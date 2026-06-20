import { useEffect, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Bot,
  Boxes,
  Braces,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  Gamepad2,
  Menu,
  Monitor,
  Moon,
  Play,
  Sparkles,
  Sun,
  X,
} from 'lucide-react'

type Project = {
  index: string
  title: string
  eyebrow: string
  description: string
  result: string
  tags: string[]
  className: string
  icon: typeof Code2
}

type Theme = 'system' | 'light' | 'dark'

const projects: Project[] = [
  {
    index: '01',
    title: 'Conciliación financiera automatizada',
    eyebrow: 'Software · Automatización · Datos',
    description: 'Aplicación interna en Python para extraer, transformar y conciliar información financiera distribuida en distintas fases y sistemas.',
    result: '≈95% de discrepancias alineadas',
    tags: ['Python', 'ETL', 'Data processing'],
    className: 'project-lime',
    icon: Database,
  },
  {
    index: '02',
    title: 'AlphaEngine2D',
    eyebrow: 'Java · Arquitectura · Gráficos',
    description: 'Motor gráfico 2D construido desde cero: escenas, objetos, físicas, colisiones, persistencia, renderizado optimizado y un juego funcional de ejemplo.',
    result: 'Proyecto académico de referencia',
    tags: ['Java', '2D Engine', 'Physics'],
    className: 'project-violet',
    icon: Boxes,
  },
  {
    index: '03',
    title: 'Fruit Drop',
    eyebrow: 'Producto · Mobile · Monetización',
    description: 'Videojuego Android ideado, diseñado, desarrollado y publicado de principio a fin, incluyendo compras, anuncios, ranking y sincronización en la nube.',
    result: 'Publicado en Google Play',
    tags: ['Unity', 'C#', 'Google Play'],
    className: 'project-orange',
    icon: Gamepad2,
  },
  {
    index: '04',
    title: 'Asistente de IA local',
    eyebrow: 'IA · Privacidad · Infraestructura',
    description: 'Ecosistema híbrido de asistentes personalizados que combina modelos locales con servicios cloud para equilibrar capacidad, coste y privacidad.',
    result: 'IA útil sobre hardware propio',
    tags: ['LLMs', 'LM Studio', 'OpenClaw'],
    className: 'project-blue',
    icon: Bot,
  },
]

const capabilities = [
  { number: '01', title: 'Software & producto', text: 'De la idea al producto funcional: arquitectura, interfaces, integraciones y puesta en producción.', icon: Braces },
  { number: '02', title: 'Automatización & datos', text: 'Procesos que reducen trabajo manual, transforman información y generan resultados medibles.', icon: Database },
  { number: '03', title: 'IA aplicada', text: 'Exploro soluciones de IA con propósito: privacidad, procesos financieros y herramientas de negocio.', icon: Sparkles },
]

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('portfolio-theme') as Theme) || 'system')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    onScroll()
    window.addEventListener('scroll', onScroll)
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
  }, [theme])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Ir al inicio">MR<span>.</span></a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
          <a href="#proyectos" onClick={closeMenu}>Proyectos</a>
          <a href="#experiencia" onClick={closeMenu}>Experiencia</a>
          <a href="#sobre-mi" onClick={closeMenu}>Sobre mí</a>
          <a href="#contacto" onClick={closeMenu}>Contacto</a>
        </nav>
        <div className="header-actions">
          <div className="theme-switcher" aria-label="Apariencia">
            <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')} title="Usar tema del dispositivo" aria-label="Tema automático"><Monitor /></button>
            <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')} title="Usar tema claro" aria-label="Tema claro"><Sun /></button>
            <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')} title="Usar tema oscuro" aria-label="Tema oscuro"><Moon /></button>
          </div>
          <a className="availability" href="#contacto"><span />Disponible</a>
        </div>
        <button className="menu-button" onClick={() => setMenuOpen(!menuOpen)} aria-label="Abrir menú">
          {menuOpen ? <X /> : <Menu />}
        </button>
      </header>

      <main>
        <section className="hero" id="inicio">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <p className="kicker reveal"><span>01</span> Software developer · Madrid</p>
          <div className="hero-copy">
            <h1>Construyo software<br />que convierte lo<br /><em>complejo</em> en útil.</h1>
            <p>Hola, soy <strong>Mikael Rodríguez</strong>. Diseño productos, automatizaciones y soluciones de datos e IA con una obsesión sencilla: que funcionen y generen impacto real.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#proyectos">Explorar proyectos <ArrowDownRight size={18} /></a>
            <a className="text-link" href="#sobre-mi">Conocer mi historia <ArrowRight size={17} /></a>
          </div>
          <div className="hero-stats">
            <div><strong>95<span>%</span></strong><small>Discrepancias conciliadas</small></div>
            <div><strong>185<span>K</span></strong><small>Visualizaciones en YouTube</small></div>
            <div><strong>10<span>+</span></strong><small>Años creando y aprendiendo</small></div>
          </div>
        </section>

        <section className="marquee" aria-hidden="true">
          <div>SOFTWARE <span>·</span> AUTOMATIZACIÓN <span>·</span> INTELIGENCIA ARTIFICIAL <span>·</span> PRODUCTO <span>·</span> DATOS <span>·</span></div>
        </section>

        <section className="section projects-section" id="proyectos">
          <div className="section-heading">
            <div><p className="kicker"><span>02</span> Trabajo seleccionado</p><h2>Proyectos con<br /><em>intención.</em></h2></div>
            <p>No me interesa construir por construir. Cada proyecto es una oportunidad para aprender, resolver y llevar una idea un poco más lejos.</p>
          </div>
          <div className="project-grid">
            {projects.map((project) => {
              const Icon = project.icon
              if (project.index === '03') {
                return (
                  <article className="fruit-showcase" key={project.title}>
                    <div className="fruit-content">
                      <div className="project-top"><span>{project.index}</span><span className="published-pill"><span /> Disponible en Google Play</span></div>
                      <div className="fruit-title-row">
                        <img src="/projects/fruit-drop/icon.png" alt="Icono de Fruit Drop" />
                        <div><p className="project-eyebrow">{project.eyebrow}</p><h3>{project.title}</h3></div>
                      </div>
                      <p className="project-description">{project.description}</p>
                      <div className="fruit-metrics">
                        <div><strong>100%</strong><span>Diseñado y desarrollado por mí</span></div>
                        <div><strong>4</strong><span>Sistemas de producto integrados</span></div>
                      </div>
                      <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                      <a className="store-link" href="https://play.google.com/store/apps/details?id=com.alphacreative.fruitdrop" target="_blank" rel="noreferrer">
                        Ver en Google Play <ExternalLink size={17} />
                      </a>
                    </div>
                    <div className="fruit-visual" aria-label="Imágenes del videojuego Fruit Drop">
                      <div className="fruit-feature"><img src="/projects/fruit-drop/feature.png" alt="Arte promocional de Fruit Drop con sus personajes" /></div>
                      <div className="phone-frame"><div className="phone-speaker" /><img src="/projects/fruit-drop/rankings.png" alt="Ranking global dentro de Fruit Drop" /></div>
                      <img className="floating-fruit-icon" src="/projects/fruit-drop/icon.png" alt="" aria-hidden="true" />
                    </div>
                  </article>
                )
              }
              return (
                <article className={`project-card ${project.className}`} key={project.title}>
                  <div className="project-top"><span>{project.index}</span><Icon size={28} /></div>
                  <p className="project-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  <p className="project-description">{project.description}</p>
                  <div className="project-result"><Check size={16} /> {project.result}</div>
                  <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <span className="project-link">Caso de estudio <ArrowRight size={17} /></span>
                </article>
              )
            })}
          </div>
          <div className="more-work">
            <p>También he construido mundos abiertos 3D, herramientas de ciberseguridad y proyectos editoriales.</p>
            <a href="#contacto">Hablemos de ellos <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="section capabilities-section" id="sobre-mi">
          <div className="section-heading compact">
            <div><p className="kicker"><span>03</span> Cómo aporto valor</p><h2>Curiosidad técnica.<br /><em>Criterio de producto.</em></h2></div>
          </div>
          <div className="capabilities-list">
            {capabilities.map((item) => {
              const Icon = item.icon
              return (
                <article className="capability" key={item.title}>
                  <span>{item.number}</span><Icon /><h3>{item.title}</h3><p>{item.text}</p><ChevronRight />
                </article>
              )
            })}
          </div>
          <div className="about-grid">
            <div className="about-statement">
              <span className="quote-mark">“</span>
              <p>Empecé creando videojuegos porque quería entender cómo funcionaban las cosas. Hoy sigo haciéndome la misma pregunta, pero aplicada a problemas reales de negocio.</p>
            </div>
            <div className="about-copy">
              <p>Mi trayectoria no empezó en una gran empresa ni en una universidad. Empezó aprendiendo por mi cuenta, desmontando problemas y construyendo cosas que parecían demasiado ambiciosas.</p>
              <p>Esa mezcla de iniciativa, profundidad técnica y orientación a resultados sigue siendo mi forma de trabajar.</p>
              <div className="principles">
                <span>Aprendizaje continuo</span><span>Ownership real</span><span>Impacto medible</span><span>Comunicación clara</span>
              </div>
            </div>
          </div>
        </section>

        <section className="section experience-section" id="experiencia">
          <div className="section-heading compact">
            <div><p className="kicker"><span>04</span> Trayectoria</p><h2>Aprender rápido.<br /><em>Entregar mejor.</em></h2></div>
          </div>
          <div className="timeline">
            <article className="timeline-item current">
              <div className="timeline-date">2025 — Ahora</div>
              <div><p className="timeline-company">Prosegur AVOS Tech</p><h3>Desarrollo & automatización</h3><p>Desarrollo de aplicaciones internas, automatización de procesos, conciliación financiera e infraestructura de software para operaciones BPO.</p></div>
              <span className="timeline-status">Actual</span>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">2024 — 2025</div>
              <div><p className="timeline-company">DAM · Proyecto final</p><h3>Mundo abierto en Unity 3D</h3><p>Arquitectura de entidades, IA de peatones, vehículos, streaming asíncrono y optimización gráfica en un entorno completo e interactivo.</p></div>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">2023 — 2024</div>
              <div><p className="timeline-company">DAM · Proyecto destacado</p><h3>AlphaEngine2D</h3><p>Motor gráfico desarrollado desde cero en Java, convertido en proyecto de referencia académica para promociones posteriores.</p></div>
            </article>
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div className="contact-glow" />
          <p className="kicker"><span>05</span> El siguiente proyecto</p>
          <h2>¿Construimos algo<br /><em>que importe?</em></h2>
          <p className="contact-intro">Estoy abierto a oportunidades donde pueda aportar, aprender y resolver problemas que merezcan la pena.</p>
          <a className="button button-primary contact-button" href="https://www.youtube.com/@alpha.creative" target="_blank" rel="noreferrer">Conocer Alpha Creative <ExternalLink size={18} /></a>
          <div className="social-row">
            <a href="https://www.youtube.com/@alpha.creative" target="_blank" rel="noreferrer"><Play /> YouTube</a>
          </div>
        </section>
      </main>

      <footer>
        <a className="brand" href="#inicio">MR<span>.</span></a>
        <p>Diseñado y desarrollado por Mikael Rodríguez.</p>
        <a href="#inicio">Volver arriba <ArrowRight size={15} /></a>
      </footer>
    </div>
  )
}

export default App
