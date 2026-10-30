import { useRef } from 'react'
import { SiteLayout } from '../components/layout/SiteLayout'
import { useSectionNavigation } from '../shared/hooks/useSectionNavigation'
import { usePageAnimations } from '../shared/hooks/usePageAnimations'
import { usePageMetadata } from '../shared/hooks/usePageMetadata'
import { homeNavigation } from '../features/home/data/navigation'
import { HomeHero } from '../features/home/sections/HomeHero'
import { HomeSpaces } from '../features/home/sections/HomeSpaces'
import { HomePerspective } from '../features/home/sections/HomePerspective'
import { HomeContact } from '../features/home/sections/HomeContact'

export function HomePage() {
  const pageRef = useRef<HTMLElement>(null)
  const navigation = useSectionNavigation(homeNavigation)
  usePageAnimations(pageRef)
  usePageMetadata({ title: 'Mikael Rodríguez — Software, ideas y producto', description: 'El espacio personal de Mikael Rodríguez. Software, producto, automatización, datos e IA. Explora mi trabajo y las cosas que construyo.', path: '/' })

  return (
    <SiteLayout navigation={navigation} page="home">
      <main id="main-content" tabIndex={-1} ref={pageRef}>
        <HomeHero navigateTo={navigation.navigateTo} />
        <HomeSpaces />
        <HomePerspective />
        <HomeContact />
      </main>
    </SiteLayout>
  )
}
