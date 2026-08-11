export const APP_NAME = 'Lịch Việt'
export const APP_DESCRIPTION = 'Lịch Dương – Lịch Âm Việt Nam, ngày lễ, can chi, tiết khí'

/** Vietnam is UTC+7 year round (no DST), which the lunar algorithm depends on. */
export const VN_TIMEZONE = 'Asia/Ho_Chi_Minh'
export const VN_UTC_OFFSET = 7

export const STORAGE_KEYS = {
  theme: 'vietcal:theme',
  settings: 'vietcal:settings',
  holidays: 'vietcal:holidays:v1',
} as const

/** Years the app is willing to navigate to. The lunar algorithm is reliable well beyond this. */
export const MIN_YEAR = 1900
export const MAX_YEAR = 2100
