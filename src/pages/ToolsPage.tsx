import { siteAreas } from '../shared/config/areas'
import { usePageMetadata } from '../shared/hooks/usePageMetadata'
import { toolCatalog } from '../features/tools/catalog'
import { ToolCatalog } from '../features/tools/components/ToolCatalog'
import { ToolsLayout } from '../features/tools/components/ToolsLayout'

const description = 'Un catálogo de utilidades que desarrollo para automatizar tareas y resolver problemas concretos desde el navegador.'

export function ToolsPage() {
  usePageMetadata({ title: 'Herramientas — Mikael Rodríguez', description, path: siteAreas.tools.to })

  return (
    <ToolsLayout>
      <div className="tools-intro">
        <p className="tools-eyebrow">Utilidades web</p>
        <h1 id="tools-title">Herramientas<span>.</span></h1>
        <p>{description}</p>
      </div>
      <ToolCatalog entries={toolCatalog} />
    </ToolsLayout>
  )
}
