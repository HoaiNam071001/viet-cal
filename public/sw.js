/*
 * Deliberately small service worker.
 *
 * - App shell (HTML/JS/CSS/icons): cache-first with a background refresh, so the
 *   calendar, the lunar engine and the local holiday rules all work offline.
 * - Holiday API: network-first with a cached fallback; the app also keeps its own
 *   localStorage cache, so this is only a second line of defence.
 */
const VERSION = 'v1'
const SHELL_CACHE = `vietcal-shell-${VERSION}`
const DATA_CACHE = `vietcal-data-${VERSION}`
const SHELL_ASSETS = ['/', '/index.html', '/manifest.webmanifest', '/icon.svg', '/favicon.svg']

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches
      .open(SHELL_CACHE)
      // A missing asset must not abort the whole install.
      .then((cache) => Promise.allSettled(SHELL_ASSETS.map((asset) => cache.add(asset)))),
  )
  self.skipWaiting()
})

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== SHELL_CACHE && key !== DATA_CACHE)
            .map((key) => caches.delete(key)),
        ),
      )
      .then(() => self.clients.claim()),
  )
})

self.addEventListener('fetch', (event) => {
  const request = event.request
  if (request.method !== 'GET') return

  const url = new URL(request.url)

  if (url.hostname === 'date.nager.at') {
    event.respondWith(networkFirst(request))
    return
  }

  if (url.origin !== self.location.origin) return

  // SPA navigations always resolve to the app shell.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request)
        .then((response) => {
          cachePut(SHELL_CACHE, '/index.html', response.clone())
          return response
        })
        .catch(() => caches.match('/index.html').then((cached) => cached || fetch(request))),
    )
    return
  }

  event.respondWith(cacheFirst(request))
})

async function cacheFirst(request) {
  const cached = await caches.match(request)
  if (cached) {
    // Refresh in the background so the next load is up to date.
    fetch(request)
      .then((response) => cachePut(SHELL_CACHE, request, response.clone()))
      .catch(() => {})
    return cached
  }

  const response = await fetch(request)
  cachePut(SHELL_CACHE, request, response.clone())
  return response
}

async function networkFirst(request) {
  try {
    const response = await fetch(request)
    cachePut(DATA_CACHE, request, response.clone())
    return response
  } catch (error) {
    const cached = await caches.match(request)
    if (cached) return cached
    throw error
  }
}

function cachePut(cacheName, request, response) {
  if (!response || response.status !== 200 || response.type === 'opaque') return
  caches.open(cacheName).then((cache) => cache.put(request, response))
}
