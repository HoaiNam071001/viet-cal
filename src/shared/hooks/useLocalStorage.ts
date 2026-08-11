import { useCallback, useEffect, useState } from 'react'

/** Reads once on mount and writes through on change. Safe when storage is unavailable. */
export function useLocalStorage<T>(key: string, initialValue: T) {
  const [value, setValue] = useState<T>(() => readStorage(key, initialValue))

  useEffect(() => {
    try {
      window.localStorage.setItem(key, JSON.stringify(value))
    } catch {
      /* private mode / quota — the app works fine without persistence */
    }
  }, [key, value])

  const update = useCallback((next: T | ((prev: T) => T)) => setValue(next), [])

  return [value, update] as const
}

export function readStorage<T>(key: string, fallback: T): T {
  try {
    const raw = window.localStorage.getItem(key)
    return raw ? (JSON.parse(raw) as T) : fallback
  } catch {
    return fallback
  }
}

export function writeStorage(key: string, value: unknown): void {
  try {
    window.localStorage.setItem(key, JSON.stringify(value))
  } catch {
    /* ignore */
  }
}
