import { useEffect, useState } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { buildTemplateContent, type DiaryTemplateDef } from '@/features/diary/constants/templates'
import { DiaryEditor } from '@/features/diary/components/DiaryEditor'
import { TemplatePicker } from '@/features/diary/components/TemplatePicker'
import { getEntry } from '@/features/diary/services/diary.service'
import type { DiaryEntry } from '@/features/diary/types/diary'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import { useToday } from '@/shared/hooks/useToday'
import { formatDateVN, fromKey } from '@/shared/utils/date'

export function DiaryEditorPage() {
  const { id } = useParams<{ id: string }>()
  const [searchParams] = useSearchParams()
  const navigate = useNavigate()
  const today = useToday()
  const [entry, setEntry] = useState<DiaryEntry | null>(null)
  const [isLoading, setIsLoading] = useState(Boolean(id))
  const [template, setTemplate] = useState<DiaryTemplateDef | null>(null)

  useEffect(() => {
    if (!id) return
    setIsLoading(true)
    getEntry(id)
      .then(setEntry)
      .finally(() => setIsLoading(false))
  }, [id])

  if (isLoading) return <p className="text-subtle py-10 text-center text-sm">Đang tải…</p>
  if (id && !entry) {
    return (
      <EmptyState
        className="py-10"
        title="Không tìm thấy nhật ký"
        description="Nhật ký này có thể đã bị xoá."
      />
    )
  }

  const date = entry ? (fromKey(entry.date) ?? today) : (fromKey(searchParams.get('date') ?? '') ?? today)

  return (
    <div className="mx-auto max-w-xl">
      <h1 className="text-text mb-1 text-xl font-semibold">{entry ? 'Sửa nhật ký' : 'Viết nhật ký'}</h1>
      <p className="text-muted mb-5 text-sm">{formatDateVN(date)}</p>

      {!entry ? (
        <div className="mb-5">
          <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">Bắt đầu nhanh</p>
          <TemplatePicker onPick={setTemplate} />
        </div>
      ) : null}

      <DiaryEditor
        key={template?.id ?? 'blank'}
        date={date}
        entry={entry ?? undefined}
        initialContent={template ? buildTemplateContent(template) : undefined}
        initialMoodEmoji={template?.defaultMoodEmoji}
        onSaved={(saved) => navigate(`/diary/${saved.id}`, { replace: true })}
        onCancel={() => navigate(-1)}
        onDeleted={() => navigate('/diary')}
      />
    </div>
  )
}
