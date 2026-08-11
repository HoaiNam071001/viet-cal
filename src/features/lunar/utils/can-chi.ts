import type { CivilDate } from '@/shared/types'
import { CAN, CHI } from '../constants'
import type { LunarDate, SexagenaryInfo, SexagenaryName } from '../types'
import { jdFromDate } from './astronomy'
import { solarToLunar } from './convert'

function sexagenary(canIndex: number, chiIndex: number): SexagenaryName {
  const can = CAN[((canIndex % 10) + 10) % 10]
  const chi = CHI[((chiIndex % 12) + 12) % 12]
  return { can, chi, name: `${can} ${chi}` }
}

/** Can chi of a solar day, derived straight from its julian day number. */
export function getDayCanChi(date: CivilDate): SexagenaryName {
  const jd = jdFromDate(date.day, date.month, date.year)
  return sexagenary(jd + 9, jd + 1)
}

/** Can chi of a lunar month (tháng Giêng is always a Dần month). */
export function getMonthCanChi(lunarMonth: number, lunarYear: number): SexagenaryName {
  return sexagenary(lunarYear * 12 + lunarMonth + 3, lunarMonth + 1)
}

/** Can chi of a lunar year, e.g. 2026 → Bính Ngọ. */
export function getYearCanChi(lunarYear: number): SexagenaryName {
  return sexagenary(lunarYear + 6, lunarYear + 8)
}

export function getSexagenaryInfo(date: CivilDate, lunar: LunarDate = solarToLunar(date)): SexagenaryInfo {
  return {
    day: getDayCanChi(date),
    month: getMonthCanChi(lunar.month, lunar.year),
    year: getYearCanChi(lunar.year),
  }
}
