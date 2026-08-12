import { ChevronLeft, Pencil } from 'lucide-react'
import { Badge } from '@/shared/components/ui/Badge'
import { Button } from '@/shared/components/ui/Button'
import { formatFullDateVN, fromKey } from '@/shared/utils/date'
import type { DiaryEntry } from '../types/diary'

interface DiaryDetailProps {
  entry: DiaryEntry
  onEdit: () => void
  onBack: () => void
}

export function DiaryDetail({ entry, onEdit, onBack }: DiaryDetailProps) {
  const date = fromKey(entry.date)

  return (
    <div>
      <Button variant="ghost" size="sm" onClick={onBack} className="mb-3 -ml-2 gap-1.5">
        <ChevronLeft className="size-4" />
        Nhật ký
      </Button>

      <p className="text-muted text-sm">{date ? formatFullDateVN(date) : entry.date}</p>
      <h1 className="text-text mt-1 text-2xl font-semibold">{entry.title || 'Không có tiêu đề'}</h1>

      {entry.moodEmoji || entry.tags.length > 0 ? (
        <div className="mt-3 flex flex-wrap items-center gap-2">
          {entry.moodEmoji ? (
            <Badge tone="primary">
              {entry.moodEmoji}
              {entry.moodIntensity ? ` ${entry.moodIntensity}/5` : ''}
            </Badge>
          ) : null}
          {entry.tags.map((tag) => (
            <Badge key={tag} tone="neutral">
              #{tag}
            </Badge>
          ))}
        </div>
      ) : null}

      {entry.content ? (
        <p className="text-text mt-5 text-[15px] leading-relaxed whitespace-pre-wrap">{entry.content}</p>
      ) : (
        <p className="text-subtle mt-5 text-sm">Không có nội dung.</p>
      )}

      <div className="mt-6">
        <Button variant="primary" onClick={onEdit} className="gap-1.5">
          <Pencil className="size-4" />
          Sửa
        </Button>
      </div>
    </div>
  )
}
