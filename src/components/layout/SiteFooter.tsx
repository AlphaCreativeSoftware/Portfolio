import { ArrowRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function SiteFooter({ navigateTo }: { navigateTo: (section: string) => void }) {

  return (
    <footer>
      <Link className="brand" to="/" aria-label="Ir a la página principal">MR<span>.</span></Link>
      <p>Diseñado y desarrollado por Mikael Rodríguez.</p>
      <a href="#inicio" onClick={() => navigateTo('inicio')}>Volver arriba <ArrowRight size={15} /></a>
    </footer>
  )
}
