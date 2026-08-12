import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { MiniMonth } from '@/features/calendar/components/MiniMonth'
import { Button } from '@/shared/components/ui/Button'
import { Sheet } from '@/shared/components/ui/Sheet'
import type { CivilDate } from '@/shared/types'
import { addMonths, civil } from '@/shared/utils/date'

interface DiaryDatePickerSheetProps {
  open: boolean
  onClose: () => void
  today: CivilDate
  onPick: (date: CivilDate) => void
}

/** Lets the user pick any day (not just today) before writing a diary entry. */
export function DiaryDatePickerSheet({ open, onClose, today, onPick }: DiaryDatePickerSheetProps) {
  const [cursor, setCursor] = useState<CivilDate>(() => civil(today.year, today.month, 1))

  useEffect(() => {
    if (open) setCursor(civil(today.year, today.month, 1))
  }, [open, today])

  return (
    <Sheet open={open} onClose={onClose} title="Chọn ngày để viết" desktopVariant="dialog">
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
        onSelectDate={onPick}
        showTitle={false}
        className="[&_button]:size-9 [&_button]:text-sm"
      />

      <Button variant="secondary" size="lg" className="mt-4 w-full" onClick={() => onPick(today)}>
        Hôm nay
      </Button>
    </Sheet>
  )
}
