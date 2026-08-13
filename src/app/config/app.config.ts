export const APP_NAME = 'Diary Calendar'
export const APP_TAGLINE = 'Lịch Việt + Nhật ký • Sống trọn vẹn mỗi ngày'
export const APP_DESCRIPTION = 'Lịch Dương – Lịch Âm Việt Nam, ngày lễ, can chi, tiết khí, nhật ký cá nhân'

/** Vietnam is UTC+7 year round (no DST), which the lunar algorithm depends on. */
export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh'
export const VN_UTC_OFFSET = 7

export const STORAGE_KEYS = {
  theme: 'vietcal:theme',
  settings: 'vietcal:settings',
  holidays: 'vietcal:holidays:v1',
  diaryEntries: 'vietcal:diary:v1',
  diaryListView: 'vietcal:diary:list-view',
  language: 'vietcal:language',
} as const

export const SUPPORTED_LANGUAGES = ['vi', 'en'] as const
export type AppLanguage = (typeof SUPPORTED_LANGUAGES)[number]
export const DEFAULT_LANGUAGE: AppLanguage = 'vi'

/** Years the app is willing to navigate to. The lunar algorithm is reliable well beyond this. */
export const MIN_YEAR = 1900
export const MAX_YEAR = 2100
