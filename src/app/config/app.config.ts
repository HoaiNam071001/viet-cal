export const APP_NAME = 'Nhật Ký Lịch'
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
} as const

/** Years the app is willing to navigate to. The lunar algorithm is reliable well beyond this. */
export const MIN_YEAR = 1900
export const MAX_YEAR = 2100
