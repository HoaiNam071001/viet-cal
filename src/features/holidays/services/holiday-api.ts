import type { Holiday } from '../types'

/**
 * Remote source: Nager.Date — free, key-less, CORS-enabled and documented at
 * https://date.nager.at/swagger/index.html. It only knows the *public* holidays
 * of Vietnam, so it complements (never replaces) the local rules.
 */
const ENDPOINT = 'https://date.nager.at/api/v3/PublicHolidays'
const COUNTRY = 'VN'
const TIMEOUT_MS = 6000

interface NagerHoliday {
  date: string
  localName: string
  name: string
  countryCode: string
  global: boolean
  types?: string[]
}

export async function fetchRemoteHolidays(year: number, signal?: AbortSignal): Promise<Holiday[]> {
  const controller = new AbortController()
  const timeout = setTimeout(() => controller.abort(), TIMEOUT_MS)
  signal?.addEventListener('abort', () => controller.abort(), { once: true })

  try {
    const response = await fetch(`${ENDPOINT}/${year}/${COUNTRY}`, {
      signal: controller.signal,
      headers: { accept: 'application/json' },
    })
    if (!response.ok) throw new Error(`Holiday API responded ${response.status}`)

    const data = (await response.json()) as NagerHoliday[]
    return data.map((item) => ({
      id: `remote-${item.date}-${item.name}`,
      name: item.localName || item.name,
      localName: item.name,
      date: item.date,
      country: item.countryCode,
      type: 'national' as const,
      isPublicHoliday: true,
      source: 'remote' as const,
    }))
  } finally {
    clearTimeout(timeout)
  }
}
