import i18n from '@/app/i18n'
import { MAX_YEAR, MIN_YEAR, VN_TIMEZONE } from '@/app/config/app.config'
import type { CivilDate, DateKey } from '@/shared/types'

/*
 * All date arithmetic here is done on UTC-anchored Date objects built from a
 * CivilDate. The browser's own timezone is never used for anything except
 * reading the current instant — which is then projected onto Vietnam time.
 */

export function civil(year: number, month: number, day: number): CivilDate {
  return { year, month, day }
}

/** Midnight UTC of the given civil date — an arithmetic vehicle, not a moment in time. */
export function toUTCDate(d: CivilDate): Date {
  return new Date(Date.UTC(d.year, d.month - 1, d.day))
}

export function fromUTCDate(date: Date): CivilDate {
  return {
    year: date.getUTCFullYear(),
    month: date.getUTCMonth() + 1,
    day: date.getUTCDate(),
  }
}

const pad = (n: number) => String(n).padStart(2, '0')

export function toKey(d: CivilDate): DateKey {
  return `${d.year}-${pad(d.month)}-${pad(d.day)}`
}

export function fromKey(key: string): CivilDate | null {
  const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(key)
  if (!m) return null
  const date = civil(Number(m[1]), Number(m[2]), Number(m[3]))
  return isValidDate(date) ? date : null
}

export function isValidDate(d: CivilDate): boolean {
  if (!Number.isInteger(d.year) || !Number.isInteger(d.month) || !Number.isInteger(d.day)) return false
  if (d.month < 1 || d.month > 12 || d.day < 1) return false
  return d.day <= daysInMonth(d.year, d.month)
}

export function daysInMonth(year: number, month: number): number {
  return new Date(Date.UTC(year, month, 0)).getUTCDate()
}

export function addDays(d: CivilDate, amount: number): CivilDate {
  const date = toUTCDate(d)
  date.setUTCDate(date.getUTCDate() + amount)
  return fromUTCDate(date)
}

export function addMonths(d: CivilDate, amount: number): CivilDate {
  const total = d.year * 12 + (d.month - 1) + amount
  const year = Math.floor(total / 12)
  const month = (total % 12) + 1
  return civil(year, month, Math.min(d.day, daysInMonth(year, month)))
}

export function addYears(d: CivilDate, amount: number): CivilDate {
  return addMonths(d, amount * 12)
}

export function startOfMonth(d: CivilDate): CivilDate {
  return civil(d.year, d.month, 1)
}

export function endOfMonth(d: CivilDate): CivilDate {
  return civil(d.year, d.month, daysInMonth(d.year, d.month))
}

/** 0 = Sunday … 6 = Saturday */
export function getDayOfWeek(d: CivilDate): number {
  return toUTCDate(d).getUTCDay()
}

/** 0 = Monday … 6 = Sunday — the Vietnamese week order. */
export function getDayOfWeekMondayFirst(d: CivilDate): number {
  return (getDayOfWeek(d) + 6) % 7
}

export function isWeekend(d: CivilDate): boolean {
  const dow = getDayOfWeek(d)
  return dow === 0 || dow === 6
}

export function compareDates(a: CivilDate, b: CivilDate): number {
  return a.year - b.year || a.month - b.month || a.day - b.day
}

export function isSameDate(a: CivilDate | null | undefined, b: CivilDate | null | undefined): boolean {
  if (!a || !b) return false
  return compareDates(a, b) === 0
}

export function isSameMonth(a: CivilDate, b: CivilDate): boolean {
  return a.year === b.year && a.month === b.month
}

/** Whole days from `a` to `b` (positive when `b` is later). */
export function diffInDays(a: CivilDate, b: CivilDate): number {
  const MS_PER_DAY = 86_400_000
  return Math.round((toUTCDate(b).getTime() - toUTCDate(a).getTime()) / MS_PER_DAY)
}

export function clampDate(d: CivilDate): CivilDate {
  if (d.year < MIN_YEAR) return civil(MIN_YEAR, 1, 1)
  if (d.year > MAX_YEAR) return civil(MAX_YEAR, 12, 31)
  return d
}

const vnPartsFormatter = new Intl.DateTimeFormat('en-CA', {
  timeZone: VN_TIMEZONE,
  year: 'numeric',
  month: '2-digit',
  day: '2-digit',
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
})

interface VnNow extends CivilDate {
  hour: number
  minute: number
}

/** The current wall-clock date & time in Vietnam, regardless of where the user is. */
export function nowInVietnam(at: Date = new Date()): VnNow {
  const parts = vnPartsFormatter.formatToParts(at)
  const get = (type: Intl.DateTimeFormatPartTypes) => Number(parts.find((p) => p.type === type)?.value ?? 0)
  return {
    year: get('year'),
    month: get('month'),
    day: get('day'),
    // Intl can render midnight as hour 24 in some engines.
    hour: get('hour') % 24,
    minute: get('minute'),
  }
}

export function todayInVietnam(at?: Date): CivilDate {
  const { year, month, day } = nowInVietnam(at)
  return civil(year, month, day)
}

/** Milliseconds until the next Vietnamese midnight — used to auto-refresh "today". */
export function msUntilNextVietnamDay(at: Date = new Date()): number {
  const { hour, minute } = nowInVietnam(at)
  const seconds = at.getUTCSeconds()
  const ms = at.getUTCMilliseconds()
  const elapsed = ((hour * 60 + minute) * 60 + seconds) * 1000 + ms
  return 86_400_000 - elapsed
}

/* ------------------------- Locale-aware date labels ------------------------- */

const WEEKDAY_LABELS_VI = ['Chủ nhật', 'Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy']
const WEEKDAY_LABELS_EN = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday']
const WEEKDAY_SHORT_MON_FIRST_VI = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']
const WEEKDAY_SHORT_MON_FIRST_EN = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']
const MONTH_NAMES_EN = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
]

const isEnglish = () => i18n.language === 'en'

/** 0 = Sunday … 6 = Saturday, in the current UI language. */
export function getWeekdayLabels(): string[] {
  return isEnglish() ? WEEKDAY_LABELS_EN : WEEKDAY_LABELS_VI
}

/** `Tháng 1` … `Tháng 12` (vi) / `January` … `December` (en). */
export function getMonthNames(): string[] {
  return isEnglish() ? MONTH_NAMES_EN : Array.from({ length: 12 }, (_, i) => `Tháng ${i + 1}`)
}

/** `Th 8` (vi) / `Aug` (en) — a compact month label for small UI chrome. */
export function getMonthAbbr(month: number): string {
  return isEnglish() ? MONTH_NAMES_EN[month - 1].slice(0, 3) : `Th ${month}`
}

/** Monday-first short weekday labels, in the current UI language. */
export function getWeekdayShortLabels(): string[] {
  return isEnglish() ? WEEKDAY_SHORT_MON_FIRST_EN : WEEKDAY_SHORT_MON_FIRST_VI
}

export function getWeekdayLabel(d: CivilDate): string {
  return getWeekdayLabels()[getDayOfWeek(d)]
}

/** `11 tháng 8, 2026` (vi) / `August 11, 2026` (en) */
export function formatDateVN(d: CivilDate): string {
  return isEnglish() ? `${MONTH_NAMES_EN[d.month - 1]} ${d.day}, ${d.year}` : `${d.day} tháng ${d.month}, ${d.year}`
}

/** `Thứ ba, 11 tháng 8, 2026` (vi) / `Tuesday, August 11, 2026` (en) */
export function formatFullDateVN(d: CivilDate): string {
  return `${getWeekdayLabel(d)}, ${formatDateVN(d)}`
}

/** `11/08/2026` */
export function formatNumericVN(d: CivilDate): string {
  return `${pad(d.day)}/${pad(d.month)}/${d.year}`
}

/** `Tháng 8, 2026` (vi) / `August 2026` (en) */
export function formatMonthVN(d: CivilDate): string {
  return isEnglish() ? `${MONTH_NAMES_EN[d.month - 1]} ${d.year}` : `Tháng ${d.month}, ${d.year}`
}
