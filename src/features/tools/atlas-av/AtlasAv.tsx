import { useMemo, useState } from 'react'
import { Radio, RefreshCw, Search } from 'lucide-react'
import { AtlasMap } from './AtlasMap'
import { corridors, matchesSearch, operators, staleAfter, summarize } from './model'
import type { AtlasTrain, Corridor, Operator, ServiceFamily } from './model'
import { adifArrivals, atlasStations } from './stations'
import { useAtlasSnapshot } from './useAtlasSnapshot'
import './atlas.css'

const clock = new Intl.DateTimeFormat('es-ES', { timeZone: 'Europe/Madrid', hour: '2-digit', minute: '2-digit', second: '2-digit' })
const noTrains: AtlasTrain[] = []

function delayLabel(train: AtlasTrain) {
  if (train.status === 'cancelled') return 'Cancelado'
  if (train.status === 'scheduled') return 'Programado'
  if (train.delay === null) return 'Sin dato de retraso'
  return train.delay === 0 ? 'En hora' : `${train.delay > 0 ? '+' : '−'}${Math.abs(train.delay)} min`
}

function positionLabel(train: AtlasTrain) {
  if (train.position?.kind === 'gps') return train.position.source === 'Trenalia' ? 'GPS vía Trenalia' : 'GPS'
  if (train.position?.kind === 'estimated') return 'Posición estimada'
  return 'Sin posición'
}

function expectedArrival(train: AtlasTrain, now: number, stale: boolean) {
  const expected = train.stationTimes?.expected
  return !stale && expected && now - expected.reportedAt <= staleAfter ? expected : null
}

function StationLinks({ corridor }: { corridor: Corridor | 'all' }) {
  return <ul className="atlas-station-links" aria-label="Paneles de llegadas de Adif">
    {atlasStations.filter(({ city }) => corridor === 'all' || city === 'madrid' || city === corridor).map((station) => <li key={station.code}>
      <a href={adifArrivals(station)} target="_blank" rel="noreferrer">{station.label}</a>
    </li>)}
  </ul>
}

function TrainDetail({ train, stale, now }: { train: AtlasTrain; stale: boolean; now: number }) {
  const expected = expectedArrival(train, now, stale)
  const times = train.stationTimes
  return (
    <section className="atlas-detail" aria-label="Ficha del tren">
      <p className="atlas-kicker" data-operator={train.operator}>{operators[train.operator]} · {train.number}</p>
      <h3>{train.service}</h3>
      <p>{train.origin} → {train.destination}</p>
      <dl>
        <div><dt>Estado</dt><dd>{delayLabel(train)}{train.delaySource && <small> · {train.delaySource}</small>}</dd></div>
        <div><dt>Posición</dt><dd>{stale ? 'Lectura desactualizada' : positionLabel(train)}</dd></div>
        {train.nextStop && <div><dt>Próxima parada</dt><dd>{train.nextStop}{train.arrival && !times?.arrival && <small> · {train.arrival}</small>}</dd></div>}
        {times?.departure && <div><dt>Salida programada</dt><dd>{times.departure}</dd></div>}
        {times?.arrival && <div><dt>Llegada programada</dt><dd>{times.arrival}</dd></div>}
        {expected && <div><dt>Llegada prevista</dt><dd>{expected.time} <small>· {expected.source} vía Trenalia</small></dd></div>}
        {train.position && <div><dt>{train.position.timestampKind === 'vehicle' ? 'Hora GPS' : 'Hora del feed'}</dt><dd>{clock.format(train.position.timestamp)}</dd></div>}
      </dl>
    </section>
  )
}

export default function AtlasAv() {
  const { snapshot, now, busy, failed, refresh } = useAtlasSnapshot()
  const [corridor, setCorridor] = useState<Corridor | 'all'>('all')
  const [operator, setOperator] = useState<Operator | 'all'>('all')
  const [family, setFamily] = useState<ServiceFamily | 'main' | 'all'>('main')
  const [query, setQuery] = useState('')
  const [selectedKey, setSelectedKey] = useState<string | null>(null)
  const stale = !!snapshot && now - snapshot.generatedAt > staleAfter
  const trains = snapshot?.trains ?? noTrains
  const missingOperator = !!snapshot && (operator === 'ouigo' || operator === 'iryo') && !trains.some((train) => train.operator === operator)
  const results = useMemo(() => trains.filter((train) =>
    (corridor === 'all' || train.corridor === corridor)
    && (operator === 'all' || train.operator === operator)
    && (family === 'all' || train.family === family || (family === 'main' && train.family !== 'regional'))
    && matchesSearch(train, query),
  ).map((train) => train.position && now - train.position.timestamp > staleAfter ? { ...train, position: null } : train), [trains, corridor, operator, family, query, now])
  const selected = results.find((train) => train.key === selectedKey)
  const stats = summarize(stale ? noTrains : results)
  const status = stale ? 'Lectura desactualizada' : failed ? 'Fuente no disponible' : snapshot ? 'Última lectura' : 'Conectando con las fuentes…'

  return (
    <div className="atlas">
      <div className="atlas-toolbar">
        <span className="atlas-status" role="status"><Radio size={16} aria-hidden="true" /> {status}{snapshot && <> · <time dateTime={new Date(snapshot.generatedAt).toISOString()} title="Hora peninsular española">{clock.format(snapshot.generatedAt)}</time></>}</span>
        <button className="atlas-refresh" type="button" onClick={refresh} disabled={busy}><RefreshCw size={15} aria-hidden="true" /> {busy ? 'Actualizando…' : 'Actualizar'}</button>
      </div>
      <div className="atlas-filters" role="group" aria-label="Filtros del mapa">
        <div><label htmlFor="atlas-corridor">Corredor</label><select id="atlas-corridor" value={corridor} onChange={(event) => setCorridor(event.target.value as Corridor | 'all')}><option value="all">Todos</option>{Object.entries(corridors).map(([key, item]) => <option key={key} value={key}>{item.label}</option>)}</select></div>
        <div><label htmlFor="atlas-operator">Operador</label><select id="atlas-operator" value={operator} onChange={(event) => setOperator(event.target.value as Operator | 'all')}><option value="all">Todos</option>{Object.entries(operators).map(([key, label]) => <option key={key} value={key}>{label}</option>)}</select></div>
        <div><label htmlFor="atlas-service">Servicio</label><select id="atlas-service" value={family} onChange={(event) => setFamily(event.target.value as typeof family)}><option value="main">AV y larga distancia</option><option value="alta-velocidad">Alta velocidad</option><option value="larga-distancia">Larga distancia</option><option value="regional">Regional / Media Distancia</option><option value="all">Todos (sin Cercanías)</option></select></div>
        <div><label htmlFor="atlas-query">Buscar tren</label><span className="atlas-search"><Search size={15} aria-hidden="true" /><input id="atlas-query" type="search" value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Número o ruta" /></span></div>
      </div>
      <dl className="atlas-stats" aria-label="Indicadores de la vista filtrada">
        <div><dt>Con GPS</dt><dd>{snapshot?.gpsAvailable && !stale && !missingOperator ? stats.gps : '—'}</dd></div>
        <div><dt>Posición estimada</dt><dd>{snapshot && !stale && !missingOperator ? stats.estimated : '—'}</dd></div>
        <div><dt>Con menos de 5 min de retraso</dt><dd>{stats.punctuality === null ? '—' : `${stats.punctuality}%`} <small>{stats.measured > 0 ? `de ${stats.measured} con dato` : 'sin muestra'}</small></dd></div>
      </dl>
      {failed && snapshot && <p role="status" className="atlas-notice">No se pudo actualizar. Se conserva la última lectura disponible.</p>}
      {snapshot && !stale && !snapshot.gpsAvailable && <p className="atlas-notice">El GPS de Renfe no está disponible o su lectura no es reciente. Los servicios siguen en la lista.</p>}
      <div className="atlas-workspace">
        <AtlasMap trains={stale ? noTrains : results} corridor={corridor} selected={selectedKey} onSelect={setSelectedKey} now={now} />
        <div className="atlas-side">
          {selected && <TrainDetail train={selected} stale={stale} now={now} />}
          <div className="atlas-list-header"><h2>Servicios</h2><span>{snapshot ? results.length : '—'}</span></div>
          {results.length ? <ul className="atlas-train-list" aria-label="Trenes de la selección">
            {results.map((train) => {
              const expected = expectedArrival(train, now, stale)
              const arrival = expected ? `Llegada prevista ${expected.time}` : train.stationTimes?.arrival ? `Llegada programada ${train.stationTimes.arrival}` : null
              return (
                <li key={train.key}>
                  <button type="button" className="atlas-train" aria-pressed={selectedKey === train.key} onClick={() => setSelectedKey(train.key === selectedKey ? null : train.key)}>
                    <span className="atlas-train-identity"><i className="atlas-operator-dot" data-operator={train.operator} /><b>{train.service} {train.number}</b><small>{delayLabel(train)}</small></span>
                    <span className="atlas-train-route">{train.origin} → {train.destination}</span>
                    <small>{stale ? 'Última lectura' : [positionLabel(train), arrival].filter(Boolean).join(' · ')}</small>
                  </button>
                </li>
              )
            })}
          </ul> : <div className="atlas-list-empty">
            <p>{!snapshot ? (failed ? 'No se han podido obtener datos. Prueba a actualizar.' : 'Esperando la primera lectura…') : missingOperator ? `Las fuentes no devolvieron datos de ${operators[operator]} en la última lectura. Puede haber trenes en circulación.` : 'No hay servicios que coincidan con los filtros en la última lectura.'}</p>
            {missingOperator && <><p>Consultar llegadas en Adif:</p><StationLinks corridor={corridor} /></>}
          </div>}
        </div>
      </div>
      <div className="atlas-footer">
        <div className="atlas-operators" aria-label="Colores de operadores">{Object.entries(operators).map(([key, name]) => <span key={key}><i className="atlas-operator-dot" data-operator={key} />{name}</span>)}</div>
        {snapshot && <small className="atlas-credit">Datos de <a href="https://trenalia.org/api" target="_blank" rel="noreferrer">Trenalia</a>, a partir de Renfe y Adif</small>}
        <details><summary>Fuentes y cobertura</summary>
          <p>Atlas AV se actualiza cada 30 segundos con la página visible. Un horario programado no confirma que el tren esté en marcha. La llegada prevista solo aparece si la fuente atribuye la actualización a Adif. Una posición estimada no es GPS; los servicios programados no tienen marcador.</p>
          <p>Fuentes: <a href="https://trenalia.org/api" target="_blank" rel="noreferrer">Trenalia</a> (trayectos, paneles de estación y respaldo GPS procesado), <a href="https://data.renfe.com/es/dataset/posicion-vehiculos-av-ld-md" target="_blank" rel="noreferrer">Renfe Operadora</a> (GPS directo, CC BY 4.0) y <a href="https://www.naturalearthdata.com/" target="_blank" rel="noreferrer">Natural Earth</a> (contorno).</p>
          {snapshot && <p>{snapshot.attribution}</p>}
          <p>Información orientativa. Para viajar, confirma los datos con tu operador o en los paneles oficiales de Adif:</p>
          <StationLinks corridor={corridor} />
        </details>
      </div>
    </div>
  )
}
