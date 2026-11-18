import type { ReactNode } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteAreas } from '../shared/config/areas'
import { usePageMetadata } from '../shared/hooks/usePageMetadata'
import { toolPath } from '../features/tools/catalog'
import type { ToolEntry } from '../features/tools/catalog'
import { ToolsLayout } from '../features/tools/components/ToolsLayout'

export function ToolPage({ entry, children }: { entry: ToolEntry; children: ReactNode }) {
  usePageMetadata({ title: `${entry.title} — Mikael Rodríguez`, description: entry.description, path: toolPath(entry.slug) })

  return (
    <ToolsLayout>
      <div className="tools-intro">
        <Link className="tools-link" to={siteAreas.tools.to}><ArrowLeft size={15} aria-hidden="true" /> Todas las herramientas</Link>
        <h1 id="tools-title">{entry.title}</h1>
        <p>{entry.description}</p>
      </div>
      {children}
    </ToolsLayout>
  )
}
