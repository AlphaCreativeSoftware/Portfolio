export const siteAreas = {
  home: { to: '/', label: 'Web principal', shortLabel: 'Principal', sectionsLabel: 'Secciones de la web principal', exact: true },
  tools: { to: '/herramientas', label: 'Herramientas', shortLabel: 'Herramientas', sectionsLabel: 'Secciones de herramientas', exact: false },
  portfolio: { to: '/portfolio', label: 'Portfolio', shortLabel: 'Portfolio', sectionsLabel: 'Secciones del portfolio', exact: true },
} as const

export type SiteArea = keyof typeof siteAreas
