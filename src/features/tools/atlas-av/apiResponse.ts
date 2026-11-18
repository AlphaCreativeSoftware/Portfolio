import { loadAtlasSnapshot } from './sources.ts'
import type { AtlasSnapshot } from './model.ts'

const cacheDuration = 20_000
let cache: { value: AtlasSnapshot; at: number } | undefined
let pending: Promise<AtlasSnapshot> | undefined

function snapshot() {
  if (cache && Date.now() - cache.at < cacheDuration) return Promise.resolve(cache.value)
  pending ??= loadAtlasSnapshot()
    .then((value) => {
      cache = { value, at: Date.now() }
      return value
    })
    .finally(() => { pending = undefined })
  return pending
}

export async function atlasResponse(method: string) {
  if (method !== 'GET') return Response.json({ error: 'Método no permitido' }, { status: 405, headers: { Allow: 'GET' } })
  try {
    return Response.json(await snapshot(), {
      headers: {
        'Cache-Control': 'no-store',
        'Vercel-CDN-Cache-Control': 'public, s-maxage=20, stale-while-revalidate=10',
      },
    })
  } catch {
    return Response.json({ error: 'Fuente temporalmente no disponible' }, { status: 502, headers: { 'Cache-Control': 'no-store' } })
  }
}
