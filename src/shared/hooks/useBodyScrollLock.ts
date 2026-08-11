import { useEffect } from 'react'

let locks = 0

/** Freezes background scrolling while a sheet or modal is open. */
export function useBodyScrollLock(active: boolean): void {
  useEffect(() => {
    if (!active) return
    locks += 1
    const previous = document.body.style.overflow
    document.body.style.overflow = 'hidden'
    return () => {
      locks -= 1
      if (locks === 0) document.body.style.overflow = previous
    }
  }, [active])
}
