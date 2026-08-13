import { useTranslation } from 'react-i18next'
import { useSettings } from '@/app/providers/SettingsProvider'
import { formatDateVN, fromKey } from '@/shared/utils/date'
import type { DiaryEntry } from '../types/diary'

export function DiaryCard({ entry, onSelect }: { entry: DiaryEntry; onSelect: (entry: DiaryEntry) => void }) {
  const { t } = useTranslation()
  const date = fromKey(entry.date)
  const { settings } = useSettings()

  return (
    <button
      type="button"
      onClick={() => onSelect(entry)}
      className="glass-card flex h-40 w-full flex-col overflow-hidden rounded-3xl p-4 text-left transition-transform active:scale-[0.99]"
    >
      <div className="flex items-center justify-between gap-2">
        <p className="text-subtle text-xs font-medium">{date ? formatDateVN(date) : entry.date}</p>
        {entry.moodEmoji ? <span className="text-xl leading-none">{entry.moodEmoji}</span> : null}
      </div>
      <p className="text-text mt-1 line-clamp-1 text-[15px] font-semibold">{entry.title || t('diary.noTitle')}</p>
      {settings.showDiaryContentPreview && entry.content ? (
        <p className="text-muted mt-1 line-clamp-2 flex-1 text-sm">{entry.content}</p>
      ) : (
        <div className="flex-1" />
      )}
      {entry.tags.length > 0 ? (
        <div className="mt-2 flex gap-1.5 overflow-hidden">
          {entry.tags.map((tag) => (
            <span key={tag} className="text-subtle shrink-0 text-xs">
              #{tag}
            </span>
          ))}
        </div>
      ) : null}
    </button>
  )
}
