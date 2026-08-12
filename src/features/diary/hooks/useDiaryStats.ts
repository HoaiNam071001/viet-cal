import { useEffect, useMemo } from 'react'
import { useDiaryContext } from '@/app/providers/DiaryProvider'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate, DateKey } from '@/shared/types'
import { addDays, addMonths, diffInDays, fromKey, toKey } from '@/shared/utils/date'

/** Heatmap window: 12 weeks, GitHub-style. */
const HEATMAP_WEEKS = 12
/** Enough trailing months to always cover the heatmap window, even at month start. */
const MONTHS_BACK = 3

export interface DiaryStats {
  totalEntriesThisMonth: number
  moodCounts: Array<{ emoji: string; count: number }>
  streakCurrent: number
  streakLongest: number
  heatmap: Array<{ date: DateKey; hasEntry: boolean }>
  isLoading: boolean
}

export function useDiaryStats(): DiaryStats {
  const today = useToday()
  const { ensureMonth, getForMonth, isLoading } = useDiaryContext()

  const months = useMemo(() => {
    const list: Array<{ year: number; month: number }> = []
    let cursor: CivilDate = today
    for (let i = 0; i < MONTHS_BACK; i++) {
      list.push({ year: cursor.year, month: cursor.month })
      cursor = addMonths(cursor, -1)
    }
    return list
    // eslint-disable-next-line react-hooks/exhaustive-deps -- keyed by the month, not the exact day
  }, [today.year, today.month])

  useEffect(() => {
    for (const { year, month } of months) ensureMonth(year, month)
  }, [ensureMonth, months])

  return useMemo(() => {
    const allEntries = months.flatMap(({ year, month }) => getForMonth(year, month))
    const byDate = new Set(allEntries.map((entry) => entry.date))

    const totalEntriesThisMonth = getForMonth(today.year, today.month).length

    const moodTally = new Map<string, number>()
    for (const entry of allEntries) {
      if (entry.moodEmoji) moodTally.set(entry.moodEmoji, (moodTally.get(entry.moodEmoji) ?? 0) + 1)
    }
    const moodCounts = [...moodTally.entries()]
      .map(([emoji, count]) => ({ emoji, count }))
      .sort((a, b) => b.count - a.count)

    let streakCurrent = 0
    let cursor = today
    while (byDate.has(toKey(cursor))) {
      streakCurrent++
      cursor = addDays(cursor, -1)
    }

    let streakLongest = 0
    let run = 0
    let previous: CivilDate | null = null
    for (const key of [...byDate].sort()) {
      const date = fromKey(key)
      if (!date) continue
      run = previous && diffInDays(previous, date) === 1 ? run + 1 : 1
      streakLongest = Math.max(streakLongest, run)
      previous = date
    }

    const heatmap: Array<{ date: DateKey; hasEntry: boolean }> = []
    for (let i = HEATMAP_WEEKS * 7 - 1; i >= 0; i--) {
      const key = toKey(addDays(today, -i))
      heatmap.push({ date: key, hasEntry: byDate.has(key) })
    }

    return { totalEntriesThisMonth, moodCounts, streakCurrent, streakLongest, heatmap, isLoading }
  }, [months, getForMonth, today, isLoading])
}
