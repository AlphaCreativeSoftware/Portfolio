import { useEffect, useRef } from 'react'
import { useLocation } from 'react-router-dom'

/** Move keyboard/screen-reader focus on page changes, not on local anchor clicks. */
export function RouteAccessibility() {
  const { pathname } = useLocation()
  const previousPath = useRef(pathname)

  useEffect(() => {
    if (previousPath.current === pathname) return
    previousPath.current = pathname
    document.getElementById('main-content')?.focus({ preventScroll: true })
  }, [pathname])

  return null
}
