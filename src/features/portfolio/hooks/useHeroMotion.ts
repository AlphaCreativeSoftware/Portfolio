import { useEffect, useRef } from 'react'

export function useHeroMotion() {
  const orbitOneRef = useRef<HTMLDivElement>(null)

  const orbitTwoRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let frame = 0
    let lastHeroTravel = -1
    const mobileDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    const update = () => {
      frame = 0
      const heroTravel = Math.min(window.scrollY, window.innerHeight)
      if (!mobileDevice && heroTravel !== lastHeroTravel) {
        lastHeroTravel = heroTravel
        if (orbitOneRef.current) orbitOneRef.current.style.transform = `translate3d(0, ${heroTravel * -.15}px, 0)`
        if (orbitTwoRef.current) orbitTwoRef.current.style.transform = `translate3d(0, ${heroTravel * -.3}px, 0)`
        document.documentElement.style.setProperty('--hero-word-shift', `${(heroTravel / window.innerHeight) * 70}%`)
      }

    }
    const scheduleUpdate = () => { if (!frame) frame = window.requestAnimationFrame(update) }
    update()
    const observer = new ResizeObserver(scheduleUpdate)
    observer.observe(document.documentElement)
    window.addEventListener('scroll', scheduleUpdate, { passive: true })
    window.addEventListener('resize', scheduleUpdate)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      observer.disconnect()
      window.removeEventListener('scroll', scheduleUpdate)
      window.removeEventListener('resize', scheduleUpdate)
    }
  }, [])
  return { orbitOneRef, orbitTwoRef }
}
