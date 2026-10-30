import { useEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'

type AnimatedMetricProps = {
  value: number
  play: boolean
  suffix?: string
  accentSuffix?: boolean
  prefix?: string
  delay?: number
  duration?: number
  count?: boolean
}

export function AnimatedMetric({ value, play, suffix = '', accentSuffix = false, prefix = '', delay = 0, duration = 1250, count = true }: AnimatedMetricProps) {
  const animatedRef = useRef(false)
  const [displayValue, setDisplayValue] = useState(count ? 0 : value)
  const [animating, setAnimating] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (!play || animatedRef.current) return
    let frame = 0
    let timer = 0
    let finishTimer = 0
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      animatedRef.current = true
      setDisplayValue(value)
      setComplete(true)
      return
    }
    if (!count) {
      timer = window.setTimeout(() => {
        animatedRef.current = true
        setAnimating(true)
        finishTimer = window.setTimeout(() => {
          setAnimating(false)
          setComplete(true)
        }, duration)
      }, delay)
      return () => {
        window.clearTimeout(timer)
        window.clearTimeout(finishTimer)
      }
    }
    timer = window.setTimeout(() => {
      animatedRef.current = true
      setAnimating(true)
      const startedAt = performance.now()
      const frameInterval = window.matchMedia('(max-width: 900px)').matches ? 33 : 16
      let lastRenderAt = startedAt - frameInterval
      let lastRenderedValue = -1
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        const nextValue = Math.round(value * eased)
        if (progress === 1 || (now - lastRenderAt >= frameInterval && nextValue !== lastRenderedValue)) {
          lastRenderAt = now
          lastRenderedValue = nextValue
          setDisplayValue(nextValue)
        }
        if (progress < 1) frame = window.requestAnimationFrame(tick)
        else {
          setAnimating(false)
          setComplete(true)
        }
      }
      frame = window.requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      window.clearTimeout(finishTimer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [count, delay, duration, play, value])

  return <strong className={`metric-value ${animating ? 'metric-counting' : ''} ${complete ? 'metric-complete' : ''}`} style={{ '--metric-duration': `${duration}ms` } as CSSProperties} aria-label={`${prefix}${value}${suffix}`}>{prefix}{displayValue}{accentSuffix ? <span>{suffix}</span> : suffix}</strong>
}
