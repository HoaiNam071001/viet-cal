import i18n from '@/app/i18n'
import type { CivilDate } from '@/shared/types'
import { diffInDays, todayInVietnam } from '@/shared/utils/date'

/** Whole days from today (in Vietnam) to `target`. Negative when it has passed. */
export function getDaysUntil(target: CivilDate, from: CivilDate = todayInVietnam()): number {
  return diffInDays(from, target)
}

/** `Hôm nay` · `Ngày mai` · `Còn 22 ngày` · `22 ngày trước` */
export function formatCountdown(days: number): string {
  if (days === 0) return i18n.t('common.today')
  if (days === 1) return i18n.t('countdown.tomorrow')
  if (days === -1) return i18n.t('countdown.yesterday')
  if (days > 1) return i18n.t('countdown.inDays', { days })
  return i18n.t('countdown.daysAgo', { days: Math.abs(days) })
}

/** A rough "in about N weeks/months" used as a secondary line. */
export function formatCountdownLong(days: number): string | null {
  if (days < 14) return null
  if (days < 60) return i18n.t('countdown.aboutWeeks', { weeks: Math.round(days / 7) })
  return i18n.t('countdown.aboutMonths', { months: Math.round(days / 30) })
}
