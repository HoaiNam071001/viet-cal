import { CalendarDays, Repeat, Settings, Sparkles, type LucideIcon } from 'lucide-react'

export interface NavItem {
  to: string
  label: string
  icon: LucideIcon
  /** Path prefix that marks this item as active. */
  match: string
}

export const NAV_ITEMS: NavItem[] = [
  { to: '/calendar/month', label: 'Lịch', icon: CalendarDays, match: '/calendar' },
  { to: '/convert', label: 'Đổi ngày', icon: Repeat, match: '/convert' },
  { to: '/holidays', label: 'Ngày lễ', icon: Sparkles, match: '/holidays' },
  { to: '/settings', label: 'Cài đặt', icon: Settings, match: '/settings' },
]
