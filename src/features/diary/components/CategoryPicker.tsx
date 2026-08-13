import { Plus } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { cn } from '@/shared/utils/cn'
import type { DiaryCategory } from '../types/diary'

interface CategoryPickerProps {
  categoryId: string | null
  categories: DiaryCategory[]
  onChange: (categoryId: string | null) => void
  onCreate: (name: string) => Promise<DiaryCategory | undefined>
}

export function CategoryPicker({ categoryId, categories, onChange, onCreate }: CategoryPickerProps) {
  const { t } = useTranslation()
  const [isAdding, setIsAdding] = useState(false)
  const [name, setName] = useState('')

  const submitNew = async () => {
    const trimmed = name.trim()
    setIsAdding(false)
    setName('')
    if (!trimmed) return
    const created = await onCreate(trimmed)
    if (created) onChange(created.id)
  }

  const chip = (key: string, label: string, active: boolean, onClick: () => void) => (
    <button
      key={key}
      type="button"
      onClick={onClick}
      className={cn(
        'rounded-xl px-3 py-1.5 text-xs font-medium transition-colors',
        active ? 'bg-primary text-primary-fg' : 'bg-surface-2 text-muted hover:bg-surface-3',
      )}
    >
      {label}
    </button>
  )

  return (
    <div className="flex flex-wrap items-center gap-2">
      {chip('none', t('diary.uncategorized'), !categoryId, () => onChange(null))}
      {categories.map((category) =>
        chip(
          category.id,
          `${category.emoji ? `${category.emoji} ` : ''}${category.name}`,
          categoryId === category.id,
          () => onChange(category.id),
        ),
      )}
      {isAdding ? (
        <input
          autoFocus
          value={name}
          onChange={(event) => setName(event.target.value)}
          onBlur={submitNew}
          onKeyDown={(event) => {
            if (event.key === 'Enter') {
              event.preventDefault()
              submitNew()
            }
          }}
          placeholder={t('diary.categoryNamePlaceholder')}
          className="bg-surface-2 border-border text-text h-8 w-32 rounded-xl border px-2.5 text-xs outline-none"
        />
      ) : (
        <button
          type="button"
          onClick={() => setIsAdding(true)}
          className="text-primary flex items-center gap-1 rounded-xl px-2 py-1.5 text-xs font-medium"
        >
          <Plus className="size-3.5" />
          {t('common.add')}
        </button>
      )}
    </div>
  )
}
