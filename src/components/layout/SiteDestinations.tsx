import { useLayoutEffect, useRef } from 'react'
import { NavLink, useLocation } from 'react-router-dom'
import { useDestinationMotion } from './DestinationMotionProvider'
import { resolveDestinationSelection } from './destinationMotion'

const destinations = [
  { to: '/', label: 'Web principal' },
  { to: '/portfolio', label: 'Portfolio' },
] as const

/** Page-level navigation stays separate from the current page's section links. */
export function SiteDestinations({ onNavigate, placement = 'desktop', open = true }: { onNavigate?: () => void; placement?: 'desktop' | 'menu'; open?: boolean }) {
  const containerRef = useRef<HTMLElement>(null)
  const indicatorRef = useRef<HTMLSpanElement>(null)
  const previousSelections = useDestinationMotion()
  const { pathname, key: locationKey } = useLocation()

  useLayoutEffect(() => {
    const container = containerRef.current
    const indicator = indicatorRef.current
    if (!container || !indicator || !open) return
    let animation: Animation | undefined
    let disposed = false
    const position = (animate = false) => {
      const active = container.querySelector<HTMLElement>('[aria-current="page"]')
      if (!active || !container.offsetWidth) return
      const selection = resolveDestinationSelection(previousSelections?.current.get(placement), active.dataset.destination ?? pathname, locationKey)
      previousSelections?.current.set(placement, selection)
      const origin = Array.from(container.querySelectorAll<HTMLElement>('[data-destination]'))
        .find((link) => link.dataset.destination === selection.origin) ?? active
      const target = { transform: `translateX(${active.offsetLeft}px)`, width: `${active.offsetWidth}px` }
      animation?.cancel()
      Object.assign(indicator.style, target, { opacity: '1' })
      if (animate && origin !== active && !window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
        animation = indicator.animate([
          { transform: `translateX(${origin.offsetLeft}px)`, width: `${origin.offsetWidth}px` },
          target,
        ], { duration: 440, easing: 'cubic-bezier(.22, 1, .36, 1)' })
        void animation.finished.then(() => { animation = undefined; if (!disposed) position() }, () => {})
      }
    }
    // A closed mobile panel is recreated on the next page. Open it on the
    // current destination, never replay an old selection when reopening it.
    position(placement === 'desktop')
    const observer = new ResizeObserver(() => {
      // ResizeObserver's first delivery must not cancel the entrance motion.
      if (!animation || animation.playState !== 'running') position()
    })
    observer.observe(container)
    for (const link of container.querySelectorAll('.site-destination')) observer.observe(link)
    void document.fonts.ready.then(() => { if (!disposed && animation?.playState !== 'running') position() })
    return () => { disposed = true; animation?.cancel(); observer.disconnect() }
  }, [pathname, locationKey, placement, open, previousSelections])

  return (
    <nav ref={containerRef} className="site-destinations" aria-label="Áreas de la web">
      <span ref={indicatorRef} className="site-destination-indicator" aria-hidden="true" />
      {destinations.map(({ to, label }) => (
        <NavLink key={to} to={to} data-destination={to} end onClick={onNavigate} className={({ isActive }) => `site-destination${isActive ? ' site-destination-active' : ''}`}>
          {label}
        </NavLink>
      ))}
    </nav>
  )
}
