import type { ReactNode } from 'react'
import type { SectionNavigation } from '../../shared/hooks/useSectionNavigation'
import { AmbientScene } from '../../features/appearance/AmbientScene'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'

type SiteLayoutProps = { children: ReactNode; navigation: SectionNavigation }

export function SiteLayout({ children, navigation }: SiteLayoutProps) {
  return (
    <div className="site-shell">
      <AmbientScene />
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <SiteHeader navigation={navigation} />
      {children}
      <SiteFooter navigateTo={navigation.navigateTo} />
    </div>
  )
}
