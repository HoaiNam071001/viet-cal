import type { CivilDate } from '@/shared/types'
import { AUSPICIOUS_HOUR_TABLE, CHI } from '../constants'
import type { AuspiciousHour } from '../types'
import { jdFromDate } from './astronomy'

const pad = (n: number) => String(n).padStart(2, '0')

/**
 * The twelve double-hours of the day with their giờ hoàng đạo flag.
 * Hour i starts at 23:00 + 2i.
 */
export function getHours(date: CivilDate): AuspiciousHour[] {
  const jd = jdFromDate(date.day, date.month, date.year)
  const chiOfDay = (jd + 1) % 12
  const row = AUSPICIOUS_HOUR_TABLE[chiOfDay % 6]

  return CHI.map((chi, i) => {
    const start = (23 + i * 2) % 24
    const end = (start + 2) % 24
    return {
      chi,
      range: `${pad(start)}:00 - ${pad(end)}:00`,
      isAuspicious: row[i] === '1',
    }
  })
}

/** Only the auspicious ones — what the day detail panel shows. */
export function getAuspiciousHours(date: CivilDate): AuspiciousHour[] {
  return getHours(date).filter((h) => h.isAuspicious)
}
