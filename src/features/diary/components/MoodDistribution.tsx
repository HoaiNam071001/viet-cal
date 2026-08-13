import { useTranslation } from 'react-i18next'
import { EmptyState } from '@/shared/components/ui/EmptyState'
import type { DiaryStats } from '../hooks/useDiaryStats'

export function MoodDistribution({ moodCounts }: { moodCounts: DiaryStats['moodCounts'] }) {
  const { t } = useTranslation()
  if (moodCounts.length === 0) {
    return <EmptyState className="py-6" title={t('diary.noMoodData')} />
  }

  const max = moodCounts[0].count

  return (
    <div className="flex flex-col gap-2.5">
      {moodCounts.map((mood) => (
        <div key={mood.emoji} className="flex items-center gap-3">
          <span className="w-6 text-center text-lg leading-none">{mood.emoji}</span>
          <div className="bg-surface-2 h-2.5 flex-1 overflow-hidden rounded-full">
            <div
              className="bg-primary h-full rounded-full"
              style={{ width: `${Math.max(8, (mood.count / max) * 100)}%` }}
            />
          </div>
          <span className="text-subtle w-5 text-right text-xs tabular-nums">{mood.count}</span>
        </div>
      ))}
    </div>
  )
}
