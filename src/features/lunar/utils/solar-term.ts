import { VN_UTC_OFFSET } from '@/app/config/app.config'
import type { CivilDate } from '@/shared/types'
import { SOLAR_TERMS } from '../constants'
import type { SolarTerm } from '../types'
import { jdFromDate, sunLongitudeDegAtMidnight } from './astronomy'

function termAt(jd: number, timeZone: number): SolarTerm {
  const index = Math.floor(sunLongitudeDegAtMidnight(jd, timeZone) / 15) % 24
  return { index, name: SOLAR_TERMS[index], longitude: index * 15 }
}

/** The solar term (tiết khí) the given day falls inside. */
export function getSolarTerm(date: CivilDate, timeZone: number = VN_UTC_OFFSET): SolarTerm {
  return termAt(jdFromDate(date.day, date.month, date.year), timeZone)
}

/** The solar term that *begins* on this day, or `null` on ordinary days. */
export function getSolarTermStart(date: CivilDate, timeZone: number = VN_UTC_OFFSET): SolarTerm | null {
  const jd = jdFromDate(date.day, date.month, date.year)
  const today = termAt(jd, timeZone)
  const yesterday = termAt(jd - 1, timeZone)
  return today.index === yesterday.index ? null : today
}
