import { Download, Share, SquarePlus, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { APP_NAME } from '@/app/config/app.config'
import { Button } from '@/shared/components/ui/Button'
import { useIsDesktop } from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'
import { useInstallPrompt } from '../hooks/useInstallPrompt'

/**
 * Mobile-only install banner. It sits just above the bottom navigation and
 * degrades to iOS "Add to Home Screen" instructions where no install event exists.
 */
export function InstallPrompt({ className }: { className?: string }) {
  const { t } = useTranslation()
  const isDesktop = useIsDesktop()
  const { pathname } = useLocation()
  const { canInstall, needsManualInstructions, install, dismiss } = useInstallPrompt()

  // The home page carries its own install section — one call to action is enough.
  if (isDesktop || pathname === '/' || !canInstall) return null

  return (
    <div
      className={cn(
        'safe-bottom fixed inset-x-3 bottom-17 z-40 animate-slide-up lg:hidden',
        className,
      )}
      role="dialog"
      aria-label={t('pwa.installAria', { appName: APP_NAME })}
    >
      <div className="glass-card glass-card-tinted rounded-3xl p-3.5">
        <div className="flex items-start gap-3">
          <img src="/logo.svg" alt="" width={44} height={44} className="size-11 shrink-0 rounded-xl" />

          <div className="min-w-0 flex-1">
            <p className="text-text text-sm font-semibold">{t('pwa.installTitle', { appName: APP_NAME })}</p>
            {needsManualInstructions ? (
              <p className="text-muted mt-0.5 flex flex-wrap items-center gap-1 text-xs">
                {t('home.install.iosBefore')} <Share className="size-3.5" /> {t('pwa.thenChoose')}
                <span className="text-text inline-flex items-center gap-1 font-medium">
                  <SquarePlus className="size-3.5" /> {t('home.install.iosAdd')}
                </span>
              </p>
            ) : (
              <p className="text-muted mt-0.5 text-xs">{t('pwa.offlineDescription')}</p>
            )}
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label={t('pwa.dismiss')}
            className="text-subtle hover:text-text -mt-1 -mr-1 shrink-0 rounded-xl p-1.5 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {needsManualInstructions ? null : (
          <Button variant="primary" size="sm" className="mt-3 w-full" onClick={install}>
            <Download className="size-4" />
            {t('common.install')}
          </Button>
        )}
      </div>
    </div>
  )
}
