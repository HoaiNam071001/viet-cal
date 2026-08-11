import { useEffect } from 'react'
import { useHolidayContext } from '@/app/providers/HolidayProvider'
import { getYearCanChi, solarToLunar } from '@/features/lunar'
import { Card } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { civil } from '@/shared/utils/date'
import { MiniMonth } from './MiniMonth'

interface YearViewProps {
  date: CivilDate
  today: CivilDate
  selected: CivilDate
  onSelectDate: (date: CivilDate) => void
  onSelectMonth: (date: CivilDate) => void
}

const MONTHS = Array.from({ length: 12 }, (_, index) => index + 1)

export function YearView({ date, today, selected, onSelectDate, onSelectMonth }: YearViewProps) {
  const { ensureYear } = useHolidayContext()

  useEffect(() => {
    ensureYear(date.year)
  }, [date.year, ensureYear])

  return (
    <div>
      <div className="mb-4 flex items-baseline gap-2 px-1">
        <span className="text-subtle text-sm">Năm Âm lịch</span>
        <span className="text-accent text-sm font-semibold">
          {getYearCanChi(solarToLunar(civil(date.year, 6, 15)).year).name}
        </span>
      </div>

      <div className="grid grid-cols-1 gap-3 min-[420px]:grid-cols-2 md:grid-cols-3 xl:grid-cols-4">
        {MONTHS.map((month) => (
          <Card key={month} className="p-3.5">
            <MiniMonth
              year={date.year}
              month={month}
              today={today}
              selected={selected}
              onSelectDate={onSelectDate}
              onSelectMonth={onSelectMonth}
            />
          </Card>
        ))}
      </div>
    </div>
  )
}
