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
          <p className="home-statement">Construir es mi forma de<br className="home-desktop-break" /> entender el mundo.</p>
          <p className="home-hero-intro">Software, automatización, datos e IA. Este es mi espacio para reunir lo que hago, lo que aprendo y las ideas que quiero llevar más lejos.</p>
          <div className="home-hero-actions">
            <Link className="button button-primary" to="/portfolio">Entrar al portfolio<ArrowUpRight size={17} /></Link>
            <a className="home-quiet-link" href="#espacios" onClick={() => navigateTo('espacios')}>Conocer este espacio<ArrowDown size={15} /></a>
          </div>
        </div>
        <HomeOrbit />
      </div>
      <div className="home-hero-caption">
        <p><span className="home-caption-index">MR / 01</span>Un espacio personal, en constante evolución.</p>
        <a href="#espacios" onClick={() => navigateTo('espacios')} aria-label="Descubrir mis espacios">Sigue explorando<ArrowDown size={14} /></a>
      </div>
    </section>
  )
}
