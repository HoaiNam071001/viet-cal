import { useTranslation } from 'react-i18next'
import type { DiaryStats } from '../hooks/useDiaryStats'

export function StatsCard({ stats }: { stats: DiaryStats }) {
  const { t } = useTranslation()
  const items: Array<{ value: string; label: string }> = [
    { value: String(stats.totalEntriesThisMonth), label: t('diary.entriesThisMonth') },
    { value: `🔥 ${stats.streakCurrent}`, label: t('diary.currentStreak') },
    { value: String(stats.streakLongest), label: t('diary.longestStreak') },
  ]

  return (
    <dl className="grid grid-cols-3 gap-2.5">
      {items.map((item) => (
        <div key={item.label} className="glass-card rounded-2xl px-2 py-3 text-center">
          <dt className="text-text text-lg font-semibold tabular-nums">{item.value}</dt>
          <dd className="text-subtle mt-0.5 text-[11px]">{item.label}</dd>
        </div>
      ))}
    </dl>
  )
}
