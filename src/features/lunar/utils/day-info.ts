import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import type { LunarDayInfo } from '../types'
import { jdFromDate } from './astronomy'
import { getSexagenaryInfo } from './can-chi'
import { solarToLunar } from './convert'
import { getSolarTerm, getSolarTermStart } from './solar-term'

/**
 * A month grid asks for the same 42 days repeatedly while the user pans around,
 * and every lookup runs a few trigonometric series — so results are memoised.
 */
const cache = new Map<string, LunarDayInfo>()
const CACHE_LIMIT = 2000

/** Everything the UI needs about one day, computed once and cached. */
export function getLunarDayInfo(date: CivilDate): LunarDayInfo {
  const key = toKey(date)
  const cached = cache.get(key)
  if (cached) return cached

  const lunar = solarToLunar(date)
  const info: LunarDayInfo = {
    lunar,
    sexagenary: getSexagenaryInfo(date, lunar),
    solarTerm: getSolarTerm(date),
    solarTermStart: getSolarTermStart(date),
    julianDayNumber: jdFromDate(date.day, date.month, date.year),
    isNewMoon: lunar.day === 1,
    isFullMoon: lunar.day === 15,
  }

  if (cache.size > CACHE_LIMIT) cache.clear()
  cache.set(key, info)
  return info
}
