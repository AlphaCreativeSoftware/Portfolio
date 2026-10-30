import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'

export function HomePerspective() {
  return (
    <section className="home-perspective home-container" id="mirada" aria-labelledby="home-perspective-title">
      <div className="home-perspective-heading"><p className="home-eyebrow">02 / Detrás del código</p><h2 id="home-perspective-title">Antes de hacerlo<br />por trabajo,<br /><em>ya lo hacía<br />por curiosidad.</em></h2></div>
      <div className="home-perspective-copy">
        <p className="home-perspective-lead">Empecé entre mods, videojuegos y pruebas con Linux. No había una hoja de ruta; había cosas que quería crear.</p>
        <p>Esa forma de aprender sigue conmigo. Hoy desarrollo aplicaciones, automatizo procesos y exploro qué pueden aportar los datos y la IA. Me importa tanto cómo se construye algo como para qué sirve.</p>
        <Link className="home-quiet-link" to="/portfolio#sobre-mi">Más sobre cómo trabajo<ArrowUpRight size={15} /></Link>
        <div className="home-now"><span><i />Ahora</span><p>Desarrollo y mantenimiento de aplicaciones en el sector bancario.</p><Link to="/portfolio#experiencia">Ver trayectoria<ArrowUpRight size={14} /></Link></div>
      </div>
    </section>
  )
}
