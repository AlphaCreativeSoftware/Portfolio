import { useEffect, useLayoutEffect, useRef, useState } from 'react'

export type NavigationItem = { id: string; label: string; number: string }
export type NavigationConfig = {
  sectionIds: readonly string[]
  sectionLabels: Readonly<Record<string, string>>
  items: readonly NavigationItem[]
}

export type SectionNavigation = ReturnType<typeof useSectionNavigation>

export function useSectionNavigation({ sectionIds, sectionLabels, items }: NavigationConfig) {
  const firstSection = sectionIds[0] ?? ''
  const lastSection = sectionIds[sectionIds.length - 1] ?? firstSection
  const navRef = useRef<HTMLElement>(null)
  const menuPanelRef = useRef<HTMLDivElement>(null)

  const menuButtonRef = useRef<HTMLButtonElement>(null)

  const scrollProgressRef = useRef<HTMLSpanElement>(null)

  const scrolledRef = useRef(false)

  const activeSectionRef = useRef(firstSection)

  const indicatorTimerRef = useRef<number | null>(null)

  const navigationTargetRef = useRef<string | null>(null)

  const navigationTimerRef = useRef<number | null>(null)

  const [menuOpen, setMenuOpen] = useState(false)

  const [scrolled, setScrolled] = useState(false)

  const [activeSection, setActiveSection] = useState(firstSection)

  const [navIndicator, setNavIndicator] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false, moving: false })

  const updateActiveSection = (section: string) => {
    if (activeSectionRef.current === section) return
    activeSectionRef.current = section
    setActiveSection(section)
  }

  useEffect(() => {
    let frame = 0
    const sections = sectionIds.map((id) => document.getElementById(id)).filter((section): section is HTMLElement => Boolean(section))
    const updatePageState = () => {
      frame = 0
      const nextScrolled = window.scrollY > 24
      if (scrolledRef.current !== nextScrolled) {
        scrolledRef.current = nextScrolled
        setScrolled(nextScrolled)
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      if (scrollProgressRef.current) scrollProgressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`

      const marker = window.innerHeight * .32
      const navigationTarget = navigationTargetRef.current
      if (navigationTarget) {
        const destination = document.getElementById(navigationTarget)
        const destinationBox = destination?.getBoundingClientRect()
        if (!destinationBox || destinationBox.top > marker || destinationBox.bottom <= marker) return
        navigationTargetRef.current = null
        if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
        updateActiveSection(navigationTarget)
        return
      }

      let currentSection = firstSection
      for (const section of sections) {
        if (section.getBoundingClientRect().top <= marker) currentSection = section.id
        else break
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) currentSection = lastSection
      updateActiveSection(currentSection)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePageState)
    }
    updatePageState()
    const pageResizeObserver = new ResizeObserver(onScroll)
    pageResizeObserver.observe(document.documentElement)
    window.addEventListener('scroll', onScroll, { passive: true })
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      pageResizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [sectionIds, firstSection, lastSection])

  useLayoutEffect(() => {
    let disposed = false
    let retryTimer: number | null = null
    const updateIndicator = () => {
      const nav = navRef.current
      const target = nav?.querySelector<HTMLAnchorElement>(`a[href="#${activeSection}"]`)
      if (!nav || !target) {
        setNavIndicator((current) => ({ ...current, visible: false }))
        return
      }
      const navBox = nav.getBoundingClientRect()
      const targetBox = target.getBoundingClientRect()
      if (targetBox.width < 1 || targetBox.height < 1) {
        retryTimer = window.setTimeout(updateIndicator, 80)
        return
      }
      setNavIndicator((current) => {
        const next = {
          x: targetBox.left - navBox.left,
          y: targetBox.top - navBox.top,
          width: targetBox.width,
          height: targetBox.height,
        }
        const changed = !current.visible || Math.abs(current.x - next.x) > .5 || Math.abs(current.y - next.y) > .5 || Math.abs(current.width - next.width) > .5
        return { ...next, visible: true, moving: changed }
      })
      if (indicatorTimerRef.current) window.clearTimeout(indicatorTimerRef.current)
      indicatorTimerRef.current = window.setTimeout(() => {
        setNavIndicator((current) => ({ ...current, moving: false }))
      }, 520)
    }
    const frame = window.requestAnimationFrame(updateIndicator)
    const settleTimer = window.setTimeout(updateIndicator, 180)
    const resizeObserver = new ResizeObserver(updateIndicator)
    if (navRef.current) resizeObserver.observe(navRef.current)
    document.fonts?.ready.then(() => { if (!disposed) updateIndicator() })
    window.addEventListener('resize', updateIndicator)
    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      if (retryTimer) window.clearTimeout(retryTimer)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateIndicator)
      if (indicatorTimerRef.current) window.clearTimeout(indicatorTimerRef.current)
    }
  }, [activeSection, menuOpen])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return () => { document.body.style.overflow = '' }
    if (menuPanelRef.current) menuPanelRef.current.scrollTop = 0
    const openedWithKeyboard = menuButtonRef.current?.matches(':focus-visible')
    const panel = menuPanelRef.current
    // Visibility can still be hidden during the entrance transition. Focus only
    // once the actual panel is visible, including when motion is disabled.
    const focusMenu = (event?: TransitionEvent) => {
      if (!panel || (event && event.target !== panel) || getComputedStyle(panel).visibility !== 'visible') return
      panel.querySelector<HTMLAnchorElement>('a')?.focus()
      panel.removeEventListener('transitionend', focusMenu)
    }
    if (openedWithKeyboard) panel?.addEventListener('transitionend', focusMenu)
    const focusFrame = openedWithKeyboard ? window.requestAnimationFrame(() => focusMenu()) : null
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }
    const closeOnOutsideClick = (event: PointerEvent) => {
      const target = event.target as Node
      if (menuPanelRef.current?.contains(target) || menuButtonRef.current?.contains(target)) return
      setMenuOpen(false)
    }
    const desktopQuery = window.matchMedia('(min-width: 901px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (event.matches) setMenuOpen(false) }
    document.addEventListener('pointerdown', closeOnOutsideClick)
    window.addEventListener('keydown', closeOnEscape)
    desktopQuery.addEventListener('change', closeOnDesktop)
    return () => {
      document.body.style.overflow = ''
      if (focusFrame) window.cancelAnimationFrame(focusFrame)
      panel?.removeEventListener('transitionend', focusMenu)
      document.removeEventListener('pointerdown', closeOnOutsideClick)
      window.removeEventListener('keydown', closeOnEscape)
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [menuOpen])

  useEffect(() => () => {
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
  }, [])

  useEffect(() => {
    const cancelProgrammaticNavigation = () => {
      if (!navigationTargetRef.current) return
      navigationTargetRef.current = null
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
      window.dispatchEvent(new Event('scroll'))
    }
    window.addEventListener('wheel', cancelProgrammaticNavigation, { passive: true })
    window.addEventListener('touchstart', cancelProgrammaticNavigation, { passive: true })
    return () => {
      window.removeEventListener('wheel', cancelProgrammaticNavigation)
      window.removeEventListener('touchstart', cancelProgrammaticNavigation)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)

  const currentSectionLabel = sectionLabels[activeSection] || sectionLabels[firstSection] || ''

  const navigateTo = (section: string) => {
    const restoreMenuFocus = menuOpen
    navigationTargetRef.current = section
    updateActiveSection(section)
    closeMenu()
    if (restoreMenuFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }))
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
    navigationTimerRef.current = window.setTimeout(() => {
      navigationTargetRef.current = null
      window.dispatchEvent(new Event('scroll'))
    }, 1400)
  }

  return { items, navRef, menuPanelRef, menuButtonRef, scrollProgressRef, menuOpen, setMenuOpen, scrolled, activeSection, isAtStart: activeSection === firstSection, navIndicator, closeMenu, currentSectionLabel, navigateTo }
}
