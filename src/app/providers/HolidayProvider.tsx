import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from 'react'
import { useSettings } from '@/app/providers/SettingsProvider'
import { getHolidays, getHolidaysSync } from '@/features/holidays/services/holiday.service'
import type { Holiday } from '@/features/holidays/types'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate, DateKey } from '@/shared/types'
import { compareDates, fromKey, toKey } from '@/shared/utils/date'

interface HolidayContextValue {
  /** Ask for a year; loading happens once and is shared across consumers. */
  ensureYear: (year: number) => void
  getForDate: (date: CivilDate) => Holiday[]
  getForYear: (year: number) => Holiday[]
  /** Next holidays on or after `from`, spanning the year boundary. */
  getUpcoming: (from: CivilDate, count?: number) => Holiday[]
  isLoading: boolean
  /** False when every year in view came from local rules only (offline). */
  usedRemote: boolean
}

const HolidayContext = createContext<HolidayContextValue | null>(null)

export function HolidayProvider({ children }: { children: ReactNode }) {
  const { settings } = useSettings()
  const today = useToday()
  const options = useMemo(
    () => ({ includeInternational: settings.showInternationalHolidays }),
    [settings.showInternationalHolidays],
  )

  const [byYear, setByYear] = useState<Record<number, Holiday[]>>({})
  const [pending, setPending] = useState(0)
  const [usedRemote, setUsedRemote] = useState(true)
  const requested = useRef(new Set<number>())

  const ensureYear = useCallback(
    (year: number) => {
      if (requested.current.has(year)) return
      requested.current.add(year)

      // Paint immediately from local rules + cache, then refine from the network.
      setByYear((prev) => ({ ...prev, [year]: getHolidaysSync(year, options) }))
      setPending((n) => n + 1)

      getHolidays(year, options)
        .then((result) => {
          setByYear((prev) => ({ ...prev, [year]: result.holidays }))
          setUsedRemote((prev) => prev && result.usedRemote)
        })
        .finally(() => setPending((n) => n - 1))
    },
    [options],
  )

  // Settings changed → everything must be recomputed from the rules.
  useEffect(() => {
    const years = [...requested.current]
    requested.current.clear()
    setByYear({})
    for (const year of years) ensureYear(year)
    // eslint-disable-next-line react-hooks/exhaustive-deps -- intentionally only on option change
  }, [options])

  // The current year is always useful (today widget, upcoming holidays).
  useEffect(() => {
    ensureYear(today.year)
    ensureYear(today.year + 1)
  }, [ensureYear, today.year])

  const index = useMemo(() => {
    const map = new Map<DateKey, Holiday[]>()
    for (const holidays of Object.values(byYear)) {
      for (const holiday of holidays) {
        const list = map.get(holiday.date) ?? []
        list.push(holiday)
        map.set(holiday.date, list)
      }
    }
    return map
  }, [byYear])

  const value = useMemo<HolidayContextValue>(
    () => ({
      ensureYear,
      isLoading: pending > 0,
      usedRemote,
      getForDate: (date) => index.get(toKey(date)) ?? [],
      getForYear: (year) => byYear[year] ?? [],
      getUpcoming: (from, count = 5) => {
        const pool = [...(byYear[from.year] ?? []), ...(byYear[from.year + 1] ?? [])]
        return pool
          .filter((holiday) => {
            const date = fromKey(holiday.date)
            return date ? compareDates(date, from) >= 0 : false
          })
          .sort((a, b) => a.date.localeCompare(b.date))
          .slice(0, count)
      },
    }),
    [byYear, ensureYear, index, pending, usedRemote],
  )

  return <HolidayContext value={value}>{children}</HolidayContext>
}

export function useHolidayContext(): HolidayContextValue {
  const context = useContext(HolidayContext)
  if (!context) throw new Error('useHolidayContext must be used inside <HolidayProvider>')
  return context
}
