import type { LunarDayInfo } from '@/features/lunar'
import type { CivilDate, DateKey } from '@/shared/types'

/** One cell of the grid — purely derived data, no holiday/event lookups. */
export interface CalendarDay {
  date: CivilDate
  key: DateKey
  lunar: LunarDayInfo
  /** False for the leading/trailing days borrowed from the neighbouring months. */
  isCurrentMonth: boolean
  isToday: boolean
  isWeekend: boolean
  /** 0 = Monday … 6 = Sunday */
  dayOfWeek: number
}

export type CalendarWeek = CalendarDay[]

export interface MonthGrid {
  year: number
  month: number
  weeks: CalendarWeek[]
}
