import { supabase } from '@/lib/supabase'
import type { DiaryCategory } from '../types/diary'

interface DiaryCategoryRow {
  id: string
  name: string
  color: string | null
  emoji: string | null
  order: number
}

const CATEGORY_COLUMNS = 'id, name, color, emoji, "order"'

function mapCategory(row: DiaryCategoryRow): DiaryCategory {
  return { id: row.id, name: row.name, color: row.color, emoji: row.emoji, order: row.order }
}

export async function listCategories(userId: string): Promise<DiaryCategory[]> {
  const { data, error } = await supabase
    .from('diary_categories')
    .select(CATEGORY_COLUMNS)
    .eq('user_id', userId)
    .order('order', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapCategory)
}

export async function createCategory(userId: string, name: string): Promise<DiaryCategory> {
  const { data, error } = await supabase
    .from('diary_categories')
    .insert({ user_id: userId, name })
    .select(CATEGORY_COLUMNS)
    .single()

  if (error) throw error
  return mapCategory(data)
}

export async function renameCategory(id: string, name: string): Promise<DiaryCategory> {
  const { data, error } = await supabase
    .from('diary_categories')
    .update({ name })
    .eq('id', id)
    .select(CATEGORY_COLUMNS)
    .single()

  if (error) throw error
  return mapCategory(data)
}

/** Entries in this category keep their `category_id` set to null (see FK `on delete set null`). */
export async function deleteCategory(id: string): Promise<void> {
  const { error } = await supabase.from('diary_categories').delete().eq('id', id)
  if (error) throw error
}
