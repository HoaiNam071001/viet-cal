import { useTranslation } from 'react-i18next'
import { Badge } from '@/shared/components/ui/Badge'
import { cn } from '@/shared/utils/cn'
import type { Holiday } from '../types'

export function HolidayItem({ holiday, className }: { holiday: Holiday; className?: string }) {
  const { t } = useTranslation()
  return (
    <li className={cn('bg-surface-2 rounded-2xl px-3.5 py-3', className)}>
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0">
          <p className="text-text text-sm font-medium">{holiday.name}</p>
          {holiday.lunar ? (
            <p className="text-subtle mt-0.5 text-xs">
              {t('holidays.lunarDate', { day: holiday.lunar.day, month: holiday.lunar.month })}
            </p>
          ) : null}
          {holiday.description ? (
            <p className="text-muted mt-1 text-xs leading-relaxed">{holiday.description}</p>
          ) : null}
        </div>
        <div className="flex shrink-0 flex-col items-end gap-1">
          <Badge tone={holiday.type === 'lunar' ? 'accent' : holiday.isPublicHoliday ? 'primary' : 'neutral'}>
            {t(`holidays.types.${holiday.type}`)}
          </Badge>
          {holiday.isPublicHoliday ? (
            <span className="text-primary text-[10px] font-semibold">{t('holidays.publicHoliday')}</span>
          ) : null}
        </div>
      </div>
    </li>
  )
}
