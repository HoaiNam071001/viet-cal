import { BookHeart, CalendarDays, Home, Repeat, Settings, Sparkles, type LucideIcon } from 'lucide-react'
import type { TFunction } from 'i18next'
import { ROUTES } from './routes'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Path prefix that marks this item as active; `/` matches exactly. */
  match: string
}

/** Desktop header nav. Settings lives in the account dropdown instead. Everything but
 * Home requires sign-in, so the whole row is empty until then. */
export function getDesktopNavItems(isAuthed: boolean, t: TFunction): NavItem[] {
  if (!isAuthed) return []
  return [
    { to: ROUTES.home, label: t('nav.home'), icon: Home, match: ROUTES.home },
    { to: ROUTES.calendarMonth, label: t('nav.calendar'), icon: CalendarDays, match: ROUTES.calendar },
    { to: ROUTES.convert, label: t('nav.convert'), icon: Repeat, match: ROUTES.convert },
    { to: ROUTES.holidays, label: t('nav.holidays'), icon: Sparkles, match: ROUTES.holidays },
    { to: ROUTES.diary, label: t('nav.diary'), icon: BookHeart, match: ROUTES.diary },
  ]
}

/** Mobile bottom nav: only these 3 — Đổi ngày/Ngày lễ move into the Calendar page,
 * and Home is reached via the header logo instead of a tab. */
export function getMobileNavItems(t: TFunction): NavItem[] {
  return [
    { to: ROUTES.diary, label: t('nav.diary'), icon: BookHeart, match: ROUTES.diary },
    { to: ROUTES.calendarMonth, label: t('nav.calendar'), icon: CalendarDays, match: ROUTES.calendar },
    { to: ROUTES.settings, label: t('nav.settings'), icon: Settings, match: ROUTES.settings },
  ]
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return item.match === '/' ? pathname === '/' : pathname.startsWith(item.match)
}

/** The mobile tab bar is app chrome — hide it on the landing page and on auth screens. */
export function shouldShowMobileNav(pathname: string, isAuthed: boolean): boolean {
  if (!isAuthed) return false
  if (pathname === '/') return false
  if (pathname.startsWith('/auth')) return false
  return true
}
