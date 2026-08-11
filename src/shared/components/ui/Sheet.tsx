import { X } from 'lucide-react'
import { useEffect, useRef, useState, type ReactNode, type TouchEvent } from 'react'
import { createPortal } from 'react-dom'
import { useBodyScrollLock } from '@/shared/hooks/useBodyScrollLock'
import { useIsDesktop } from '@/shared/hooks/useMediaQuery'
import { cn } from '@/shared/utils/cn'
import { Button } from './Button'

interface SheetProps {
  open: boolean
  onClose: () => void
  title?: ReactNode
  children: ReactNode
  /** Desktop presentation: a right-hand slide-over or a centred dialog. */
  desktopVariant?: 'panel' | 'dialog'
  className?: string
}

function useDismissOnEscape(open: boolean, onClose: () => void) {
  useEffect(() => {
    if (!open) return
    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') onClose()
    }
    document.addEventListener('keydown', onKeyDown)
    return () => document.removeEventListener('keydown', onKeyDown)
  }, [open, onClose])
}

/**
 * One overlay primitive with two faces: a drag-to-dismiss bottom sheet on
 * touch/mobile, a slide-over panel (or centred dialog) on desktop.
 */
export function Sheet({ open, onClose, title, children, desktopVariant = 'panel', className }: SheetProps) {
  const isDesktop = useIsDesktop()
  const [dragY, setDragY] = useState(0)
  const dragStart = useRef<number | null>(null)
  const contentRef = useRef<HTMLDivElement>(null)

  useDismissOnEscape(open, onClose)
  useBodyScrollLock(open)

  useEffect(() => {
    if (open) setDragY(0)
  }, [open])

  if (!open) return null

  const onTouchStart = (event: TouchEvent) => {
    dragStart.current = event.touches[0].clientY
  }

  const onTouchMove = (event: TouchEvent) => {
    if (dragStart.current === null) return
    const delta = event.touches[0].clientY - dragStart.current
    // Only follow downward drags, with resistance once past the halfway point.
    setDragY(delta > 0 ? delta : delta / 4)
  }

  const onTouchEnd = () => {
    dragStart.current = null
    if (dragY > 120) onClose()
    else setDragY(0)
  }

  return createPortal(
    <div className="fixed inset-0 z-50 flex" role="dialog" aria-modal="true" aria-label={typeof title === 'string' ? title : undefined}>
      <button
        type="button"
        aria-label="Đóng"
        onClick={onClose}
        className="absolute inset-0 animate-fade-in cursor-default bg-black/35 backdrop-blur-[2px] dark:bg-black/55"
      />

      <div
        ref={contentRef}
        style={!isDesktop && dragY ? { transform: `translateY(${dragY}px)`, transition: 'none' } : undefined}
        className={cn(
          'bg-bg-elevated border-border relative z-10 flex flex-col shadow-panel',
          isDesktop
            ? desktopVariant === 'panel'
              ? 'ml-auto h-full w-[420px] animate-slide-left border-l'
              : 'm-auto max-h-[85vh] w-[min(560px,92vw)] animate-scale-in rounded-4xl border'
            : 'mt-auto max-h-[88svh] w-full animate-slide-up rounded-t-[28px] border-t',
          className,
        )}
      >
        {!isDesktop ? (
          <div
            className="flex shrink-0 justify-center pt-3 pb-1 touch-none"
            onTouchStart={onTouchStart}
            onTouchMove={onTouchMove}
            onTouchEnd={onTouchEnd}
          >
            <span className="bg-border-strong h-1.5 w-11 rounded-full" />
          </div>
        ) : null}

        <div className="flex shrink-0 items-center justify-between gap-3 px-5 pt-3 pb-3">
          {title ? <h2 className="text-text text-lg font-semibold">{title}</h2> : <span />}
          <Button variant="ghost" size="icon-sm" onClick={onClose} aria-label="Đóng">
            <X className="size-4.5" />
          </Button>
        </div>

        <div className="no-scrollbar safe-bottom flex-1 overflow-y-auto overscroll-contain px-5 pb-6">
          {children}
        </div>
      </div>
    </div>,
    document.body,
  )
}
