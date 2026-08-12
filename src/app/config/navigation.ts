import { BookHeart, CalendarDays, Home, Repeat, Settings, Sparkles, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Path prefix that marks this item as active; `/` matches exactly. */
  match: string
}

const BASE_NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Trang chủ', icon: Home, match: '/' },
  { to: '/calendar/month', label: 'Lịch', icon: CalendarDays, match: '/calendar' },
  { to: '/convert', label: 'Đổi ngày', icon: Repeat, match: '/convert' },
  { to: '/holidays', label: 'Ngày lễ', icon: Sparkles, match: '/holidays' },
  { to: '/settings', label: 'Cài đặt', icon: Settings, match: '/settings' },
]

const DIARY_NAV_ITEM: NavItem = { to: '/diary', label: 'Nhật ký', icon: BookHeart, match: '/diary' }

/** The Diary tab only appears once signed in — the route redirects to login otherwise. */
export function getNavItems(isAuthed: boolean): NavItem[] {
  if (!isAuthed) return BASE_NAV_ITEMS
  const [home, ...rest] = BASE_NAV_ITEMS
  return [home, DIARY_NAV_ITEM, ...rest]
}

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return item.match === '/' ? pathname === '/' : pathname.startsWith(item.match)
}
