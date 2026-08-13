import { Moon } from 'lucide-react'
import { useTranslation } from 'react-i18next'
import { formatLunarDayMonth, getLeapMonthOfYear, useLunarDate } from '@/features/lunar'
import { Card, CardHeader, InfoRow } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { getMonthNames } from '@/shared/utils/date'

/** Lunar identity of the day currently selected in the calendar. */
export function LunarInfoCard({ date, className }: { date: CivilDate; className?: string }) {
  const { t } = useTranslation()
  const info = useLunarDate(date)
  const leapMonth = getLeapMonthOfYear(info.lunar.year)

  return (
    <Card variant="glass" className={cn('overflow-hidden', className)}>
      <CardHeader title={t('widgets.lunarCalendar')} icon={<Moon className="size-3.5" />} />
      <div className="px-5 pt-1 pb-4">
        <p className="text-accent text-lg font-semibold">{formatLunarDayMonth(info.lunar)}</p>
        <p className="text-subtle mb-2 text-xs">{t('converter.yearOf', { name: info.sexagenary.year.name })}</p>

        <div className="divide-border divide-y">
          <InfoRow label={t('calendar.canChiLabels.day')}>{info.sexagenary.day.name}</InfoRow>
          <InfoRow label={t('calendar.canChiLabels.month')}>{info.sexagenary.month.name}</InfoRow>
          <InfoRow label="Tiết khí">{info.solarTerm.name}</InfoRow>
          <InfoRow label={t('converter.leapMonth')}>
            {leapMonth ? getMonthNames()[leapMonth - 1] : t('widgets.none')}
          </InfoRow>
        </div>
      </div>
    </Card>
  )
}
