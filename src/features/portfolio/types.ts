import type { LucideIcon } from 'lucide-react'

export type ProjectPresentation = 'cibeles' | 'alpha-engine' | 'fruit-drop' | 'assistant' | 'standard'

export type Project = {
  id: string
  presentation: ProjectPresentation
  index: string
  title: string
  tagline?: string
  eyebrow: string
  description: string
  result: string
  tags: string[]
  className: string
  icon: LucideIcon
}
