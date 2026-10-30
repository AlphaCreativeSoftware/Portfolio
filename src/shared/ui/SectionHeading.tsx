import type { ReactNode } from 'react'

type SectionHeadingProps = {
  number: string
  eyebrow: string
  title: ReactNode
  description?: string
  className?: string
}

/** No extra wrapper: keeps the existing layout and heading semantics intact. */
export function SectionHeading({ number, eyebrow, title, description, className = '' }: SectionHeadingProps) {
  return (
    <div className={className ? 'section-heading ' + className : 'section-heading'}>
      <div><p className="kicker"><span>{number}</span>{' '}{eyebrow}</p><h2>{title}</h2></div>
      {description && <p>{description}</p>}
    </div>
  )
}
