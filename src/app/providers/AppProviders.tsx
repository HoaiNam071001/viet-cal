import type { ReactNode } from 'react'
import { AuthProvider } from './AuthProvider'
import { DiaryProvider } from './DiaryProvider'
import { HolidayProvider } from './HolidayProvider'
import { SettingsProvider } from './SettingsProvider'
import { ThemeProvider } from './ThemeProvider'

/** Settings feed the holiday service, so the order matters. Diary needs auth. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <AuthProvider>
      <DiaryProvider>
        <ThemeProvider>
          <SettingsProvider>
            <HolidayProvider>{children}</HolidayProvider>
          </SettingsProvider>
        </ThemeProvider>
      </DiaryProvider>
    </AuthProvider>
  )
}
