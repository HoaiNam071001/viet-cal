import { Sun } from 'lucide-react'
import { useHolidaysOfDate } from '@/features/holidays/hooks/useHolidays'
import { formatLunarTraditional, useLunarDate } from '@/features/lunar'
import { Badge } from '@/shared/components/ui/Badge'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { formatDateVN, getWeekdayLabel } from '@/shared/utils/date'

interface TodayCardProps {
  onOpen?: (date: CivilDate) => void
  /** Compact layout for the mobile home strip. */
  compact?: boolean
  className?: string
}

export function TodayCard({ onOpen, compact = false, className }: TodayCardProps) {
  const today = useToday()
  const info = useLunarDate(today)
  const holidays = useHolidaysOfDate(today)

  const body = (
    <>
      <p className="text-muted text-sm font-medium">{getWeekdayLabel(today)}</p>
      <div className="mt-1 flex items-baseline gap-3">
        <span className="text-text text-5xl leading-none font-semibold tabular-nums">{today.day}</span>
        <span className="text-muted text-sm">{formatDateVN(today)}</span>
      </div>
      <p className="text-accent mt-3 text-[15px] font-medium">{formatLunarTraditional(info.lunar)}</p>
      <p className="text-subtle text-xs">
        Ngày {info.sexagenary.day.name} · Tháng {info.sexagenary.month.name} · Năm{' '}
        {info.sexagenary.year.name}
      </p>

      <div className="mt-3 flex flex-wrap gap-1.5">
        <Badge tone="accent">{info.solarTerm.name}</Badge>
        {holidays.slice(0, 2).map((holiday) => (
          <Badge key={holiday.id} tone={holiday.isPublicHoliday ? 'primary' : 'neutral'}>
            {holiday.name}
          </Badge>
        ))}
        {holidays.length === 0 ? <Badge tone="outline">Không có sự kiện</Badge> : null}
      </div>
    </>
  )

  if (compact) {
    return (
      <Card
        variant="glass"
        className={cn('p-4', onOpen && 'cursor-pointer', className)}
        onClick={onOpen ? () => onOpen(today) : undefined}
      >
        {body}
      </Card>
    )
  }

  return (
    <Card variant="glass" className={cn('overflow-hidden', className)}>
      <CardHeader title="Hôm nay" icon={<Sun className="size-3.5" />} />
      <div
        className={cn('px-5 pt-1 pb-5', onOpen && 'cursor-pointer')}
        onClick={onOpen ? () => onOpen(today) : undefined}
      >
        {body}
      </div>
    </Card>
  )
}
