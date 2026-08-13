import { ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { getYearCanChi, solarToLunar } from '@/features/lunar'
import { Button } from '@/shared/components/ui/Button'
import { Segmented } from '@/shared/components/ui/Segmented'
import type { CivilDate, ViewMode } from '@/shared/types'
import { formatFullDateVN, formatMonthVN } from '@/shared/utils/date'
import { MonthYearPicker } from './MonthYearPicker'

interface CalendarHeaderProps {
  date: CivilDate
  view: ViewMode
  isOnToday: boolean
  onPrevious: () => void
  onNext: () => void
  onToday: () => void
  onPick: (date: CivilDate) => void
  onViewChange: (view: ViewMode) => void
}

export function CalendarHeader({
  date,
  view,
  isOnToday,
  onPrevious,
  onNext,
  onToday,
  onPick,
  onViewChange,
}: CalendarHeaderProps) {
  const { t } = useTranslation()
  const [pickerOpen, setPickerOpen] = useState(false)
  const lunarYear = getYearCanChi(solarToLunar(date).year).name

  const viewOptions = [
    { value: 'day' as const, label: t('calendar.views.day') },
    { value: 'month' as const, label: t('calendar.views.month') },
    { value: 'year' as const, label: t('calendar.views.year') },
  ]

  const title = (): string => {
    if (view === 'year') return t('calendar.yearTitle', { year: date.year })
    if (view === 'day') return formatFullDateVN(date)
    return formatMonthVN(date)
  }

  return (
    <div className="flex flex-col gap-3">
      <div className="flex items-center justify-between gap-2">
        <div className="flex min-w-0 items-center gap-0.5">
          <Button variant="ghost" size="icon" onClick={onPrevious} aria-label={t('common.previous')}>
            <ChevronLeft className="size-5" />
          </Button>

          <button
            type="button"
            onClick={() => setPickerOpen(true)}
            className="hover:bg-surface-2 flex min-w-0 items-center gap-1.5 rounded-2xl px-2.5 py-1.5 transition-colors"
          >
            <span className="min-w-0 text-left">
              <span className="text-text block truncate text-[17px] leading-tight font-semibold sm:text-xl">
                {title()}
              </span>
              <span className="text-accent block text-[11px] leading-tight font-medium">
                {t('calendar.lunarYearOf', { name: lunarYear })}
              </span>
            </span>
            <ChevronDown className="text-subtle size-4 shrink-0" />
          </button>

          <Button variant="ghost" size="icon" onClick={onNext} aria-label={t('common.next')}>
            <ChevronRight className="size-5" />
          </Button>
        </div>

        <div className="flex items-center gap-2">
          <Button
            variant={isOnToday ? 'ghost' : 'soft'}
            size="sm"
            onClick={onToday}
            className="shrink-0"
          >
            {t('common.today')}
          </Button>
          <Segmented
            className="hidden sm:inline-flex"
            options={viewOptions}
            value={view}
            onChange={onViewChange}
            aria-label={t('calendar.viewMode')}
          />
        </div>
      </div>

      <Segmented
        className="flex w-full sm:hidden"
        options={viewOptions}
        value={view}
        onChange={onViewChange}
        aria-label={t('calendar.viewMode')}
      />

      <MonthYearPicker open={pickerOpen} onClose={() => setPickerOpen(false)} date={date} onPick={onPick} />
    </div>
  )
}
