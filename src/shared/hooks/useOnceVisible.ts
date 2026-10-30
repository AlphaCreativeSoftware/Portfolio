import { useEffect, useRef, useState } from 'react'

export function useOnceVisible<T extends HTMLElement>(threshold = .32) {
  const elementRef = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || visible) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, visible])

  return { elementRef, visible }
}
