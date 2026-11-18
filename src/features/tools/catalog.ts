import type { ComponentType } from 'react'
import { siteAreas } from '../../shared/config/areas'

export type ToolEntry = {
  slug: string
  title: string
  description: string
  load: () => Promise<{ default: ComponentType }>
}

// Only published tools go here. One entry enables both its card and its route.
export const toolCatalog: readonly ToolEntry[] = []

export function toolPath(slug: string) {
  return `${siteAreas.tools.to}/${slug}`
}
