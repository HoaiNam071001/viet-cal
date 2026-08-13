import { ArrowDown, ArrowRight, Check, Copy } from 'lucide-react'
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { Segmented } from '@/shared/components/ui/Segmented'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { useDateConverter } from '../hooks/useDateConverter'

interface DateConverterProps {
  onViewDate?: (date: CivilDate) => void
  className?: string
}

export function DateConverter({ onViewDate, className }: DateConverterProps) {
  const { t } = useTranslation()
  const { direction, setDirection, input, setInput, isLeapMonth, setIsLeapMonth, canBeLeap, result, today } =
    useDateConverter()
  const [copied, setCopied] = useState(false)

  const directions = [
    { value: 'solar-to-lunar' as const, label: t('converter.solarToLunar') },
    { value: 'lunar-to-solar' as const, label: t('converter.lunarToSolar') },
  ]

  const copy = async () => {
    try {
      await navigator.clipboard.writeText(result.copyText)
      setCopied(true)
      setTimeout(() => setCopied(false), 1600)
    } catch {
      /* clipboard blocked — nothing else to do */
    }
  }

  const sourceLabel = direction === 'solar-to-lunar' ? t('converter.solarCalendar') : t('converter.lunarCalendar')
  const targetLabel = direction === 'solar-to-lunar' ? t('converter.lunarCalendar') : t('converter.solarCalendar')

  return (
    <div className={cn('flex flex-col gap-4', className)}>
      <Segmented options={directions} value={direction} onChange={setDirection} className="flex w-full" />

      <Card variant="glass" className="p-5">
        <p className="text-subtle mb-3 text-[11px] font-semibold tracking-[0.14em] uppercase">
          {sourceLabel}
        </p>

        <div className="grid grid-cols-3 gap-2">
          <NumberField
            label={t('converter.day')}
            value={input.day}
            min={1}
            max={31}
            onChange={(day) => setInput({ ...input, day })}
          />
          <NumberField
            label={t('converter.month')}
            value={input.month}
            min={1}
            max={12}
            onChange={(month) => setInput({ ...input, month })}
          />
          <NumberField
            label={t('converter.year')}
            value={input.year}
            min={1900}
            max={2100}
            onChange={(year) => setInput({ ...input, year })}
          />
        </div>

        {direction === 'lunar-to-solar' ? (
          <label
            className={cn(
              'mt-3 flex items-center gap-2.5 text-sm',
              canBeLeap ? 'text-text' : 'text-subtle',
            )}
          >
            <input
              type="checkbox"
              className="accent-primary size-4"
              disabled={!canBeLeap}
              checked={isLeapMonth}
              onChange={(event) => setIsLeapMonth(event.target.checked)}
            />
            {t('converter.leapMonth')}
            {!canBeLeap ? <span className="text-subtle text-xs">{t('converter.leapMonthUnavailable')}</span> : null}
          </label>
        ) : null}

        <div className="mt-3 flex flex-wrap gap-2">
          <Button variant="ghost" size="sm" onClick={() => setInput(today)}>
            {t('common.today')}
          </Button>
        </div>
      </Card>

      <div className="text-subtle flex justify-center">
        <ArrowDown className="size-5 sm:hidden" />
        <ArrowRight className="hidden size-5 sm:block" />
      </div>

      <Card variant="tinted" className="p-5">
        <p className="text-subtle mb-2 text-[11px] font-semibold tracking-[0.14em] uppercase">
          {targetLabel}
        </p>

        {result.error ? (
          <p className="text-primary text-sm">{result.error}</p>
        ) : (
          <>
            <p className="text-text text-3xl leading-tight font-semibold tabular-nums">
              {result.primaryText}
            </p>
            <p className="text-muted mt-1.5 text-sm">{result.secondaryText}</p>

            <div className="mt-4 flex flex-wrap gap-2">
              <Button variant="secondary" size="sm" onClick={copy}>
                {copied ? <Check className="size-4" /> : <Copy className="size-4" />}
                {copied ? t('converter.copied') : t('converter.copy')}
              </Button>
              {onViewDate && result.solar ? (
                <Button variant="primary" size="sm" onClick={() => onViewDate(result.solar!)}>
                  {t('converter.viewThisDate')}
                </Button>
              ) : null}
            </div>
          </>
        )}
      </Card>
    </div>
  )
}

function NumberField({
  label,
  value,
  min,
  max,
  onChange,
}: {
  label: string
  value: number
  min: number
  max: number
  onChange: (value: number) => void
}) {
  return (
    <label className="flex flex-col gap-1.5">
      <span className="text-subtle text-xs">{label}</span>
      <input
        type="number"
        inputMode="numeric"
        value={value}
        min={min}
        max={max}
        onChange={(event) => {
          const next = Number(event.target.value)
          if (Number.isFinite(next)) onChange(next)
        }}
        className="bg-surface-2 border-border text-text focus:border-primary h-12 w-full rounded-2xl border px-3 text-center text-lg font-semibold tabular-nums outline-none transition-colors"
      />
    </label>
  )
}
