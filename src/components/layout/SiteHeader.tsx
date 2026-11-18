import type { CSSProperties } from 'react'
import type { SectionNavigation } from '../../shared/hooks/useSectionNavigation'
import { AppearanceControls } from '../../features/appearance/AppearanceControls'
import { Link } from 'react-router-dom'
import { SiteDestinations } from './SiteDestinations'
import { siteAreas } from '../../shared/config/areas'
import type { SiteArea } from '../../shared/config/areas'

export function SiteHeader({ navigation, page }: { navigation: SectionNavigation; page: SiteArea }) {
  const { items, scrolled, menuOpen, scrollProgressRef, navigateTo, activeSection, isAtStart, currentSectionLabel, navRef, menuPanelRef, navIndicator, menuButtonRef, setMenuOpen, closeMenu } = navigation
  const { label: pageLabel, shortLabel, sectionsLabel } = siteAreas[page]
  return (
    <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''} ${menuOpen ? 'topbar-menu-open' : ''}`}>
      <span className="scroll-progress" ref={scrollProgressRef} />
      <div className="header-identity">
        <Link className="brand" to="/" aria-label="Ir a la página principal">MR<span>.</span></Link>
        <div className="desktop-site-destinations"><SiteDestinations /></div>
      </div>
      <span className="mobile-section-label" aria-label={isAtStart ? pageLabel : `${pageLabel}: ${currentSectionLabel}`}>
        <strong className="mobile-area-label">{shortLabel}</strong>
        {!isAtStart && (
          <span className="mobile-section-context">
            <span className="mobile-context-divider" aria-hidden="true" />
            <span className="mobile-current-section" key={activeSection} title={currentSectionLabel}>{currentSectionLabel}</span>
          </span>
        )}
      </span>
      <div id="site-navigation" ref={menuPanelRef} className={`site-menu${menuOpen ? ' site-menu-open' : ''}`}>
        <div className="mobile-site-destinations">
          <span className="site-menu-label">Áreas de la web</span>
          <SiteDestinations onNavigate={closeMenu} placement="menu" open={menuOpen} />
          {items.length > 0 && <span className="site-menu-label site-menu-section-label">En esta página</span>}
        </div>
        {items.length > 0 && <nav ref={navRef} className={menuOpen ? 'nav nav-open' : 'nav'} aria-label={sectionsLabel}>
          <span
            className={`nav-indicator ${navIndicator.visible ? 'nav-indicator-visible' : ''} ${navIndicator.moving ? 'nav-indicator-moving' : ''}`}
            style={{
              '--indicator-x': `${navIndicator.x}px`,
              '--indicator-y': `${navIndicator.y}px`,
              '--indicator-width': `${navIndicator.width}px`,
              '--indicator-height': `${navIndicator.height}px`,
            } as CSSProperties}
            aria-hidden="true"
          ><i /></span>
          {items.map(({ id, label, number }) => (
            <a key={id} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'location' : undefined} href={'#' + id} onClick={() => navigateTo(id)}><span>{number}</span>{label}</a>
          ))}
        </nav>}
      </div>
      <div className="header-actions">
        <AppearanceControls />
      </div>
      <button ref={menuButtonRef} className={`menu-button ${menuOpen ? 'menu-button-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="site-navigation">
        <span className="hamburger"><i /><i /><i /></span>
      </button>
      <button className={`nav-backdrop ${menuOpen ? 'nav-backdrop-open' : ''}`} onClick={() => { closeMenu(); window.requestAnimationFrame(() => menuButtonRef.current?.focus()) }} aria-label="Cerrar menú" tabIndex={menuOpen ? 0 : -1} />
    </header>
  )
}
