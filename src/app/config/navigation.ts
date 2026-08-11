import { CalendarDays, Home, Repeat, Settings, Sparkles, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Path prefix that marks this item as active; `/` matches exactly. */
  match: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/', label: 'Trang chủ', icon: Home, match: '/' },
  { to: '/calendar/month', label: 'Lịch', icon: CalendarDays, match: '/calendar' },
  { to: '/convert', label: 'Đổi ngày', icon: Repeat, match: '/convert' },
  { to: '/holidays', label: 'Ngày lễ', icon: Sparkles, match: '/holidays' },
  { to: '/settings', label: 'Cài đặt', icon: Settings, match: '/settings' },
]

export function isNavItemActive(item: NavItem, pathname: string): boolean {
  return item.match === '/' ? pathname === '/' : pathname.startsWith(item.match)
}
