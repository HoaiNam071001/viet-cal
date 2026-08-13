import { ChevronLeft, ChevronRight } from 'lucide-react'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { MiniMonth } from '@/features/calendar/components/MiniMonth'
import { Button } from '@/shared/components/ui/Button'
import { Sheet } from '@/shared/components/ui/Sheet'
import type { CivilDate } from '@/shared/types'
import { addMonths, civil, formatMonthVN } from '@/shared/utils/date'

interface DiaryDatePickerSheetProps {
  open: boolean
  onClose: () => void
  today: CivilDate
  onPick: (date: CivilDate) => void
}

/** Lets the user pick any day (not just today) before writing a diary entry. */
export function DiaryDatePickerSheet({ open, onClose, today, onPick }: DiaryDatePickerSheetProps) {
  const { t } = useTranslation()
  const [cursor, setCursor] = useState<CivilDate>(() => civil(today.year, today.month, 1))

  useEffect(() => {
    if (open) setCursor(civil(today.year, today.month, 1))
  }, [open, today])

  return (
    <Sheet open={open} onClose={onClose} title={t('diary.pickDateTitle')} desktopVariant="dialog">
      <div className="mb-3 flex items-center justify-between">
        <span className="text-text text-sm font-semibold">{formatMonthVN(cursor)}</span>
        <div className="flex gap-0.5">
          <Button variant="ghost" size="icon-sm" aria-label={t('widgets.previousMonth')} onClick={() => setCursor((c) => addMonths(c, -1))}>
            <ChevronLeft className="size-4" />
          </Button>
          <Button variant="ghost" size="icon-sm" aria-label={t('widgets.nextMonth')} onClick={() => setCursor((c) => addMonths(c, 1))}>
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
        {t('common.today')}
      </Button>
    </Sheet>
  )
}
