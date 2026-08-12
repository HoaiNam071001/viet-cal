import { memo } from 'react'
import type { Holiday } from '@/features/holidays/types'
import { formatLunarShort } from '@/features/lunar'
import { cn } from '@/shared/utils/cn'
import type { CalendarDay } from '../types'

interface DayCellProps {
  day: CalendarDay
  holidays: Holiday[]
  hasDiary?: boolean
  isSelected: boolean
  showLunar: boolean
  onSelect: (day: CalendarDay) => void
}

/**
 * One day of the month grid: solar number, lunar number, and at most a couple of
 * dots. Anything more belongs in the day detail.
 */
export const DayCell = memo(function DayCell({
  day,
  holidays,
  hasDiary,
  isSelected,
  showLunar,
  onSelect,
}: DayCellProps) {
  const { date, lunar, isCurrentMonth, isToday, isWeekend } = day
  const isPublicHoliday = holidays.some((holiday) => holiday.isPublicHoliday)
  const hasHoliday = holidays.length > 0
  // Mùng 1 prints the month too, the way paper calendars do.
  const lunarLabel = lunar.lunar.day === 1 ? formatLunarShort(lunar.lunar) : String(lunar.lunar.day)

  return (
    <button
      type="button"
      onClick={() => onSelect(day)}
      aria-label={`Ngày ${date.day} tháng ${date.month} năm ${date.year}`}
      aria-current={isToday ? 'date' : undefined}
      aria-pressed={isSelected}
      className={cn(
        'group relative flex min-h-[54px] flex-col items-center justify-center gap-px rounded-2xl px-0.5 py-1.5 transition-colors duration-150 sm:min-h-[76px] sm:gap-0.5 lg:min-h-[86px]',
        'hover:bg-surface-2 focus-visible:outline-offset-[-2px]',
        !isCurrentMonth && 'opacity-35',
        isSelected && !isToday && 'bg-surface-2 ring-border-strong ring-1 ring-inset',
        isToday && 'bg-primary text-primary-fg hover:bg-primary-hover shadow-soft',
      )}
    >
      <span
        className={cn(
          'text-[15px] leading-tight font-semibold tabular-nums sm:text-[17px]',
          !isToday && isWeekend && 'text-weekend',
          !isToday && !isWeekend && 'text-text',
          !isToday && isPublicHoliday && 'text-primary',
        )}
      >
        {date.day}
      </span>

      {showLunar ? (
        <span
          className={cn(
            'text-[10px] leading-tight tabular-nums sm:text-[11px]',
            isToday ? 'text-primary-fg/75' : lunar.lunar.day === 1 ? 'text-accent font-medium' : 'text-subtle',
          )}
        >
          {lunarLabel}
        </span>
      ) : null}

      {hasDiary ? (
        <span
          aria-hidden="true"
          className={cn('absolute top-1.5 right-1.5 size-[5px] rounded-full', isToday ? 'bg-primary-fg/70' : 'bg-accent')}
        />
      ) : null}

      {hasHoliday ? (
        <span className="absolute bottom-1.5 flex items-center gap-[3px] sm:bottom-2">
          {holidays.slice(0, 3).map((holiday) => (
            <span
              key={holiday.id}
              className={cn(
                'size-[5px] rounded-full',
                isToday
                  ? 'bg-primary-fg/70'
                  : holiday.isPublicHoliday
                    ? 'bg-primary'
                    : holiday.type === 'lunar'
                      ? 'bg-accent'
                      : 'bg-subtle/60',
              )}
            />
          ))}
        </span>
      ) : null}
    </button>
  )
})
