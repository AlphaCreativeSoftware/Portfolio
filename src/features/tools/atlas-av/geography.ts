import type { Coordinates, Corridor } from './model'

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

// Geographic station guides, NOT surveyed track geometry or GPS interpolation.
export const routeGuides: Record<Corridor, string> = {
  barcelona: points('-3.691,40.407 -3.125,40.587 -1.970,41.336 -0.911,41.659 0.632,41.620 1.273,41.193 2.140,41.379'),
  valencia: points('-3.682,40.472 -3.691,40.407 -3.633,40.298 -2.144,40.035 -1.281,39.485 -0.382,39.460'),
  sevilla: points('-3.691,40.407 -3.956,38.985 -4.108,38.688 -4.789,37.888 -5.975,37.392'),
}

export const mapCities = [
  { name: 'Madrid', lat: 40.407, lon: -3.691, dx: -12, dy: -11, anchor: 'end' },
  { name: 'Barcelona', lat: 41.379, lon: 2.140, dx: -8, dy: -13, anchor: 'end' },
  { name: 'Valencia', lat: 39.460, lon: -0.382, dx: 12, dy: 16, anchor: 'start' },
  { name: 'Sevilla', lat: 37.392, lon: -5.975, dx: -12, dy: 17, anchor: 'end' },
] as const
