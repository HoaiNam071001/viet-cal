import { Download, Share, SquarePlus, X } from 'lucide-react'
import { useLocation } from 'react-router-dom'
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
      aria-label={`Cài đặt ${APP_NAME}`}
    >
      <div className="glass-card glass-card-tinted rounded-3xl p-3.5">
        <div className="flex items-start gap-3">
          <img src="/logo.svg" alt="" width={44} height={44} className="size-11 shrink-0 rounded-xl" />

          <div className="min-w-0 flex-1">
            <p className="text-text text-sm font-semibold">Cài {APP_NAME} vào máy</p>
            {needsManualInstructions ? (
              <p className="text-muted mt-0.5 flex flex-wrap items-center gap-1 text-xs">
                Nhấn <Share className="size-3.5" /> rồi chọn
                <span className="text-text inline-flex items-center gap-1 font-medium">
                  <SquarePlus className="size-3.5" /> Thêm vào MH chính
                </span>
              </p>
            ) : (
              <p className="text-muted mt-0.5 text-xs">
                Mở nhanh như ứng dụng, xem lịch cả khi không có mạng.
              </p>
            )}
          </div>

          <button
            type="button"
            onClick={dismiss}
            aria-label="Bỏ qua"
            className="text-subtle hover:text-text -mt-1 -mr-1 shrink-0 rounded-xl p-1.5 transition-colors"
          >
            <X className="size-4" />
          </button>
        </div>

        {needsManualInstructions ? null : (
          <Button variant="primary" size="sm" className="mt-3 w-full" onClick={install}>
            <Download className="size-4" />
            Cài đặt
          </Button>
        )}
      </div>
    </div>
  )
}
