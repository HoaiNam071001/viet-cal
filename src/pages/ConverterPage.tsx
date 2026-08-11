import { useNavigate } from 'react-router-dom'
import { DateConverter } from '@/features/date-converter/components/DateConverter'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import { TodayCard } from '@/widgets/TodayCard'

export function ConverterPage() {
  const navigate = useNavigate()
  const viewDate = (date: CivilDate) => navigate(`/calendar/day?date=${toKey(date)}`)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <h1 className="text-text mb-1 text-xl font-semibold">Chuyển đổi ngày</h1>
        <p className="text-muted mb-5 text-sm">
          Đổi qua lại giữa Dương lịch và Âm lịch Việt Nam (múi giờ UTC+7).
        </p>
        <DateConverter onViewDate={viewDate} className="max-w-xl" />
      </div>

      <aside className="hidden lg:block">
        <TodayCard onOpen={viewDate} />
      </aside>
    </div>
  )
}
