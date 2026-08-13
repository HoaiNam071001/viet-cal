import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import {
  formatLunarDayMonth,
  getDayCanChi,
  getLeapMonthOfYear,
  getYearCanChi,
  lunarToSolar,
  solarToLunar,
} from '@/features/lunar'
import type { LunarDate } from '@/features/lunar'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate } from '@/shared/types'
import { formatFullDateVN, isValidDate } from '@/shared/utils/date'

export type ConversionDirection = 'solar-to-lunar' | 'lunar-to-solar'

export interface ConversionResult {
  /** The day to navigate to / share — always the solar one. */
  solar: CivilDate | null
  lunar: LunarDate | null
  primaryText: string
  secondaryText: string
  copyText: string
  error: string | null
}

/** Drives the two-way converter; all validation lives here, not in the UI. */
export function useDateConverter() {
  const { t } = useTranslation()
  const today = useToday()
  const [direction, setDirection] = useState<ConversionDirection>('solar-to-lunar')
  const [input, setInput] = useState<CivilDate>(today)
  const [isLeapMonth, setIsLeapMonth] = useState(false)

  const leapMonthOfYear = useMemo(
    () => (direction === 'lunar-to-solar' ? getLeapMonthOfYear(input.year) : null),
    [direction, input.year],
  )
  const canBeLeap = leapMonthOfYear === input.month

  const result = useMemo<ConversionResult>(() => {
    const solarAbbr = t('converter.solarAbbr')
    const lunarAbbr = t('converter.lunarAbbr')

    if (direction === 'solar-to-lunar') {
      if (!isValidDate(input)) {
        return empty(t('converter.invalidSolarDate'))
      }
      const lunar = solarToLunar(input)
      return {
        solar: input,
        lunar,
        primaryText: `${lunar.day}/${lunar.month}${lunar.isLeapMonth ? t('converter.leapSuffix') : ''}/${lunar.year}`,
        secondaryText: `${formatLunarDayMonth(lunar)} ${t('converter.yearOf', { name: getYearCanChi(lunar.year).name })} · ${t('converter.canChiDay', { name: getDayCanChi(input).name })}`,
        copyText: `${input.day}/${input.month}/${input.year} (${solarAbbr}) = ${lunar.day}/${lunar.month}/${lunar.year} (${lunarAbbr})`,
        error: null,
      }
    }

    const lunar: LunarDate = {
      day: input.day,
      month: input.month,
      year: input.year,
      isLeapMonth: canBeLeap && isLeapMonth,
    }
    const solar = lunarToSolar(lunar)
    if (!solar) {
      return empty(t('converter.invalidLunarDate'))
    }
    return {
      solar,
      lunar,
      primaryText: `${solar.day}/${solar.month}/${solar.year}`,
      secondaryText: `${formatFullDateVN(solar)} · ${t('converter.canChiDay', { name: getDayCanChi(solar).name })}`,
      copyText: `${lunar.day}/${lunar.month}/${lunar.year} (${lunarAbbr}) = ${solar.day}/${solar.month}/${solar.year} (${solarAbbr})`,
      error: null,
    }
  }, [canBeLeap, direction, input, isLeapMonth, t])

  return {
    direction,
    setDirection: (next: ConversionDirection) => {
      // Carry the current result across so switching direction keeps context.
      setDirection(next)
      setIsLeapMonth(false)
    },
    input,
    setInput,
    isLeapMonth: canBeLeap && isLeapMonth,
    setIsLeapMonth,
    canBeLeap,
    result,
    today,
  }
}

function empty(error: string): ConversionResult {
  return { solar: null, lunar: null, primaryText: '—', secondaryText: '', copyText: '', error }
}
