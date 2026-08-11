import { STORAGE_KEYS } from '@/app/config/app.config'
import { readStorage, writeStorage } from '@/shared/hooks/useLocalStorage'
import type { Holiday } from '../types'

interface CacheEntry {
  fetchedAt: number
  holidays: Holiday[]
}

type CacheShape = Record<string, CacheEntry>

/** Public holidays barely change; a month-old copy is still perfectly usable. */
const TTL_MS = 30 * 24 * 60 * 60 * 1000

function readAll(): CacheShape {
  return readStorage<CacheShape>(STORAGE_KEYS.holidays, {})
}

export function readCachedHolidays(year: number): { holidays: Holiday[]; stale: boolean } | null {
  const entry = readAll()[String(year)]
  if (!entry) return null
  return { holidays: entry.holidays, stale: Date.now() - entry.fetchedAt > TTL_MS }
}

export function writeCachedHolidays(year: number, holidays: Holiday[]): void {
  const all = readAll()
  all[String(year)] = { fetchedAt: Date.now(), holidays }
  // Keep the cache small — only years near the one just fetched matter.
  const years = Object.keys(all)
    .map(Number)
    .sort((a, b) => Math.abs(a - year) - Math.abs(b - year))
    .slice(0, 8)
  const trimmed: CacheShape = {}
  for (const y of years) trimmed[String(y)] = all[String(y)]
  writeStorage(STORAGE_KEYS.holidays, trimmed)
}
