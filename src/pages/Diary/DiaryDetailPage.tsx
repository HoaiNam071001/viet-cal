import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/app/config/routes'
import { DiaryDetail } from '@/features/diary/components/DiaryDetail'
import { getEntry } from '@/features/diary/services/diary.service'
import type { DiaryEntry } from '@/features/diary/types/diary'
import { EmptyState } from '@/shared/components/ui/EmptyState'

export function DiaryDetailPage() {
  const { t } = useTranslation()
  const { id } = useParams<{ id: string }>()
  const navigate = useNavigate()
  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    getEntry(id)
      .then(setEntry)
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <p className="text-subtle py-10 text-center text-sm">{t('common.loading')}</p>
  if (!entry) {
    return (
      <EmptyState
        className="py-10"
        title={t('diary.notFound')}
        description={t('diary.notFoundDescription')}
      />
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <DiaryDetail
        entry={entry}
        onEdit={() => navigate(ROUTES.diaryEdit(entry.id))}
        onBack={() => navigate(ROUTES.diary)}
      />
    </div>
  )
}
