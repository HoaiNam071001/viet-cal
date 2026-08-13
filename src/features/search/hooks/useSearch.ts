import { useEffect, useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import { useToday } from '@/shared/hooks/useToday'
import { diffInDays, fromKey } from '@/shared/utils/date'
import { matchesQuery, normalizeVietnamese } from '@/shared/utils/vietnamese'
import { extractYear, parseDateQuery, type SearchResult } from '../utils/parse-query'

export interface SearchResults {
  dates: SearchResult[]
  holidays: SearchResult[]
  isEmpty: boolean
}

/** Global search across parsed dates and holiday names for the next few years. */
export function useSearch(query: string): SearchResults {
  const { t } = useTranslation()
  const today = useToday()
  const { ensureYear, getForYear } = useHolidayContext()
  const targetYear = extractYear(query)

  useEffect(() => {
    for (const year of [today.year, today.year + 1, today.year + 2]) ensureYear(year)
    if (targetYear) ensureYear(targetYear)
  }, [ensureYear, targetYear, today.year])

  return useMemo(() => {
    const trimmed = query.trim()
    if (trimmed.length < 1) return { dates: [], holidays: [], isEmpty: true }

    const dates = parseDateQuery(trimmed, today)

    // "Tết 2027" → search that year; otherwise the next three years.
    const years = targetYear ? [targetYear] : [today.year, today.year + 1, today.year + 2]
    // Strip the year so it doesn't pollute the name match.
    const nameQuery = normalizeVietnamese(trimmed.replace(/\b(19|20|21)\d{2}\b/, ''))

    const seen = new Set<string>()
    const holidays: SearchResult[] = []

    if (nameQuery.length >= 2) {
      for (const year of years) {
        for (const holiday of getForYear(year)) {
          if (!matchesQuery(holiday.name, nameQuery)) continue
          const date = fromKey(holiday.date)
          if (!date) continue
          const dedupeKey = `${normalizeVietnamese(holiday.name)}-${holiday.date}`
          if (seen.has(dedupeKey)) continue
          seen.add(dedupeKey)

          const daysUntil = diffInDays(today, date)
          holidays.push({
            id: `holiday-${holiday.id}`,
            kind: 'holiday',
            title: holiday.name,
            subtitle: holiday.lunar
              ? `${date.day}/${date.month}/${date.year} · ${t('holidays.lunarDate', { day: holiday.lunar.day, month: holiday.lunar.month })}`
              : `${date.day}/${date.month}/${date.year}`,
            date,
            // Upcoming first, past last.
            score: daysUntil >= 0 ? 80 - Math.min(daysUntil / 40, 30) : 20 + daysUntil / 400,
          })
        }
      }
    }

    holidays.sort((a, b) => b.score - a.score)

    return {
      dates: dates.sort((a, b) => b.score - a.score),
      holidays: holidays.slice(0, 12),
      isEmpty: dates.length === 0 && holidays.length === 0,
    }
  }, [getForYear, query, targetYear, today, t])
}
