import { simple } from './model.ts'
import type { AtlasSnapshot, AtlasTrain, Operator, ServiceFamily, TrainPosition } from './model.ts'
import { asNumber, asRecord, asText, company, isCancelled, isFreshAt, point, readJson, serviceNumber, serviceRoute, trainNumber } from './sourceFields.ts'
import { loadStationBoards, supplementWithStationBoards } from './stationBoards.ts'

const sourceLookup = 'https://trenalia.org/api/v1/trains?group=ave,avlo,avant,alvia,euromed,intercity,regional,md,ouigo,iryo&limit=1000'
const gpsLookup = 'https://gtfsrt.renfe.com/vehicle_positions_LD.json'
const gpsBackupLookup = 'https://trenalia.org/gtfs-rt/vehicle-positions.json'
const attributionDefault = 'Trenalia, a partir de datos de Renfe y Adif. Uso informativo.'

function unixMs(value: unknown) {
  if (typeof value !== 'number' && !(typeof value === 'string' && /^\d+$/.test(value))) return null
  const seconds = Number(value)
  return Number.isFinite(seconds) && seconds > 0 ? seconds * 1000 : null
}

function serviceFamily(operator: Operator, group: string, product: string): ServiceFamily | null {
  if (operator !== 'renfe') return 'alta-velocidad'
  if (/^(ave|avlo|avant)\b/.test(product) || ['ave', 'avlo', 'avant'].includes(group)) return 'alta-velocidad'
  if (/^(alvia|intercity|euromed)\b/.test(product) || ['alvia', 'intercity', 'euromed'].includes(group)) return 'larga-distancia'
  if (/^(regional|media distancia)\b/.test(product) || ['md', 'regional'].includes(group)) return 'regional'
  return null
}

function indexGps(document: unknown, now: number, source: 'Renfe' | 'Trenalia') {
  const feed = asRecord(document)
  const timestamp = unixMs(asRecord(feed.header).timestamp)
  const available = timestamp !== null && isFreshAt(timestamp, now) && Array.isArray(feed.entity)
  const positions = new Map<string, TrainPosition>()
  const ambiguous = new Set<string>()
  if (available && timestamp !== null && Array.isArray(feed.entity)) {
    for (const item of feed.entity) {
      const vehicle = asRecord(asRecord(item).vehicle)
      const descriptor = asRecord(vehicle.vehicle)
      const id = asText(descriptor.id) ?? asText(descriptor.label)
      const position = asRecord(vehicle.position)
      const coordinates = point(position.latitude, position.longitude)
      const observedTime = unixMs(vehicle.timestamp)
      if (!id || !coordinates || (observedTime !== null && !isFreshAt(observedTime, now))) continue
      const key = trainNumber(id)
      const previous = positions.get(key)
      if (previous && (Math.abs(previous.lat - coordinates.lat) > .005 || Math.abs(previous.lon - coordinates.lon) > .005)) ambiguous.add(key)
      positions.set(key, { ...coordinates, kind: 'gps', source, timestamp: observedTime ?? timestamp, timestampKind: observedTime && source === 'Renfe' ? 'vehicle' : 'feed' })
    }
  }
  for (const key of ambiguous) positions.delete(key)
  return { available, positions }
}

export function normalizeSnapshot(trenalia: unknown, renfe: unknown, now = Date.now(), gpsBackup?: unknown): AtlasSnapshot {
  const payload = asRecord(trenalia)
  const generatedAt = Date.parse(asText(payload.generatedAt) ?? '')
  if (!Number.isFinite(generatedAt) || generatedAt - now > 60_000 || !Array.isArray(payload.trains)) throw new Error('Invalid Trenalia snapshot')
  const primaryGps = indexGps(renfe, now, 'Renfe')
  const gps = primaryGps.available ? primaryGps : indexGps(gpsBackup, now, 'Trenalia')
  const trains = new Map<string, AtlasTrain>()
  for (const item of payload.trains) {
    const row = asRecord(item)
    const operator = company(row)
    const number = asText(row.id)
    const service = asText(row.product)
    if (!operator || !number || !service) continue
    const family = serviceFamily(operator, simple(asText(row.group) ?? ''), simple(service))
    if (!family) continue
    const route = serviceRoute(row)
    if (!route) continue
    const { corridor, direction, origin, destination } = route

    const cancelled = isCancelled(row)
    const scheduled = row.scheduled === true
    const reportedBy = simple(asText(row.delaySource) ?? '')
    const delaySource = reportedBy === 'renfe' ? 'Renfe' : reportedBy === 'adif' ? 'Adif' : null
    const reportedDelay = delaySource && !cancelled && !scheduled ? asNumber(row.delay) : null
    const next = asRecord(row.next)
    const estimate = row.estimated === true && reportedDelay !== null ? point(row.lat, row.lon) : null
    const observed = operator === 'renfe' && row.live === true && row.estimated === false && isFreshAt(generatedAt, now)
      ? gps.positions.get(trainNumber(number)) : null
    const position = cancelled || scheduled ? null : observed ?? (estimate ? { ...estimate, kind: 'estimated', source: 'Trenalia', timestamp: generatedAt, timestampKind: 'feed' } as const : null)
    const key = `${operator}:${serviceNumber(operator, number)}:${corridor}:${direction}`
    if (trains.has(key)) continue
    trains.set(key, {
      key, number, operator, service: operator === 'renfe' ? service : operator === 'ouigo' ? 'OUIGO' : 'iryo', family,
      corridor, origin, destination, position,
      status: cancelled ? 'cancelled' : scheduled ? 'scheduled' : position || reportedDelay !== null ? 'tracked' : 'unknown',
      delay: reportedDelay, delaySource: reportedDelay === null ? null : delaySource,
      nextStop: cancelled ? null : asText(next.name), arrival: cancelled ? null : asText(next.arrival),
    })
  }
  return { generatedAt, gpsAvailable: gps.available, attribution: asText(payload.attribution) ?? attributionDefault, trains: [...trains.values()] }
}

async function loadServiceSnapshot() {
  const [service, gps] = await Promise.all([readJson(sourceLookup), readJson(gpsLookup, 3_500).catch(() => null)])
  const now = Date.now()
  const primary = normalizeSnapshot(service, gps, now)
  if (primary.gpsAvailable) return primary
  // Use only the provider's dedicated GPS feed, never its feed of estimates.
  const backup = await readJson(gpsBackupLookup, 3_500).catch(() => null)
  return normalizeSnapshot(service, gps, Date.now(), backup)
}

export async function loadAtlasSnapshot() {
  const [snapshot, boards] = await Promise.all([loadServiceSnapshot(), loadStationBoards()])
  return supplementWithStationBoards(snapshot, boards)
}
