import { useRef } from 'react'
import { SiteLayout } from '../components/layout/SiteLayout'
import { useSectionNavigation } from '../shared/hooks/useSectionNavigation'
import { usePageAnimations } from '../shared/hooks/usePageAnimations'
import { portfolioNavigation, sectionIds, sectionLabels } from '../features/portfolio/data/navigation'
import { HeroSection } from '../features/portfolio/sections/HeroSection'
import { Marquee } from '../features/portfolio/sections/Marquee'
import { ProjectsSection } from '../features/portfolio/sections/ProjectsSection'
import { ExperienceSection } from '../features/portfolio/sections/ExperienceSection'
import { SkillsSection } from '../features/portfolio/sections/SkillsSection'
import { AboutSection } from '../features/portfolio/sections/AboutSection'
import { ContactSection } from '../features/portfolio/sections/ContactSection'
import { usePageMetadata } from '../shared/hooks/usePageMetadata'

const navigationConfig = { sectionIds, sectionLabels, items: portfolioNavigation }

export function PortfolioPage() {
  usePageMetadata({ title: 'Portfolio — Mikael Rodríguez', description: 'Proyectos, experiencia y criterio técnico. Software, automatización, datos e IA desarrollados por Mikael Rodríguez.', path: '/portfolio' })
  const pageRef = useRef<HTMLElement>(null)
  const navigation = useSectionNavigation(navigationConfig)
  usePageAnimations(pageRef)

  return (
    <SiteLayout navigation={navigation}>
      <main id="main-content" tabIndex={-1} ref={pageRef}>
        <HeroSection navigateTo={navigation.navigateTo} />
        <Marquee />
        <ProjectsSection navigateTo={navigation.navigateTo} />
        <ExperienceSection />
        <SkillsSection />
        <AboutSection />
        <ContactSection />
      </main>
    </SiteLayout>
  )
}
