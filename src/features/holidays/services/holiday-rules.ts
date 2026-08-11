import { getLunarMonthLength, lunarToSolar } from '@/features/lunar'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import { INTERNATIONAL_HOLIDAY_RULES } from '../constants/international'
import { VIETNAM_HOLIDAY_RULES } from '../constants/vietnam'
import type { Holiday, HolidayRule } from '../types'

function toHoliday(rule: HolidayRule, date: CivilDate, lunar?: { day: number; month: number }): Holiday {
  return {
    id: `${rule.id}-${date.year}`,
    name: rule.name,
    date: toKey(date),
    type: rule.type,
    country: rule.country ?? 'VN',
    isPublicHoliday: rule.isPublicHoliday,
    description: rule.description,
    source: 'local',
    lunar,
  }
}

/**
 * Resolve one rule into the occurrences that land inside `solarYear`.
 * Lunar rules are tried against three lunar years because e.g. Ông Công Ông Táo
 * (23/12 ÂL) of lunar year N falls in solar year N+1.
 */
function expandRule(rule: HolidayRule, solarYear: number): Holiday[] {
  if (rule.kind === 'solar') {
    return [toHoliday(rule, { year: solarYear, month: rule.month, day: rule.day })]
  }

  const occurrences: Holiday[] = []
  for (const lunarYear of [solarYear - 1, solarYear, solarYear + 1]) {
    const day =
      rule.lunarDay === 'last' ? getLunarMonthLength(rule.lunarMonth, lunarYear) : rule.lunarDay
    const solar = lunarToSolar({ day, month: rule.lunarMonth, year: lunarYear, isLeapMonth: false })
    if (solar && solar.year === solarYear) {
      occurrences.push(toHoliday(rule, solar, { day, month: rule.lunarMonth }))
    }
  }
  return occurrences
}

export interface LocalHolidayOptions {
  includeInternational?: boolean
}

/** All locally-defined holidays for a solar year. Pure and always available offline. */
export function getLocalHolidays(year: number, options: LocalHolidayOptions = {}): Holiday[] {
  const { includeInternational = true } = options
  const rules = includeInternational
    ? [...VIETNAM_HOLIDAY_RULES, ...INTERNATIONAL_HOLIDAY_RULES]
    : VIETNAM_HOLIDAY_RULES

  return rules
    .flatMap((rule) => expandRule(rule, year))
    .sort((a, b) => a.date.localeCompare(b.date))
}

/** The solar date of Tết in a given year — used by search and countdown shortcuts. */
export function getTetDate(year: number): CivilDate | null {
  return lunarToSolar({ day: 1, month: 1, year, isLeapMonth: false })
}
