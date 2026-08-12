import { BarChart3, Plus } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { DiaryList } from '@/features/diary/components/DiaryList'
import { Button } from '@/shared/components/ui/Button'
import { useToday } from '@/shared/hooks/useToday'
import { toKey } from '@/shared/utils/date'

export function DiaryListPage() {
  const navigate = useNavigate()
  const today = useToday()

  return (
    <div className="relative mx-auto max-w-xl pb-4">
      <div className="mb-5 flex items-start justify-between gap-3">
        <div>
          <h1 className="text-text mb-1 text-xl font-semibold">Nhật ký</h1>
          <p className="text-muted text-sm">Ghi lại những khoảnh khắc của bạn.</p>
        </div>
        <Button variant="ghost" size="icon-sm" onClick={() => navigate('/diary/analytics')} aria-label="Thống kê">
          <BarChart3 className="size-4.5" />
        </Button>
      </div>

      <DiaryList />

      <Button
        variant="primary"
        size="icon"
        onClick={() => navigate(`/diary/new?date=${toKey(today)}`)}
        aria-label="Viết nhật ký mới"
        className="fixed right-4 bottom-20 z-20 shadow-panel lg:absolute lg:top-0 lg:right-0 lg:bottom-auto"
      >
        <Plus className="size-5" />
      </Button>
    </div>
  )
}
