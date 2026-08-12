import { formatDateVN, fromKey } from '@/shared/utils/date'
import type { DiaryEntry } from '../types/diary'

export function DiaryCard({ entry, onSelect }: { entry: DiaryEntry; onSelect: (entry: DiaryEntry) => void }) {
  const date = fromKey(entry.date)

  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="glass-card w-full rounded-3xl p-4 text-left transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-subtle text-xs font-medium">{date ? formatDateVN(date) : entry.date}</p>
        {entry.moodEmoji ? <span className="text-xl leading-none">{entry.moodEmoji}</span> : null}
      </div>
      <p className="text-text mt-1 text-[15px] font-semibold">{entry.title || 'Không có tiêu đề'}</p>
      {entry.content ? <p className="text-muted mt-1 line-clamp-2 text-sm">{entry.content}</p> : null}
      {entry.tags.length > 0 ? (
        <div className="mt-2 flex flex-wrap gap-1.5">
          {entry.tags.map((tag) => (
            <span key={tag} className="text-subtle text-xs">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  )
}
