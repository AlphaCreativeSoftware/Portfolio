import type { NavigationConfig } from '../../../shared/hooks/useSectionNavigation'

export const homeNavigation: NavigationConfig = {
  sectionIds: ['inicio', 'espacios', 'mirada', 'contacto'],
  sectionLabels: { inicio: 'Inicio', espacios: 'Mis espacios', mirada: 'Sobre mí', contacto: 'Contacto' },
  items: [
    { id: 'inicio', label: 'Inicio', number: '01' },
    { id: 'portfolio-page', label: 'Portfolio', number: '02', to: '/portfolio' },
    { id: 'espacios', label: 'Mis espacios', number: '03' },
    { id: 'mirada', label: 'Sobre mí', number: '04' },
    { id: 'contacto', label: 'Contacto', number: '05' },
  ],
}
