import { useRef, type TouchEvent } from 'react'

interface SwipeOptions {
  onSwipeLeft?: () => void
  onSwipeRight?: () => void
  /** Minimum horizontal travel, in px, before it counts as a swipe. */
  threshold?: number
}

/** Horizontal swipe detection for month paging. Ignores mostly-vertical drags. */
export function useSwipe({ onSwipeLeft, onSwipeRight, threshold = 56 }: SwipeOptions) {
  const start = useRef<{ x: number; y: number } | null>(null)

  return {
    onTouchStart: (e: TouchEvent) => {
      const touch = e.touches[0]
      start.current = { x: touch.clientX, y: touch.clientY }
    },
    onTouchEnd: (e: TouchEvent) => {
      if (!start.current) return
      const touch = e.changedTouches[0]
      const dx = touch.clientX - start.current.x
      const dy = touch.clientY - start.current.y
      start.current = null
      if (Math.abs(dx) < threshold || Math.abs(dx) < Math.abs(dy) * 1.5) return
      if (dx < 0) onSwipeLeft?.()
      else onSwipeRight?.()
    },
  }
}
