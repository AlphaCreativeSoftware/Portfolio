import { useEffect } from 'react'
import type { RefObject } from 'react'

/** Autoplay only near the viewport and while the document is visible.
 * Reduced-motion users keep the poster; mobile uses a stricter threshold.
 */
export function useViewportVideo(videoRef: RefObject<HTMLVideoElement | null>) {
  useEffect(() => {
    const video = videoRef.current
    if (!video || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const mobileDevice = window.matchMedia('(hover: none) and (pointer: coarse)').matches
    let inView = false
    const syncPlayback = () => {
      if (inView && document.visibilityState === 'visible') void video.play().catch(() => undefined)
      else video.pause()
    }
    const observer = new IntersectionObserver(([entry]) => {
      inView = entry.isIntersecting
      syncPlayback()
    }, { rootMargin: mobileDevice ? '0px' : '120px 0px', threshold: mobileDevice ? .55 : .15 })
    observer.observe(video)
    document.addEventListener('visibilitychange', syncPlayback)
    return () => {
      observer.disconnect()
      document.removeEventListener('visibilitychange', syncPlayback)
      video.pause()
    }
  }, [videoRef])
}
