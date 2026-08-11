import { formatLunarDayMonth, lunarToSolar, solarToLunar } from '@/features/lunar'
import type { CivilDate } from '@/shared/types'
import { civil, compareDates, formatFullDateVN, isValidDate, toKey } from '@/shared/utils/date'
import { normalizeVietnamese } from '@/shared/utils/vietnamese'

export type SearchResultKind = 'date' | 'lunar' | 'holiday'

export interface SearchResult {
  id: string
  kind: SearchResultKind
  title: string
  subtitle: string
  date: CivilDate
  /** Higher sorts first. */
  score: number
}

function solarResult(date: CivilDate, score = 100): SearchResult | null {
  if (!isValidDate(date)) return null
  const lunar = solarToLunar(date)
  return {
    id: `date-${toKey(date)}`,
    kind: 'date',
    title: formatFullDateVN(date),
    subtitle: `${formatLunarDayMonth(lunar)} Âm lịch`,
    date,
    score,
  }
}

function lunarResult(day: number, month: number, year: number, label: string): SearchResult | null {
  const solar = lunarToSolar({ day, month, year, isLeapMonth: false })
  if (!solar) return null
  return {
    id: `lunar-${year}-${month}-${day}`,
    kind: 'lunar',
    title: `${label} năm ${year} (Âm lịch)`,
    subtitle: formatFullDateVN(solar),
    date: solar,
    score: 95,
  }
}

const MONTH_WORDS: Record<string, number> = {
  gieng: 1,
  chap: 12,
  mot: 1,
  hai: 2,
  ba: 3,
  tu: 4,
  nam: 5,
  sau: 6,
  bay: 7,
  tam: 8,
  chin: 9,
  muoi: 10,
}

/**
 * Turns free text into candidate dates. Understands `15/08/2026`, `15/8`,
 * `15 tháng 8`, `rằm tháng 7`, `mùng 1 tháng giêng` and the `âm` suffix.
 */
export function parseDateQuery(query: string, today: CivilDate): SearchResult[] {
  const raw = query.trim()
  if (!raw) return []

  const text = normalizeVietnamese(raw)
  const isLunar = /\b(am|al|am lich)\b/.test(text) || /\bram\b|\bmung\b/.test(text)
  const results: (SearchResult | null)[] = []

  // 15/08/2026 · 15-8-2026 · 15.8
  const numeric = /(\d{1,2})\s*[/\-.]\s*(\d{1,2})(?:\s*[/\-.]\s*(\d{2,4}))?/.exec(text)
  if (numeric) {
    const day = Number(numeric[1])
    const month = Number(numeric[2])
    const year = numeric[3] ? normalizeYear(Number(numeric[3])) : today.year

    if (isLunar) {
      results.push(lunarResult(day, month, year, `Ngày ${day} tháng ${month}`))
    } else {
      results.push(solarResult(civil(year, month, day)))
      // Without an explicit year, also offer next year's occurrence.
      if (!numeric[3]) {
        const thisYear = civil(year, month, day)
        if (isValidDate(thisYear) && compareDates(thisYear, today) < 0) {
          results.push(solarResult(civil(year + 1, month, day), 90))
        }
      }
    }
  }

  // "15 tháng 8" / "rằm tháng 7" / "mùng 1 tháng giêng"
  const monthWord = /(?:ngay\s*)?(\d{1,2}|ram|mung\s*\d{1,2})\s*thang\s*(\d{1,2}|[a-z]+)(?:\s*nam\s*(\d{4}))?/.exec(
    text,
  )
  if (monthWord) {
    const dayToken = monthWord[1]
    const day = dayToken === 'ram' ? 15 : Number(dayToken.replace(/mung\s*/, ''))
    const monthToken = monthWord[2]
    const month = /^\d+$/.test(monthToken) ? Number(monthToken) : MONTH_WORDS[monthToken]
    const year = monthWord[3] ? Number(monthWord[3]) : today.year

    if (Number.isFinite(day) && month) {
      const wantsLunar = isLunar || dayToken === 'ram' || dayToken.startsWith('mung') || !/^\d+$/.test(monthToken)
      if (wantsLunar) {
        const lunarNow = solarToLunar(today)
        // Pick the occurrence that has not passed yet.
        const candidateYear = monthWord[3]
          ? year
          : month < lunarNow.month || (month === lunarNow.month && day < lunarNow.day)
            ? lunarNow.year + 1
            : lunarNow.year
        const label = dayToken === 'ram' ? `Rằm tháng ${month}` : `Ngày ${day} tháng ${month}`
        results.push(lunarResult(day, month, candidateYear, label))
      } else {
        results.push(solarResult(civil(year, month, day)))
      }
    }
  }

  return results.filter((result): result is SearchResult => result !== null)
}

function normalizeYear(value: number): number {
  if (value >= 1000) return value
  return value >= 70 ? 1900 + value : 2000 + value
}

/** Extracts a 4-digit year mentioned anywhere in the query, e.g. "Tết 2027". */
export function extractYear(query: string): number | null {
  const match = /\b(19|20|21)\d{2}\b/.exec(query)
  return match ? Number(match[0]) : null
}
