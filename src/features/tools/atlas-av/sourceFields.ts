import { simple, staleAfter } from './model.ts'
import type { Coordinates, Operator } from './model.ts'
import { corridorFor, routeNode } from './network.ts'
import { atlasStations } from './stations.ts'
import type { StationId } from './stations.ts'

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

const stationName = (value: string) => simple(value).replace(/[^a-z0-9]+/g, ' ').trim()
const byCode = new Map<string, StationId>()
const byName = new Map<string, StationId>()
for (const id of Object.keys(atlasStations) as StationId[]) {
  const { code, label, aliases = [], alsoCodes = [] } = atlasStations[id]
  for (const value of [code, ...alsoCodes]) byCode.set(value, id)
  for (const value of [label, ...aliases]) byName.set(stationName(value), id)
}

function terminal(stop: Record<string, unknown>) {
  const code = stationCode(stop.code)
  // An explicit code is authoritative. For example, the conventional Figueres
  // station is not Figueres-Vilafant, even when both are abbreviated as Figueres.
  return code ? byCode.get(code) : byName.get(stationName(asText(stop.name) ?? ''))
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
  const start = terminal(from)
  const end = terminal(to)
  if (!start || !end) return null
  const a = routeNode(start)
  const b = routeNode(end)
  const corridor = corridorFor(a, b)
  if (!corridor) return null
  return { corridor, origin: atlasStations[start].label, destination: atlasStations[end].label, a, b, from, to }
}

export const trainNumber = (id: string) => /^\d+$/.test(id) ? id.replace(/^0+(?=\d)/, '') : id.toLowerCase()
export function serviceKey(operator: Operator, id: string, { a, b }: NonNullable<ReturnType<typeof serviceRoute>>) {
  const number = trainNumber(operator === 'ouigo' ? id.replace(/^TGV\s+(?=\d)/i, '') : id)
  return `${operator}:${number}:${a}:${b}`
}

export function isCancelled(row: Record<string, unknown>) {
  return row.cancelled === true || [row.status, asRecord(row.advisory).kind].some((value) => value === 'canceled' || value === 'cancelled')
}

export function hasIndependentAdif(payload: Record<string, unknown>) {
  const sources = Array.isArray(payload.sources) ? payload.sources.map((value) => simple(asText(value) ?? '').replace(/[^a-z]/g, '')) : []
  return sources.includes('adif') && !sources.includes('radardetrenes')
}

export async function readJson(url: string, timeout = 5_000) {
  const response = await fetch(url, { headers: { Accept: 'application/json' }, signal: AbortSignal.timeout(timeout) })
  if (!response.ok) throw new Error(`Upstream ${response.status}`)
  return response.json() as Promise<unknown>
}
