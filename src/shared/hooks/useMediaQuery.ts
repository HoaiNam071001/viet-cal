import { useSyncExternalStore } from 'react'

const queries = new Map<string, MediaQueryList>()

function getMediaQueryList(query: string): MediaQueryList | null {
  if (typeof window === 'undefined' || !window.matchMedia) return null
  let mql = queries.get(query)
  if (!mql) {
    mql = window.matchMedia(query)
    queries.set(query, mql)
  }
  return mql
}

export function useMediaQuery(query: string): boolean {
  return useSyncExternalStore(
    (onChange) => {
      const mql = getMediaQueryList(query)
      mql?.addEventListener('change', onChange)
      return () => mql?.removeEventListener('change', onChange)
    },
    () => getMediaQueryList(query)?.matches ?? false,
    () => false,
  )
}

/** Matches the Tailwind `md` breakpoint — anything below is treated as mobile. */
export const useIsDesktop = () => useMediaQuery('(min-width: 1024px)')
export const useIsTablet = () => useMediaQuery('(min-width: 768px)')
