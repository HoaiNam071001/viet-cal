/*
 * Regenerates the screenshots used by the home page and the PWA manifest.
 *
 *   npm run dev            # in one terminal
 *   npm run screenshots    # in another
 *
 * Drives the locally installed Chrome through puppeteer-core (no Chromium
 * download) and fails loudly if any page overflows horizontally.
 */
import puppeteer from 'puppeteer-core'
import { mkdirSync } from 'node:fs'

const CHROME =
  process.env.CHROME_PATH ?? '/Applications/Google Chrome.app/Contents/MacOS/Google Chrome'
const BASE = process.env.BASE_URL ?? 'http://localhost:5173'
const OUT = process.argv[2] ?? new URL('../public/screenshots', import.meta.url).pathname

mkdirSync(OUT, { recursive: true })

const SHOTS = [
  { name: 'month', url: '/calendar/month?date=2026-08-11', width: 390, height: 844, theme: 'light' },
  {
    name: 'day-detail',
    url: '/calendar/month?date=2026-09-02',
    width: 390,
    height: 844,
    theme: 'light',
    click: '[aria-label="Ngày 2 tháng 9 năm 2026"]',
  },
  { name: 'convert', url: '/convert', width: 390, height: 844, theme: 'light' },
  { name: 'desktop', url: '/calendar/month?date=2026-08-11', width: 1440, height: 900, theme: 'light' },
  { name: 'home', url: '/', width: 1440, height: 980, theme: 'light' },
  { name: 'month-dark', url: '/calendar/month?date=2026-08-11', width: 390, height: 844, theme: 'dark' },
  {
    name: 'day-detail-dark',
    url: '/calendar/month?date=2026-09-02',
    width: 390,
    height: 844,
    theme: 'dark',
    click: '[aria-label="Ngày 2 tháng 9 năm 2026"]',
  },
  { name: 'convert-dark', url: '/convert', width: 390, height: 844, theme: 'dark' },
]

const AUTH_EMAIL = process.env.AUTH_EMAIL
const AUTH_PASSWORD = process.env.AUTH_PASSWORD

const browser = await puppeteer.launch({
  executablePath: CHROME,
  headless: 'shell',
  args: ['--hide-scrollbars', '--no-first-run', '--no-default-browser-check'],
})

// Most routes are behind <ProtectedRoute>; sign in once so the session cookie
// carries over to every page opened below.
if (AUTH_EMAIL && AUTH_PASSWORD) {
  const loginPage = await browser.newPage()
  await loginPage.goto(`${BASE}/auth/login`, { waitUntil: 'networkidle2', timeout: 30_000 })
  await loginPage.type('input[name="email"]', AUTH_EMAIL)
  await loginPage.type('input[name="password"]', AUTH_PASSWORD)
  // The redirect after sign-in is a client-side route change, not a full
  // navigation, so poll the URL instead of waiting for a navigation event.
  await loginPage.evaluate(() => document.querySelector('form').requestSubmit())
  const signedIn = await loginPage.waitForFunction(() => !location.pathname.startsWith('/auth/login'), {
    timeout: 15_000,
  })
  if (!signedIn) throw new Error('Sign-in did not redirect away from /auth/login')
  await loginPage.close()
  console.log(`✓ signed in as ${AUTH_EMAIL}`)
}

let overflowed = false

for (const shot of SHOTS) {
  const page = await browser.newPage()
  await page.setViewport({
    width: shot.width,
    height: shot.height,
    deviceScaleFactor: 2,
    isMobile: shot.width < 768,
    hasTouch: shot.width < 768,
  })
  await page.emulateMediaFeatures([{ name: 'prefers-color-scheme', value: shot.theme }])
  await page.evaluateOnNewDocument((theme) => {
    localStorage.setItem('vietcal:theme', JSON.stringify(theme))
    // Keep the install banner out of marketing screenshots.
    localStorage.setItem('vietcal:install-dismissed', JSON.stringify(Date.now()))
  }, shot.theme)

  await page.goto(BASE + shot.url, { waitUntil: 'networkidle2', timeout: 30_000 })
  if (shot.click) {
    await page.waitForSelector(shot.click)
    await page.click(shot.click)
  }
  await new Promise((resolve) => setTimeout(resolve, 700))

  const { clientWidth, scrollWidth } = await page.evaluate(() => ({
    clientWidth: document.documentElement.clientWidth,
    scrollWidth: document.documentElement.scrollWidth,
  }))
  if (scrollWidth > clientWidth) {
    overflowed = true
    console.error(`✗ ${shot.name}: tràn ngang ${scrollWidth}px > ${clientWidth}px`)
  }

  await page.screenshot({ path: `${OUT}/${shot.name}.png` })
  console.log(`✓ ${shot.name}.png (${shot.width}×${shot.height}, ${shot.theme})`)
  await page.close()
}

await browser.close()
process.exit(overflowed ? 1 : 0)
