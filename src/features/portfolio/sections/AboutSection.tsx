import type { CSSProperties } from 'react'
import { useOnceVisible } from '../../../shared/hooks/useOnceVisible'
import { workMethodSteps } from '../data/about'
import { SectionHeading } from '../../../shared/ui/SectionHeading'

export function AboutSection() {
  const workMethodReveal = useOnceVisible<HTMLDivElement>(.3)
  return (
    <section className="section capabilities-section" id="sobre-mi">
      <SectionHeading className="about-heading" number="05" eyebrow="Cómo trabajo" title={<>Ingeniería con<br /><em>visión de producto.</em></>} description="Construyo software entendiendo el sistema completo: la tecnología, el usuario, el proceso y el objetivo de negocio." />
      <div className="about-profile">
        <div className="about-profile-lead">
          <span>Mi punto de partida</span>
          <h3>Siempre he aprendido construyendo.</h3>
          <p>Empecé haciendo de todo: mods, videojuegos, herramientas propias y pruebas con Linux. No seguía un camino diseñado; aprendía porque quería crear cosas que todavía no sabía hacer.</p>
        </div>
        <div className="about-profile-copy">
          <p>Con los años, esa curiosidad se convirtió en una forma de trabajar. Hoy desarrollo software end-to-end: entiendo el problema, diseño la solución, construyo el producto y compruebo si realmente aporta valor.</p>
          <p>Me importa la calidad técnica, pero también el contexto. Saber quién utilizará una herramienta, qué proceso mejora y qué resultado necesita el negocio me permite tomar mejores decisiones de desarrollo.</p>
          <div className="profile-focus"><span>Software</span><span>Producto</span><span>Datos</span><span>IA aplicada</span></div>
        </div>
      </div>
      <div ref={workMethodReveal.elementRef} className={`work-method ${workMethodReveal.visible ? 'work-method-active' : ''}`} aria-label="Mi proceso de trabajo">
        <span className="method-progress" aria-hidden="true"><i /></span>
        <div className="method-label"><span>Mi proceso</span><strong>Del problema al resultado</strong></div>
        {workMethodSteps.map(({ number, title, text, icon: Icon }, index) => (
          <article key={title} style={{ '--method-delay': `${index * 550}ms` } as CSSProperties}>
            <div className="method-step-head"><span>{number}</span><span className="method-step-icon"><Icon /></span></div>
            <h3>{title}</h3><p>{text}</p>
          </article>
        ))}
      </div>
      <div className="about-now">
        <span><i /> Ahora</span><p>Responsable de desarrollo y mantenimiento de aplicaciones en cliente bancario.</p><strong>Madrid · Software · Producto · IA aplicada</strong>
      </div>
    </section>
  )
}
