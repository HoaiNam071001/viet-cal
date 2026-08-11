import { getLunarDayInfo } from '@/features/lunar'
import type { CivilDate } from '@/shared/types'
import {
  addDays,
  civil,
  daysInMonth,
  getDayOfWeekMondayFirst,
  isSameDate,
  isWeekend,
  toKey,
} from '@/shared/utils/date'
import type { CalendarDay, MonthGrid } from '../types'

function toCalendarDay(date: CivilDate, month: number, today: CivilDate): CalendarDay {
  return {
    date,
    key: toKey(date),
    lunar: getLunarDayInfo(date),
    isCurrentMonth: date.month === month,
    isToday: isSameDate(date, today),
    isWeekend: isWeekend(date),
    dayOfWeek: getDayOfWeekMondayFirst(date),
  }
}

/**
 * Weeks of a month, Monday-first, padded with the neighbouring months' days.
 * The number of rows adapts (4–6) so short months don't leave an empty row.
 */
export function buildMonthGrid(year: number, month: number, today: CivilDate): MonthGrid {
  const first = civil(year, month, 1)
  const leading = getDayOfWeekMondayFirst(first)
  const total = leading + daysInMonth(year, month)
  const rows = Math.ceil(total / 7)

  const start = addDays(first, -leading)
  const weeks: CalendarDay[][] = []

  for (let row = 0; row < rows; row += 1) {
    const week: CalendarDay[] = []
    for (let column = 0; column < 7; column += 1) {
      week.push(toCalendarDay(addDays(start, row * 7 + column), month, today))
    }
    weeks.push(week)
  }

  return { year, month, weeks }
}

/** Flat list of a month's own days — used by the day view's month strip. */
export function buildMonthDays(year: number, month: number, today: CivilDate): CalendarDay[] {
  return Array.from({ length: daysInMonth(year, month) }, (_, index) =>
    toCalendarDay(civil(year, month, index + 1), month, today),
  )
}
