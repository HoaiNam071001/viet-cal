import type { DateKey } from '@/shared/types'

/**
 * The seam for a future event/reminder system (local store, backend or Google
 * Calendar sync). The day view already renders whatever this returns, so adding
 * events later means implementing a source — not touching the views.
 */
export interface CalendarEvent {
  id: string
  title: string
  date: DateKey
  /** `HH:mm`; omitted for all-day events. */
  startTime?: string
  endTime?: string
  location?: string
  note?: string
  color?: string
}
