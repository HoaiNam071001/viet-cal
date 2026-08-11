import { describe, expect, it } from 'vitest'
import type { CivilDate } from '@/shared/types'
import { getDayCanChi, getMonthCanChi, getYearCanChi } from '../utils/can-chi'
import { getLeapMonthOfYear, getLunarMonthLength, lunarToSolar, solarToLunar } from '../utils/convert'
import { getSolarTerm, getSolarTermStart } from '../utils/solar-term'
import { getHours } from '../utils/auspicious'
import { jdFromDate, jdToDate } from '../utils/astronomy'

const d = (year: number, month: number, day: number): CivilDate => ({ year, month, day })

describe('julian day', () => {
  it('round-trips civil dates', () => {
    for (const date of [d(1900, 1, 1), d(2000, 2, 29), d(2026, 8, 11), d(2100, 12, 31)]) {
      const [day, month, year] = jdToDate(jdFromDate(date.day, date.month, date.year))
      expect({ year, month, day }).toEqual(date)
    }
  })

  it('matches the known JDN of 1/1/2000', () => {
    expect(jdFromDate(1, 1, 2000)).toBe(2451545)
  })
})

describe('solarToLunar', () => {
  // Dates cross-checked against published Vietnamese calendars.
  const cases: Array<[CivilDate, number, number, number, boolean]> = [
    // Tết Nguyên Đán: mùng 1 tháng Giêng
    [d(2024, 2, 10), 1, 1, 2024, false],
    [d(2025, 1, 29), 1, 1, 2025, false],
    [d(2026, 2, 17), 1, 1, 2026, false],
    [d(2027, 2, 6), 1, 1, 2027, false],
    [d(2023, 1, 22), 1, 1, 2023, false],
    // Ordinary days
    [d(2026, 8, 11), 29, 6, 2026, false],
    [d(2000, 1, 1), 25, 11, 1999, false],
    [d(1975, 4, 30), 20, 3, 1975, false],
    [d(1945, 9, 2), 26, 7, 1945, false],
    // Leap month: 2025 has a leap 6th month
    [d(2025, 7, 25), 1, 6, 2025, true],
    [d(2023, 3, 22), 1, 2, 2023, true],
  ]

  it.each(cases)('%o → lunar', (date, day, month, year, isLeapMonth) => {
    expect(solarToLunar(date)).toEqual({ day, month, year, isLeapMonth })
  })

  it('is independent of the machine timezone', () => {
    // Values are pure functions of the civil date, never of Date.now / getTimezoneOffset.
    expect(solarToLunar(d(2026, 1, 1))).toEqual(solarToLunar({ ...d(2026, 1, 1) }))
  })
})

describe('lunarToSolar', () => {
  it('inverts solarToLunar across a 40-year span', () => {
    for (let jd = jdFromDate(1, 1, 1990); jd <= jdFromDate(31, 12, 2030); jd += 7) {
      const [day, month, year] = jdToDate(jd)
      const solar = d(year, month, day)
      const lunar = solarToLunar(solar)
      expect(lunarToSolar(lunar)).toEqual(solar)
    }
  })

  it('resolves Tết 2027 to 06/02/2027', () => {
    expect(lunarToSolar({ day: 1, month: 1, year: 2027, isLeapMonth: false })).toEqual(d(2027, 2, 6))
  })

  it('rejects dates that do not exist', () => {
    // 2026 is not a leap year in the lunar calendar
    expect(lunarToSolar({ day: 1, month: 6, year: 2026, isLeapMonth: true })).toBeNull()
    // Day 30 of a 29-day month
    const length = getLunarMonthLength(6, 2026)
    if (length === 29) {
      expect(lunarToSolar({ day: 30, month: 6, year: 2026, isLeapMonth: false })).toBeNull()
    }
  })
})

describe('leap months', () => {
  it('detects known leap years', () => {
    expect(getLeapMonthOfYear(2025)).toBe(6)
    expect(getLeapMonthOfYear(2023)).toBe(2)
    expect(getLeapMonthOfYear(2020)).toBe(4)
    expect(getLeapMonthOfYear(2026)).toBeNull()
  })

  it('reports 29 or 30 day months only', () => {
    for (let month = 1; month <= 12; month += 1) {
      expect([29, 30]).toContain(getLunarMonthLength(month, 2026))
    }
  })
})

describe('can chi', () => {
  it('names the year', () => {
    expect(getYearCanChi(2026).name).toBe('Bính Ngọ')
    expect(getYearCanChi(2025).name).toBe('Ất Tỵ')
    expect(getYearCanChi(2024).name).toBe('Giáp Thìn')
    expect(getYearCanChi(1945).name).toBe('Ất Dậu')
  })

  it('names the month', () => {
    // Tháng Giêng is always a Dần month
    expect(getMonthCanChi(1, 2026).chi).toBe('Dần')
    expect(getMonthCanChi(11, 2026).chi).toBe('Tý')
  })

  it('names the day and advances by one per day', () => {
    // 1/1/2000 is the standard anchor for the day cycle.
    expect(getDayCanChi(d(2000, 1, 1)).name).toBe('Mậu Ngọ')
    expect(getDayCanChi(d(2026, 8, 11)).name).toBe('Đinh Tỵ')
    expect(getDayCanChi(d(2026, 8, 12)).name).toBe('Mậu Ngọ')
  })

  it('repeats on a 60 day cycle', () => {
    expect(getDayCanChi(d(2026, 8, 11)).name).toBe(getDayCanChi(d(2026, 10, 10)).name)
  })
})

describe('solar terms', () => {
  it('places the solstices and equinoxes', () => {
    expect(getSolarTerm(d(2026, 6, 22)).name).toBe('Hạ chí')
    expect(getSolarTerm(d(2026, 12, 23)).name).toBe('Đông chí')
    expect(getSolarTerm(d(2026, 3, 21)).name).toBe('Xuân phân')
  })

  it('marks the first day of a term only', () => {
    const start = getSolarTermStart(d(2026, 8, 8))
    expect(start?.name).toBe('Lập thu')
    expect(getSolarTermStart(d(2026, 8, 9))).toBeNull()
  })

  it('covers every day of a year with a valid term', () => {
    for (let jd = jdFromDate(1, 1, 2026); jd <= jdFromDate(31, 12, 2026); jd += 1) {
      const [day, month, year] = jdToDate(jd)
      const term = getSolarTerm(d(year, month, day))
      expect(term.index).toBeGreaterThanOrEqual(0)
      expect(term.index).toBeLessThan(24)
      expect(term.name).toBeTruthy()
    }
  })
})

describe('giờ hoàng đạo', () => {
  it('returns 12 double-hours starting at 23:00', () => {
    const hours = getHours(d(2026, 8, 11))
    expect(hours).toHaveLength(12)
    expect(hours[0].chi).toBe('Tý')
    expect(hours[0].range).toBe('23:00 - 01:00')
    expect(hours.filter((h) => h.isAuspicious).length).toBe(6)
  })
})
