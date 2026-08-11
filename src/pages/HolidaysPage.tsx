import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useMemo, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { MAX_YEAR, MIN_YEAR } from '@/app/config/app.config'
import { CountdownCard } from '@/features/countdown/components/CountdownCard'
import { formatCountdown } from '@/features/countdown/utils/countdown'
import { HolidayItem } from '@/features/holidays/components/HolidayItem'
import { useHolidaysOfYear, useUpcomingHolidays } from '@/features/holidays/hooks/useHolidays'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Segmented } from '@/shared/components/ui/Segmented'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate } from '@/shared/types'
import { diffInDays, fromKey, getWeekdayLabel, toKey } from '@/shared/utils/date'

type Filter = 'all' | 'public' | 'lunar' | 'international'

const FILTERS = [
  { value: 'all' as const, label: 'Tất cả' },
  { value: 'public' as const, label: 'Được nghỉ' },
  { value: 'lunar' as const, label: 'Âm lịch' },
  { value: 'international' as const, label: 'Quốc tế' },
]

export function HolidaysPage() {
  const today = useToday()
  const navigate = useNavigate()
  const [year, setYear] = useState(today.year)
  const [filter, setFilter] = useState<Filter>('all')
  const holidays = useHolidaysOfYear(year)
  const [nextHoliday] = useUpcomingHolidays(1)

  const filtered = useMemo(() => {
    return holidays.filter((holiday) => {
      if (filter === 'public') return holiday.isPublicHoliday
      if (filter === 'lunar') return holiday.type === 'lunar'
      if (filter === 'international') return holiday.type === 'international'
      return true
    })
  }, [filter, holidays])

  const goToDate = (date: CivilDate) => navigate(`/calendar/day?date=${toKey(date)}`)

  return (
    <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_320px]">
      <div className="min-w-0">
        <div className="mb-4 flex items-center justify-between gap-3">
          <h1 className="text-text text-xl font-semibold">Ngày lễ {year}</h1>
          <div className="flex items-center gap-0.5">
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Năm trước"
              disabled={year <= MIN_YEAR}
              onClick={() => setYear((y) => y - 1)}
            >
              <ChevronLeft className="size-4" />
            </Button>
            <Button
              variant="ghost"
              size="icon-sm"
              aria-label="Năm sau"
              disabled={year >= MAX_YEAR}
              onClick={() => setYear((y) => y + 1)}
            >
              <ChevronRight className="size-4" />
            </Button>
          </div>
        </div>

        <Segmented
          className="mb-4 flex w-full"
          options={FILTERS}
          value={filter}
          onChange={setFilter}
          size="sm"
        />

        <ul className="flex flex-col gap-2">
          {filtered.map((holiday) => {
            const date = fromKey(holiday.date)
            return (
              <li key={holiday.id}>
                <button
                  type="button"
                  className="w-full text-left"
                  onClick={() => date && goToDate(date)}
                >
                  <Card className="hover:border-border-strong flex items-center gap-3 p-3 transition-colors">
                    {date ? (
                      <div className="bg-surface-2 grid size-14 shrink-0 place-items-center rounded-2xl">
                        <span className="text-text text-lg leading-none font-semibold tabular-nums">
                          {date.day}
                        </span>
                        <span className="text-subtle text-[10px]">Th {date.month}</span>
                      </div>
                    ) : null}
                    <ul className="min-w-0 flex-1 list-none">
                      <HolidayItem holiday={holiday} className="bg-transparent px-0 py-0" />
                    </ul>
                    {date ? (
                      <span className="text-subtle shrink-0 text-right text-[11px]">
                        <span className="block">{getWeekdayLabel(date)}</span>
                        <span className="block font-medium">
                          {formatCountdown(diffInDays(today, date))}
                        </span>
                      </span>
                    ) : null}
                  </Card>
                </button>
              </li>
            )
          })}
        </ul>
      </div>

      <aside className="hidden flex-col gap-4 lg:sticky lg:top-19 lg:flex lg:self-start">
        {nextHoliday ? <CountdownCard item={nextHoliday} onSelect={(item) => goToDate(item.date)} /> : null}
      </aside>
    </div>
  )
}
