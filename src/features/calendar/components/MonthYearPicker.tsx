import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MAX_YEAR, MIN_YEAR } from '@/app/config/app.config'
import { getYearCanChi } from '@/features/lunar'
import { Button } from '@/shared/components/ui/Button'
import { Sheet } from '@/shared/components/ui/Sheet'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { civil, daysInMonth } from '@/shared/utils/date'

interface MonthYearPickerProps {
  open: boolean
  onClose: () => void
  date: CivilDate
  onPick: (date: CivilDate) => void
}

/** Month + year chooser opened by tapping the calendar title. */
export function MonthYearPicker({ open, onClose, date, onPick }: MonthYearPickerProps) {
  const [year, setYear] = useState(date.year)

  useEffect(() => {
    if (open) setYear(date.year)
  }, [date.year, open])

  const pick = (month: number) => {
    onPick(civil(year, month, Math.min(date.day, daysInMonth(year, month))))
    onClose()
  }

  return (
    <Sheet open={open} onClose={onClose} title="Chọn tháng" desktopVariant="dialog">
      <div className="mb-5 flex items-center justify-between">
        <Button
          variant="ghost"
          size="icon"
          aria-label="Năm trước"
          disabled={year <= MIN_YEAR}
          onClick={() => setYear((y) => y - 1)}
        >
          <ChevronLeft className="size-5" />
        </Button>
        <div className="text-center">
          <div className="text-text text-2xl font-semibold tabular-nums">{year}</div>
          <div className="text-accent text-xs font-medium">{getYearCanChi(year).name}</div>
        </div>
        <Button
          variant="ghost"
          size="icon"
          aria-label="Năm sau"
          disabled={year >= MAX_YEAR}
          onClick={() => setYear((y) => y + 1)}
        >
          <ChevronRight className="size-5" />
        </Button>
      </div>

      <div className="grid grid-cols-3 gap-2">
        {Array.from({ length: 12 }, (_, index) => index + 1).map((month) => {
          const isActive = month === date.month && year === date.year
          return (
            <button
              key={month}
              type="button"
              onClick={() => pick(month)}
              className={cn(
                'h-14 rounded-2xl text-sm font-medium transition-colors',
                isActive
                  ? 'bg-primary text-primary-fg shadow-soft'
                  : 'bg-surface-2 text-text hover:bg-surface-3',
              )}
            >
              Tháng {month}
            </button>
          )
        })}
      </div>
    </Sheet>
  )
}
