import { useEffect, useRef } from 'react'

export function useHeroMotion() {
  const orbitOneRef = useRef<HTMLDivElement>(null)

  const orbitTwoRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    const orbits = [orbitOneRef.current, orbitTwoRef.current]
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    const coarsePointer = window.matchMedia('(hover: none) and (pointer: coarse)')
    let frame = 0
    let lastHeroTravel = -1
    const update = () => {
      frame = 0
      const heroTravel = Math.min(window.scrollY, window.innerHeight)
      if (heroTravel === lastHeroTravel) return
      lastHeroTravel = heroTravel
      orbits.forEach((orbit, i) => {
        if (orbit) orbit.style.transform = `translate3d(0, ${heroTravel * -.15 * (i + 1)}px, 0)`
      })
    }
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    const stop = () => {
      if (frame) window.cancelAnimationFrame(frame)
      frame = 0
      lastHeroTravel = -1
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
      orbits.forEach((orbit) => orbit?.style.removeProperty('transform'))
    }
    const sync = () => {
      stop()
      if (reducedMotion.matches || coarsePointer.matches) return
      update()
      window.addEventListener('scroll', scheduleUpdate, { passive: true })
      window.addEventListener('resize', scheduleUpdate)
    }
    sync()
    reducedMotion.addEventListener('change', sync)
    coarsePointer.addEventListener('change', sync)
    return () => {
      stop()
      reducedMotion.removeEventListener('change', sync)
      coarsePointer.removeEventListener('change', sync)
    }
  }, [])
  return { orbitOneRef, orbitTwoRef }
}
