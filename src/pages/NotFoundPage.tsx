import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { usePageMetadata } from '../shared/hooks/usePageMetadata'
import { AmbientScene } from '../features/appearance/AmbientScene'

export function NotFoundPage() {
  usePageMetadata({ title: 'Página no encontrada — Mikael Rodríguez', description: 'Vuelve a la página principal o explora el portfolio de Mikael Rodríguez.', path: '/404', noIndex: true })
  return (
    <div className="site-shell">
      <AmbientScene />
      <main className="route-message" id="main-content" tabIndex={-1}>
        <Link className="brand" to="/">MR<span>.</span></Link>
        <p className="home-eyebrow">404 / Fuera de órbita</p>
        <h1>Por aquí todavía<br />no hay nada.</h1>
        <p>Puede que el enlace haya cambiado. La página principal es un buen lugar para seguir.</p>
        <div><Link className="button button-primary" to="/"><ArrowLeft size={16} />Volver al inicio</Link><Link className="text-link" to="/portfolio">Ver portfolio<ArrowUpRight size={16} /></Link></div>
      </main>
    </div>
  )
}
