import { useEffect, useRef, useState } from 'react'
import { Compass, House, Minus, Plus } from 'lucide-react'
import { Map as LibreMap, Marker } from 'maplibre-gl'
import type { LngLatBoundsLike, MapSourceDataEvent } from 'maplibre-gl'
import { corridors, operators } from './model'
import type { AtlasMapProps } from './AtlasMap'
import { atlasLayers, atlasMapStyle, atlasRelief } from './mapStyle'
import 'maplibre-gl/dist/maplibre-gl.css'

const peninsula: LngLatBoundsLike = [[-9.58, 35.97], [3.36, 43.85]]
const overviewPadding = 22
const prefersReducedMotion = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches
const darkMode = () => document.documentElement.dataset.appearance === 'dark'

type TrainMarker = { marker: Marker; button: HTMLButtonElement; label: HTMLSpanElement }

function createMarker(key: string, onSelect: (key: string) => void): TrainMarker {
  const button = document.createElement('button')
  const dot = document.createElement('span')
  const label = document.createElement('span')
  button.type = 'button'
  button.className = 'atlas-pin'
  button.dataset.train = key
  dot.className = 'atlas-pin-dot'
  label.className = 'atlas-pin-label'
  dot.setAttribute('aria-hidden', 'true')
  label.setAttribute('aria-hidden', 'true')
  button.append(dot, label)
  button.addEventListener('click', () => onSelect(key))
  return { button, label, marker: new Marker({ element: button, subpixelPositioning: true }) }
}

export default function AtlasMap3D({ trains, selected, onSelect, onUnavailable }: AtlasMapProps & { onUnavailable: () => void }) {
  const host = useRef<HTMLDivElement>(null)
  const mapRef = useRef<LibreMap | null>(null)
  const markers = useRef(new Map<string, TrainMarker>())
  const latestTrains = useRef(trains)
  const selectRef = useRef(onSelect)
  const [ready, setReady] = useState(false)
  const [tilted, setTilted] = useState(false)

  useEffect(() => {
    if (!host.current) return
    let map: LibreMap
    try {
      map = new LibreMap({
        container: host.current,
        style: atlasMapStyle(darkMode()),
        bounds: peninsula,
        fitBoundsOptions: { padding: overviewPadding },
        minZoom: 3, maxZoom: 14, maxPitch: 55,
        attributionControl: false, renderWorldCopies: false, cooperativeGestures: true,
        maxTileCacheSize: 64,
        locale: {
          'CooperativeGesturesHandler.WindowsHelpText': 'Usa Ctrl y la rueda para ampliar el mapa',
          'CooperativeGesturesHandler.MacHelpText': 'Usa ⌘ y la rueda para ampliar el mapa',
          'CooperativeGesturesHandler.MobileHelpText': 'Mueve el mapa con dos dedos',
        },
      })
    } catch {
      onUnavailable()
      return
    }
    mapRef.current = map
    map.getCanvas().setAttribute('aria-label', 'Mapa de ferrocarriles en España peninsular')

    let styleReady = false
    let mapped = false
    let reliefEnabled = false
    let reliefFailed = false
    const available = () => {
      if (styleReady && mapped) setReady(true)
    }
    const timeout = window.setTimeout(() => { if (!mapped || !styleReady) onUnavailable() }, 12_000)
    function baseTile(event: MapSourceDataEvent) {
      // Vector tiles report a tile payload; source-level `content` is metadata, not a tile success.
      if (event.sourceId !== 'cnig' || !event.tile) return
      mapped = true
      available()
    }
    const repaint = () => {
      if (!styleReady) return
      for (const layer of atlasLayers(darkMode())) {
        if (!('paint' in layer) || !layer.paint) continue
        for (const [property, value] of Object.entries(layer.paint)) {
          if (typeof value === 'string') map.setPaintProperty(layer.id, property, value)
        }
      }
    }
    function relief() {
      if (!styleReady || reliefFailed) return
      const enable = map.getZoom() >= 8 && map.getPitch() >= 20
      if (enable === reliefEnabled) return
      if (enable && !map.getSource('relief')) map.addSource('relief', atlasRelief)
      reliefEnabled = enable
      map.setTerrain(enable ? { source: 'relief', exaggeration: .55 } : null)
    }
    map.on('sourcedata', baseTile)
    map.once('load', () => { styleReady = true; repaint(); available() })
    map.on('zoom', relief)
    map.on('pitch', relief)
    map.on('pitchend', () => setTilted(map.getPitch() > 10))
    map.on('webglcontextlost', onUnavailable)
    map.on('error', ({ error }) => {
      // A failed terrain tile must not take the base map or train list offline.
      if (reliefEnabled && /mapterhorn/i.test(error.message)) {
        reliefFailed = true
        reliefEnabled = false
        map.setTerrain(null)
      }
    })
    const theme = new MutationObserver(repaint)
    theme.observe(document.documentElement, { attributes: true, attributeFilter: ['data-appearance'] })
    return () => {
      clearTimeout(timeout)
      theme.disconnect()
      for (const { marker } of markers.current.values()) marker.remove()
      markers.current.clear()
      mapRef.current = null
      map.remove()
    }
  }, [onUnavailable])

  useEffect(() => { latestTrains.current = trains; selectRef.current = onSelect }, [trains, onSelect])

  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    const active = new Set<string>()
    for (const { key, number, operator, position, corridor } of trains) {
      if (!position) continue
      active.add(key)
      let item = markers.current.get(key)
      if (!item) {
        item = createMarker(key, (id) => selectRef.current(id))
        markers.current.set(key, item)
        item.marker.setLngLat([position.lon, position.lat]).addTo(map)
      } else {
        const old = item.marker.getLngLat()
        if (old.lng !== position.lon || old.lat !== position.lat) item.marker.setLngLat([position.lon, position.lat])
      }
      item.button.dataset.operator = operator
      item.button.dataset.kind = position.kind
      item.button.setAttribute('aria-label', `${operators[operator]} ${number}, ${corridors[corridor].label}, ${position.kind === 'gps' ? 'GPS' : 'posición estimada'}`)
      item.button.setAttribute('aria-pressed', String(key === selected))
      item.label.textContent = `${operators[operator]} ${number}`
    }
    for (const [key, { marker }] of markers.current) {
      if (active.has(key)) continue
      marker.remove()
      markers.current.delete(key)
    }
  }, [trains, selected, ready])

  // A new selection, not a polling update, owns the camera.
  useEffect(() => {
    const map = mapRef.current
    if (!map || !ready) return
    map.stop()
    if (!selected) return
    const position = latestTrains.current.find((train) => train.key === selected)?.position
    if (!position) return
    const reduced = prefersReducedMotion()
    const scene = host.current?.parentElement
    if (scene && window.matchMedia('(max-width: 760px)').matches && scene.getBoundingClientRect().bottom < 220) {
      scene.scrollIntoView({ block: 'start', behavior: reduced ? 'instant' : 'smooth' })
    }
    const center: [number, number] = [position.lon, position.lat]
    map.flyTo({ center, zoom: 10.7, pitch: 47, bearing: -10, duration: 1150, curve: 1.32, animate: !reduced })
  }, [ready, selected])

  function home() {
    mapRef.current?.fitBounds(peninsula, { pitch: 0, bearing: 0, padding: overviewPadding, duration: prefersReducedMotion() ? 0 : 620 })
  }

  function zoom(amount: number) {
    const map = mapRef.current
    if (map) map.zoomTo(map.getZoom() + amount, { duration: prefersReducedMotion() ? 0 : 230 })
  }

  function togglePitch() {
    const map = mapRef.current
    if (map) map.easeTo({ pitch: map.getPitch() > 10 ? 0 : 47, duration: prefersReducedMotion() ? 0 : 440 })
  }

  return <div className="atlas-map atlas-map-live">
    <div className="atlas-map-scene" role="region" aria-label="Visor interactivo de Atlas AV" aria-busy={!ready}>
      <div ref={host} className="atlas-map-canvas" />
      <span className="atlas-map-chip"><Compass size={14} aria-hidden="true" /> España peninsular</span>
      {!ready && <div className="atlas-map-loading" role="status">Cargando cartografía…</div>}
      <div className="atlas-map-controls" role="group" aria-label="Controles del mapa">
        <button type="button" aria-label="Acercar mapa" title="Acercar" disabled={!ready} onClick={() => zoom(1)}><Plus size={16} /></button>
        <button type="button" aria-label="Alejar mapa" title="Alejar" disabled={!ready} onClick={() => zoom(-1)}><Minus size={16} /></button>
        <button type="button" aria-label="Perspectiva 3D" aria-pressed={tilted} title="Perspectiva 3D" disabled={!ready} onClick={togglePitch}>3D</button>
        <button type="button" aria-label="Volver a la vista general" title="Vista general" disabled={!ready} onClick={home}><House size={15} /></button>
      </div>
      <div className="atlas-map-credits">
        <a href="https://www.ign.es/web/ign/portal/estilos-de-los-servicios-de-teselas-vectoriales" target="_blank" rel="noreferrer">© IGN/CNIG</a>
        <a href="https://mapterhorn.com/attribution/" target="_blank" rel="noreferrer">© Mapterhorn</a>
      </div>
    </div>
    <div className="atlas-map-legend">
      <span><i className="atlas-legend-gps" /> GPS</span>
      <span><i className="atlas-legend-estimate" /> Estimada</span>
      <span>Vías cartográficas</span>
    </div>
  </div>
}
