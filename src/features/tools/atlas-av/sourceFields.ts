import { simple, staleAfter } from './model.ts'
import type { Coordinates, Corridor, Operator } from './model.ts'
import { atlasStations } from './stations.ts'

export const asRecord = (value: unknown): Record<string, unknown> => value && typeof value === 'object' ? value as Record<string, unknown> : {}
export const asText = (value: unknown) => typeof value === 'string' && value.trim() ? value.trim() : null
export const asNumber = (value: unknown) => typeof value === 'number' && Number.isFinite(value) ? value : null
export const isFreshAt = (timestamp: number, now: number) => now - timestamp <= staleAfter && timestamp - now < 60_000

export function point(lat: unknown, lon: unknown): Coordinates | null {
  const latitude = asNumber(lat)
  const longitude = asNumber(lon)
  return latitude !== null && longitude !== null && latitude >= 35.5 && latitude <= 44 && longitude >= -10 && longitude <= 4
    ? { lat: latitude, lon: longitude } : null
}

export function stationCode(value: unknown) {
  if ((typeof value !== 'string' && typeof value !== 'number') || !/^\d{1,5}$/.test(String(value))) return null
  return String(value).padStart(5, '0')
}

// Match terminals, not arbitrary trains that happen to pass through their cities.
const madridNames = /^(madrid )?(puerta de )?atocha\b|^(madrid )?chamartin\b/
const cities = new Map<string, 'madrid' | Corridor>(atlasStations.map(({ code, city }) => [code, city]))
cities.set('18000', 'madrid')

export function terminal(stop: Record<string, unknown>): 'madrid' | Corridor | null {
  const city = cities.get(stationCode(stop.code) ?? '')
  if (city) return city
  const name = simple(asText(stop.name) ?? '')
  if (madridNames.test(name) || name === 'madrid') return 'madrid'
  if (/^barcelona(\s+-)?\s+sants$|^barcelona$/.test(name)) return 'barcelona'
  if (/^valencia$|^valencia[\s.-]+(j\.?|joaquin)\s+sorolla$/.test(name)) return 'valencia'
  if (/^sevilla(\s+-)?\s+santa justa$|^sevilla$/.test(name)) return 'sevilla'
  return null
}

export function company(row: Record<string, unknown>): Operator | null {
  const normalized = simple(asText(row.company) ?? '')
  if (normalized.startsWith('renfe')) return 'renfe'
  if (normalized.startsWith('ouigo')) return 'ouigo'
  if (normalized === 'ilsa' || normalized.startsWith('iryo')) return 'iryo'
  return null
}

export function serviceRoute(row: Record<string, unknown>) {
  const from = asRecord(row.origin)
  const to = asRecord(row.dest)
  const a = terminal(from)
  const b = terminal(to)
  const corridor = a === 'madrid' ? b : b === 'madrid' ? a : null
  const origin = asText(from.name)
  const destination = asText(to.name)
  if (!corridor || corridor === 'madrid' || !origin || !destination) return null
  return { corridor, origin, destination, direction: a === 'madrid' ? 'madrid' : corridor, from, to }
}

export const trainNumber = (id: string) => /^\d+$/.test(id) ? id.replace(/^0+(?=\d)/, '') : id.toLowerCase()
export const serviceNumber = (operator: Operator, id: string) => trainNumber(operator === 'ouigo' ? id.replace(/^TGV\s+(?=\d)/i, '') : id)

export function isCancelled(row: Record<string, unknown>) {
  return row.cancelled === true || [row.status, asRecord(row.advisory).kind].some((value) => value === 'canceled' || value === 'cancelled')
}

export async function readJson(url: string, timeout = 5_000) {
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(timeout) })
  if (!response.ok) throw new Error(`Upstream ${response.status}`)
  return response.json() as Promise<unknown>
}
