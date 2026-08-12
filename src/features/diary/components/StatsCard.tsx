import type { DiaryStats } from '../hooks/useDiaryStats'

export function StatsCard({ stats }: { stats: DiaryStats }) {
  const items: Array<{ value: string; label: string }> = [
    { value: String(stats.totalEntriesThisMonth), label: 'Nhật ký tháng này' },
    { value: `🔥 ${stats.streakCurrent}`, label: 'Chuỗi hiện tại' },
    { value: String(stats.streakLongest), label: 'Chuỗi dài nhất' },
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
