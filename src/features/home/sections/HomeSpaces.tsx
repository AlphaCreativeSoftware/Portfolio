import { ArrowUpRight } from 'lucide-react'
import { Link } from 'react-router-dom'
import { independentSpaces } from '../data/spaces'

export function HomeSpaces() {
  return (
    <section className="home-spaces home-container" id="espacios" aria-labelledby="home-spaces-title">
      <div className="home-section-intro">
        <div>
          <p className="home-eyebrow">01 / Áreas de la web</p>
          <h2 id="home-spaces-title">Trabajo, producto<br /><em>y conocimiento.</em></h2>
        </div>
        <p>Acceso al portfolio profesional, a mis productos independientes y a los recursos técnicos que comparto.</p>
      </div>
      <div className="home-space-grid">
        <Link className="home-space-card home-space-portfolio" to="/portfolio" aria-label="Abrir portfolio: proyectos, experiencia y competencias">
          <div className="home-space-meta">
            <span>01 / Trabajo profesional</span>
            <span className="home-space-action"><ArrowUpRight size={18} /></span>
          </div>
          <h3>Portfolio.</h3>
          <p>Una selección de proyectos de software, automatización, datos e IA, junto con mi experiencia y competencias técnicas.</p>
          <span className="home-space-entry">Abrir portfolio<ArrowUpRight size={17} /></span>
        </Link>
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
