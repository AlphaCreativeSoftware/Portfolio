import { speedStaleAfter } from './model.ts'
import type { AtlasTrain, Coordinates, TrainSpeed } from './model.ts'

type Fix = Coordinates & { timestamp: number }
export type GpsHistory = ReadonlyMap<string, readonly Fix[]>
const historyWindow = 110_000
const maxGap = 55_000

function distance(a: Coordinates, b: Coordinates) {
  const radians = Math.PI / 180
  const dLat = (b.lat - a.lat) * radians
  const dLon = (b.lon - a.lon) * radians
  const chord = Math.sin(dLat / 2) ** 2 + Math.cos(a.lat * radians) * Math.cos(b.lat * radians) * Math.sin(dLon / 2) ** 2
  return 2 * 6371 * Math.asin(Math.sqrt(Math.min(1, chord)))
}

function estimate(samples: readonly Fix[]): TrainSpeed | undefined {
  if (samples.length !== 3) return undefined
  const [a, b, c] = samples
  const gaps = [b.timestamp - a.timestamp, c.timestamp - b.timestamp]
  if (c.timestamp - a.timestamp < 30_000 || gaps.some((gap) => gap < 8_000 || gap > maxGap)) return undefined
  const lengths = [distance(a, b), distance(b, c)]
  const rates = lengths.map((km, i) => km * 3_600_000 / gaps[i])
  // Ignore stationary jitter, reversals and implausible jumps rather than filling with zero.
  if (rates.some((rate) => rate < 5 || rate > 360) || Math.abs(rates[1] - rates[0]) > 80
    || distance(a, c) < (lengths[0] + lengths[1]) * .65) return undefined
  const kmh = Math.round((lengths[0] + lengths[1]) * 3_600_000 / (c.timestamp - a.timestamp) / 5) * 5
  return { kmh, kind: 'estimated', timestamp: c.timestamp }
}

export function readGpsSpeeds(trains: readonly AtlasTrain[], history: GpsHistory, now: number) {
  const next = new Map<string, readonly Fix[]>()
  const enriched = trains.map((train) => {
    const fix = train.position
    if (train.operator !== 'renfe' || train.status !== 'tracked' || fix?.kind !== 'gps' || fix.source !== 'Renfe'
      || fix.timestampKind !== 'vehicle' || fix.timestamp > now + 5_000 || now - fix.timestamp > speedStaleAfter) return train

    const reported = fix.reportedKmh
    const reportedSpeed = typeof reported === 'number' && Number.isFinite(reported) && reported >= 0 && reported <= 360
      ? { kmh: reported, kind: 'reported', timestamp: fix.timestamp } as const : undefined
    if (!fix.tripId) return reportedSpeed ? { ...train, speed: reportedSpeed } : train

    const key = `${train.key}:${fix.tripId}`
    const previous = history.get(key)?.filter((sample) => now - sample.timestamp <= historyWindow) ?? []
    const last = previous.at(-1)
    // Cached API responses must not add samples or rewind the estimate.
    const samples = !last || last.timestamp < fix.timestamp
      ? [...previous, { lat: fix.lat, lon: fix.lon, timestamp: fix.timestamp }].slice(-3) : previous
    next.set(key, samples)
    const speed = reportedSpeed ?? (samples.at(-1)?.timestamp === fix.timestamp ? estimate(samples) : undefined)
    return speed ? { ...train, speed } : train
  })
  return { trains: enriched, history: next }
}
