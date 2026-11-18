import { ArrowDown, ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { HomeOrbit } from '../components/HomeOrbit'
import { useHeroNameGradient } from '../hooks/useHeroNameGradient'

export function HomeHero({ navigateTo }: { navigateTo: (id: string) => void }) {
  const nameRef = useHeroNameGradient()
  return (
    <section className="home-hero home-container" id="inicio" aria-labelledby="home-title">
      <div className="home-hero-grid">
        <div className="home-hero-copy">
          <p className="home-eyebrow home-hero-eyebrow"><span />Madrid, España</p>
          <h1 ref={nameRef} className="home-title" id="home-title"><span>Mikael</span>{' '}<span>Rodríguez<span className="home-title-dot">.</span></span></h1>
          <p className="home-statement">Ingeniero de Software,<br className="home-desktop-break" /> Emprendedor y diseño de producto</p>
          <p className="home-hero-intro">Construyo software para que el trabajo complejo deje de ser manual. He desarrollado herramientas de conciliación sobre millones de registros y, con Alpha Creative, llevo mis propios productos de la idea a su publicación.</p>
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
