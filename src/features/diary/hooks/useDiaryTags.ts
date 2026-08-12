import { useEffect, useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { listAllTags } from '../services/diary.service'

/** Every distinct tag the user has used, most-used first. */
export function useDiaryTags(): string[] {
  const { user } = useAuth()
  const [tags, setTags] = useState<string[]>([])

  useEffect(() => {
    if (!user) {
      setTags([])
      return
    }
    let cancelled = false
    listAllTags(user.id)
      .then((result) => {
        if (!cancelled) setTags(result)
      })
      .catch(() => {})
    return () => {
      cancelled = true
    }
  }, [user])

  return tags
}
