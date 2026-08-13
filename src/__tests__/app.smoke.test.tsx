// @vitest-environment jsdom
import { cleanup, fireEvent, render, screen, within } from '@testing-library/react'
import { afterEach, beforeAll, describe, expect, it, vi } from 'vitest'
import { MemoryRouter, Route, Routes } from 'react-router-dom'
import { AppProviders } from '@/app/providers/AppProviders'
import { AppShell } from '@/app/layout/AppShell'
import { CalendarPage } from '@/pages/CalendarPage'
import { HomePage } from '@/pages/HomePage'
import { ConverterPage } from '@/pages/ConverterPage'
import { HolidaysPage } from '@/pages/HolidaysPage'
import { SettingsPage } from '@/pages/SettingsPage'

beforeAll(() => {
  // jsdom ships neither matchMedia nor a network stack.
  window.matchMedia = vi.fn().mockImplementation((query: string) => ({
    matches: false,
    media: query,
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    addListener: vi.fn(),
    removeListener: vi.fn(),
    dispatchEvent: vi.fn(),
  }))
  vi.stubGlobal('fetch', vi.fn().mockRejectedValue(new Error('offline')))
})

afterEach(cleanup)

function renderApp(initialPath: string) {
  return render(
    <AppProviders>
      <MemoryRouter initialEntries={[initialPath]}>
        <Routes>
          <Route path="/" element={<AppShell />}>
            <Route index element={<HomePage />} />
            <Route path="calendar/:view" element={<CalendarPage />} />
            <Route path="convert" element={<ConverterPage />} />
            <Route path="holidays" element={<HolidaysPage />} />
            <Route path="settings" element={<SettingsPage />} />
          </Route>
        </Routes>
      </MemoryRouter>
    </AppProviders>,
  )
}

describe('app smoke test', () => {
  it('renders the home page with today and the feature list', () => {
    renderApp('/')

    expect(screen.getByRole('heading', { level: 1 }).textContent).toContain('Diary Calendar')
    expect(screen.getByText('Hôm nay')).toBeTruthy()
    expect(screen.getByText('Âm lịch chuẩn Việt Nam')).toBeTruthy()
    expect(screen.getByText('Mở lịch tháng')).toBeTruthy()
  })

  it('renders the month view with lunar days even when the holiday API is down', () => {
    renderApp('/calendar/month?date=2026-08-11')

    expect(screen.getByText('Tháng 8, 2026')).toBeTruthy()
    expect(screen.getByText('Năm Bính Ngọ')).toBeTruthy()
    // 11/8/2026 is 29/6 âm lịch — the cell shows the lunar day.
    const cell = screen.getByLabelText('Ngày 11 tháng 8 năm 2026')
    expect(within(cell).getByText('11')).toBeTruthy()
    expect(within(cell).getByText('29')).toBeTruthy()
  })

  it('opens the day detail when a day is tapped', () => {
    renderApp('/calendar/month?date=2026-08-11')

    fireEvent.click(screen.getByLabelText('Ngày 2 tháng 9 năm 2026'))
    expect(screen.getAllByText('Quốc khánh').length).toBeGreaterThan(0)
    expect(screen.getByText('Can chi')).toBeTruthy()
  })

  it('renders the day and year views', () => {
    renderApp('/calendar/day?date=2026-08-11')
    expect(screen.getByText('Can chi')).toBeTruthy()
    cleanup()

    renderApp('/calendar/year?date=2026-08-11')
    expect(screen.getByText('Tháng 12')).toBeTruthy()
  })

  it('converts a solar date to a lunar date', () => {
    renderApp('/convert')

    const [day, month, year] = screen.getAllByRole('spinbutton') as HTMLInputElement[]
    fireEvent.change(day, { target: { value: '11' } })
    fireEvent.change(month, { target: { value: '8' } })
    fireEvent.change(year, { target: { value: '2026' } })

    expect(screen.getByText('29/6/2026')).toBeTruthy()
  })

  it('lists holidays and settings without crashing', () => {
    renderApp('/holidays')
    expect(screen.getAllByText('Tết Nguyên Đán').length).toBeGreaterThan(0)
    cleanup()

    renderApp('/settings')
    expect(screen.getByText('Tùy chỉnh giao diện và thông tin hiển thị.')).toBeTruthy()
  })
})
