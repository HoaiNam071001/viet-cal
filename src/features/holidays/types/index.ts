import type { DateKey } from '@/shared/types'

export type HolidayType = 'national' | 'international' | 'lunar' | 'observance' | 'personal'

export interface Holiday {
  id: string
  name: string
  /** Name in the source language when it differs from `name` (remote API). */
  localName?: string
  /** `YYYY-MM-DD` in the Vietnamese calendar. */
  date: DateKey
  country?: string
  type: HolidayType
  /** A day off under Vietnamese labour law. */
  isPublicHoliday?: boolean
  description?: string
  /** Where the entry came from — local rules always win on conflicts. */
  source: 'local' | 'remote'
  /** Present for holidays defined on the lunar calendar. */
  lunar?: { day: number; month: number }
}

interface BaseRule {
  id: string
  name: string
  type: HolidayType
  isPublicHoliday?: boolean
  description?: string
  country?: string
}

export interface SolarHolidayRule extends BaseRule {
  kind: 'solar'
  month: number
  day: number
}

export interface LunarHolidayRule extends BaseRule {
  kind: 'lunar'
  lunarMonth: number
  /** `'last'` resolves to the final day of the month (29 or 30) — used by Giao thừa. */
  lunarDay: number | 'last'
}

export type HolidayRule = SolarHolidayRule | LunarHolidayRule
