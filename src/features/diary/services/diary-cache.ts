import { STORAGE_KEYS } from '@/app/config/app.config'
import { readStorage, writeStorage } from '@/shared/hooks/useLocalStorage'
import type { DiaryEntry } from '../types/diary'

interface CacheShape {
  [monthKey: string]: DiaryEntry[]
}

/** Diary entries are scoped per user so a shared browser never leaks between accounts. */
function storageKey(userId: string): string {
  return `${STORAGE_KEYS.diaryEntries}:${userId}`
}

function readAll(userId: string): CacheShape {
  return readStorage<CacheShape>(storageKey(userId), {})
}

export function readCachedMonth(userId: string, year: number, month: number): DiaryEntry[] | null {
  const key = `${year}-${String(month).padStart(2, '0')}`
  return readAll(userId)[key] ?? null
}

function monthIndex(key: string): number {
  const [y, m] = key.split('-').map(Number)
  return y * 12 + m
}

export function writeCachedMonth(userId: string, year: number, month: number, entries: DiaryEntry[]): void {
  const key = `${year}-${String(month).padStart(2, '0')}`
  const all = readAll(userId)
  all[key] = entries
  // Keep the cache small — only months near the one just fetched matter.
  const target = monthIndex(key)
  const keys = Object.keys(all).sort((a, b) => Math.abs(monthIndex(a) - target) - Math.abs(monthIndex(b) - target))
  const trimmed: CacheShape = {}
  for (const k of keys.slice(0, 12)) trimmed[k] = all[k]
  writeStorage(storageKey(userId), trimmed)
}
