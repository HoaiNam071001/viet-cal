import { Trash2 } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
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
import { TitleAutocomplete } from './TitleAutocomplete'

interface DiaryEditorProps {
  date: CivilDate
  /** Present when editing an existing entry; absent when creating a new one. */
  entry?: DiaryEntry
  /** Seeds a fresh entry (e.g. from a quick-write template) — ignored once `entry` is set. */
  initialContent?: string
  initialMoodEmoji?: string
  /** Quick-pick sample titles from the selected template — ignored once `entry` is set. */
  titleSuggestions?: string[]
  onSaved: (entry: DiaryEntry) => void
  onCancel: () => void
  onDeleted?: () => void
}

export function DiaryEditor({
  date,
  entry,
  initialContent,
  initialMoodEmoji,
  titleSuggestions,
  onSaved,
  onCancel,
  onDeleted,
}: DiaryEditorProps) {
  const { t } = useTranslation()
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
      setError(err instanceof Error ? err.message : t('diary.saveFailed'))
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
      setError(err instanceof Error ? err.message : t('diary.deleteFailed'))
      setIsDeleting(false)
    }
  }

  const busy = isSaving || isDeleting

  return (
    <div className="flex flex-col gap-4">
      <div>
        <TitleAutocomplete value={title} onChange={setTitle} placeholder={t('diary.titlePlaceholder')} />
        {!entry && titleSuggestions?.length ? (
          <div className="mt-2 flex flex-wrap gap-1.5">
            {titleSuggestions.map((suggestion) => (
              <button
                key={suggestion}
                type="button"
                onClick={() => setTitle(suggestion)}
                className="bg-surface-2 hover:bg-surface-3 text-subtle rounded-full px-2.5 py-1 text-xs transition-colors"
              >
                {suggestion}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      <textarea
        value={content}
        onChange={(event) => setContent(event.target.value)}
        placeholder={t('diary.contentPlaceholder')}
        rows={8}
        className="bg-surface-2 border-border text-text focus:border-primary w-full resize-none rounded-2xl border p-3.5 text-sm leading-relaxed outline-none transition-colors"
      />

      <div>
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">{t('diary.mood')}</p>
        <MoodPicker emoji={moodEmoji} intensity={moodIntensity} onChange={onMoodChange} />
      </div>

      <div>
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">{t('diary.category')}</p>
        <CategoryPicker categoryId={categoryId} categories={categories} onChange={setCategoryId} onCreate={addCategory} />
      </div>

      <div>
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">{t('diary.tags')}</p>
        <TagInput tags={tags} onChange={setTags} suggestions={tagSuggestions} />
      </div>

      {error ? <p className="text-primary text-sm">{error}</p> : null}

      <div className="mt-1 flex gap-2">
        <Button variant="primary" size="lg" className="flex-1" onClick={save} disabled={busy}>
          {isSaving ? t('common.saving') : t('common.save')}
        </Button>
        <Button variant="secondary" size="lg" onClick={onCancel} disabled={busy}>
          {t('common.cancel')}
        </Button>
        {entry ? (
          <Button variant="ghost" size="icon" aria-label={t('diary.deleteEntry')} onClick={remove} disabled={busy}>
            <Trash2 className="size-4.5" />
          </Button>
        ) : null}
      </div>
    </div>
  )
}
