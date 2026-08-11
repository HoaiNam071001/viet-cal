import { Timer } from 'lucide-react'
import type { UpcomingHoliday } from '@/features/holidays/hooks/useHolidays'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import { cn } from '@/shared/utils/cn'
import { formatNumericVN } from '@/shared/utils/date'
import { formatCountdown, formatCountdownLong } from '../utils/countdown'

interface CountdownCardProps {
  item: UpcomingHoliday
  onSelect?: (item: UpcomingHoliday) => void
  className?: string
}

/** Hero countdown to a single upcoming holiday. */
export function CountdownCard({ item, onSelect, className }: CountdownCardProps) {
  const { holiday, date, daysUntil } = item
  const long = formatCountdownLong(daysUntil)

  return (
    <Card
      className={cn(
        'from-primary-soft to-surface overflow-hidden bg-gradient-to-br',
        onSelect && 'hover:border-border-strong cursor-pointer transition-colors',
        className,
      )}
      onClick={onSelect ? () => onSelect(item) : undefined}
    >
      <CardHeader title="Đếm ngược" icon={<Timer className="size-3.5" />} />
      <div className="px-5 pt-1 pb-5">
        <p className="text-text text-[15px] font-semibold">{holiday.name}</p>
        <p className="text-muted mt-0.5 text-xs">
          {formatNumericVN(date)}
          {holiday.lunar ? ` · ${holiday.lunar.day}/${holiday.lunar.month} ÂL` : ''}
        </p>
        <p className="text-primary mt-3 text-3xl leading-none font-semibold">
          {formatCountdown(daysUntil)}
        </p>
        {long ? <p className="text-subtle mt-1 text-xs">{long}</p> : null}
      </div>
    </Card>
  )
}
