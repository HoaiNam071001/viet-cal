import { Card } from '@/shared/components/ui/Card'
import type { CivilDate } from '@/shared/types'
import { DayDetail } from './DayDetail'

interface DayViewProps {
  date: CivilDate
}

/** Single-column day detail: lunar info, holidays, and that day's diary entry. */
export function DayView({ date }: DayViewProps) {
  return (
    <Card className="p-5">
      <DayDetail date={date} />
    </Card>
  )
}
