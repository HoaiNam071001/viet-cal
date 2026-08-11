import { normalizeVietnamese } from '@/shared/utils/vietnamese'
import type { Holiday } from '../types'
import { fetchRemoteHolidays } from './holiday-api'
import { readCachedHolidays, writeCachedHolidays } from './holiday-cache'
import { getLocalHolidays, type LocalHolidayOptions } from './holiday-rules'

export interface HolidayResult {
  holidays: Holiday[]
  /** Whether the remote source contributed — the UI can note "offline data". */
  usedRemote: boolean
}

/**
 * Local rules are authoritative for anything lunar (Tết, Giỗ Tổ, Trung Thu…):
 * a remote entry is dropped when a local one already covers that day.
 */
function merge(local: Holiday[], remote: Holiday[]): Holiday[] {
  const localByDate = new Map<string, Holiday[]>()
  for (const holiday of local) {
    const list = localByDate.get(holiday.date) ?? []
    list.push(holiday)
    localByDate.set(holiday.date, list)
  }

  const extras = remote.filter((candidate) => {
    const sameDay = localByDate.get(candidate.date)
    if (!sameDay) return true
    const name = normalizeVietnamese(candidate.name)
    const alt = normalizeVietnamese(candidate.localName ?? '')
    return !sameDay.some((existing) => {
      const known = normalizeVietnamese(existing.name)
      return known.includes(name) || name.includes(known) || (alt && known.includes(alt))
    })
  })

  return [...local, ...extras].sort((a, b) => a.date.localeCompare(b.date))
}

const inFlight = new Map<number, Promise<HolidayResult>>()

/**
 * Holidays for a solar year: local rules first, then the remote API layered on
 * top when it is reachable, with a localStorage cache in between. Never throws.
 */
export function getHolidays(year: number, options: LocalHolidayOptions = {}): Promise<HolidayResult> {
  const existing = inFlight.get(year)
  if (existing) return existing

  const request = load(year, options).finally(() => inFlight.delete(year))
  inFlight.set(year, request)
  return request
}

async function load(year: number, options: LocalHolidayOptions): Promise<HolidayResult> {
  const local = getLocalHolidays(year, options)
  const cached = readCachedHolidays(year)

  if (cached && !cached.stale) {
    return { holidays: merge(local, cached.holidays), usedRemote: true }
  }

  try {
    const remote = await fetchRemoteHolidays(year)
    writeCachedHolidays(year, remote)
    return { holidays: merge(local, remote), usedRemote: true }
  } catch {
    // Offline, blocked, or the API is down — a stale cache still beats nothing.
    if (cached) return { holidays: merge(local, cached.holidays), usedRemote: true }
    return { holidays: local, usedRemote: false }
  }
}

/** Synchronous view used for the very first paint, before the network answers. */
export function getHolidaysSync(year: number, options: LocalHolidayOptions = {}): Holiday[] {
  const local = getLocalHolidays(year, options)
  const cached = readCachedHolidays(year)
  return cached ? merge(local, cached.holidays) : local
}
