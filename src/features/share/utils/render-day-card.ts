import i18n from '@/app/i18n'
import { APP_NAME } from '@/app/config/app.config'
import { formatLunarTraditional, getLunarDayInfo } from '@/features/lunar'
import type { CivilDate } from '@/shared/types'
import { formatDateVN, getWeekdayLabel } from '@/shared/utils/date'

const WIDTH = 1080
const HEIGHT = 1350

/**
 * Draws a shareable day card straight on a canvas — no html-to-image, no fonts
 * to fetch, so it works offline and inside the PWA.
 */
export async function renderDayCard(date: CivilDate, holidayName?: string): Promise<Blob | null> {
  const canvas = document.createElement('canvas')
  canvas.width = WIDTH
  canvas.height = HEIGHT
  const ctx = canvas.getContext('2d')
  if (!ctx) return null

  const font = (size: number, weight = '400') =>
    `${weight} ${size}px -apple-system, "Segoe UI", system-ui, Roboto, sans-serif`

  const background = ctx.createLinearGradient(0, 0, WIDTH, HEIGHT)
  background.addColorStop(0, '#f2fdf6')
  background.addColorStop(1, '#dcf6e6')
  ctx.fillStyle = background
  ctx.fillRect(0, 0, WIDTH, HEIGHT)

  // Card
  const pad = 72
  roundedRect(ctx, pad, pad, WIDTH - pad * 2, HEIGHT - pad * 2, 56)
  ctx.fillStyle = '#ffffff'
  ctx.shadowColor = 'rgba(20, 90, 55, 0.14)'
  ctx.shadowBlur = 60
  ctx.shadowOffsetY = 20
  ctx.fill()
  ctx.shadowColor = 'transparent'
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0

  const info = getLunarDayInfo(date)
  const centerX = WIDTH / 2
  ctx.textAlign = 'center'

  ctx.fillStyle = '#0f9d58'
  ctx.font = font(44, '600')
  ctx.fillText(getWeekdayLabel(date).toUpperCase(), centerX, 300)

  ctx.fillStyle = '#14261c'
  ctx.font = font(300, '700')
  ctx.fillText(String(date.day), centerX, 600)

  ctx.fillStyle = '#48544c'
  ctx.font = font(52, '500')
  ctx.fillText(formatDateVN(date), centerX, 690)

  // Divider
  ctx.strokeStyle = '#dfeee6'
  ctx.lineWidth = 3
  ctx.beginPath()
  ctx.moveTo(centerX - 220, 760)
  ctx.lineTo(centerX + 220, 760)
  ctx.stroke()

  ctx.fillStyle = '#a9761d'
  ctx.font = font(46, '600')
  ctx.fillText(formatLunarTraditional(info.lunar), centerX, 840)

  ctx.fillStyle = '#63736a'
  ctx.font = font(38)
  ctx.fillText(i18n.t('converter.yearOf', { name: info.sexagenary.year.name }), centerX, 900)
  ctx.fillText(`${i18n.t('calendar.canChiLabels.day')} ${info.sexagenary.day.name} · ${info.solarTerm.name}`, centerX, 960)

  if (holidayName) {
    const chipWidth = Math.min(WIDTH - pad * 2 - 120, ctx.measureText(holidayName).width + 200)
    roundedRect(ctx, centerX - chipWidth / 2, 1030, chipWidth, 96, 48)
    ctx.fillStyle = '#e4f7ec'
    ctx.fill()
    ctx.fillStyle = '#0b7a44'
    ctx.font = font(40, '600')
    ctx.fillText(holidayName, centerX, 1092)
  }

  ctx.fillStyle = '#9aa8a0'
  ctx.font = font(30)
  ctx.fillText(`${APP_NAME} · ${i18n.t('share.tagline')}`, centerX, HEIGHT - 130)

  return new Promise((resolve) => canvas.toBlob(resolve, 'image/png'))
}

function roundedRect(
  ctx: CanvasRenderingContext2D,
  x: number,
  y: number,
  width: number,
  height: number,
  radius: number,
): void {
  ctx.beginPath()
  ctx.roundRect(x, y, width, height, radius)
  ctx.closePath()
}
