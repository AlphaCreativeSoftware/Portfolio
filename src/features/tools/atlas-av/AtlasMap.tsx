import { Compass } from 'lucide-react'
import { useCallback, useEffect, useRef, useState } from 'react'
import type { ComponentType } from 'react'
import { land, mapCities, mapSize, project, routeGuides } from './geography'
import { corridors, operators, staleAfter } from './model'
import type { AtlasTrain, Corridor } from './model'

export type AtlasMapProps = {
  trains: readonly AtlasTrain[]; corridor: Corridor | 'all'; selected: string | null; onSelect: (key: string) => void; now: number;
}

export function AtlasMap(props: AtlasMapProps) {
  const shell = useRef<HTMLDivElement>(null)
  const [Map3D, setMap3D] = useState<ComponentType<AtlasMapProps & { onUnavailable: () => void }> | null>(null)
  const [unavailable, setUnavailable] = useState(false)
  const fallBack = useCallback(() => setUnavailable(true), [])

  useEffect(() => {
    let active = true
    const load = () => {
      void import('./AtlasMap3D').then(({ default: View }) => {
        if (active) setMap3D(() => View)
      }).catch(() => { if (active) fallBack() })
    }
    const root = shell.current
    if (!root || typeof IntersectionObserver === 'undefined') {
      load()
      return () => { active = false }
    }
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      observer.disconnect()
      load()
    }, { rootMargin: '160px' })
    observer.observe(root)
    return () => { active = false; observer.disconnect() }
  }, [fallBack])

  return <div ref={shell} className="atlas-map-shell">
    {Map3D && !unavailable ? <Map3D {...props} onUnavailable={fallBack} /> : <AtlasFlatMap {...props} />}
  </div>
}

function AtlasFlatMap({ trains, corridor, selected, onSelect, now }: AtlasMapProps) {
  return (
    <div className="atlas-map">
      <div className="atlas-map-label"><Compass size={15} aria-hidden="true" /> <span>España peninsular · Vista 2D</span></div>
      <div className="atlas-map-stage">
        <svg className="atlas-basemap" viewBox={`0 0 ${mapSize.width} ${mapSize.height}`} aria-hidden="true">
          <polygon className="atlas-land atlas-land-neighbour" points={land.portugal} />
          <polygon className="atlas-land" points={land.spain} />
          <text className="atlas-land-label" x="166" y="173">PORTUGAL</text>
          <text className="atlas-land-label" x="256" y="338">ESPAÑA</text>
          {Object.entries(routeGuides).map(([id, points]) => (
            <polyline key={id} className="atlas-track" data-muted={corridor !== 'all' && corridor !== id} points={points} />
          ))}
          {mapCities.map(({ name, dx, dy, anchor, ...coordinates }) => {
            const { x, y } = project(coordinates)
            return <g key={name}><circle className="atlas-station" cx={x} cy={y} r={4} /><text className="atlas-city" x={x + dx} y={y + dy} textAnchor={anchor}>{name}</text></g>
          })}
        </svg>
        {trains.map(({ key, number, operator, position, corridor }) => {
          if (!position || now - position.timestamp > staleAfter) return null
          const { x, y } = project(position)
          return (
            <button key={key} type="button" className="atlas-marker" data-operator={operator} data-kind={position.kind}
              style={{ left: `${100 * x / mapSize.width}%`, top: `${100 * y / mapSize.height}%` }}
              aria-label={`${operators[operator]} ${number}, ${corridors[corridor].label}, ${position.kind === 'gps' ? 'GPS' : 'posición estimada'}`}
              aria-pressed={key === selected} onClick={() => onSelect(key)}><span aria-hidden="true" /></button>
          )
        })}
      </div>
      <div className="atlas-map-legend">
        <span><i className="atlas-legend-gps" /> GPS</span>
        <span><i className="atlas-legend-estimate" /> Estimada</span>
        <span>Trazado orientativo</span>
      </div>
    </div>
  )
}
