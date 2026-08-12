import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useAuth } from '@/app/providers/AuthProvider'
import { useDiaryContext } from '@/app/providers/DiaryProvider'
import { Button } from '@/shared/components/ui/Button'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import { useDiaryCategories } from '../hooks/useDiaryCategories'
import { useDiaryTags } from '../hooks/useDiaryTags'
import { createEntry, deleteEntry, updateEntry } from '../services/diary.service'
import type { DiaryEntry, DiaryEntryInput } from '../types/diary'
import { CategoryPicker } from './CategoryPicker'
import { MoodPicker } from './MoodPicker'
import { TagInput } from './TagInput'

interface DiaryEditorProps {
  date: CivilDate
  /** Present when editing an existing entry; absent when creating a new one. */
  entry?: DiaryEntry
  /** Seeds a fresh entry (e.g. from a quick-write template) — ignored once `entry` is set. */
  initialContent?: string
  initialMoodEmoji?: string
  onSaved: (entry: DiaryEntry) => void
  onCancel: () => void
  onDeleted?: () => void
}

export function DiaryEditor({
  date,
  entry,
  initialContent,
  initialMoodEmoji,
  onSaved,
  onCancel,
  onDeleted,
}: DiaryEditorProps) {
  const { user } = useAuth()
  const { invalidateMonth } = useDiaryContext()
  const { categories, add: addCategory } = useDiaryCategories()
  const tagSuggestions = useDiaryTags()

  const [title, setTitle] = useState(entry?.title ?? '')
  const [content, setContent] = useState(entry?.content ?? initialContent ?? '')
  const [moodEmoji, setMoodEmoji] = useState<string | null>(entry?.moodEmoji ?? initialMoodEmoji ?? null)
  const [moodIntensity, setMoodIntensity] = useState<number | null>(
    entry?.moodIntensity ?? (initialMoodEmoji ? 3 : null),
  )
  const [categoryId, setCategoryId] = useState<string | null>(entry?.categoryId ?? null)
  const [tags, setTags] = useState<string[]>(entry?.tags ?? [])
  const [isSaving, setIsSaving] = useState(false)
  const [isDeleting, setIsDeleting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const onMoodChange = (nextEmoji: string | null, nextIntensity: number | null) => {
    setMoodEmoji(nextEmoji)
    setMoodIntensity(nextIntensity)
  }

  const save = async () => {
    if (!user) return
    setIsSaving(true)
    setError(null)
    try {
      const input: DiaryEntryInput = {
        date: toKey(date),
        title: title.trim(),
        content: content.trim(),
        moodEmoji,
        moodIntensity,
        categoryId,
        tags,
      }
      const saved = entry ? await updateEntry(entry.id, input) : await createEntry(user.id, input)
      invalidateMonth(date.year, date.month)
      onSaved(saved)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể lưu nhật ký.')
    } finally {
      setIsSaving(false)
    }
  }

  const remove = async () => {
    if (!entry) return
    setIsDeleting(true)
    setError(null)
    try {
      await deleteEntry(entry.id)
      invalidateMonth(date.year, date.month)
      onDeleted?.()
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Không thể xoá nhật ký.')
      setIsDeleting(false)
    }
  }

  const busy = isSaving || isDeleting

  return (
    <div className="flex flex-col gap-4">
      <input
        value={title}
        onChange={(event) => setTitle(event.target.value)}
        placeholder="Tiêu đề (không bắt buộc)"
        className="bg-surface-2 border-border text-text focus:border-primary h-12 w-full rounded-2xl border px-3.5 text-base font-medium outline-none transition-colors"
      />

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder="Hôm nay của bạn thế nào?"
        rows={8}
        className="bg-surface-2 border-border text-text focus:border-primary w-full resize-none rounded-2xl border p-3.5 text-sm leading-relaxed outline-none transition-colors"
      />

      <div>
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">Cảm xúc</p>
        <MoodPicker emoji={moodEmoji} intensity={moodIntensity} onChange={onMoodChange} />
      </div>

      <div>
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">Danh mục</p>
        <CategoryPicker categoryId={categoryId} categories={categories} onChange={setCategoryId} onCreate={addCategory} />
      </div>

      <div>
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">Thẻ</p>
        <TagInput tags={tags} onChange={setTags} suggestions={tagSuggestions} />
      </div>

      {error ? <p className="text-primary text-sm">{error}</p> : null}

      <div className="mt-1 flex gap-2">
        <Button variant="primary" size="lg" className="flex-1" onClick={save} disabled={busy}>
          {isSaving ? 'Đang lưu…' : 'Lưu'}
        </Button>
        <Button variant="secondary" size="lg" onClick={onCancel} disabled={busy}>
          Huỷ
        </Button>
        {entry ? (
          <Button variant="ghost" size="icon" aria-label="Xoá nhật ký" onClick={remove} disabled={busy}>
            <Trash2 className="size-4.5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
