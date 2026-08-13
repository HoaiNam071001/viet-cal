/** Relative path patterns handed to react-router's `path:` (nested under the `/` root route). */
export const ROUTE_PATTERNS = {
  calendarView: 'calendar/:view',
  calendarRedirect: 'calendar',
  convert: 'convert',
  holidays: 'holidays',
  settings: 'settings',
  authLogin: 'auth/login',
  authSignup: 'auth/signup',
  diary: 'diary',
  diaryCategories: 'diary/categories',
  diaryNew: 'diary/new',
  diaryEntry: 'diary/:id',
  diaryEdit: 'diary/:id/edit',
  diaryAnalytics: 'diary/analytics',
} as const

/** Absolute paths / path builders for navigate()/Link/Navigate call sites. */
export const ROUTES = {
  home: '/',
  calendar: '/calendar',
  calendarMonth: '/calendar/month',
  calendarView: (view: string) => `/calendar/${view}`,
  calendarDay: (dateKey: string) => `/calendar/day?date=${dateKey}`,
  convert: '/convert',
  holidays: '/holidays',
  settings: '/settings',
  authLogin: '/auth/login',
  authSignup: '/auth/signup',
  diary: '/diary',
  diaryCategories: '/diary/categories',
  diaryNew: (dateKey?: string) => (dateKey ? `/diary/new?date=${dateKey}` : '/diary/new'),
  diaryEntry: (id: string) => `/diary/${id}`,
  diaryEdit: (id: string) => `/diary/${id}/edit`,
  diaryAnalytics: '/diary/analytics',
} as const
