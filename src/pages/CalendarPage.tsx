import { Repeat, Sparkles } from 'lucide-react'
import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { ROUTES } from '@/app/config/routes'
import { CalendarHeader } from '@/features/calendar/components/CalendarHeader'
import { DayDetail } from '@/features/calendar/components/DayDetail'
import { DayView } from '@/features/calendar/components/DayView'
import { MonthView } from '@/features/calendar/components/MonthView'
import { YearView } from '@/features/calendar/components/YearView'
import { useCalendarState } from '@/features/calendar/hooks/useCalendarState'
import { CountdownCard } from '@/features/countdown/components/CountdownCard'
import { useUpcomingHolidays } from '@/features/holidays/hooks/useHolidays'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Sheet } from '@/shared/components/ui/Sheet'
import { useIsDesktop } from '@/shared/hooks/useMediaQuery'
import type { CivilDate } from '@/shared/types'
import { LunarInfoCard } from '@/widgets/LunarInfoCard'
import { TodayCard } from '@/widgets/TodayCard'
import { UpcomingHolidaysCard } from '@/widgets/UpcomingHolidaysCard'

export function CalendarPage() {
  const { t } = useTranslation()
  const { view, date, today, setDate, setView, goNext, goPrevious, goToToday, isOnToday } =
    useCalendarState()
  const isDesktop = useIsDesktop()
  const [detailOpen, setDetailOpen] = useState(false)
  const [nextHoliday] = useUpcomingHolidays(1)

  const selectDate = (next: CivilDate) => {
    setDate(next)
    // The month grid is a picker; the day view already shows the detail inline.
    if (view !== 'day') setDetailOpen(true)
  }

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_320px] lg:gap-6">
      <div className="min-w-0">
        <CalendarHeader
          date={date}
          view={view}
          isOnToday={isOnToday}
          onPrevious={goPrevious}
          onNext={goNext}
          onToday={goToToday}
          onPick={setDate}
          onViewChange={setView}
        />

        {/* Mobile only — desktop reaches these from the header nav instead of a tab. */}
        <div className="mt-3 grid grid-cols-2 gap-2 lg:hidden">
          <Button asChild variant="secondary" size="sm" className="gap-1.5">
            <Link to={ROUTES.convert}>
              <Repeat className="size-4" />
              {t('nav.convert')}
            </Link>
          </Button>
          <Button asChild variant="secondary" size="sm" className="gap-1.5">
            <Link to={ROUTES.holidays}>
              <Sparkles className="size-4" />
              {t('nav.holidays')}
            </Link>
          </Button>
        </div>

        <div className="mt-4">
          {view === 'month' ? (
            <Card className="p-2 sm:p-3">
              <MonthView
                date={date}
                selected={date}
                today={today}
                onSelect={selectDate}
                onSwipeNext={goNext}
                onSwipePrevious={goPrevious}
              />
            </Card>
          ) : null}

          {view === 'day' ? <DayView date={date} /> : null}

          {view === 'year' ? (
            <YearView
              date={date}
              today={today}
              selected={date}
              onSelectDate={selectDate}
              onSelectMonth={(month) => {
                setDate(month)
                setView('month')
              }}
            />
          ) : null}
        </div>

        {/* Mobile keeps the widgets below the calendar instead of in a sidebar. */}
        {view !== 'day' ? (
          <div className="mt-4 flex flex-col gap-4 lg:hidden">
            <TodayCard compact onOpen={selectDate} />
            {nextHoliday ? (
              <CountdownCard item={nextHoliday} onSelect={(item) => selectDate(item.date)} />
            ) : null}
            <UpcomingHolidaysCard count={4} onSelect={selectDate} />
          </div>
        ) : null}
      </div>

      <aside className="hidden flex-col gap-4 lg:sticky lg:top-19 lg:flex lg:self-start">
        <TodayCard onOpen={selectDate} />
        <LunarInfoCard date={date} />
        {nextHoliday ? <CountdownCard item={nextHoliday} onSelect={(item) => selectDate(item.date)} /> : null}
        <UpcomingHolidaysCard onSelect={selectDate} />
      </aside>

      {/* Mobile: the day detail arrives as a bottom sheet, desktop as a side panel. */}
      {view !== 'day' ? (
        <Sheet open={detailOpen} onClose={() => setDetailOpen(false)}>
          <DayDetail date={date} className={isDesktop ? 'pt-2' : ''} />
        </Sheet>
      ) : null}
    </div>
  )
}
