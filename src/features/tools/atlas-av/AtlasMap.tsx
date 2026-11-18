import { Compass } from 'lucide-react'
import { land, mapCities, mapSize, project, routeGuides } from './geography'
import { corridors, operators, staleAfter } from './model'
import type { AtlasTrain, Corridor } from './model'

export function AtlasMap({ trains, corridor, selected, onSelect, now }: {
  trains: readonly AtlasTrain[]; corridor: Corridor | 'all'; selected: string | null; onSelect: (key: string) => void; now: number;
}) {
  return (
    <div className="atlas-map">
      <div className="atlas-map-label"><Compass size={15} aria-hidden="true" /> <span>España peninsular</span></div>
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
