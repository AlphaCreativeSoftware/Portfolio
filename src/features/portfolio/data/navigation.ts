export const sectionIds = ['inicio', 'proyectos', 'experiencia', 'habilidades', 'sobre-mi', 'contacto'] as const

export const sectionLabels: Record<(typeof sectionIds)[number], string> = {
  inicio: 'Inicio',
  proyectos: 'Proyectos',
  experiencia: 'Experiencia',
  habilidades: 'Habilidades',
  'sobre-mi': 'Sobre mí',
  contacto: 'Contacto',
}

export const portfolioNavigation = sectionIds.filter((id) => id !== 'inicio').map((id, index) => ({
  id,
  label: sectionLabels[id],
  number: String(index + 2).padStart(2, '0'),
}))
