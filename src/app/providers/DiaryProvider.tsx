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
import { readCachedMonth, writeCachedMonth } from '@/features/diary/services/diary-cache'
import { listEntriesForMonth } from '@/features/diary/services/diary.service'
import type { DiaryEntry } from '@/features/diary/types/diary'
import type { DateKey } from '@/shared/types'
import { useAuth } from './AuthProvider'

interface DiaryContextValue {
  /** Ask for a month; loading happens once and is shared across consumers. */
  ensureMonth: (year: number, month: number) => void
  /** Most recent entry for that date, or null. Multiple same-day entries can still be
   * browsed from the diary list — the calendar only ever surfaces one. */
  getForDate: (dateKey: DateKey) => DiaryEntry | null
  getForMonth: (year: number, month: number) => DiaryEntry[]
  /** Call after a create/update/delete so every consumer refetches that month. */
  invalidateMonth: (year: number, month: number) => void
  isLoading: boolean
}

const DiaryContext = createContext<DiaryContextValue | null>(null)

function monthKey(year: number, month: number): string {
  return `${year}-${String(month).padStart(2, '0')}`
}

export function DiaryProvider({ children }: { children: ReactNode }) {
  const { user } = useAuth()
  const [byMonth, setByMonth] = useState<Record<string, DiaryEntry[]>>({})
  const [pending, setPending] = useState(0)
  const requested = useRef(new Set<string>())

  const load = useCallback(
    (year: number, month: number) => {
      if (!user) return
      const userId = user.id

      // Paint immediately from the last-known copy, then refine from the network.
      const cached = readCachedMonth(userId, year, month)
      if (cached) setByMonth((prev) => ({ ...prev, [monthKey(year, month)]: cached }))

      setPending((n) => n + 1)
      listEntriesForMonth(userId, year, month)
        .then((entries) => {
          setByMonth((prev) => ({ ...prev, [monthKey(year, month)]: entries }))
          writeCachedMonth(userId, year, month, entries)
        })
        .catch(() => {
          // Offline or the request failed — the cached copy already painted above is the best we can do.
        })
        .finally(() => setPending((n) => n - 1))
    },
    [user],
  )

  const ensureMonth = useCallback(
    (year: number, month: number) => {
      if (!user) return
      const key = monthKey(year, month)
      if (requested.current.has(key)) return
      requested.current.add(key)
      load(year, month)
    },
    [user, load],
  )

  const invalidateMonth = useCallback(
    (year: number, month: number) => {
      requested.current.add(monthKey(year, month))
      load(year, month)
    },
    [load],
  )

  // Logged out (or a different user signed in) → drop everything so no stale entries leak.
  useEffect(() => {
    requested.current.clear()
    setByMonth({})
  }, [user?.id])

  const index = useMemo(() => {
    const map = new Map<DateKey, DiaryEntry>()
    for (const entries of Object.values(byMonth)) {
      for (const entry of entries) map.set(entry.date, entry)
    }
    return map
  }, [byMonth])

  const value = useMemo<DiaryContextValue>(
    () => ({
      ensureMonth,
      invalidateMonth,
      isLoading: pending > 0,
      getForDate: (dateKey) => index.get(dateKey) ?? null,
      getForMonth: (year, month) => byMonth[monthKey(year, month)] ?? [],
    }),
    [byMonth, ensureMonth, index, invalidateMonth, pending],
  )

  return <DiaryContext value={value}>{children}</DiaryContext>
}

export function useDiaryContext(): DiaryContextValue {
  const context = useContext(DiaryContext)
  if (!context) throw new Error('useDiaryContext must be used inside <DiaryProvider>')
  return context
}
