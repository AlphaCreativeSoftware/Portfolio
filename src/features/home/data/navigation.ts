import type { NavigationConfig } from '../../../shared/hooks/useSectionNavigation'

export const homeNavigation: NavigationConfig = {
  sectionIds: ['inicio', 'espacios', 'contacto'],
  sectionLabels: { inicio: 'Web principal', espacios: 'Áreas', contacto: 'Contacto' },
  items: [
    { id: 'espacios', label: 'Áreas', number: '01' },
    { id: 'contacto', label: 'Contacto', number: '02' },
  ],
}
