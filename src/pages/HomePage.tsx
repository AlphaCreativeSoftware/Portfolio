import { useRef } from 'react'
import { SiteLayout } from '../components/layout/SiteLayout'
import { useSectionNavigation } from '../shared/hooks/useSectionNavigation'
import { usePageAnimations } from '../shared/hooks/usePageAnimations'
import { usePageMetadata } from '../shared/hooks/usePageMetadata'
import { homeNavigation } from '../features/home/data/navigation'
import { HomeHero } from '../features/home/sections/HomeHero'
import { HomeSpaces } from '../features/home/sections/HomeSpaces'
import { HomeContact } from '../features/home/sections/HomeContact'

export function HomePage() {
  const pageRef = useRef<HTMLElement>(null)
  const navigation = useSectionNavigation(homeNavigation)
  usePageAnimations(pageRef)
  usePageMetadata({ title: 'Mikael Rodríguez — Software, producto y tecnología', description: 'Web personal de Mikael Rodríguez. Acceso al portfolio profesional, productos independientes y publicaciones sobre desarrollo y tecnología.', path: '/' })

  return (
    <SiteLayout navigation={navigation} page="home">
      <main id="main-content" tabIndex={-1} ref={pageRef}>
        <HomeHero navigateTo={navigation.navigateTo} />
        <HomeSpaces />
        <HomeContact />
      </main>
    </SiteLayout>
  )
}
