import type { ReactNode } from 'react'
import type { SectionNavigation } from '../../shared/hooks/useSectionNavigation'
import { AmbientScene } from '../../features/appearance/AmbientScene'
import { SiteHeader } from './SiteHeader'
import { SiteFooter } from './SiteFooter'
import type { SiteArea } from '../../shared/config/areas'

type SiteLayoutProps = { children: ReactNode; navigation: SectionNavigation; page?: SiteArea }

export function SiteLayout({ children, navigation, page = 'portfolio' }: SiteLayoutProps) {
  return (
    <div className={page === 'home' ? 'site-shell home-shell' : 'site-shell'}>
      <AmbientScene />
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <SiteHeader navigation={navigation} page={page} />
      {children}
      <SiteFooter navigateTo={navigation.navigateTo} />
    </div>
  )
}
