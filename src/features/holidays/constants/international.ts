import type { HolidayRule } from '../types'

/** Widely observed international days. Kept separate so users can toggle them off. */
export const INTERNATIONAL_HOLIDAY_RULES: HolidayRule[] = [
  { kind: 'solar', id: 'intl-new-year', name: "New Year's Day", month: 1, day: 1, type: 'international' },
  { kind: 'solar', id: 'intl-valentine', name: 'Lễ tình nhân (Valentine)', month: 2, day: 14, type: 'international' },
  { kind: 'solar', id: 'intl-womens-day', name: "International Women's Day", month: 3, day: 8, type: 'international' },
  { kind: 'solar', id: 'intl-april-fools', name: 'Cá tháng Tư', month: 4, day: 1, type: 'international' },
  { kind: 'solar', id: 'intl-earth-day', name: 'Ngày Trái Đất', month: 4, day: 22, type: 'international' },
  { kind: 'solar', id: 'intl-environment-day', name: 'Ngày Môi trường Thế giới', month: 6, day: 5, type: 'international' },
  { kind: 'solar', id: 'intl-yoga-day', name: 'Ngày Quốc tế Yoga', month: 6, day: 21, type: 'international' },
  { kind: 'solar', id: 'intl-halloween', name: 'Halloween', month: 10, day: 31, type: 'international' },
  { kind: 'solar', id: 'intl-christmas-eve', name: 'Đêm Giáng sinh', month: 12, day: 24, type: 'international' },
  { kind: 'solar', id: 'intl-christmas', name: 'Giáng sinh (Christmas)', month: 12, day: 25, type: 'international' },
  { kind: 'solar', id: 'intl-new-year-eve', name: 'Đêm Giao thừa Dương lịch', month: 12, day: 31, type: 'international' },
]
