import { useState } from 'react'

/** Mount expensive details on first opening; preserve their state when closed. */
export function useDisclosure() {
  const [expanded, setExpanded] = useState(false)
  const [detailsMounted, setDetailsMounted] = useState(false)
  const toggleDetails = () => {
    if (!expanded) setDetailsMounted(true)
    setExpanded((current) => !current)
  }
  return { expanded, detailsMounted, toggleDetails }
}
