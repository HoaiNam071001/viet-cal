export const CAN = ['Giáp', 'Ất', 'Bính', 'Đinh', 'Mậu', 'Kỷ', 'Canh', 'Tân', 'Nhâm', 'Quý'] as const

export const CHI = [
  'Tý',
  'Sửu',
  'Dần',
  'Mão',
  'Thìn',
  'Tỵ',
  'Ngọ',
  'Mùi',
  'Thân',
  'Dậu',
  'Tuất',
  'Hợi',
] as const

/**
 * The 24 solar terms, indexed by `floor(sunLongitude / 15)`.
 * Index 0 is Xuân phân (0°), i.e. the March equinox.
 */
export const SOLAR_TERMS = [
  'Xuân phân',
  'Thanh minh',
  'Cốc vũ',
  'Lập hạ',
  'Tiểu mãn',
  'Mang chủng',
  'Hạ chí',
  'Tiểu thử',
  'Đại thử',
  'Lập thu',
  'Xử thử',
  'Bạch lộ',
  'Thu phân',
  'Hàn lộ',
  'Sương giáng',
  'Lập đông',
  'Tiểu tuyết',
  'Đại tuyết',
  'Đông chí',
  'Tiểu hàn',
  'Đại hàn',
  'Lập xuân',
  'Vũ thủy',
  'Kinh trập',
] as const

/** Lunar month names as Vietnamese calendars print them. */
export const LUNAR_MONTH_LABELS: Record<number, string> = {
  1: 'Giêng',
  2: 'Hai',
  3: 'Ba',
  4: 'Tư',
  5: 'Năm',
  6: 'Sáu',
  7: 'Bảy',
  8: 'Tám',
  9: 'Chín',
  10: 'Mười',
  11: 'Mười một',
  12: 'Chạp',
}

/**
 * Auspicious-hour bitmap. Row = chi of the day mod 6, each string has 12 flags
 * for the 12 double-hours starting at Tý (23:00).
 */
export const AUSPICIOUS_HOUR_TABLE = [
  '110100101100', // Tý, Ngọ
  '001101001011', // Sửu, Mùi
  '110011010010', // Dần, Thân
  '101100110100', // Mão, Dậu
  '001011001101', // Thìn, Tuất
  '010010110011', // Tỵ, Hợi
] as const
