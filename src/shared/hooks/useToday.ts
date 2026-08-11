import { useEffect, useState } from 'react'
import type { CivilDate } from '@/shared/types'
import { msUntilNextVietnamDay, todayInVietnam } from '@/shared/utils/date'

/**
 * "Today" in Vietnam, refreshed exactly when Vietnamese midnight passes
 * (and whenever the tab comes back to the foreground).
 */
export function useToday(): CivilDate {
  const [today, setToday] = useState<CivilDate>(() => todayInVietnam())

  useEffect(() => {
    let timer: number

    const schedule = () => {
      window.clearTimeout(timer)
      timer = window.setTimeout(() => {
        setToday(todayInVietnam())
        schedule()
      }, msUntilNextVietnamDay() + 1000)
    }

    const sync = () => {
      setToday((prev) => {
        const next = todayInVietnam()
        return prev.year === next.year && prev.month === next.month && prev.day === next.day ? prev : next
      })
      schedule()
    }

    schedule()
    document.addEventListener('visibilitychange', sync)
    return () => {
      window.clearTimeout(timer)
      document.removeEventListener('visibilitychange', sync)
    }
  }, [])

  return today
}
