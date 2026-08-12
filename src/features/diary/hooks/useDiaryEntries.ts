import { useEffect } from 'react'
import { useDiaryContext } from '@/app/providers/DiaryProvider'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import type { DiaryEntry } from '../types/diary'

export function useDiaryEntriesOfMonth(
  year: number,
  month: number,
): { entries: DiaryEntry[]; isLoading: boolean } {
  const { ensureMonth, getForMonth, isLoading } = useDiaryContext()
  useEffect(() => {
    ensureMonth(year, month)
  }, [ensureMonth, year, month])
  return { entries: getForMonth(year, month), isLoading }
}

/** The (single) entry the calendar shows for a day — null when there is none. */
export function useDiaryEntryOfDate(date: CivilDate): DiaryEntry | null {
  const { ensureMonth, getForDate } = useDiaryContext()
  useEffect(() => {
    ensureMonth(date.year, date.month)
  }, [ensureMonth, date.year, date.month])
  return getForDate(toKey(date))
}
