/**
 * Minimal PWA wiring: register the service worker in production builds only,
 * so dev-server assets are never cached.
 */
export function registerServiceWorker(): void {
  if (!import.meta.env.PROD || !('serviceWorker' in navigator)) return

  window.addEventListener('load', () => {
    navigator.serviceWorker.register('/sw.js').catch(() => {
      /* offline support is a bonus, never a hard requirement */
    })
  })
}
