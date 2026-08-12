import type { DateKey } from '@/shared/types'

export interface DiaryEntry {
  id: string
  date: DateKey
  title: string | null
  content: string | null
  moodEmoji: string | null
  /** 1 (weakest) – 5 (strongest); only meaningful alongside `moodEmoji`. */
  moodIntensity: number | null
  categoryId: string | null
  tags: string[]
  createdAt: string
  updatedAt: string
}

export interface DiaryEntryInput {
  date: DateKey
  title: string
  content: string
  moodEmoji: string | null
  moodIntensity: number | null
  categoryId: string | null
  tags: string[]
}

export interface DiaryCategory {
  id: string
  name: string
  color: string | null
  emoji: string | null
  order: number
}
