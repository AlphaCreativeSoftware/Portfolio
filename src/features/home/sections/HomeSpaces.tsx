import { ArrowUpRight, Wrench } from 'lucide-react'
import { Link } from 'react-router-dom'
import { siteAreas } from '../../../shared/config/areas'
import { independentSpaces } from '../data/spaces'

const internalSpaces = [
  { ...siteAreas.portfolio, number: '01', category: 'Trabajo profesional', description: 'Proyectos de software, automatización, datos e IA, junto con mi experiencia y competencias técnicas.', action: 'Abrir portfolio', icon: ArrowUpRight },
  { ...siteAreas.tools, number: '02', category: 'Utilidades web', description: 'Herramientas que desarrollo para automatizar tareas y resolver problemas concretos desde el navegador.', action: 'Ver herramientas', icon: Wrench },
]

export function HomeSpaces() {
  return (
    <section className="home-spaces home-container" id="espacios" aria-labelledby="home-spaces-title">
      <div className="home-section-intro">
        <div>
          <p className="home-eyebrow">01 / Áreas de la web</p>
          <h2 id="home-spaces-title">Trabajo, producto<br /><em>y conocimiento.</em></h2>
        </div>
        <p>Explora mis proyectos profesionales, las herramientas que desarrollo y los productos de Alpha Creative.</p>
      </div>
      <div className="home-space-grid">
        {internalSpaces.map(({ to, label, number, category, description, action, icon: Icon }) => (
          <Link className="home-space-card home-space-internal" to={to} aria-label={action} key={to}>
            <div className="home-space-meta">
              <span>{number} / {category}</span>
              <span className="home-space-action"><Icon size={17} aria-hidden="true" /></span>
            </div>
            <h3>{label}.</h3>
            <p>{description}</p>
            <span className="home-space-entry">{action}<ArrowUpRight size={17} aria-hidden="true" /></span>
          </Link>
        ))}
        {independentSpaces.map((space) => (
          <article className={'home-space-card home-space-' + space.id} key={space.id}>
            <div className="home-space-meta">
              <span>{space.number} / {space.category}</span>
              {space.id === 'alpha-creative' && (
                <span className="home-alpha-wordmark" aria-hidden="true">
                  <img className="home-alpha-logo-light" src="/brands/alpha-creative/logo-black.png" alt="" width="104" loading="lazy" decoding="async" />
                  <img className="home-alpha-logo-dark" src="/brands/alpha-creative/logo-white.png" alt="" width="104" loading="lazy" decoding="async" />
                </span>
              )}
            </div>
            <h3>{space.title}</h3>
            <p>{space.description}</p>
            <div className="home-space-link-groups">
              {space.linkGroups.map((group) => (
                <div className="home-space-link-group" key={group.id} role="group" aria-labelledby={`${space.id}-${group.id}`}>
                  <h4 id={`${space.id}-${group.id}`}>{group.label}</h4>
                  <div className="home-space-links">
                    {group.links.map(({ label, ariaLabel, href, icon: Icon }) => (
                      <a href={href} aria-label={ariaLabel} key={label} target="_blank" rel="noreferrer">
                        <Icon /><span>{label}</span><ArrowUpRight size={13} />
                      </a>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </article>
        ))}
      </div>
    </section>
  )
}
