import { Check, Pencil, Plus, Trash2, X } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/Button'
import { useDiaryCategories } from '../hooks/useDiaryCategories'

export function CategoryManager() {
  const { t } = useTranslation()
  const { categories, add, rename, remove } = useDiaryCategories()
  const [editingId, setEditingId] = useState<string | null>(null)
  const [draft, setDraft] = useState('')
  const [newName, setNewName] = useState('')
  const [isAdding, setIsAdding] = useState(false)

  const startEdit = (id: string, name: string) => {
    setEditingId(id)
    setDraft(name)
  }

  const commitEdit = async () => {
    const trimmed = draft.trim()
    if (editingId && trimmed) await rename(editingId, trimmed)
    setEditingId(null)
  }

  const submitNew = async () => {
    const trimmed = newName.trim()
    setNewName('')
    setIsAdding(false)
    if (trimmed) await add(trimmed)
  }

  return (
    <div className="flex flex-col gap-1.5">
      {categories.length === 0 ? (
        <p className="text-subtle text-sm">{t('diary.noCategories')}</p>
      ) : (
        categories.map((category) => (
          <div key={category.id} className="flex items-center gap-2 py-1">
            {editingId === category.id ? (
              <>
                <input
                  autoFocus
                  value={draft}
                  onChange={(event) => setDraft(event.target.value)}
                  onKeyDown={(event) => event.key === 'Enter' && commitEdit()}
                  className="bg-surface-2 border-border text-text h-9 flex-1 rounded-xl border px-3 text-sm outline-none"
                />
                <Button variant="ghost" size="icon-sm" aria-label={t('common.save')} onClick={commitEdit}>
                  <Check className="size-4" />
                </Button>
                <Button variant="ghost" size="icon-sm" aria-label={t('common.cancel')} onClick={() => setEditingId(null)}>
                  <X className="size-4" />
                </Button>
              </>
            ) : (
              <>
                <span className="text-text flex-1 text-sm">
                  {category.emoji ? `${category.emoji} ` : ''}
                  {category.name}
                </span>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('diary.editCategory', { name: category.name })}
                  onClick={() => startEdit(category.id, category.name)}
                >
                  <Pencil className="size-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon-sm"
                  aria-label={t('diary.deleteCategory', { name: category.name })}
                  onClick={() => remove(category.id)}
                >
                  <Trash2 className="size-3.5" />
                </Button>
              </>
            )}
          </div>
        ))
      )}

      {isAdding ? (
        <div className="mt-1 flex items-center gap-2">
          <input
            autoFocus
            value={newName}
            onChange={(event) => setNewName(event.target.value)}
            onKeyDown={(event) => event.key === 'Enter' && submitNew()}
            onBlur={submitNew}
            placeholder={t('diary.newCategoryPlaceholder')}
            className="bg-surface-2 border-border text-text h-9 flex-1 rounded-xl border px-3 text-sm outline-none"
          />
        </div>
      ) : (
        <Button variant="ghost" size="sm" className="text-primary mt-1 justify-start gap-1.5" onClick={() => setIsAdding(true)}>
          <Plus className="size-4" />
          {t('diary.addCategory')}
        </Button>
      )}
    </div>
  )
}
