import { useMemo } from 'react'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { isSameDate } from '@/shared/utils/date'
import { buildMonthGrid } from '../utils/grid'

interface MiniMonthProps {
  year: number
  month: number
  today: CivilDate
  selected?: CivilDate
  onSelectDate: (date: CivilDate) => void
  onSelectMonth?: (date: CivilDate) => void
  /** Show the "Tháng N" heading — the year view uses it, the sidebar doesn't. */
  showTitle?: boolean
  className?: string
}

const WEEKDAYS = ['T2', 'T3', 'T4', 'T5', 'T6', 'T7', 'CN']

/** Compact month grid shared by the year view and the sidebar widget. */
export function MiniMonth({
  year,
  month,
  today,
  selected,
  onSelectDate,
  onSelectMonth,
  showTitle = true,
  className,
}: MiniMonthProps) {
  const { getForDate } = useHolidayContext()
  const grid = useMemo(() => buildMonthGrid(year, month, today), [month, today, year])

  return (
    <div className={cn('min-w-0', className)}>
      {showTitle ? (
        <button
          type="button"
          onClick={() => onSelectMonth?.({ year, month, day: 1 })}
          className="text-text hover:text-primary mb-2 w-full text-left text-sm font-semibold transition-colors"
        >
          Tháng {month}
        </button>
      ) : null}

      <div className="grid grid-cols-7 gap-y-0.5">
        {WEEKDAYS.map((label, index) => (
          <div
            key={label}
            className={cn(
              'pb-1 text-center text-[10px] font-medium',
              index >= 5 ? 'text-weekend/70' : 'text-subtle',
            )}
          >
            {label}
          </div>
        ))}

        {grid.weeks.flat().map((day) => {
          const holidays = getForDate(day.date)
          const isSelected = isSameDate(day.date, selected)
          return (
            <button
              key={day.key}
              type="button"
              onClick={() => onSelectDate(day.date)}
              aria-label={`${day.date.day}/${day.date.month}/${day.date.year}`}
              className={cn(
                'relative mx-auto grid size-7 place-items-center rounded-lg text-[11px] tabular-nums transition-colors',
                !day.isCurrentMonth && 'opacity-30',
                day.isWeekend ? 'text-weekend' : 'text-text',
                holidays.some((h) => h.isPublicHoliday) && !day.isToday && 'text-primary font-semibold',
                isSelected && !day.isToday && 'bg-surface-3',
                day.isToday
                  ? 'bg-primary text-primary-fg font-semibold'
                  : 'hover:bg-surface-2',
              )}
            >
              {day.date.day}
              {holidays.length > 0 && !day.isToday ? (
                <span className="bg-primary/70 absolute bottom-0.5 size-1 rounded-full" />
              ) : null}
            </button>
          )
        })}
      </div>
    </div>
  )
}
