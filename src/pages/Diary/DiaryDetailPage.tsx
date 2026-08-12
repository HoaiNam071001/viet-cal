import { useEffect, useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { DiaryDetail } from '@/features/diary/components/DiaryDetail'
import { getEntry } from '@/features/diary/services/diary.service'
import type { DiaryEntry } from '@/features/diary/types/diary'
import { EmptyState } from '@/shared/components/ui/EmptyState'

export function DiaryDetailPage() {
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

  if (isLoading) return <p className="text-subtle py-10 text-center text-sm">Đang tải…</p>
  if (!entry) {
    return (
      <EmptyState
        className="py-10"
        title="Không tìm thấy nhật ký"
        description="Nhật ký này có thể đã bị xoá."
      />
    )
  }

  return (
    <div className="mx-auto max-w-xl">
      <DiaryDetail
        entry={entry}
        onEdit={() => navigate(`/diary/${entry.id}/edit`)}
        onBack={() => navigate('/diary')}
      />
    </div>
  )
}
