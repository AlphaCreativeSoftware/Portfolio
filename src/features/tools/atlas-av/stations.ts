export const atlasStations = [
  { code: '60000', city: 'madrid', label: 'Madrid Atocha', slug: '60000-madrid-pta-de-atocha' },
  { code: '17000', city: 'madrid', label: 'Madrid Chamartín', slug: '17000-madrid-chamartin' },
  { code: '71801', city: 'barcelona', label: 'Barcelona Sants', slug: '71801-barcelona-sants' },
  { code: '03216', city: 'valencia', label: 'València Joaquín Sorolla', slug: '03216-valencia-joaquin-sorolla' },
  { code: '51003', city: 'sevilla', label: 'Sevilla Santa Justa', slug: '51003-sevilla-sta.-justa' },
] as const

export function adifArrivals(station: (typeof atlasStations)[number]) {
  return `https://www.adif.es/w/${station.slug}?tipoBusqueda=proximasLlegadas`
}
