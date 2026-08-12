import { ChevronLeft } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DiaryHeatmap } from '@/features/diary/components/DiaryHeatmap'
import { MoodDistribution } from '@/features/diary/components/MoodDistribution'
import { StatsCard } from '@/features/diary/components/StatsCard'
import { useDiaryStats } from '@/features/diary/hooks/useDiaryStats'
import { Button } from '@/shared/components/ui/Button'
import { Card, CardHeader } from '@/shared/components/ui/Card'

export function DiaryAnalyticsPage() {
  const navigate = useNavigate()
  const stats = useDiaryStats()

  return (
    <div className="mx-auto max-w-xl">
      <Button variant="ghost" size="sm" onClick={() => navigate('/diary')} className="mb-3 -ml-2 gap-1.5">
        <ChevronLeft className="size-4" />
        Nhật ký
      </Button>

      <h1 className="text-text mb-1 text-xl font-semibold">Thống kê</h1>
      <p className="text-muted mb-5 text-sm">3 tháng gần nhất.</p>

      <div className="flex flex-col gap-4">
        <StatsCard stats={stats} />

        <Card className="p-5">
          <CardHeader title="Hoạt động 12 tuần" className="px-0 pt-0" />
          <DiaryHeatmap heatmap={stats.heatmap} />
        </Card>

        <Card className="p-5">
          <CardHeader title="Cảm xúc" className="px-0 pt-0" />
          <MoodDistribution moodCounts={stats.moodCounts} />
        </Card>
      </div>
    </div>
  )
}
