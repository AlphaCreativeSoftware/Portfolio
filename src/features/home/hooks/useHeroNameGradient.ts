import { useEffect, useRef } from 'react'

export function useHeroNameGradient() {
  const nameRef = useRef<HTMLHeadingElement>(null)

  useEffect(() => {
    const name = nameRef.current
    if (!name) return

    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)')
    let frame = 0
    let previous: number | undefined
    const paint = () => {
      frame = 0
      // Complete the sweep while the name is still in view, not at page end.
      const progress = Math.round(Math.min(100, Math.max(0, window.scrollY / 3)))
      if (progress === previous) return
      previous = progress
      name.style.setProperty('--name-gradient-position', `${progress}%`)
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
        name.style.removeProperty('--name-gradient-position')
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

  return nameRef
}
