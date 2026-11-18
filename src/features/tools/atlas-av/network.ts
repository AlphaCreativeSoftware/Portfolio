import type { StationId } from './stations.ts'

// For routing only, both Madrid terminals share a node. Station boards still match the physical station code.
export type RouteNode = Exclude<StationId, 'atocha' | 'chamartin'> | 'madrid'
type CorridorDefinition = { label: string; panels: readonly StationId[]; paths: readonly (readonly RouteNode[])[] }

const south = ['madrid', 'ciudadReal', 'puertollano', 'villanueva', 'cordoba'] as const
const granadaBranch = ['puenteGenil', 'santaAna', 'antequera', 'loja', 'granada'] as const
const alicanteBranch = ['madrid', 'cuenca', 'albacete', 'villena', 'alicante'] as const
const galicia = ['madrid', 'segovia', 'medina', 'zamora', 'sanabria', 'gudina', 'ourense', 'santiago'] as const
const aragon = ['madrid', 'yebes', 'calatayud', 'zaragoza'] as const
const coast = ['aldea', 'vinaros', 'benicarlo', 'oropesaMar', 'benicassim', 'castellon', 'sagunt'] as const

// Each path describes a family of services, not a statement that a given train stops at every node.
export const corridors = {
  andalucia: {
    label: 'Andalucía', panels: ['atocha', 'sevilla', 'malaga', 'granada'],
    paths: [[...south, 'sevilla'], [...south, 'puenteGenil', 'santaAna', 'malaga'], [...south, ...granadaBranch],
      ['sevilla', 'cordoba', 'puenteGenil', 'santaAna', 'malaga'], ['sevilla', 'cordoba', ...granadaBranch],
      ['malaga', 'santaAna', 'antequera', 'loja', 'granada']],
  },
  levante: {
    label: 'Levante', panels: ['chamartin', 'valencia', 'alicante', 'murcia'],
    paths: [['madrid', 'cuenca', 'requena', 'valencia', 'castellon'], [...alicanteBranch, 'elche', 'orihuela', 'murcia']],
  },
  norte: {
    label: 'Norte y Asturias', panels: ['chamartin', 'valladolid', 'burgos', 'oviedo'],
    paths: [['madrid', 'segovia', 'valladolid', 'palencia', 'leon', 'pola', 'mieres', 'oviedo', 'gijon'], ['madrid', 'segovia', 'valladolid', 'burgos']],
  },
  galicia: {
    label: 'Galicia', panels: ['ourense', 'santiago', 'coruna', 'vigo'],
    paths: [[...galicia, 'coruna'], [...galicia, 'vilagarcia', 'pontevedra', 'vigo'], ['coruna', 'santiago', 'vilagarcia', 'pontevedra', 'vigo']],
  },
  'aragon-cataluna': {
    label: 'Aragón y Cataluña', panels: ['atocha', 'zaragoza', 'barcelona'],
    paths: [[...aragon, 'lleida', 'camp', 'barcelona', 'girona', 'figueres'], [...aragon, 'tardienta', 'huesca']],
  },
  mediterraneo: {
    label: 'Mediterráneo', panels: ['barcelona', 'valencia', 'alicante'],
    paths: [['barcelona', 'tarragona', ...coast, 'valencia', 'alicante'], ['camp', ...coast, 'valencia', 'alicante'],
      ['barcelona', 'tarragona', ...coast, 'valenciaNord'], ['camp', ...coast, 'valenciaNord']],
  },
  'toledo-extremadura': {
    label: 'Toledo y Extremadura', panels: ['atocha', 'toledo', 'plasencia', 'badajoz'],
    paths: [['madrid', 'toledo'], ['madrid', 'torrijos', 'talavera', 'oropesaToledo', 'navalmoral', 'plasencia', 'caceres', 'merida', 'badajoz']],
  },
} as const satisfies Record<string, CorridorDefinition>

export type Corridor = keyof typeof corridors
export const corridorIds = Object.keys(corridors) as Corridor[]

export function routeNode(station: StationId): RouteNode {
  return station === 'atocha' || station === 'chamartin' ? 'madrid' : station
}

const pairKey = (a: RouteNode, b: RouteNode) => a < b ? `${a}:${b}` : `${b}:${a}`
const sharedPairs = new Map<string, Corridor>([
  [pairKey('madrid', 'segovia'), 'norte'],
  [pairKey('valencia', 'castellon'), 'mediterraneo'],
])
const byPair = new Map<string, Corridor>()
for (const id of corridorIds) {
  for (const path of corridors[id].paths) {
    for (let i = 0; i < path.length; i++) {
      for (const to of path.slice(i + 1)) {
        const key = pairKey(path[i], to)
        const previous = byPair.get(key)
        if (previous && previous !== id) {
          const owner = sharedPairs.get(key)
          if (owner !== previous && owner !== id) throw new Error(`Ambiguous Atlas AV corridor for ${key}`)
          byPair.set(key, owner)
        } else {
          byPair.set(key, id)
        }
      }
    }
  }
}

export function corridorFor(a: RouteNode, b: RouteNode) {
  return byPair.get(pairKey(a, b)) ?? null
}
