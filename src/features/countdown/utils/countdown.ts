import type { CivilDate } from '@/shared/types'
import { diffInDays, todayInVietnam } from '@/shared/utils/date'

/** Whole days from today (in Vietnam) to `target`. Negative when it has passed. */
export function getDaysUntil(target: CivilDate, from: CivilDate = todayInVietnam()): number {
  return diffInDays(from, target)
}

/** `Hôm nay` · `Ngày mai` · `Còn 22 ngày` · `22 ngày trước` */
export function formatCountdown(days: number): string {
  if (days === 0) return 'Hôm nay'
  if (days === 1) return 'Ngày mai'
  if (days === -1) return 'Hôm qua'
  if (days > 1) return `Còn ${days} ngày`
  return `${Math.abs(days)} ngày trước`
}

/** A rough "in about N weeks/months" used as a secondary line. */
export function formatCountdownLong(days: number): string | null {
  if (days < 14) return null
  if (days < 60) return `khoảng ${Math.round(days / 7)} tuần`
  return `khoảng ${Math.round(days / 30)} tháng`
}
