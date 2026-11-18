import type { AtlasSnapshot, AtlasTrain, StationTimes } from './model.ts'
import { simple } from './model.ts'
import { asNumber, asRecord, asText, company, isCancelled, isFreshAt, point, readJson, serviceNumber, serviceRoute, stationCode } from './sourceFields.ts'
import { atlasStations } from './stations.ts'

type StationBoard = { code: string; data: unknown }
const boardCacheDuration = 50_000
let cached: { at: number; boards: StationBoard[] } | undefined
let pending: Promise<StationBoard[]> | undefined

export function loadStationBoards() {
  if (cached && Date.now() - cached.at < boardCacheDuration) return Promise.resolve(cached.boards)
  pending ??= Promise.all(atlasStations.map(async ({ code }) => ({
    code,
    data: await readJson(`https://trenalia.org/api/v1/stations/${code}/board?type=all&limit=120&horizon=120`, 3_500).catch(() => null),
  }))).then((boards) => {
    cached = { boards, at: Date.now() }
    return boards
  }).finally(() => { pending = undefined })
  return pending
}

const clockTime = (value: unknown) => typeof value === 'string' && /^(?:[01]\d|2[0-3]):[0-5]\d$/.test(value) ? value : undefined

function boardTrain(row: Record<string, unknown>, code: string, reportedAt: number, kind: 'departure' | 'arrival'): AtlasTrain | null {
  // Renfe is already covered by the main service and GPS feeds.
  const operator = company(row)
  const number = asText(row.id)
  const route = serviceRoute(row)
  if (!operator || operator === 'renfe' || !number || !route || row.kind !== kind) return null
  const arrivalRow = kind === 'arrival'
  if (stationCode((arrivalRow ? route.to : route.from).code) !== code) return null
  const minutes = asNumber(row.minutes)
  if (minutes !== null && minutes < 0) return null

  const scheduled = clockTime(row.scheduledTime)
  if (!scheduled) return null
  const cancelled = isCancelled(row)
  const delay = arrivalRow && !cancelled && row.scheduled !== true && row.status === 'on_the_way'
    && simple(asText(row.delaySource) ?? '') === 'adif' ? asNumber(row.delay) : null
  const eta = delay !== null ? clockTime(row.estimatedTime) : undefined
  const stationTimes: StationTimes = arrivalRow
    ? { arrival: scheduled, expected: eta ? { time: eta, source: 'Adif', reportedAt } : undefined }
    : { departure: scheduled, arrival: clockTime(row.destScheduled) }
  const rawPosition = asRecord(row.position)
  const estimate = delay !== null && row.estimated === true ? point(rawPosition.lat, rawPosition.lon) : null
  return {
    key: `${operator}:${serviceNumber(operator, number)}:${route.corridor}:${route.direction}`,
    number, operator, service: operator === 'ouigo' ? 'OUIGO' : 'iryo', family: 'alta-velocidad',
    corridor: route.corridor, origin: route.origin, destination: route.destination,
    position: estimate ? { ...estimate, kind: 'estimated', source: 'Trenalia', timestamp: reportedAt, timestampKind: 'feed' } : null,
    status: cancelled ? 'cancelled' : delay !== null ? 'tracked' : 'scheduled',
    delay, delaySource: delay !== null ? 'Adif' : null,
    nextStop: null, arrival: null, stationTimes,
  }
}

function mergeTrain(current: AtlasTrain, incoming: AtlasTrain, reportedAt: number, generatedAt: number): AtlasTrain {
  const times = { ...current.stationTimes }
  const stationTimes = incoming.stationTimes
  if (stationTimes?.departure) times.departure = stationTimes.departure
  if (stationTimes?.arrival && (!stationTimes.departure || !times.arrival)) times.arrival = stationTimes.arrival
  if (stationTimes?.expected && (!times.expected || stationTimes.expected.reportedAt >= times.expected.reportedAt)) times.expected = stationTimes.expected
  if (current.status === 'cancelled' || incoming.status === 'cancelled') return {
    ...current, status: 'cancelled', position: null, delay: null, delaySource: null,
    nextStop: null, arrival: null, stationTimes: { ...times, expected: undefined },
  }
  // A timetable never overrides the operational feed or an observed position.
  const useBoardDelay = incoming.delay !== null && (current.delay === null || reportedAt >= generatedAt)
  return {
    ...current, stationTimes: times,
    status: useBoardDelay ? 'tracked' : current.status,
    delay: useBoardDelay ? incoming.delay : current.delay,
    delaySource: useBoardDelay ? incoming.delaySource : current.delaySource,
    position: current.position ?? incoming.position,
  }
}

export function supplementWithStationBoards(snapshot: AtlasSnapshot, boards: StationBoard[], now = Date.now()): AtlasSnapshot {
  const trains = new Map(snapshot.trains.map((train) => [train.key, train]))
  const attribution = new Set([snapshot.attribution])
  for (const { code, data } of boards) {
    const board = asRecord(data)
    const reportedAt = Date.parse(asText(board.generatedAt) ?? '')
    if (!Number.isFinite(reportedAt) || !isFreshAt(reportedAt, now) || stationCode(asRecord(board.station).code) !== code) continue
    let contributed = false
    for (const [kind, rows] of [['departure', board.departures], ['arrival', board.arrivals]] as const) {
      if (!Array.isArray(rows)) continue
      for (const row of rows) {
        const train = boardTrain(asRecord(row), code, reportedAt, kind)
        if (!train) continue
        contributed = true
        const current = trains.get(train.key)
        trains.set(train.key, current ? mergeTrain(current, train, reportedAt, snapshot.generatedAt) : train)
      }
    }
    const credit = asText(board.attribution)
    if (contributed && credit) attribution.add(credit)
  }
  return { ...snapshot, attribution: [...attribution].join(' · '), trains: [...trains.values()] }
}
