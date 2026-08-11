export interface LunarDate {
  day: number
  month: number
  year: number
  isLeapMonth: boolean
}

export interface SexagenaryName {
  /** Thiên can, e.g. "Bính" */
  can: string
  /** Địa chi, e.g. "Ngọ" */
  chi: string
  /** "Bính Ngọ" */
  name: string
}

export interface SexagenaryInfo {
  day: SexagenaryName
  month: SexagenaryName
  year: SexagenaryName
}

export interface SolarTerm {
  /** 0 - 23, indexed from Xuân phân (sun longitude 0°) */
  index: number
  name: string
  /** Sun longitude in degrees at which this term begins */
  longitude: number
}

export interface AuspiciousHour {
  /** Địa chi of the hour, e.g. "Tý" */
  chi: string
  /** "23:00 - 01:00" */
  range: string
  isAuspicious: boolean
}

/** Everything the UI ever needs to know about one day's lunar identity. */
export interface LunarDayInfo {
  lunar: LunarDate
  sexagenary: SexagenaryInfo
  solarTerm: SolarTerm
  /** Only set on the day a solar term actually begins. */
  solarTermStart: SolarTerm | null
  julianDayNumber: number
  /** True for mùng 1 and rằm — highlighted on the grid. */
  isNewMoon: boolean
  isFullMoon: boolean
}
