import type { CSSProperties } from 'react'
import type { SectionNavigation } from '../../shared/hooks/useSectionNavigation'
import { AppearanceControls } from '../../features/appearance/AppearanceControls'
import { Link } from 'react-router-dom'

export function SiteHeader({ navigation }: { navigation: SectionNavigation }) {
  const { items, scrolled, menuOpen, scrollProgressRef, navigateTo, activeSection, currentSectionLabel, navRef, navIndicator, menuButtonRef, setMenuOpen, closeMenu } = navigation
  return (
    <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''} ${menuOpen ? 'topbar-menu-open' : ''}`}>
      <span className="scroll-progress" ref={scrollProgressRef} />
      <Link className="brand" to="/" aria-label="Ir a la página principal">MR<span>.</span></Link>
      <span className="mobile-section-label" key={activeSection}>{currentSectionLabel}</span>
      <nav id="site-navigation" ref={navRef} className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
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
        {items.map(({ id, label, number, to }) => to ? (
          <Link key={id} to={to} onClick={closeMenu} className="nav-page-link"><span>{number}</span>{label}</Link>
        ) : (
          <a key={id} className={activeSection === id ? 'active' : ''} aria-current={activeSection === id ? 'page' : undefined} href={'#' + id} onClick={() => navigateTo(id)}><span>{number}</span>{label}</a>
        ))}
      </nav>
      <div className="header-actions">
        <AppearanceControls />
        <a className="availability" href="#contacto" onClick={() => navigateTo('contacto')}><span />Disponible</a>
      </div>
      <button ref={menuButtonRef} className={`menu-button ${menuOpen ? 'menu-button-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="site-navigation">
        <span className="hamburger"><i /><i /><i /></span>
      </button>
      <button className={`nav-backdrop ${menuOpen ? 'nav-backdrop-open' : ''}`} onClick={() => { closeMenu(); window.requestAnimationFrame(() => menuButtonRef.current?.focus()) }} aria-label="Cerrar menú" tabIndex={menuOpen ? 0 : -1} />
    </header>
  )
}
