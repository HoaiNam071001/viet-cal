import { useCallback, useMemo } from 'react'
import { useNavigate, useParams, useSearchParams } from 'react-router-dom'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate, ViewMode } from '@/shared/types'
import { addDays, addMonths, addYears, clampDate, fromKey, toKey } from '@/shared/utils/date'

const VIEWS: ViewMode[] = ['day', 'month', 'year']

function parseView(value: string | undefined): ViewMode {
  return VIEWS.includes(value as ViewMode) ? (value as ViewMode) : 'month'
}

/**
 * The calendar's whole navigation state lives in the URL
 * (`/calendar/month?date=2026-08-11`), so every view is linkable and the
 * browser's back button does the obvious thing.
 */
export function useCalendarState() {
  const { view: viewParam } = useParams()
  const [searchParams, setSearchParams] = useSearchParams()
  const navigate = useNavigate()
  const today = useToday()

  const view = parseView(viewParam)
  const date = useMemo(() => fromKey(searchParams.get('date') ?? '') ?? today, [searchParams, today])

  const setDate = useCallback(
    (next: CivilDate, options: { replace?: boolean } = {}) => {
      const params = new URLSearchParams(searchParams)
      params.set('date', toKey(clampDate(next)))
      setSearchParams(params, { replace: options.replace ?? true })
    },
    [searchParams, setSearchParams],
  )

  const setView = useCallback(
    (next: ViewMode) => {
      navigate({ pathname: `/calendar/${next}`, search: `?date=${toKey(date)}` })
    },
    [date, navigate],
  )

  /** Step by the unit the current view shows. */
  const step = useCallback(
    (direction: 1 | -1) => {
      if (view === 'day') setDate(addDays(date, direction))
      else if (view === 'year') setDate(addYears(date, direction))
      else setDate(addMonths(date, direction))
    },
    [date, setDate, view],
  )

  const goToToday = useCallback(() => setDate(today), [setDate, today])

  return {
    view,
    date,
    today,
    setDate,
    setView,
    goPrevious: useCallback(() => step(-1), [step]),
    goNext: useCallback(() => step(1), [step]),
    goToToday,
    isOnToday: toKey(date) === toKey(today),
  }
}
