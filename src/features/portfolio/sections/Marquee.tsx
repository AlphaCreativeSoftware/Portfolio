import { useEffect, useRef } from 'react'
import { marqueeItems } from '../data/marquee'

export function Marquee() {
  const marqueeRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return
    const observer = new IntersectionObserver(([entry]) => marquee.classList.toggle('marquee-running', entry.isIntersecting), { threshold: .01 })
    observer.observe(marquee)
    return () => observer.disconnect()
  }, [])
  return (
    <section className="marquee" ref={marqueeRef} aria-hidden="true">
      <div className="marquee-track">
        {[0, 1].map((copy) => <div className="marquee-group" key={copy}>{marqueeItems.map((item) => <span key={item}>{item}<i>·</i></span>)}</div>)}
      </div>
    </section>
  )
}
