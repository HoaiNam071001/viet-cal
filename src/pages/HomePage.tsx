import {
  CalendarDays,
  Download,
  Moon,
  PartyPopper,
  Repeat,
  Search,
  Share2,
  Sparkles,
  WifiOff,
} from 'lucide-react'
import { useState, type ReactNode } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '@/app/config/app.config'
import { ROUTES } from '@/app/config/routes'
import { useTheme } from '@/app/providers/ThemeProvider'
import { CountdownCard } from '@/features/countdown/components/CountdownCard'
import { useUpcomingHolidays } from '@/features/holidays/hooks/useHolidays'
import { useInstallPrompt } from '@/features/pwa/hooks/useInstallPrompt'
import { Button } from '@/shared/components/ui/Button'
import { Card } from '@/shared/components/ui/Card'
import { useToday } from '@/shared/hooks/useToday'
import type { CivilDate } from '@/shared/types'
import { cn } from '@/shared/utils/cn'
import { toKey } from '@/shared/utils/date'
import { TodayCard } from '@/widgets/TodayCard'
import { UpcomingHolidaysCard } from '@/widgets/UpcomingHolidaysCard'

export function HomePage() {
  const { t } = useTranslation()
  const today = useToday()
  const navigate = useNavigate()
  const [nextHoliday] = useUpcomingHolidays(1)
  const { canInstall, needsManualInstructions, install } = useInstallPrompt()
  const { resolved } = useTheme()

  const openDate = (date: CivilDate) => navigate(ROUTES.calendarDay(toKey(date)))

  const FEATURES: Array<{ icon: ReactNode; title: string; description: string }> = [
    { icon: <Moon className="size-5" />, title: t('home.features.lunar.title'), description: t('home.features.lunar.description') },
    { icon: <PartyPopper className="size-5" />, title: t('home.features.holidays.title'), description: t('home.features.holidays.description') },
    { icon: <Repeat className="size-5" />, title: t('home.features.convert.title'), description: t('home.features.convert.description') },
    { icon: <Search className="size-5" />, title: t('home.features.search.title'), description: t('home.features.search.description') },
    { icon: <Share2 className="size-5" />, title: t('home.features.share.title'), description: t('home.features.share.description') },
    { icon: <WifiOff className="size-5" />, title: t('home.features.offline.title'), description: t('home.features.offline.description') },
  ]

  const SCREENSHOTS = [
    { light: '/screenshots/month.png', dark: '/screenshots/month-dark.png', label: t('home.screenshots.month.label'), caption: t('home.screenshots.month.caption') },
    { light: '/screenshots/day-detail.png', dark: '/screenshots/day-detail-dark.png', label: t('home.screenshots.dayDetail.label'), caption: t('home.screenshots.dayDetail.caption') },
    { light: '/screenshots/convert.png', dark: '/screenshots/convert-dark.png', label: t('home.screenshots.convert.label'), caption: t('home.screenshots.convert.caption') },
  ]

  return (
    <div className="flex flex-col gap-10 pb-6 lg:gap-16">
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="grid items-center gap-6 pt-2 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 lg:pt-8">
        <div>
          <span className="glass-card text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            {t('home.badge')}
          </span>

          <h1 className="text-text mt-4 text-[34px] leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            {t('home.heroTitle', { appName: APP_NAME })}
            <span className="text-primary"> {t('home.heroTitleHighlight')}</span>
          </h1>

          <p className="text-muted mt-4 max-w-[52ch] text-[15px] leading-relaxed sm:text-base">
            {t('home.heroDescription')}
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild variant="primary" size="lg">
              <Link to={ROUTES.calendarMonth}>
                <CalendarDays className="size-4.5" />
                {t('home.openCalendar')}
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to={ROUTES.convert}>
                <Repeat className="size-4.5" />
                {t('home.convertDates')}
              </Link>
            </Button>
            {canInstall && !needsManualInstructions ? (
              <Button variant="outline" size="lg" onClick={install}>
                <Download className="size-4.5" />
                {t('home.installApp')}
              </Button>
            ) : null}
          </div>

          <dl className="text-muted mt-7 grid max-w-md grid-cols-3 gap-3 text-center">
            {[
              ['1900 — 2100', t('home.stats.years')],
              ['24', t('home.stats.solarTerms')],
              ['60', t('home.stats.canChi')],
            ].map(([value, label]) => (
              <div key={label} className="glass-card rounded-2xl px-2 py-3">
                <dt className="text-text text-lg font-semibold tabular-nums">{value}</dt>
                <dd className="text-subtle text-[11px]">{label}</dd>
              </div>
            ))}
          </dl>
        </div>

        <div className="flex flex-col gap-4">
          <TodayCard onOpen={openDate} />
          {nextHoliday ? <CountdownCard item={nextHoliday} onSelect={(item) => openDate(item.date)} /> : null}
        </div>
      </section>

      {/* ----------------------------- Features ----------------------------- */}
      <section>
        <SectionHeading title={t('home.features.title')} subtitle={t('home.features.subtitle')} />
        <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
          {FEATURES.map((feature) => (
            <Card key={feature.title} variant="glass" className="p-5">
              <span className="bg-primary-soft text-primary mb-3 grid size-11 place-items-center rounded-2xl">
                {feature.icon}
              </span>
              <h3 className="text-text text-[15px] font-semibold">{feature.title}</h3>
              <p className="text-muted mt-1 text-sm leading-relaxed">{feature.description}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* ---------------------------- Screenshots --------------------------- */}
      <section>
        <SectionHeading title={t('home.screenshots.title')} subtitle={t('home.screenshots.subtitle')} />
        <div className="grid gap-4 sm:grid-cols-3">
          {SCREENSHOTS.map((shot) => (
            <ScreenshotFrame
              key={shot.light}
              src={resolved === 'dark' ? shot.dark : shot.light}
              label={shot.label}
              caption={shot.caption}
            />
          ))}
        </div>
      </section>

      {/* ------------------------- Upcoming holidays ------------------------ */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <SectionHeading
            title={t('home.upcoming.title', { year: today.year })}
            subtitle={t('home.upcoming.subtitle')}
          />
          <UpcomingHolidaysCard count={6} onSelect={openDate} />
        </div>

        <Card variant="tinted" className="flex flex-col justify-between gap-4 p-6">
          <div>
            <h3 className="text-text text-lg font-semibold">{t('home.install.title')}</h3>
            <p className="text-muted mt-1.5 text-sm leading-relaxed">
              {t('home.install.description', { appName: APP_NAME })}
            </p>
          </div>
          {needsManualInstructions ? (
            <p className="text-muted text-sm">
              {t('home.install.iosBefore')} <span className="text-text font-medium">{t('home.install.iosShare')}</span> →
              <span className="text-text font-medium"> {t('home.install.iosAdd')}</span>
            </p>
          ) : (
            <Button variant="primary" onClick={install} disabled={!canInstall} className="w-full sm:w-auto">
              <Download className="size-4" />
              {canInstall ? t('home.installApp') : t('home.install.alreadyInstalled')}
            </Button>
          )}
        </Card>
      </section>

      <p className="text-subtle text-center text-xs">{t('home.footer')}</p>
    </div>
  )
}

function SectionHeading({ title, subtitle }: { title: string; subtitle?: string }) {
  return (
    <div className="mb-4">
      <h2 className="text-text text-xl font-semibold tracking-tight sm:text-2xl">{title}</h2>
      {subtitle ? <p className="text-muted mt-1 text-sm">{subtitle}</p> : null}
    </div>
  )
}

/** Shows a screenshot, or a labelled placeholder while the image is missing. */
function ScreenshotFrame({ src, label, caption }: { src: string; label: string; caption: string }) {
  const { t } = useTranslation()
  const [failed, setFailed] = useState(false)

  return (
    <figure className="glass-card overflow-hidden rounded-3xl">
      <div
        className={cn(
          'from-primary-soft to-surface-2 relative aspect-[9/16] bg-gradient-to-br sm:aspect-[3/4]',
        )}
      >
        {failed ? (
          <div className="text-subtle absolute inset-0 grid place-items-center text-xs">
            {t('home.screenshots.placeholder', { label: label.toLowerCase() })}
          </div>
        ) : (
          <img
            src={src}
            alt={t('home.screenshots.alt', { label })}
            loading="lazy"
            onError={() => setFailed(true)}
            className="absolute inset-0 size-full object-cover object-top"
          />
        )}
      </div>
      <figcaption className="px-4 py-3">
        <p className="text-text text-sm font-medium">{label}</p>
        <p className="text-subtle text-xs">{caption}</p>
      </figcaption>
    </figure>
  )
}
