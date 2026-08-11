import { useCallback, useEffect, useState } from 'react'
import { readStorage, writeStorage } from '@/shared/hooks/useLocalStorage'

/** Chromium's install event — still not in lib.dom. */
interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>
}

const DISMISSED_KEY = 'vietcal:install-dismissed'
/** Ask again a week after the user brushes the banner away. */
const SNOOZE_MS = 7 * 24 * 60 * 60 * 1000

function isStandalone(): boolean {
  return (
    window.matchMedia('(display-mode: standalone)').matches ||
    // iOS Safari reports installed apps here instead.
    (window.navigator as { standalone?: boolean }).standalone === true
  )
}

function isIos(): boolean {
  return /iphone|ipad|ipod/i.test(window.navigator.userAgent)
}

export interface InstallPromptState {
  /** Whether a banner should be offered at all. */
  canInstall: boolean
  /** iOS has no install event — show the "Chia sẻ → Thêm vào MH chính" hint instead. */
  needsManualInstructions: boolean
  install: () => Promise<void>
  dismiss: () => void
}

/**
 * Wraps `beforeinstallprompt` and adds the iOS fallback, dismissal memory and
 * the "already installed" check.
 */
export function useInstallPrompt(): InstallPromptState {
  const [deferred, setDeferred] = useState<BeforeInstallPromptEvent | null>(null)
  const [manual, setManual] = useState(false)
  const [dismissed, setDismissed] = useState(true)

  useEffect(() => {
    if (isStandalone()) return

    const snoozedAt = readStorage<number>(DISMISSED_KEY, 0)
    if (Date.now() - snoozedAt < SNOOZE_MS) return
    setDismissed(false)

    // iOS never fires the event, so offer instructions there.
    if (isIos()) setManual(true)

    const onBeforeInstall = (event: Event) => {
      event.preventDefault()
      setDeferred(event as BeforeInstallPromptEvent)
    }
    const onInstalled = () => {
      setDeferred(null)
      setDismissed(true)
    }

    window.addEventListener('beforeinstallprompt', onBeforeInstall)
    window.addEventListener('appinstalled', onInstalled)
    return () => {
      window.removeEventListener('beforeinstallprompt', onBeforeInstall)
      window.removeEventListener('appinstalled', onInstalled)
    }
  }, [])

  const dismiss = useCallback(() => {
    writeStorage(DISMISSED_KEY, Date.now())
    setDismissed(true)
  }, [])

  const install = useCallback(async () => {
    if (!deferred) return
    await deferred.prompt()
    const { outcome } = await deferred.userChoice
    setDeferred(null)
    if (outcome === 'dismissed') dismiss()
  }, [deferred, dismiss])

  return {
    canInstall: !dismissed && (deferred !== null || manual),
    needsManualInstructions: deferred === null && manual,
    install,
    dismiss,
  }
}
