import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { AnimatedMetric } from '../../../shared/ui/AnimatedMetric'
import { useAppearance } from '../../appearance/context'
import { useHeroMotion } from '../hooks/useHeroMotion'

export function HeroSection({ navigateTo }: { navigateTo: (section: string) => void }) {
  const { localTime, formattedTime, greeting } = useAppearance()
  const { orbitOneRef, orbitTwoRef } = useHeroMotion()
  return (
    <section className="hero" id="inicio">
      <div className="hero-orbit orbit-one" ref={orbitOneRef} />
      <div className="hero-orbit orbit-two" ref={orbitTwoRef} />
      <p className="kicker hero-kicker"><span>01</span> Software developer · Madrid</p>
      <time className="hero-background-time" dateTime={localTime.toISOString()} aria-label={`Hora local: ${formattedTime}`}>{formattedTime}<small> local</small></time>
      <div className="hero-copy">
        <h1 aria-label="Construyo software que convierte lo complejo en útil.">
          <span className="hero-title-line"><span>Construyo software</span></span>
          <span className="hero-title-line"><span>que convierte lo</span></span>
          <span className="hero-title-line"><span><em>complejo</em> en útil.</span></span>
        </h1>
        <p>Hola, {greeting}. Soy <strong>Mikael Rodríguez</strong>. Diseño productos, automatizaciones y soluciones de datos e IA con una obsesión sencilla: que funcionen y generen impacto real.</p>
      </div>
      <div className="hero-actions">
        <a className="button button-primary" href="#proyectos" onClick={() => navigateTo('proyectos')}>Explorar proyectos <ArrowDownRight size={18} /></a>
        <a className="text-link" href="#sobre-mi" onClick={() => navigateTo('sobre-mi')}>Conocer mi historia <ArrowRight size={17} /></a>
      </div>
      <div className="hero-stats">
        <div><AnimatedMetric value={97} suffix="%" accentSuffix play delay={820} duration={950} /><small>Precisión sobre millones de registros</small></div>
        <div><AnimatedMetric value={185} suffix="K" accentSuffix play delay={920} duration={950} /><small>Visualizaciones en YouTube</small></div>
        <div><AnimatedMetric value={10} suffix="+" accentSuffix play delay={1020} duration={950} /><small>Años creando y aprendiendo</small></div>
      </div>
    </section>
  )
}
