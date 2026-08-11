import { useMemo } from 'react'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import type { LunarDayInfo } from '../types'
import { getLunarDayInfo } from '../utils/day-info'

/** Lunar identity of a day. Cheap — results are memoised in the lunar module. */
export function useLunarDate(date: CivilDate): LunarDayInfo {
  const key = toKey(date)
  // eslint-disable-next-line react-hooks/exhaustive-deps -- `key` is the identity of `date`
  return useMemo(() => getLunarDayInfo(date), [key])
}
