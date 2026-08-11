import { LUNAR_MONTH_LABELS } from '../constants'
import type { LunarDate } from '../types'
import { getYearCanChi } from './can-chi'

/** `29/6` — the compact form printed inside a calendar cell. */
export function formatLunarShort(lunar: LunarDate): string {
  return `${lunar.day}/${lunar.month}${lunar.isLeapMonth ? 'N' : ''}`
}

/** `29 tháng 6` */
export function formatLunarDayMonth(lunar: LunarDate): string {
  return `${lunar.day} tháng ${lunar.month}${lunar.isLeapMonth ? ' (nhuận)' : ''}`
}

/** `29 tháng 6 năm Bính Ngọ` */
export function formatLunarLong(lunar: LunarDate): string {
  return `${formatLunarDayMonth(lunar)} năm ${getYearCanChi(lunar.year).name}`
}

/** `Ngày 29 tháng Sáu` — the traditional wording. */
export function formatLunarTraditional(lunar: LunarDate): string {
  const month = LUNAR_MONTH_LABELS[lunar.month] ?? String(lunar.month)
  return `Ngày ${lunar.day} tháng ${month}${lunar.isLeapMonth ? ' nhuận' : ''}`
}
