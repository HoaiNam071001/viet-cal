import { BookHeart, CalendarDays, Home, Repeat, Settings, Sparkles, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Path prefix that marks this item as active; `/` matches exactly. */
  match: string
}

/** Desktop header nav. Settings lives in the account dropdown instead. Everything but
 * Home requires sign-in, so the whole row is empty until then. */
export function getDesktopNavItems(isAuthed: boolean): NavItem[] {
  if (!isAuthed) return []
  return [
    { to: '/', label: 'Trang chủ', icon: Home, match: '/' },
    { to: '/calendar/month', label: 'Lịch', icon: CalendarDays, match: '/calendar' },
    { to: '/convert', label: 'Đổi ngày', icon: Repeat, match: '/convert' },
    { to: '/holidays', label: 'Ngày lễ', icon: Sparkles, match: '/holidays' },
    { to: '/diary', label: 'Nhật ký', icon: BookHeart, match: '/diary' },
  ]
}

/** Mobile bottom nav: only these 3 — Đổi ngày/Ngày lễ move into the Calendar page,
 * and Home is reached via the header logo instead of a tab. */
export const MOBILE_NAV_ITEMS: NavItem[] = [
  { to: '/diary', label: 'Nhật ký', icon: BookHeart, match: '/diary' },
  { to: '/calendar/month', label: 'Lịch', icon: CalendarDays, match: '/calendar' },
  { to: '/settings', label: 'Cài đặt', icon: Settings, match: '/settings' },
]

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
