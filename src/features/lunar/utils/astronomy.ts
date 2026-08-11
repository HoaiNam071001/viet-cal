/**
 * Astronomical primitives behind the Vietnamese lunar calendar.
 *
 * Ported from Hồ Ngọc Đức's reference implementation of the algorithm described in
 * "Âm lịch Việt Nam" (based on Jean Meeus, *Astronomical Algorithms*).
 * Pure functions only — no dates, no timezone, no UI.
 */

const DEG = Math.PI / 180

/** Julian day number of a civil (Gregorian/Julian) date at noon. */
export function jdFromDate(day: number, month: number, year: number): number {
  const a = Math.floor((14 - month) / 12)
  const y = year + 4800 - a
  const m = month + 12 * a - 3
  let jd =
    day +
    Math.floor((153 * m + 2) / 5) +
    365 * y +
    Math.floor(y / 4) -
    Math.floor(y / 100) +
    Math.floor(y / 400) -
    32045
  if (jd < 2299161) {
    // Before the Gregorian reform (15/10/1582) the Julian calendar applies.
    jd = day + Math.floor((153 * m + 2) / 5) + 365 * y + Math.floor(y / 4) - 32083
  }
  return jd
}

/** Inverse of {@link jdFromDate}: `[day, month, year]`. */
export function jdToDate(jd: number): [number, number, number] {
  let a: number
  let b: number
  let c: number
  if (jd > 2299160) {
    a = jd + 32044
    b = Math.floor((4 * a + 3) / 146097)
    c = a - Math.floor((b * 146097) / 4)
  } else {
    b = 0
    c = jd + 32082
  }
  const d = Math.floor((4 * c + 3) / 1461)
  const e = c - Math.floor((1461 * d) / 4)
  const m = Math.floor((5 * e + 2) / 153)
  const day = e - Math.floor((153 * m + 2) / 5) + 1
  const month = m + 3 - 12 * Math.floor(m / 10)
  const year = b * 100 + d - 4800 + Math.floor(m / 10)
  return [day, month, year]
}

/**
 * Julian day (UTC, fractional) of the k-th new moon after the one of 1/1/1900.
 */
export function newMoon(k: number): number {
  const T = k / 1236.85
  const T2 = T * T
  const T3 = T2 * T
  let jd1 = 2415020.75933 + 29.53058868 * k + 0.0001178 * T2 - 0.000000155 * T3
  jd1 += 0.00033 * Math.sin((166.56 + 132.87 * T - 0.009173 * T2) * DEG)

  // Mean anomaly of the sun / moon and the moon's argument of latitude.
  const M = 359.2242 + 29.10535608 * k - 0.0000333 * T2 - 0.00000347 * T3
  const Mpr = 306.0253 + 385.81691806 * k + 0.0107306 * T2 + 0.00001236 * T3
  const F = 21.2964 + 390.67050646 * k - 0.0016528 * T2 - 0.00000239 * T3

  let c1 = (0.1734 - 0.000393 * T) * Math.sin(M * DEG) + 0.0021 * Math.sin(2 * M * DEG)
  c1 = c1 - 0.4068 * Math.sin(Mpr * DEG) + 0.0161 * Math.sin(2 * Mpr * DEG)
  c1 = c1 - 0.0004 * Math.sin(3 * Mpr * DEG)
  c1 = c1 + 0.0104 * Math.sin(2 * F * DEG) - 0.0051 * Math.sin((M + Mpr) * DEG)
  c1 = c1 - 0.0074 * Math.sin((M - Mpr) * DEG) + 0.0004 * Math.sin((2 * F + M) * DEG)
  c1 = c1 - 0.0004 * Math.sin((2 * F - M) * DEG) - 0.0006 * Math.sin((2 * F + Mpr) * DEG)
  c1 = c1 + 0.0010 * Math.sin((2 * F - Mpr) * DEG) + 0.0005 * Math.sin((2 * Mpr + M) * DEG)

  const deltat =
    T < -11
      ? 0.001 + 0.000839 * T + 0.0002261 * T2 - 0.00000845 * T3 - 0.000000081 * T * T3
      : -0.000278 + 0.000265 * T + 0.000262 * T2

  return jd1 + c1 - deltat
}

/** Apparent longitude of the sun, in radians (0 … 2π), at the given fractional julian day. */
export function sunLongitude(jdn: number): number {
  const T = (jdn - 2451545.0) / 36525
  const T2 = T * T
  const M = 357.52910 + 35999.05030 * T - 0.0001559 * T2 - 0.00000048 * T * T2
  const L0 = 280.46645 + 36000.76983 * T + 0.0003032 * T2

  let DL = (1.914600 - 0.004817 * T - 0.000014 * T2) * Math.sin(M * DEG)
  DL += (0.019993 - 0.000101 * T) * Math.sin(2 * M * DEG) + 0.000290 * Math.sin(3 * M * DEG)

  let L = (L0 + DL) * DEG
  L -= Math.PI * 2 * Math.floor(L / (Math.PI * 2))
  return L
}

/** Sun longitude in degrees (0 … 360) at 00:00 local time of the given julian day number. */
export function sunLongitudeDegAtMidnight(jdn: number, timeZone: number): number {
  return (sunLongitude(jdn - 0.5 - timeZone / 24) / Math.PI) * 180
}

/**
 * Which 30° zodiac sector the sun is in at 00:00 local time — 0 means 0°–30°
 * (Xuân phân → Cốc vũ). Used to detect the leap month.
 */
export function getSunLongitudeSector(dayNumber: number, timeZone: number): number {
  return Math.floor((sunLongitude(dayNumber - 0.5 - timeZone / 24) / Math.PI) * 6)
}

/** Julian day number (local) of the new moon that starts the k-th lunar month. */
export function getNewMoonDay(k: number, timeZone: number): number {
  return Math.floor(newMoon(k) + 0.5 + timeZone / 24)
}
