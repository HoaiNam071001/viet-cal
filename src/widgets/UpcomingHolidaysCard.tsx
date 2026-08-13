import { CalendarDays } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { useUpcomingHolidays, type UpcomingHoliday } from '@/features/holidays/hooks/useHolidays'
import { formatCountdown } from '@/features/countdown/utils/countdown'
import { Card, CardHeader } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { formatNumericVN } from '@/shared/utils/date'

interface UpcomingHolidaysCardProps {
  count?: number
  onSelect?: (date: CivilDate) => void
  className?: string
}

export function UpcomingHolidaysCard({ count = 5, onSelect, className }: UpcomingHolidaysCardProps) {
  const { t } = useTranslation()
  const upcoming = useUpcomingHolidays(count)

  return (
    <Card variant="glass" className={cn('overflow-hidden', className)}>
      <CardHeader title={t('widgets.upcomingHolidays')} icon={<CalendarDays className="size-3.5" />} />
      <ul className="flex flex-col px-2 pb-2">
        {upcoming.map((item) => (
          <UpcomingRow key={item.holiday.id} item={item} onSelect={onSelect} />
        ))}
        {upcoming.length === 0 ? (
          <li className="text-subtle px-3 py-4 text-sm">{t('widgets.loadingHolidays')}</li>
        ) : null}
      </ul>
    </Card>
  )
}

function UpcomingRow({
  item,
  onSelect,
}: {
  item: UpcomingHoliday
  onSelect?: (date: CivilDate) => void
}) {
  const { t } = useTranslation()
  const { holiday, date, daysUntil } = item
  return (
    <li>
      <button
        type="button"
        onClick={() => onSelect?.(date)}
        className="hover:bg-surface-2 flex w-full items-center gap-3 rounded-2xl px-3 py-2.5 text-left transition-colors"
      >
        <div className="bg-primary-soft text-primary grid size-11 shrink-0 place-items-center rounded-2xl">
          <span className="text-sm font-semibold tabular-nums">{date.day}</span>
        </div>
        <div className="min-w-0 flex-1">
          <p className="text-text truncate text-sm font-medium">{holiday.name}</p>
          <p className="text-subtle text-xs tabular-nums">
            {formatNumericVN(date)}
            {holiday.lunar ? ` · ${holiday.lunar.day}/${holiday.lunar.month} ${t('converter.lunarAbbr')}` : ''}
          </p>
        </div>
        <span
          className={cn(
            'shrink-0 text-xs font-semibold',
            daysUntil <= 7 ? 'text-primary' : 'text-muted',
          )}
        >
          {formatCountdown(daysUntil)}
        </span>
      </button>
    </li>
  )
}
