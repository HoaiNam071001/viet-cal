import { useEffect, useMemo } from 'react'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate } from '@/shared/types'
import { diffInDays, fromKey } from '@/shared/utils/date'
import type { Holiday } from '../types'

/** Holidays of a whole year, requesting the year if it is not loaded yet. */
export function useHolidaysOfYear(year: number): Holiday[] {
  const { ensureYear, getForYear } = useHolidayContext()
  useEffect(() => {
    ensureYear(year)
  }, [ensureYear, year])
  return getForYear(year)
}

/** Holidays on a single day. */
export function useHolidaysOfDate(date: CivilDate): Holiday[] {
  const { ensureYear, getForDate } = useHolidayContext()
  useEffect(() => {
    ensureYear(date.year)
  }, [ensureYear, date.year])
  return getForDate(date)
}

export interface UpcomingHoliday {
  holiday: Holiday
  date: CivilDate
  daysUntil: number
}

/** The next `count` holidays from today, with their countdown already computed. */
export function useUpcomingHolidays(count = 5, onlyPublic = false): UpcomingHoliday[] {
  const today = useToday()
  const { getUpcoming } = useHolidayContext()

  return useMemo(() => {
    return getUpcoming(today, 60)
      .filter((holiday) => (onlyPublic ? holiday.isPublicHoliday : true))
      .map((holiday) => {
        const date = fromKey(holiday.date)
        return date ? { holiday, date, daysUntil: diffInDays(today, date) } : null
      })
      .filter((item): item is UpcomingHoliday => item !== null)
      .slice(0, count)
  }, [count, getUpcoming, onlyPublic, today])
}
