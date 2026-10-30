import { ArrowRight } from 'lucide-react'

export function SiteFooter({ navigateTo }: { navigateTo: (section: string) => void }) {

  return (
    <footer>
      <a className="brand" href="#inicio" onClick={() => navigateTo('inicio')}>MR<span>.</span></a>
      <p>Diseñado y desarrollado por Mikael Rodríguez.</p>
      <a href="#inicio" onClick={() => navigateTo('inicio')}>Volver arriba <ArrowRight size={15} /></a>
    </footer>
  )
}
