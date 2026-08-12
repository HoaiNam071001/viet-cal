# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project

Lịch Việt — a mobile-first PWA calendar app for Vietnamese users: solar/lunar calendar views, public
holidays, can-chi (sexagenary cycle), solar terms (tiết khí), solar↔lunar date conversion, holiday
countdowns, sharing a date as an image, and offline support.

## Commands

```bash
npm install
npm run dev          # http://localhost:5173
npm run build        # tsc -b && vite build
npm test              # vitest run (lunar engine + app smoke tests)
npm run test:watch   # vitest, watch mode
npm run lint          # oxlint
npm run preview       # preview production build
npm run screenshots   # regenerate public/screenshots/*.png via puppeteer-core (needs `npm run dev` running)
```

Run a single test file: `npx vitest run src/features/lunar/__tests__/lunar.test.ts`

Test environment: pure logic (`*.test.ts`) runs under `node`; component smoke tests (`*.test.tsx`)
run under `jsdom` (see `environmentMatchGlobs` in `vitest.config.ts`). The `@` alias resolves to `src/`.

## Architecture

Feature-based; business logic lives outside components:

```
src/
├── app/                    # config, providers, router, layout (shell/header/bottom nav)
├── features/
│   ├── lunar/              # lunar algorithm: astronomy → convert → can-chi/solar-term/auspicious-hour
│   ├── holidays/           # rules (VN + international) → service (API + cache + fallback) → hooks
│   ├── calendar/           # grid builder, useCalendarState, Month/Day/Year view, DayDetail
│   ├── date-converter/     # useDateConverter (all validation) + UI
│   ├── search/             # parse-query (text → date) + useSearch + SearchDialog
│   ├── countdown/          # getDaysUntil / formatCountdown + CountdownCard
│   ├── share/              # renders a date as a canvas image + Web Share API
│   ├── pwa/                # useInstallPrompt + install banner (Android/iOS)
│   └── settings/           # settings panel
├── shared/                 # UI kit (Button, Card, Sheet, Segmented…), hooks, utils, types
├── widgets/                # TodayCard, LunarInfoCard, UpcomingHolidaysCard, MiniCalendarCard
├── pages/                  # Home / Calendar / Converter / Holidays / Settings
└── index.css               # design tokens (light + dark) + base layer
```

### Dates and timezone

A "date" in this app is `CivilDate { year, month, day }` — no time, no timezone. All date arithmetic
runs on `Date` objects anchored at UTC (`src/shared/utils/date.ts`); "today" is read via `Intl` with
`Asia/Ho_Chi_Minh`, so the browser's local timezone never shifts the date. The lunar algorithm always
uses a fixed UTC+7 (`VN_UTC_OFFSET`).

### Lunar calendar (`features/lunar`)

Pure module, no React dependency:

- `utils/astronomy.ts` — Julian day, new moon, sun longitude
- `utils/convert.ts` — `solarToLunar`, `lunarToSolar`, `getLunarMonthLength`, `getLeapMonthOfYear`
- `utils/can-chi.ts`, `utils/solar-term.ts`, `utils/auspicious.ts`
- `utils/day-info.ts` — aggregates + memoizes (the month grid re-queries the same date often)

Tests in `src/features/lunar/__tests__/lunar.test.ts` check Tết dates 2023–2027, leap months in
2020/2023/2025, can-chi (anchor 2000-01-01 = Mậu Ngọ), solar terms, and round-trip solar↔lunar every
7 days across 40 years.

### Holidays (`features/holidays`)

```
useHolidays* → HolidayProvider → holiday.service
                                   ├── holiday-rules  (local, always available, computed per year)
                                   ├── holiday-api    (Nager.Date, 6s timeout)
                                   └── holiday-cache  (localStorage, 30-day TTL)
```

Lunar holidays (Tết, Giao thừa, Giỗ Tổ, Trung Thu, Ông Táo…) are declared as lunar-calendar rules and
converted per year — never hard-coded as solar dates. If the API fails or the app is offline, local
rules still cover the data. UI code never calls the API directly — always go through the service/hooks.

### Future extension point (events / reminders / Google Calendar)

`features/calendar/types/event.ts` + `hooks/useEvents.ts` are the intended plug-in point: Day View and
Day Detail already render from `useEventsForDate`, so adding a real event source only requires
swapping the data layer behind that hook.

### Styling / theming

Color tokens are declared in `:root` / `.dark` in `src/index.css` and mapped into Tailwind via
`@theme inline`, so switching theme never triggers a React re-render. `Card variant="glass" | "tinted"`
uses the `.glass-card` class (translucent background + `backdrop-filter`, sheen layer, hairline border).

### PWA

`public/manifest.webmanifest` + `public/sw.js` (cache-first for the app shell, network-first for the
holiday API). The service worker registers only in production builds (`src/pwa.ts`). Offline, the
calendar, lunar info, and all holidays (computed locally) remain available.

The "Install app" banner only shows on mobile: Android/Chrome uses the `beforeinstallprompt` event;
iOS/Safari has no such event, so it shows manual instructions (Share → Add to Home Screen) instead. If
dismissed, it doesn't re-prompt for 7 days; it never prompts once the app is installed.
