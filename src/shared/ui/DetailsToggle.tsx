import { ChevronRight } from 'lucide-react'

type DetailsToggleProps = {
  expanded: boolean
  controls: string
  onToggle: () => void
  openLabel: string
  closeLabel: string
}

export function DetailsToggle({ expanded, controls, onToggle, openLabel, closeLabel }: DetailsToggleProps) {
  return (
    <button className="details-toggle" onClick={onToggle} aria-expanded={expanded} aria-controls={controls}>
      <span><small>Caso interactivo</small>{expanded ? closeLabel : openLabel}</span><ChevronRight />
    </button>
  )
}
