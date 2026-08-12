import { BookHeart, Clock, Moon, PartyPopper, Sparkles } from 'lucide-react'
import type { ReactNode } from 'react'
import { useSettings } from '@/app/providers/SettingsProvider'
import { DiaryDaySection } from '@/features/diary/components/DiaryDaySection'
import { HolidayItem } from '@/features/holidays/components/HolidayItem'
import { useHolidaysOfDate } from '@/features/holidays/hooks/useHolidays'
import { formatLunarTraditional, getAuspiciousHours, useLunarDate } from '@/features/lunar'
import { ShareDayButton } from '@/features/share/components/ShareDayButton'
import { Badge } from '@/shared/components/ui/Badge'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { formatDateVN, getWeekdayLabel, isWeekend } from '@/shared/utils/date'

interface DayDetailProps {
  date: CivilDate
  className?: string
}

function Section({
  icon,
  title,
  children,
}: {
  icon: ReactNode
  title: string
  children: ReactNode
}) {
  return (
    <section className="border-border border-t pt-4 first:border-t-0 first:pt-0">
      <h3 className="text-subtle mb-2.5 flex items-center gap-1.5 text-[11px] font-semibold tracking-[0.14em] uppercase">
        {icon}
        {title}
      </h3>
      {children}
    </section>
  )
}

/** The full picture of a single day — reused by the day view and the side panel. */
export function DayDetail({ date, className }: DayDetailProps) {
  const { settings } = useSettings()
  const info = useLunarDate(date)
  const holidays = useHolidaysOfDate(date)
  const auspicious = getAuspiciousHours(date)

  return (
    <div className={cn('flex flex-col gap-5', className)}>
      <header className="flex items-start justify-between gap-4">
        <div>
          <p className={cn('text-sm font-medium', isWeekend(date) ? 'text-weekend' : 'text-muted')}>
            {getWeekdayLabel(date)}
          </p>
          <p className="text-text mt-0.5 text-[34px] leading-none font-semibold tabular-nums">
            {date.day}
          </p>
          <p className="text-muted mt-1.5 text-sm">{formatDateVN(date)}</p>
          <p className="text-accent mt-2.5 text-[15px] font-medium">
            {formatLunarTraditional(info.lunar)}
          </p>
          <p className="text-subtle text-xs">năm {info.sexagenary.year.name}</p>
        </div>
        <ShareDayButton date={date} />
      </header>

      <Section icon={<BookHeart className="size-3.5" />} title="Nhật ký">
        <DiaryDaySection date={date} />
      </Section>

      <Section icon={<Moon className="size-3.5" />} title="Can chi">
        <div className="grid grid-cols-3 gap-2">
          {(
            [
              ['Ngày', info.sexagenary.day.name],
              ['Tháng', info.sexagenary.month.name],
              ['Năm', info.sexagenary.year.name],
            ] as const
          ).map(([label, value]) => (
            <div key={label} className="bg-surface-2 rounded-2xl px-3 py-2.5 text-center">
              <p className="text-subtle text-[11px]">{label}</p>
              <p className="text-text mt-0.5 text-sm font-semibold">{value}</p>
            </div>
          ))}
        </div>
      </Section>

      {settings.showAstrology ? (
        <Section icon={<Sparkles className="size-3.5" />} title="Tiết khí">
          <div className="flex flex-wrap items-center gap-2">
            <Badge tone="accent">{info.solarTerm.name}</Badge>
            {info.solarTermStart ? (
              <span className="text-muted text-xs">Bắt đầu tiết khí hôm nay</span>
            ) : null}
            {info.isFullMoon ? <Badge tone="neutral">Rằm</Badge> : null}
            {info.isNewMoon ? <Badge tone="neutral">Mùng một</Badge> : null}
          </div>
        </Section>
      ) : null}

      <Section icon={<PartyPopper className="size-3.5" />} title="Ngày lễ">
        {holidays.length > 0 ? (
          <ul className="flex flex-col gap-2">
            {holidays.map((holiday) => (
              <HolidayItem key={holiday.id} holiday={holiday} />
            ))}
          </ul>
        ) : (
          <p className="text-subtle text-sm">Không có ngày lễ.</p>
        )}
      </Section>

      {settings.showAstrology ? (
        <Section icon={<Clock className="size-3.5" />} title="Giờ hoàng đạo">
          <div className="flex flex-wrap gap-1.5">
            {auspicious.map((hour) => (
              <span
                key={hour.chi}
                className="bg-surface-2 text-muted rounded-xl px-2.5 py-1.5 text-xs"
              >
                <span className="text-text font-medium">{hour.chi}</span>{' '}
                <span className="tabular-nums">{hour.range}</span>
              </span>
            ))}
          </div>
        </Section>
      ) : null}
    </div>
  )
}
