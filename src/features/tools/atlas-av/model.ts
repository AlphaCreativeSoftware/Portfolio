export const operators = { renfe: 'Renfe', ouigo: 'OUIGO', iryo: 'iryo' } as const
export type Operator = keyof typeof operators

export const corridors = {
  barcelona: { label: 'Madrid–Barcelona', city: 'Barcelona' },
  valencia: { label: 'Madrid–Valencia', city: 'Valencia' },
  sevilla: { label: 'Madrid–Sevilla', city: 'Sevilla' },
} as const
export type Corridor = keyof typeof corridors
export type ServiceFamily = 'alta-velocidad' | 'larga-distancia' | 'regional'
export type Coordinates = { lat: number; lon: number }

export type TrainPosition = Coordinates & { kind: 'gps' | 'estimated'; source: 'Renfe' | 'Trenalia'; timestamp: number; timestampKind: 'vehicle' | 'feed' }
export type StationTimes = {
  departure?: string
  arrival?: string
  expected?: { time: string; source: 'Adif'; reportedAt: number }
}
export type AtlasTrain = {
  key: string
  number: string
  operator: Operator
  service: string
  family: ServiceFamily
  corridor: Corridor
  origin: string
  destination: string
  position: TrainPosition | null
  status: 'tracked' | 'scheduled' | 'cancelled' | 'unknown'
  delay: number | null
  delaySource: 'Renfe' | 'Adif' | null
  nextStop: string | null
  arrival: string | null
  stationTimes?: StationTimes
}

export type AtlasSnapshot = {
  generatedAt: number
  gpsAvailable: boolean
  attribution: string
  trains: AtlasTrain[]
}

export const atlasEndpoint = '/api/atlas-av'
export const refreshInterval = 30_000
export const staleAfter = 120_000

export function simple(text: string) {
  return text.normalize('NFD').replace(/\p{Diacritic}/gu, '').toLowerCase().trim()
}

const serviceAliases: Record<string, string> = {
  intercity: 'alvia', alvia: 'intercity', euromed: 'ave euromed',
  'ave euromed': 'euromed', regional: 'media distancia', 'media distancia': 'regional',
}

export function matchesSearch(train: AtlasTrain, query: string) {
  const service = simple(train.service)
  const haystack = simple([train.number, operators[train.operator], train.service, serviceAliases[service], train.origin, train.destination].join(' '))
  return simple(query).split(/\s+/).every((term) => haystack.includes(term))
}

export function summarize(trains: readonly AtlasTrain[]) {
  const running = trains.filter((train) => train.status === 'tracked')
  const measured = running.filter((train) => train.delay !== null)
  return {
    gps: running.filter((train) => train.position?.kind === 'gps').length,
    estimated: running.filter((train) => train.position?.kind === 'estimated').length,
    measured: measured.length,
    punctuality: measured.length ? Math.round(100 * measured.filter(({ delay }) => delay! < 5).length / measured.length) : null,
  }
}
