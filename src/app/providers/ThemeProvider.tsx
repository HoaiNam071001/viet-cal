import { createContext, useCallback, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import { STORAGE_KEYS } from '@/app/config/app.config'
import { readStorage, writeStorage } from '@/shared/hooks/useLocalStorage'
import type { ThemeMode } from '@/shared/types'

interface ThemeContextValue {
  mode: ThemeMode
  /** What is actually on screen once `system` is resolved. */
  resolved: 'light' | 'dark'
  setMode: (mode: ThemeMode) => void
  toggle: () => void
}

const ThemeContext = createContext<ThemeContextValue | null>(null)

function systemPrefersDark(): boolean {
  return typeof window !== 'undefined' && window.matchMedia('(prefers-color-scheme: dark)').matches
}

function apply(mode: ThemeMode): 'light' | 'dark' {
  const resolved = mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode
  document.documentElement.classList.toggle('dark', resolved === 'dark')
  document
    .querySelector('meta[name="theme-color"]')
    ?.setAttribute('content', resolved === 'dark' ? '#211d24' : '#ffffff')
  return resolved
}

export function ThemeProvider({ children }: { children: ReactNode }) {
  const [mode, setModeState] = useState<ThemeMode>(() => readStorage<ThemeMode>(STORAGE_KEYS.theme, 'system'))
  const [resolved, setResolved] = useState<'light' | 'dark'>(() =>
    (mode === 'system' ? (systemPrefersDark() ? 'dark' : 'light') : mode),
  )

  useEffect(() => {
    setResolved(apply(mode))
    writeStorage(STORAGE_KEYS.theme, mode)
    if (mode !== 'system') return

    const media = window.matchMedia('(prefers-color-scheme: dark)')
    const onChange = () => setResolved(apply('system'))
    media.addEventListener('change', onChange)
    return () => media.removeEventListener('change', onChange)
  }, [mode])

  const setMode = useCallback((next: ThemeMode) => setModeState(next), [])
  const toggle = useCallback(() => setModeState(resolved === 'dark' ? 'light' : 'dark'), [resolved])

  const value = useMemo(() => ({ mode, resolved, setMode, toggle }), [mode, resolved, setMode, toggle])
  return <ThemeContext value={value}>{children}</ThemeContext>
}

export function useTheme(): ThemeContextValue {
  const context = useContext(ThemeContext)
  if (!context) throw new Error('useTheme must be used inside <ThemeProvider>')
  return context
}
