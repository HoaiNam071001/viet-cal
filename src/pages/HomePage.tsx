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
import { APP_NAME } from '@/app/config/app.config'
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

const FEATURES: Array<{ icon: ReactNode; title: string; description: string }> = [
  {
    icon: <Moon className="size-5" />,
    title: 'Âm lịch chuẩn Việt Nam',
    description: 'Tính theo múi giờ UTC+7, có tháng nhuận, can chi ngày/tháng/năm và 24 tiết khí.',
  },
  {
    icon: <PartyPopper className="size-5" />,
    title: 'Ngày lễ Việt & quốc tế',
    description: 'Tết, Giỗ Tổ, Trung Thu… quy đổi động theo từng năm, không hard-code.',
  },
  {
    icon: <Repeat className="size-5" />,
    title: 'Đổi ngày hai chiều',
    description: 'Dương ↔ Âm tức thì, hỗ trợ tháng nhuận, sao chép hoặc mở thẳng ngày đó.',
  },
  {
    icon: <Search className="size-5" />,
    title: 'Tìm kiếm thông minh',
    description: 'Gõ “15/08/2026”, “rằm tháng 7” hay “Tết 2027” đều ra kết quả.',
  },
  {
    icon: <Share2 className="size-5" />,
    title: 'Chia sẻ ngày đẹp',
    description: 'Xuất ngày thành ảnh để gửi bạn bè chỉ với một chạm.',
  },
  {
    icon: <WifiOff className="size-5" />,
    title: 'Chạy offline',
    description: 'Cài như ứng dụng, xem lịch và ngày lễ cả khi mất mạng.',
  },
]

const SCREENSHOTS = [
  { src: '/screenshots/month.png', label: 'Lịch tháng', caption: 'Ngày Dương và ngày Âm trong cùng một ô' },
  { src: '/screenshots/day-detail.png', label: 'Chi tiết ngày', caption: 'Can chi, tiết khí, giờ hoàng đạo' },
  { src: '/screenshots/convert.png', label: 'Đổi ngày', caption: 'Dương ↔ Âm, có tháng nhuận' },
]

export function HomePage() {
  const today = useToday()
  const navigate = useNavigate()
  const [nextHoliday] = useUpcomingHolidays(1)
  const { canInstall, needsManualInstructions, install } = useInstallPrompt()

  const openDate = (date: CivilDate) => navigate(`/calendar/day?date=${toKey(date)}`)

  return (
    <div className="flex flex-col gap-10 pb-6 lg:gap-16">
      {/* ------------------------------- Hero ------------------------------- */}
      <section className="grid items-center gap-6 pt-2 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-10 lg:pt-8">
        <div>
          <span className="glass-card text-primary inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-xs font-semibold">
            <Sparkles className="size-3.5" />
            Lịch Dương · Lịch Âm · Ngày lễ
          </span>

          <h1 className="text-text mt-4 text-[34px] leading-[1.1] font-semibold tracking-tight sm:text-5xl">
            {APP_NAME} — xem ngày Âm Dương
            <span className="text-primary"> nhanh và chính xác</span>
          </h1>

          <p className="text-muted mt-4 max-w-[52ch] text-[15px] leading-relaxed sm:text-base">
            Lịch vạn niên cho người Việt: ngày Âm ngay trong lịch tháng, can chi, tiết khí, giờ hoàng
            đạo, ngày lễ trong nước và quốc tế, đếm ngược tới Tết — hoạt động cả khi ngoại tuyến.
          </p>

          <div className="mt-6 flex flex-wrap gap-2.5">
            <Button asChild variant="primary" size="lg">
              <Link to="/calendar/month">
                <CalendarDays className="size-4.5" />
                Mở lịch tháng
              </Link>
            </Button>
            <Button asChild variant="secondary" size="lg">
              <Link to="/convert">
                <Repeat className="size-4.5" />
                Đổi ngày Âm — Dương
              </Link>
            </Button>
            {canInstall && !needsManualInstructions ? (
              <Button variant="outline" size="lg" onClick={install}>
                <Download className="size-4.5" />
                Cài ứng dụng
              </Button>
            ) : null}
          </div>

          <dl className="text-muted mt-7 grid max-w-md grid-cols-3 gap-3 text-center">
            {[
              ['1900 — 2100', 'năm tra cứu'],
              ['24', 'tiết khí'],
              ['60', 'can chi'],
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
        <SectionHeading title="Có gì trong ứng dụng" subtitle="Đủ dùng hằng ngày, không rườm rà." />
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
        <SectionHeading
          title="Giao diện"
          subtitle="Thiết kế mobile-first, sáng/tối theo hệ thống."
        />
        <div className="grid gap-4 sm:grid-cols-3">
          {SCREENSHOTS.map((shot) => (
            <ScreenshotFrame key={shot.src} {...shot} />
          ))}
        </div>
      </section>

      {/* ------------------------- Upcoming holidays ------------------------ */}
      <section className="grid gap-4 lg:grid-cols-[minmax(0,1fr)_360px]">
        <div>
          <SectionHeading
            title={`Sắp tới trong năm ${today.year}`}
            subtitle="Chạm vào một ngày lễ để mở chi tiết ngày đó."
          />
          <UpcomingHolidaysCard count={6} onSelect={openDate} />
        </div>

        <Card variant="tinted" className="flex flex-col justify-between gap-4 p-6">
          <div>
            <h3 className="text-text text-lg font-semibold">Cài vào màn hình chính</h3>
            <p className="text-muted mt-1.5 text-sm leading-relaxed">
              {APP_NAME} là ứng dụng web (PWA): cài xong mở nhanh như app, không cần cửa hàng ứng
              dụng và vẫn xem được lịch khi không có mạng.
            </p>
          </div>
          {needsManualInstructions ? (
            <p className="text-muted text-sm">
              Trên iPhone: nhấn <span className="text-text font-medium">Chia sẻ</span> →
              <span className="text-text font-medium"> Thêm vào MH chính</span>.
            </p>
          ) : (
            <Button variant="primary" onClick={install} disabled={!canInstall} className="w-full sm:w-auto">
              <Download className="size-4" />
              {canInstall ? 'Cài ứng dụng' : 'Đã cài hoặc trình duyệt không hỗ trợ'}
            </Button>
          )}
        </Card>
      </section>

      <p className="text-subtle text-center text-xs">
        Âm lịch tính theo múi giờ Asia/Ho_Chi_Minh (UTC+7) ngay trên thiết bị của bạn.
      </p>
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
            Ảnh {label.toLowerCase()}
          </div>
        ) : (
          <img
            src={src}
            alt={`Ảnh chụp màn hình: ${label}`}
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
