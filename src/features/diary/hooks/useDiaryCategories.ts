import { useCallback, useEffect, useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { createCategory, deleteCategory, listCategories, renameCategory } from '../services/diary-category.service'
import type { DiaryCategory } from '../types/diary'

export function useDiaryCategories(): {
  categories: DiaryCategory[]
  isLoading: boolean
  add: (name: string) => Promise<DiaryCategory | undefined>
  rename: (id: string, name: string) => Promise<void>
  remove: (id: string) => Promise<void>
} {
  const { user } = useAuth()
  const [categories, setCategories] = useState<DiaryCategory[]>([])
  const [isLoading, setIsLoading] = useState(false)

  useEffect(() => {
    if (!user) {
      setCategories([])
      return
    }
    setIsLoading(true)
    listCategories(user.id)
      .then(setCategories)
      .catch(() => {})
      .finally(() => setIsLoading(false))
  }, [user])

  const add = useCallback(
    async (name: string) => {
      if (!user) return
      const category = await createCategory(user.id, name)
      setCategories((prev) => [...prev, category])
      return category
    },
    [user],
  )

  const rename = useCallback(async (id: string, name: string) => {
    const updated = await renameCategory(id, name)
    setCategories((prev) => prev.map((category) => (category.id === id ? updated : category)))
  }, [])

  const remove = useCallback(async (id: string) => {
    await deleteCategory(id)
    setCategories((prev) => prev.filter((category) => category.id !== id))
  }, [])

  return { categories, isLoading, add, rename, remove }
}
