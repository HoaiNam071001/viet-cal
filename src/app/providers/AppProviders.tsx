import type { ReactNode } from 'react'
import { HolidayProvider } from './HolidayProvider'
import { SettingsProvider } from './SettingsProvider'
import { ThemeProvider } from './ThemeProvider'

/** Settings feed the holiday service, so the order matters. */
export function AppProviders({ children }: { children: ReactNode }) {
  return (
    <ThemeProvider>
      <SettingsProvider>
        <HolidayProvider>{children}</HolidayProvider>
      </SettingsProvider>
    </ThemeProvider>
  )
}
