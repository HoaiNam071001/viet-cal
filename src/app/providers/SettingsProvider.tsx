import { createContext, useContext, useMemo, type ReactNode } from 'react'
import { STORAGE_KEYS } from '@/app/config/app.config'
import { useLocalStorage } from '@/shared/hooks/useLocalStorage'

export interface Settings {
  /** Show the lunar day inside every calendar cell. */
  showLunarInGrid: boolean
  showInternationalHolidays: boolean
  /** Show tiết khí and giờ hoàng đạo in the day detail. */
  showAstrology: boolean
}

export const DEFAULT_SETTINGS: Settings = {
  showLunarInGrid: true,
  showInternationalHolidays: true,
  showAstrology: true,
}

interface SettingsContextValue {
  settings: Settings
  update: <K extends keyof Settings>(key: K, value: Settings[K]) => void
  reset: () => void
}

const SettingsContext = createContext<SettingsContextValue | null>(null)

export function SettingsProvider({ children }: { children: ReactNode }) {
  const [stored, setStored] = useLocalStorage<Settings>(STORAGE_KEYS.settings, DEFAULT_SETTINGS)
  // Merge so settings added in a later release get their default.
  const settings = useMemo(() => ({ ...DEFAULT_SETTINGS, ...stored }), [stored])

  const value = useMemo<SettingsContextValue>(
    () => ({
      settings,
      update: (key, next) => setStored((prev) => ({ ...DEFAULT_SETTINGS, ...prev, [key]: next })),
      reset: () => setStored(DEFAULT_SETTINGS),
    }),
    [settings, setStored],
  )

  return <SettingsContext value={value}>{children}</SettingsContext>
}

export function useSettings(): SettingsContextValue {
  const context = useContext(SettingsContext)
  if (!context) throw new Error('useSettings must be used inside <SettingsProvider>')
  return context
}
