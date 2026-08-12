import { Check, Share2 } from 'lucide-react'
import { useState } from 'react'
import { APP_NAME } from '@/app/config/app.config'
import { useHolidaysOfDate } from '@/features/holidays/hooks/useHolidays'
import { Button } from '@/shared/components/ui/Button'
import type { CivilDate } from '@/shared/types'
import { toKey } from '@/shared/utils/date'
import { renderDayCard } from '../utils/render-day-card'

/**
 * Shares the day as an image: the Web Share API when the device supports
 * sharing files, otherwise a plain download.
 */
export function ShareDayButton({ date }: { date: CivilDate }) {
  const holidays = useHolidaysOfDate(date)
  const [state, setState] = useState<'idle' | 'working' | 'done'>('idle')

  const share = async () => {
    setState('working')
    try {
      const blob = await renderDayCard(date, holidays[0]?.name)
      if (!blob) return

      const file = new File([blob], `lich-viet-${toKey(date)}.png`, { type: 'image/png' })
      if (navigator.canShare?.({ files: [file] })) {
        await navigator.share({ files: [file], title: APP_NAME })
      } else {
        const url = URL.createObjectURL(blob)
        const link = document.createElement('a')
        link.href = url
        link.download = file.name
        link.click()
        URL.revokeObjectURL(url)
      }
      setState('done')
      setTimeout(() => setState('idle'), 1800)
    } catch {
      // A cancelled share is not an error worth surfacing.
      setState('idle')
    }
  }

  return (
    <Button
      variant="secondary"
      size="icon-sm"
      onClick={share}
      disabled={state === 'working'}
      aria-label="Chia sẻ ngày này"
      title="Chia sẻ ngày này"
    >
      {state === 'done' ? <Check className="size-4" /> : <Share2 className="size-4" />}
    </Button>
  )
}
