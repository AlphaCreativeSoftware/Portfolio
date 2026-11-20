import { ArrowDownRight, ArrowRight } from 'lucide-react'
import { useHeroLightSweep } from '../../../shared/hooks/useHeroLightSweep'
import { AnimatedMetric } from '../../../shared/ui/AnimatedMetric'
import { useAppearance } from '../../appearance/context'
import { useHeroMotion } from '../hooks/useHeroMotion'

export function HeroSection({ navigateTo }: { navigateTo: (section: string) => void }) {
  const { localTime, formattedTime, greeting } = useAppearance()
  const { orbitOneRef, orbitTwoRef } = useHeroMotion()
  const titleRef = useHeroLightSweep()
  return (
    <section className="hero" id="inicio" aria-labelledby="portfolio-title">
      <div className="hero-orbit orbit-one" ref={orbitOneRef} aria-hidden="true" />
      <div className="hero-orbit orbit-two" ref={orbitTwoRef} aria-hidden="true" />
      <p className="kicker hero-kicker"><span>01</span> Software developer · Madrid</p>
      <time className="hero-background-time" dateTime={localTime.toISOString()} aria-label={`Hora local: ${formattedTime}`}>{formattedTime}<small> local</small></time>
      <div className="hero-copy">
        <h1 ref={titleRef} className="portfolio-title" id="portfolio-title">Portfolio profesional.</h1>
        <div className="hero-details">
          <p>Hola, {greeting}. Soy <strong>Mikael Rodríguez</strong>, ingeniero de software. Aquí presento mis proyectos más representativos: aplicaciones que he llevado de la idea a producción, procesos que he automatizado y soluciones de datos e IA que ayudan a tomar decisiones. En cada proyecto cuento qué problema resolví, cómo lo construí y qué resultados obtuve.</p>
          <div className="hero-actions">
            <a className="button button-primary" href="#proyectos" onClick={() => navigateTo('proyectos')}>Explorar proyectos <ArrowDownRight size={18} aria-hidden="true" /></a>
            <a className="text-link" href="#sobre-mi" onClick={() => navigateTo('sobre-mi')}>Conocer mi historia <ArrowRight size={17} aria-hidden="true" /></a>
          </div>
        </div>
      </div>
      <div className="hero-stats">
        <div><AnimatedMetric value={97} suffix="%" accentSuffix play delay={820} duration={950} /><small>Precisión sobre millones de registros</small></div>
        <div><AnimatedMetric value={185} suffix="K" accentSuffix play delay={920} duration={950} /><small>Visualizaciones en YouTube</small></div>
        <div><AnimatedMetric value={10} suffix="+" accentSuffix play delay={1020} duration={950} /><small>Años creando y aprendiendo</small></div>
      </div>
    </section>
  )
}
