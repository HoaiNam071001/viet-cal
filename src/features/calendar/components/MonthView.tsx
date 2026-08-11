import { useEffect, useMemo } from 'react'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import { useSettings } from '@/app/providers/SettingsProvider'
import { useSwipe } from '@/shared/hooks/useSwipe'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { WEEKDAY_SHORT_MON_FIRST, isSameDate } from '@/shared/utils/date'
import type { CalendarDay } from '../types'
import { buildMonthGrid } from '../utils/grid'
import { DayCell } from './DayCell'

interface MonthViewProps {
  /** Any day inside the month to render. */
  date: CivilDate
  selected: CivilDate
  today: CivilDate
  onSelect: (date: CivilDate) => void
  onSwipeNext?: () => void
  onSwipePrevious?: () => void
  className?: string
}

export function MonthView({
  date,
  selected,
  today,
  onSelect,
  onSwipeNext,
  onSwipePrevious,
  className,
}: MonthViewProps) {
  const { settings } = useSettings()
  const { ensureYear, getForDate } = useHolidayContext()
  const grid = useMemo(() => buildMonthGrid(date.year, date.month, today), [date.month, date.year, today])

  // Leading/trailing cells can belong to the neighbouring year.
  useEffect(() => {
    ensureYear(date.year)
    ensureYear(date.year - 1)
    ensureYear(date.year + 1)
  }, [date.year, ensureYear])

  const swipe = useSwipe({ onSwipeLeft: onSwipeNext, onSwipeRight: onSwipePrevious })
  const handleSelect = (day: CalendarDay) => onSelect(day.date)

  return (
    <div className={cn('select-none', className)} {...swipe}>
      <div className="mb-1 grid grid-cols-7 px-0.5">
        {WEEKDAY_SHORT_MON_FIRST.map((label, index) => (
          <div
            key={label}
            className={cn(
              'py-2 text-center text-[11px] font-semibold tracking-wider uppercase',
              index >= 5 ? 'text-weekend/80' : 'text-subtle',
            )}
          >
            {label}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-0.5 sm:gap-1">
        {grid.weeks.flat().map((day) => (
          <DayCell
            key={day.key}
            day={day}
            holidays={getForDate(day.date)}
            isSelected={isSameDate(day.date, selected)}
            showLunar={settings.showLunarInGrid}
            onSelect={handleSelect}
          />
        ))}
      </div>
    </div>
  )
}
