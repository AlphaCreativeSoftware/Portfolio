import { ArrowLeft, ArrowUpRight, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteAreas } from '../../../shared/config/areas'
import { toolPath } from '../catalog'
import type { ToolEntry } from '../catalog'

export function ToolCatalog({ entries }: { entries: readonly ToolEntry[] }) {
  if (!entries.length) return (
    <div className="tools-surface tools-empty">
      <span className="tools-icon"><Wrench size={22} aria-hidden="true" /></span>
      <div>
        <h2>Todavía no hay herramientas publicadas</h2>
        <p>Las herramientas estarán disponibles aquí a medida que las publique. Mientras tanto, puedes explorar los proyectos del portfolio.</p>
        <div className="tools-empty-actions">
          <Link className="tools-link tools-link-back" to={siteAreas.home.to}><ArrowLeft size={15} aria-hidden="true" /> Volver al inicio</Link>
          <Link className="tools-link" to={siteAreas.portfolio.to}>Ver portfolio <ArrowUpRight size={15} aria-hidden="true" /></Link>
        </div>
      </div>
    </div>
  )

  return (
    <ul className="tools-grid" aria-label="Herramientas publicadas">
      {entries.map(({ slug, title, description }) => (
        <li key={slug}>
          <Link className="tools-surface tools-card" to={toolPath(slug)}>
            <h2>{title}</h2>
            <p>{description}</p>
            <span className="tools-link">Abrir herramienta <ArrowUpRight size={15} aria-hidden="true" /></span>
          </Link>
        </li>
      ))}
    </ul>
  )
}
