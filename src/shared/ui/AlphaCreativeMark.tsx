import { useEffect, useRef, useState } from 'react'

export function AlphaCreativeMark() {
  const markRef = useRef<HTMLSpanElement>(null)
  const [expanded, setExpanded] = useState(false)

  useEffect(() => {
    const mark = markRef.current
    if (!mark) return
    let dwellTimer = 0
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const observer = new IntersectionObserver(([entry]) => {
      window.clearTimeout(dwellTimer)
      if (!entry.isIntersecting) {
        setExpanded(false)
        return
      }
      if (reducedMotion) {
        setExpanded(true)
        return
      }
      dwellTimer = window.setTimeout(() => setExpanded(true), 800)
    }, { threshold: .8, rootMargin: '-6% 0px' })
    observer.observe(mark)
    return () => {
      window.clearTimeout(dwellTimer)
      observer.disconnect()
    }
  }, [])

  return (
    <span ref={markRef} className={`alpha-brand ${expanded ? 'alpha-brand-expanded' : ''}`} aria-label="Proyecto de Alpha Creative" title="Alpha Creative">
      <span className="alpha-brand-logo" aria-hidden="true">
        <img className="alpha-logo-light" src="/brands/alpha-creative/logo-black.png" alt="" />
        <img className="alpha-logo-dark" src="/brands/alpha-creative/logo-white.png" alt="" />
      </span>
      <span className="alpha-brand-label">
        <span className="alpha-brand-label-full">Alpha Creative</span>
        <span className="alpha-brand-label-short">A.Creative</span>
      </span>
    </span>
  )
}
