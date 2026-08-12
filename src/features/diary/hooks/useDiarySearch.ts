import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { searchEntries } from '../services/diary.service'
import type { DiaryEntry } from '../types/diary'

const DEBOUNCE_MS = 300

export function useDiarySearch(query: string): { results: DiaryEntry[]; isSearching: boolean } {
  const { user } = useAuth()
  const [results, setResults] = useState<DiaryEntry[]>([])
  const [isSearching, setIsSearching] = useState(false)

  useEffect(() => {
    const trimmed = query.trim()
    if (!user || !trimmed) {
      setResults([])
      return
    }

    let cancelled = false
    setIsSearching(true)
    const timer = setTimeout(() => {
      searchEntries(user.id, trimmed)
        .then((entries) => {
          if (!cancelled) setResults(entries)
        })
        .catch(() => {})
        .finally(() => {
          if (!cancelled) setIsSearching(false)
        })
    }, DEBOUNCE_MS)

    return () => {
      cancelled = true
      clearTimeout(timer)
    }
  }, [query, user])

  return { results, isSearching }
}
