import type { Coordinates } from './model'
import { corridorIds, corridors, routeNode } from './network'
import type { Corridor, RouteNode } from './network'
import { atlasStations } from './stations'
import type { StationId } from './stations'

export const mapSize = { width: 720, height: 562 }
const west = -10
const north = 44
export function project({ lat, lon }: Coordinates) {
  return { x: (lon - west) * 51, y: (north - lat) * 66 }
}

// Natural Earth 1:110m Admin-0 land borders. Mainland polygons only.
const mainland = {
  portugal: '-9.035,41.881 -8.672,42.135 -8.264,42.28 -8.013,41.791 -7.423,41.792 -7.251,41.918 -6.669,41.883 -6.389,41.382 -6.851,41.111 -6.864,40.331 -7.026,40.185 -7.067,39.712 -7.499,39.63 -7.098,39.03 -7.374,38.373 -7.029,38.076 -7.167,37.804 -7.537,37.429 -7.454,37.098 -7.856,36.838 -8.383,36.979 -8.899,36.869 -8.746,37.651 -8.84,38.266 -9.287,38.358 -9.527,38.737 -9.447,39.392 -9.048,39.755 -8.977,40.159 -8.769,40.761 -8.791,41.184 -8.991,41.543',
  spain: '-7.454,37.098 -7.537,37.429 -7.167,37.804 -7.029,38.076 -7.374,38.373 -7.098,39.03 -7.499,39.63 -7.067,39.712 -7.026,40.185 -6.864,40.331 -6.851,41.111 -6.389,41.382 -6.669,41.883 -7.251,41.918 -7.423,41.792 -8.013,41.791 -8.264,42.28 -8.672,42.135 -9.035,41.881 -8.984,42.593 -9.393,43.027 -7.978,43.748 -6.754,43.568 -5.412,43.574 -4.348,43.403 -3.518,43.456 -1.901,43.423 -1.503,43.034 0.338,42.58 0.702,42.796 1.827,42.343 2.986,42.473 3.039,41.892 2.092,41.226 0.811,41.015 0.721,40.678 0.107,40.124 -0.279,39.31 0.111,38.739 -0.467,38.292 -0.683,37.642 -1.438,37.443 -2.146,36.674 -3.416,36.659 -4.369,36.678 -4.995,36.325 -5.377,35.947 -5.866,36.03 -6.237,36.368 -6.52,36.943',
}

function points(line: string) {
  return line.split(' ').map((pair) => {
    const [lon, lat] = pair.split(',').map(Number)
    const { x, y } = project({ lat, lon })
    return `${x.toFixed(2)},${y.toFixed(2)}`
  }).join(' ')
}

export const land = { spain: points(mainland.spain), portugal: points(mainland.portugal) }

// The 2D fallback uses station-to-station guides, never these as GPS corrections.
const pointFor = (node: RouteNode) => project(atlasStations[node === 'madrid' ? 'atocha' : node])
export const routeGuides = corridorIds.map((id) => {
  const seen = new Set<string>()
  const paths: string[] = []
  for (const path of corridors[id].paths) {
    for (let i = 1; i < path.length; i++) {
      const key = [path[i - 1], path[i]].sort().join(':')
      if (seen.has(key)) continue
      seen.add(key)
      const a = pointFor(path[i - 1])
      const b = pointFor(path[i])
      paths.push(`M${a.x},${a.y}L${b.x},${b.y}`)
    }
  }
  return { id, d: paths.join(' ') }
})

const nodesByCorridor = corridorIds.map((id) => ({ id, nodes: new Set<RouteNode>(corridors[id].paths.flat()) }))
const city = (id: StationId, name: string, dx: number, dy: number, overview = true) => {
  const { lat, lon } = atlasStations[id]
  return { id, name, lat, lon, dx, dy, overview, anchor: dx < 0 ? 'end' as const : 'start' as const,
    corridors: nodesByCorridor.filter(({ nodes }) => nodes.has(routeNode(id))).map(({ id: group }) => group) }
}

export const mapCities = [
  city('atocha', 'Madrid', -12, -11), city('barcelona', 'Barcelona', -10, -13),
  city('valencia', 'València', 12, -7), city('sevilla', 'Sevilla', -10, -10),
  city('zaragoza', 'Zaragoza', 12, -10), city('valladolid', 'Valladolid', 12, -10),
  city('oviedo', 'Oviedo', 12, -8), city('coruna', 'A Coruña', 12, -9),
  city('badajoz', 'Badajoz', -10, 17), city('malaga', 'Málaga', 12, 17),
  city('granada', 'Granada', 12, -8, false), city('cordoba', 'Córdoba', -12, -7, false),
  city('murcia', 'Murcia', -10, 17, false), city('alicante', 'Alicante', 12, 13, false),
  city('albacete', 'Albacete', -9, -10, false), city('castellon', 'Castelló', 12, -8, false),
  city('burgos', 'Burgos', 12, -8, false), city('leon', 'León', -11, 16, false),
  city('ourense', 'Ourense', 12, 17, false), city('vigo', 'Vigo', -12, 16, false),
  city('zamora', 'Zamora', -11, -8, false), city('huesca', 'Huesca', -10, -8, false),
  city('girona', 'Girona', 11, -7, false), city('toledo', 'Toledo', 12, 13, false),
  city('caceres', 'Cáceres', 12, -8, false),
]

export function citiesForMap(corridor: Corridor | 'all') {
  return mapCities.filter((city) => corridor === 'all' ? city.overview : city.corridors.includes(corridor))
}
