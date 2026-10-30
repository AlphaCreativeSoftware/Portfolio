import { useEffect, useLayoutEffect } from 'react'
import type { RefObject } from 'react'

/** Scope observers to this page so future routes do not animate each other's DOM. */
export function usePageAnimations(pageRef: RefObject<HTMLElement | null>) {
  useLayoutEffect(() => {
    const targets = pageRef.current?.querySelectorAll<HTMLElement>('.section-heading, .project-card, .cibeles-showcase, .alpha-showcase, .fruit-showcase, .timeline-item, .skill-group, .strengths-panel, .about-profile, .about-now, .contact-card, .social-presence') ?? []
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('in-view'))
      return
    }
    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal')
      target.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`)
    })
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        const target = entry.target as HTMLElement
        const finishReveal = (event: AnimationEvent) => {
          if (event.target !== target || !['reveal-in', 'mobile-heavy-reveal'].includes(event.animationName)) return
          target.classList.remove('scroll-reveal', 'in-view')
          target.style.removeProperty('--reveal-delay')
          target.removeEventListener('animationend', finishReveal)
        }
        target.addEventListener('animationend', finishReveal)
        target.classList.add('in-view')
        revealObserver.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 })
    targets.forEach((target) => revealObserver.observe(target))
    return () => revealObserver.disconnect()
  }, [pageRef])

  useEffect(() => {
    const showcases = pageRef.current?.querySelectorAll<HTMLElement>('.featured-showcase') ?? []
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        (entry.target as HTMLElement).dataset.onscreen = String(entry.isIntersecting)
      })
    }, { rootMargin: '120px 0px', threshold: .01 })
    showcases.forEach((showcase) => {
      showcase.dataset.onscreen = 'false'
      observer.observe(showcase)
    })
    return () => observer.disconnect()
  }, [pageRef])
}
