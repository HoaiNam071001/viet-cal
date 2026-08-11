import type { CivilDate } from '@/shared/types'
import type { CalendarEvent } from '../types/event'

/**
 * Events for a day. There is no event source yet — this is the single place a
 * store, an API client or a Google Calendar sync gets plugged in; every view
 * already consumes it.
 */
export function useEventsForDate(_date: CivilDate): CalendarEvent[] {
  return EMPTY
}

const EMPTY: CalendarEvent[] = []
