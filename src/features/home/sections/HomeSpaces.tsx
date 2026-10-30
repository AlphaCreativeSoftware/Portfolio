import { ArrowUpRight, Boxes, Database } from 'lucide-react'
import { Link } from 'react-router-dom'
import { independentSpaces, selectedWork } from '../data/spaces'

export function HomeSpaces() {
  return (
    <section className="home-spaces home-container" id="espacios" aria-labelledby="home-spaces-title">
      <div className="home-section-intro">
        <div><p className="home-eyebrow">01 / Mis espacios</p><h2 id="home-spaces-title">Una misma curiosidad.<br /><em>Distintas formas de crear.</em></h2></div>
        <p>A veces toma forma de software.<br className="home-desktop-break" /> Otras, de un producto o de algo que merece ser compartido.</p>
      </div>
      <div className="home-space-grid">
        <Link className="home-space-card home-space-portfolio" to="/portfolio" aria-label="Explorar el portfolio: proyectos, experiencia y habilidades">
          <div className="home-space-meta"><span>01 / Portfolio</span><span className="home-space-action"><ArrowUpRight size={20} /></span></div>
          <div className="home-space-portfolio-copy"><h3>El trabajo,<br />con contexto.</h3><p>Proyectos, decisiones técnicas y resultados. Del software de negocio al producto independiente.</p></div>
          <div className="home-work-index" aria-hidden="true">
            {selectedWork.map((project, index) => (
              <div className="home-work-index-row" key={project.name}>
                <span className={`home-work-index-icon home-work-index-${project.type}`}>
                  {project.type === 'data' ? <Database /> : project.type === 'engine' ? <Boxes /> : <img src="/projects/fruit-drop/icon.png" alt="" width="34" height="34" loading="lazy" decoding="async" />}
                </span>
                <span><strong>{project.name}</strong><small>{project.field}</small></span>
                <span className="home-work-index-number">0{index + 1}</span>
              </div>
            ))}
          </div>
          <span className="home-space-entry">Entrar al portfolio<ArrowUpRight size={17} /></span>
        </Link>
        <div className="home-secondary-spaces">
          {independentSpaces.map((space) => (
            <article className={`home-space-card home-space-${space.id}`} key={space.id}>
              <div className="home-space-meta"><span>{space.number} / {space.category}</span>
                {space.id === 'alpha-creative' && <span className="home-alpha-wordmark" aria-hidden="true"><img className="home-alpha-logo-light" src="/brands/alpha-creative/logo-black.png" alt="" width="104" loading="lazy" decoding="async" /><img className="home-alpha-logo-dark" src="/brands/alpha-creative/logo-white.png" alt="" width="104" loading="lazy" decoding="async" /></span>}
              </div>
              <h3>{space.title}</h3><p>{space.description}</p>
              <div className="home-space-links">{space.links.map(({ label, href, icon: Icon }) => <a href={href} key={label} target="_blank" rel="noreferrer"><Icon /><span>{label}</span><ArrowUpRight size={13} /></a>)}</div>
            </article>
          ))}
        </div>
      </div>
    </section>
  )
}
