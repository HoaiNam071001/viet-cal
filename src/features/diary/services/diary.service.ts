import { supabase } from '@/lib/supabase'
import type { DiaryEntry, DiaryEntryInput } from '../types/diary'

interface DiaryEntryRow {
  id: string
  date: string
  title: string | null
  content: string | null
  mood_emoji: string | null
  mood_intensity: number | null
  category_id: string | null
  tags: string[] | null
  created_at: string
  updated_at: string
}

const ENTRY_COLUMNS =
  'id, date, title, content, mood_emoji, mood_intensity, category_id, tags, created_at, updated_at'

function mapEntry(row: DiaryEntryRow): DiaryEntry {
  return {
    id: row.id,
    date: row.date,
    title: row.title,
    content: row.content,
    moodEmoji: row.mood_emoji,
    moodIntensity: row.mood_intensity,
    categoryId: row.category_id,
    tags: row.tags ?? [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  }
}

function nextMonthStart(year: number, month: number): string {
  const y = month === 12 ? year + 1 : year
  const m = month === 12 ? 1 : month + 1
  return `${y}-${String(m).padStart(2, '0')}-01`
}

export async function listEntriesForMonth(
  userId: string,
  year: number,
  month: number,
): Promise<DiaryEntry[]> {
  const from = `${year}-${String(month).padStart(2, '0')}-01`
  const to = nextMonthStart(year, month)

  const { data, error } = await supabase
    .from('diary_entries')
    .select(ENTRY_COLUMNS)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .gte('date', from)
    .lt('date', to)
    .order('date', { ascending: false })

  if (error) throw error
  return (data ?? []).map(mapEntry)
}

export async function getEntry(id: string): Promise<DiaryEntry | null> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select(ENTRY_COLUMNS)
    .eq('id', id)
    .is('deleted_at', null)
    .maybeSingle()

  if (error) throw error
  return data ? mapEntry(data) : null
}

export async function createEntry(userId: string, input: DiaryEntryInput): Promise<DiaryEntry> {
  const { data, error } = await supabase
    .from('diary_entries')
    .insert({
      user_id: userId,
      date: input.date,
      title: input.title || null,
      content: input.content || null,
      mood_emoji: input.moodEmoji,
      mood_intensity: input.moodIntensity,
      category_id: input.categoryId,
      tags: input.tags,
    })
    .select(ENTRY_COLUMNS)
    .single()

  if (error) throw error
  return mapEntry(data)
}

export async function updateEntry(id: string, input: DiaryEntryInput): Promise<DiaryEntry> {
  const { data, error } = await supabase
    .from('diary_entries')
    .update({
      date: input.date,
      title: input.title || null,
      content: input.content || null,
      mood_emoji: input.moodEmoji,
      mood_intensity: input.moodIntensity,
      category_id: input.categoryId,
      tags: input.tags,
    })
    .eq('id', id)
    .select(ENTRY_COLUMNS)
    .single()

  if (error) throw error
  return mapEntry(data)
}

/** Title/content full-text-ish search (ILIKE) across all of the user's entries. */
export async function searchEntries(userId: string, query: string, limit = 30): Promise<DiaryEntry[]> {
  const term = query.trim()
  if (!term) return []
  const escaped = term.replace(/[%_]/g, (char) => `\\${char}`)

  const { data, error } = await supabase
    .from('diary_entries')
    .select(ENTRY_COLUMNS)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .or(`title.ilike.%${escaped}%,content.ilike.%${escaped}%`)
    .order('date', { ascending: false })
    .limit(limit)

  if (error) throw error
  return (data ?? []).map(mapEntry)
}

/** Every entry the user has, oldest first — used for the "export my data" flow. */
export async function listAllEntries(userId: string): Promise<DiaryEntry[]> {
  const { data, error } = await supabase
    .from('diary_entries')
    .select(ENTRY_COLUMNS)
    .eq('user_id', userId)
    .is('deleted_at', null)
    .order('date', { ascending: true })

  if (error) throw error
  return (data ?? []).map(mapEntry)
}

export async function deleteEntry(id: string): Promise<void> {
  const { error } = await supabase
    .from('diary_entries')
    .update({ deleted_at: new Date().toISOString() })
    .eq('id', id)

  if (error) throw error
}
