import { Moon } from 'lucide-react'
import { formatLunarDayMonth, getLeapMonthOfYear, useLunarDate } from '@/features/lunar'
import { Card, CardHeader, InfoRow } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'

/** Lunar identity of the day currently selected in the calendar. */
export function LunarInfoCard({ date, className }: { date: CivilDate; className?: string }) {
  const info = useLunarDate(date)
  const leapMonth = getLeapMonthOfYear(info.lunar.year)

  return (
    <Card variant="glass" className={cn('overflow-hidden', className)}>
      <CardHeader title="Âm lịch" icon={<Moon className="size-3.5" />} />
      <div className="px-5 pt-1 pb-4">
        <p className="text-accent text-lg font-semibold">{formatLunarDayMonth(info.lunar)}</p>
        <p className="text-subtle mb-2 text-xs">năm {info.sexagenary.year.name}</p>

        <div className="divide-border divide-y">
          <InfoRow label="Ngày">{info.sexagenary.day.name}</InfoRow>
          <InfoRow label="Tháng">{info.sexagenary.month.name}</InfoRow>
          <InfoRow label="Tiết khí">{info.solarTerm.name}</InfoRow>
          <InfoRow label="Tháng nhuận">
            {leapMonth ? `Tháng ${leapMonth}` : 'Không có'}
          </InfoRow>
        </div>
      </div>
    </Card>
  )
}
