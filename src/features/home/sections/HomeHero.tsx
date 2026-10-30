import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HomeOrbit } from '../components/HomeOrbit'

export function HomeHero({ navigateTo }: { navigateTo: (id: string) => void }) {
  return (
    <section className="home-hero home-container" id="inicio" aria-labelledby="home-title">
      <div className="home-hero-grid">
        <div className="home-hero-copy">
          <p className="home-eyebrow home-hero-eyebrow"><span />Software developer · Madrid</p>
          <h1 className="home-title" id="home-title"><span>Mikael</span><span className="home-title-last">Rodríguez<span className="home-title-dot">.</span></span></h1>
          <p className="home-statement">Software, producto<br className="home-desktop-break" /> y tecnología aplicada.</p>
          <p className="home-hero-intro">Mi web personal reúne el trabajo profesional, las iniciativas de producto y el contenido técnico que publico. Cada área tiene su propio espacio.</p>
          <div className="home-hero-actions">
            <a className="button button-primary" href="#espacios" onClick={() => navigateTo('espacios')}>Explorar las áreas<ArrowDown size={17} /></a>
            <Link className="home-quiet-link" to="/portfolio">Ver portfolio<ArrowUpRight size={15} /></Link>
          </div>
        </div>
        <HomeOrbit />
      </div>
      <div className="home-hero-caption">
        <p><span className="home-caption-index">MIKAELRODRIGUEZ.COM</span>Software · Producto · Conocimiento</p>
        <a href="#espacios" onClick={() => navigateTo('espacios')}>Áreas de la web<ArrowDown size={14} /></a>
      </div>
    </section>
  )
}
