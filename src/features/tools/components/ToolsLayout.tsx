import type { ReactNode } from 'react'
import { SiteLayout } from '../../../components/layout/SiteLayout'
import { useSectionNavigation } from '../../../shared/hooks/useSectionNavigation'
import type { NavigationConfig } from '../../../shared/hooks/useSectionNavigation'

const navigationConfig: NavigationConfig = { sectionIds: ['inicio'], sectionLabels: { inicio: 'Inicio' }, items: [] }

export function ToolsLayout({ children, detail = false }: { children: ReactNode; detail?: boolean }) {
  const navigation = useSectionNavigation(navigationConfig)

  return (
    <SiteLayout page="tools" navigation={navigation}>
      <main id="main-content" className={detail ? 'tools-main tools-main-detail' : 'tools-main'} tabIndex={-1}>
        <section id="inicio" aria-labelledby="tools-title">{children}</section>
      </main>
    </SiteLayout>
  )
}
