import type { LayerSpecification, StyleSpecification } from 'maplibre-gl'
import { mapCities } from './geography'

const base = 'cnig'
const palette = {
  light: { water: '#e2eaf1', land: '#f3f5f7', coast: '#b3c2cf', town: '#e3e8ee', road: '#c3ccd6', rail: '#60778e', text: '#2f4359', label: '#f6f8fb' },
  dark: { water: '#0d1724', land: '#182432', coast: '#34475b', town: '#243242', road: '#435469', rail: '#809bb6', text: '#dbe6f2', label: '#182432' },
}

export function atlasLayers(dark: boolean): LayerSpecification[] {
  const c = dark ? palette.dark : palette.light
  return [
    { id: 'water', type: 'background', paint: { 'background-color': c.water } },
    { id: 'land', type: 'fill', source: base, 'source-layer': 'contexto_territorios_pol', paint: { 'fill-color': c.land, 'fill-outline-color': c.coast } },
    { id: 'regions', type: 'line', source: base, 'source-layer': 'comunidad_autonoma_pol', paint: { 'line-color': c.coast, 'line-opacity': .55, 'line-width': .65 } },
    { id: 'urban', type: 'fill', source: base, 'source-layer': 'nucleo_urbano_pol', minzoom: 9, paint: { 'fill-color': c.town } },
    { id: 'lakes', type: 'fill', source: base, 'source-layer': 'contexto_lamina_agua_pol', paint: { 'fill-color': c.water } },
    { id: 'rivers', type: 'line', source: base, 'source-layer': 'hidrografia_lin', minzoom: 10, paint: { 'line-color': c.water, 'line-width': 1.15 } },
    { id: 'roads', type: 'line', source: base, 'source-layer': 'autovia_lin', minzoom: 8, paint: { 'line-color': c.road, 'line-opacity': .65, 'line-width': ['interpolate', ['linear'], ['zoom'], 8, .45, 13, 1.8] } },
    {
      id: 'railway', type: 'line', source: base, 'source-layer': 'ferrocarril_lin', minzoom: 6,
      filter: ['all', ['==', ['get', 'estado'], 'en_uso'], ['==', ['get', 'clase'], 'tren'], ['==', ['get', 'tipo_tramo'], 'troncal']],
      layout: { 'line-cap': 'round', 'line-join': 'round' },
      paint: { 'line-color': c.rail, 'line-opacity': .8, 'line-width': ['interpolate', ['linear'], ['zoom'], 6, .65, 9, 1.25, 13, 2.2] },
    },
    {
      id: 'towns', type: 'symbol', source: base, 'source-layer': 'nombre_poblacion_construccion_pto', minzoom: 9,
      filter: ['==', ['get', 'clase'], 'capital_municipio'],
      layout: { 'text-field': ['get', 'nombre'], 'text-font': ['Roboto Regular'], 'text-size': 11, 'text-padding': 8 },
      paint: { 'text-color': c.text, 'text-halo-color': c.label, 'text-halo-width': 1.2 },
    },
    {
      id: 'station-cities', type: 'symbol', source: 'station-cities',
      layout: { 'text-field': ['get', 'name'], 'text-font': ['Roboto Regular'], 'text-size': 13, 'text-padding': 4, 'text-offset': [0, -.75], 'text-anchor': 'bottom' },
      paint: { 'text-color': c.text, 'text-halo-color': c.label, 'text-halo-width': 1.5 },
    },
  ]
}

export function atlasMapStyle(dark: boolean): StyleSpecification {
  return {
    version: 8,
    glyphs: 'https://vt-mapabase.idee.es/files/styles/fonts/pbf/{fontstack}/{range}.pbf',
    sources: {
      [base]: { type: 'vector', tiles: ['https://vt-mapabase.idee.es/1.0.0/mapabase/{z}/{x}/{y}.pbf'], maxzoom: 14 },
      'station-cities': { type: 'geojson', data: {
        type: 'FeatureCollection',
        features: mapCities.map(({ name, lat, lon }) => ({ type: 'Feature', properties: { name }, geometry: { type: 'Point', coordinates: [lon, lat] } })),
      } },
    },
    layers: atlasLayers(dark),
  }
}

export const atlasRelief = {
  type: 'raster-dem', url: 'https://tiles.mapterhorn.com/tilejson.json', tileSize: 512, encoding: 'terrarium',
} as const
