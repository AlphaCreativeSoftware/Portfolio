import { useEffect, useRef } from 'react'

export function useHeroLightSweep() {
  const headingRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const heading = headingRef.current
    if (!heading) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previous: number | undefined
    const paint = () => {
      frame = 0
      // Complete the sweep while the hero is still in view, not at page end.
      const progress = Math.round(Math.min(100, Math.max(0, window.scrollY / 3)))
      if (progress === previous) return
      previous = progress
      heading.style.setProperty('--hero-light-progress', `${progress}%`)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(paint)
    }
    const stop = () => {
      window.removeEventListener('scroll', onScroll)
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
    }
    const sync = () => {
      stop()
      if (reducedMotion.matches) {
        previous = undefined
        heading.style.removeProperty('--hero-light-progress')
        return
      }
      paint()
      window.addEventListener('scroll', onScroll, { passive: true })
    }

    sync()
    reducedMotion.addEventListener('change', sync)
    return () => {
      stop()
      reducedMotion.removeEventListener('change', sync)
    }
  }, [])

  return headingRef
}
