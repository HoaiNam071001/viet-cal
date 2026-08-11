import { VN_UTC_OFFSET } from '@/app/config/app.config'
import type { CivilDate } from '@/shared/types'
import type { LunarDate } from '../types'
import { getNewMoonDay, getSunLongitudeSector, jdFromDate, jdToDate } from './astronomy'

const SYNODIC_MONTH = 29.530588853
/** Julian day of the new moon of 1/1/1900, the epoch the k-index counts from. */
const EPOCH = 2415021.076998695

/**
 * Julian day number of the new moon that begins lunar month 11 of the given
 * solar year — the anchor of the whole lunar year (it always contains Đông chí).
 */
function getLunarMonth11(year: number, timeZone: number): number {
  const off = jdFromDate(31, 12, year) - 2415021
  const k = Math.floor(off / SYNODIC_MONTH)
  let nm = getNewMoonDay(k, timeZone)
  // If the sun has already passed 270° the previous new moon is the right one.
  if (getSunLongitudeSector(nm, timeZone) >= 9) {
    nm = getNewMoonDay(k - 1, timeZone)
  }
  return nm
}

/**
 * Offset (from month 11) of the leap month in a 13-month lunar year:
 * the first month that contains no principal solar term.
 */
function getLeapMonthOffset(a11: number, timeZone: number): number {
  const k = Math.floor((a11 - EPOCH) / SYNODIC_MONTH + 0.5)
  let last = 0
  let i = 1
  let arc = getSunLongitudeSector(getNewMoonDay(k + i, timeZone), timeZone)
  do {
    last = arc
    i += 1
    arc = getSunLongitudeSector(getNewMoonDay(k + i, timeZone), timeZone)
  } while (arc !== last && i < 14)
  return i - 1
}

/** Solar → lunar. `date` is a wall-calendar date; no timezone conversion happens. */
export function solarToLunar(date: CivilDate, timeZone: number = VN_UTC_OFFSET): LunarDate {
  const dayNumber = jdFromDate(date.day, date.month, date.year)
  const k = Math.floor((dayNumber - EPOCH) / SYNODIC_MONTH)

  let monthStart = getNewMoonDay(k + 1, timeZone)
  if (monthStart > dayNumber) monthStart = getNewMoonDay(k, timeZone)

  let a11 = getLunarMonth11(date.year, timeZone)
  let b11 = a11
  let lunarYear: number
  if (a11 >= monthStart) {
    lunarYear = date.year
    a11 = getLunarMonth11(date.year - 1, timeZone)
  } else {
    lunarYear = date.year + 1
    b11 = getLunarMonth11(date.year + 1, timeZone)
  }

  const lunarDay = dayNumber - monthStart + 1
  const diff = Math.floor((monthStart - a11) / 29)
  let isLeapMonth = false
  let lunarMonth = diff + 11

  if (b11 - a11 > 365) {
    const leapMonthDiff = getLeapMonthOffset(a11, timeZone)
    if (diff >= leapMonthDiff) {
      lunarMonth = diff + 10
      if (diff === leapMonthDiff) isLeapMonth = true
    }
  }

  if (lunarMonth > 12) lunarMonth -= 12
  if (lunarMonth >= 11 && diff < 4) lunarYear -= 1

  return { day: lunarDay, month: lunarMonth, year: lunarYear, isLeapMonth }
}

/**
 * Lunar → solar. Returns `null` when the lunar date does not exist
 * (e.g. a leap month that year has no leap, or day 30 of a 29-day month).
 */
export function lunarToSolar(lunar: LunarDate, timeZone: number = VN_UTC_OFFSET): CivilDate | null {
  const { day, month, year, isLeapMonth } = lunar
  if (month < 1 || month > 12 || day < 1 || day > 30) return null

  let a11: number
  let b11: number
  if (month < 11) {
    a11 = getLunarMonth11(year - 1, timeZone)
    b11 = getLunarMonth11(year, timeZone)
  } else {
    a11 = getLunarMonth11(year, timeZone)
    b11 = getLunarMonth11(year + 1, timeZone)
  }

  let off = month - 11
  if (off < 0) off += 12

  if (b11 - a11 > 365) {
    const leapOff = getLeapMonthOffset(a11, timeZone)
    let leapMonth = leapOff - 2
    if (leapMonth < 0) leapMonth += 12
    if (isLeapMonth && month !== leapMonth) return null
    if (isLeapMonth || off >= leapOff) off += 1
  } else if (isLeapMonth) {
    return null
  }

  const k = Math.floor(0.5 + (a11 - EPOCH) / SYNODIC_MONTH)
  const monthStart = getNewMoonDay(k + off, timeZone)
  const [d, m, y] = jdToDate(monthStart + day - 1)
  const solar: CivilDate = { year: y, month: m, day: d }

  // Day 30 of a 29-day month resolves into the next month — reject it.
  const back = solarToLunar(solar, timeZone)
  if (back.day !== day || back.month !== month || back.isLeapMonth !== isLeapMonth) return null
  return solar
}

/** 29 or 30 — how many days the given lunar month has. */
export function getLunarMonthLength(month: number, year: number, isLeapMonth = false, timeZone = VN_UTC_OFFSET): number {
  return lunarToSolar({ day: 30, month, year, isLeapMonth }, timeZone) ? 30 : 29
}

/** Which month (1-12) is doubled in the given lunar year, or `null` if it is not a leap year. */
export function getLeapMonthOfYear(year: number, timeZone = VN_UTC_OFFSET): number | null {
  for (let month = 1; month <= 12; month += 1) {
    if (lunarToSolar({ day: 1, month, year, isLeapMonth: true }, timeZone)) return month
  }
  return null
}
