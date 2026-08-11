/**
 * A calendar day without any time or timezone attached.
 * Everything in the app that means "a day on the wall calendar" uses this,
 * so no browser-timezone drift can ever shift a date by one.
 */
export interface CivilDate {
  /** Full year, e.g. 2026 */
  year: number
  /** 1 - 12 */
  month: number
  /** 1 - 31 */
  day: number
}

/** `YYYY-MM-DD` — the canonical string identity of a CivilDate. */
export type DateKey = string

export type ViewMode = 'day' | 'month' | 'year'

export type ThemeMode = 'light' | 'dark' | 'system'
