import { useEffect, useMemo, useRef } from 'react'
import { Card } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { isSameDate, nowInVietnam } from '@/shared/utils/date'
import { useEventsForDate } from '../hooks/useEvents'
import { DayDetail } from './DayDetail'

interface DayViewProps {
  date: CivilDate
  today: CivilDate
}

const HOURS = Array.from({ length: 24 }, (_, hour) => hour)
const HOUR_HEIGHT = 56

/** Detail card plus a 24-hour timeline that a future event system can draw into. */
export function DayView({ date, today }: DayViewProps) {
  const events = useEventsForDate(date)
  const isToday = isSameDate(date, today)
  const timelineRef = useRef<HTMLDivElement>(null)
  const now = useMemo(() => nowInVietnam(), [])

  useEffect(() => {
    if (!isToday || !timelineRef.current) return
    // Open the timeline near the current hour rather than at midnight.
    timelineRef.current.scrollTop = Math.max(0, (now.hour - 2) * HOUR_HEIGHT)
  }, [isToday, now.hour])

  return (
    <div className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_minmax(0,340px)]">
      <Card className="order-2 overflow-hidden lg:order-1">
        <div className="border-border flex items-center justify-between border-b px-5 py-3.5">
          <h2 className="text-text text-sm font-semibold">Lịch trình</h2>
          <span className="text-subtle text-xs">{events.length} sự kiện</span>
        </div>

        <div ref={timelineRef} className="no-scrollbar relative max-h-[560px] overflow-y-auto">
          {HOURS.map((hour) => (
            <div key={hour} className="relative flex" style={{ height: HOUR_HEIGHT }}>
              <span className="text-subtle w-16 shrink-0 pt-1.5 pr-3 text-right text-[11px] tabular-nums">
                {String(hour).padStart(2, '0')}:00
              </span>
              <div className="border-border/70 flex-1 border-t border-l" />
            </div>
          ))}

          {isToday ? (
            <div
              className="pointer-events-none absolute inset-x-0 flex items-center"
              style={{ top: (now.hour + now.minute / 60) * HOUR_HEIGHT }}
            >
              <span className="text-primary w-16 pr-3 text-right text-[10px] font-semibold tabular-nums">
                {String(now.hour).padStart(2, '0')}:{String(now.minute).padStart(2, '0')}
              </span>
              <span className="bg-primary size-2 rounded-full" />
              <span className="bg-primary/60 h-px flex-1" />
            </div>
          ) : null}

          {events.length === 0 ? (
            <div className="pointer-events-none absolute inset-0 grid place-items-center">
              <p className={cn('bg-surface/85 text-muted rounded-2xl px-4 py-2 text-sm backdrop-blur-sm')}>
                {isToday ? 'Chưa có sự kiện hôm nay' : 'Chưa có sự kiện'}
              </p>
            </div>
          ) : null}
        </div>
      </Card>

      <Card className="order-1 p-5 lg:order-2">
        <DayDetail date={date} />
      </Card>
    </div>
  )
}
