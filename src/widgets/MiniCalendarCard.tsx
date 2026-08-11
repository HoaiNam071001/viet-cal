import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MiniMonth } from '@/features/calendar/components/MiniMonth'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { addMonths, civil } from '@/shared/utils/date'

interface MiniCalendarCardProps {
  selected: CivilDate
  today: CivilDate
  onSelectDate: (date: CivilDate) => void
  className?: string
}

/** Sidebar month browser — pans independently, resyncs when the selection moves. */
export function MiniCalendarCard({ selected, today, onSelectDate, className }: MiniCalendarCardProps) {
  const [cursor, setCursor] = useState<CivilDate>(() => civil(selected.year, selected.month, 1))

  useEffect(() => {
    setCursor(civil(selected.year, selected.month, 1))
  }, [selected.month, selected.year])

  return (
    <Card variant="glass" className={cn('p-4', className)}>
      <div className="mb-3 flex items-center justify-between">
        <span className="text-text text-sm font-semibold">
          Tháng {cursor.month}, {cursor.year}
        </span>
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label="Tháng trước" onClick={() => setCursor((c) => addMonths(c, -1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label="Tháng sau" onClick={() => setCursor((c) => addMonths(c, 1))}>
            <ChevronRight className="size-4" />
          </Button>
        </div>
      </div>

      <MiniMonth
        year={cursor.year}
        month={cursor.month}
        today={today}
        selected={selected}
        onSelectDate={onSelectDate}
        showTitle={false}
      />
    </Card>
  )
}
