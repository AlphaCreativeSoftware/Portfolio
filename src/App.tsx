import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Bot,
  Boxes,
  Braces,
  CalendarDays,
  Check,
  ChevronRight,
  Code2,
  Database,
  ExternalLink,
  FileText,
  Gamepad2,
  Mail,
  Monitor,
  Moon,
  Play,
  Phone,
  Sparkles,
  Sun,
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

type MatchPath = {
  d: string
  phase: number
  grouped?: boolean
}

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

const cibelesPhases = [
  'Estandarizando millones de registros',
  'Calculando ventanas temporales',
  'Agrupando y sumando importes',
  'Contrastando descripción y tipología',
  'Auditando imputaciones existentes',
  'Generando entregables',
]

const invoiceRows = [
  { id: 'FAC-024', meta: 'ROI · 14/02 · Reforma', amount: '7.480 €', phase: 2 },
  { id: 'FAC-031', meta: 'ROI · 28/02 · Material', amount: '5.000 €', phase: 2 },
  { id: 'FAC-117', meta: 'CHURN · 03/03 · Reparación', amount: '4.220 €', phase: 3 },
  { id: 'FAC-302', meta: 'ROI · 18/03 · Obra', amount: '8.760 €', phase: 3 },
]

const adaptationRows = [
  { id: 'ADE-081', meta: 'ROI · Reforma integral', amount: '12.480 €', phase: 2 },
  { id: 'ADE-276', meta: 'ROI · Obra completa', amount: '8.760 €', phase: 3 },
  { id: 'ADE-194', meta: 'CHURN · Reparación', amount: '4.220 €', phase: 3 },
]

function CibelesShowcase() {
  const [activePhase, setActivePhase] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const stageRef = useRef<HTMLDivElement>(null)
  const [matchLayout, setMatchLayout] = useState<{ width: number; height: number; paths: MatchPath[] }>({ width: 1, height: 1, paths: [] })

  useEffect(() => {
    if (!expanded) {
      setActivePhase(0)
      return
    }
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActivePhase(cibelesPhases.length - 1)
      return
    }
    const timer = window.setInterval(() => setActivePhase((phase) => (phase + 1) % cibelesPhases.length), 1800)
    return () => window.clearInterval(timer)
  }, [expanded])

  useLayoutEffect(() => {
    const stage = stageRef.current
    if (!stage) return

    const connections = [
      { from: 0, to: 0, phase: 2, grouped: true },
      { from: 1, to: 0, phase: 2, grouped: true },
      { from: 2, to: 2, phase: 3 },
      { from: 3, to: 1, phase: 3 },
    ]

    const updateConnections = () => {
      const stageRect = stage.getBoundingClientRect()
      const paths = connections.flatMap((connection) => {
        const source = stage.querySelector<HTMLElement>(`[data-match-node="invoice-${connection.from}"] > i`)
        const target = stage.querySelector<HTMLElement>(`[data-match-node="adaptation-${connection.to}"] > i`)
        if (!source || !target) return []
        const sourceRect = source.getBoundingClientRect()
        const targetRect = target.getBoundingClientRect()
        const x1 = sourceRect.left - stageRect.left + sourceRect.width / 2
        const y1 = sourceRect.top - stageRect.top + sourceRect.height / 2
        const x2 = targetRect.left - stageRect.left + targetRect.width / 2
        const y2 = targetRect.top - stageRect.top + targetRect.height / 2
        const middle = (x1 + x2) / 2
        return [{ d: `M ${x1} ${y1} C ${middle} ${y1}, ${middle} ${y2}, ${x2} ${y2}`, phase: connection.phase, grouped: connection.grouped }]
      })
      setMatchLayout({ width: stageRect.width, height: stageRect.height, paths })
    }

    const observer = new ResizeObserver(updateConnections)
    observer.observe(stage)
    updateConnections()
    return () => observer.disconnect()
  }, [])

  return (
    <article className="cibeles-showcase">
      <div className="cibeles-project-meta"><span>01</span><span className="professional-pill"><i /> Proyecto profesional · Testa Homes</span></div>
      <div className="cibeles-heading">
        <div>
          <p className="project-eyebrow">Proyecto Cibeles · Python · Análisis de datos de negocio</p>
          <h3>De datos inconexos a<br />decisiones demostrables.</h3>
        </div>
        <div className="cibeles-summary">
          <p>Diseñé una herramienta para reconstruir la trazabilidad entre facturas de obra y adecuaciones inmobiliarias, aplicando una lógica progresiva de transformación, validación y conciliación.</p>
          <div className="project-tags"><span>Python</span><span>Conciliación financiera</span><span>Millones de registros</span><span>Reporting automático</span></div>
        </div>
      </div>

      <div className="cibeles-results">
        <div><strong>96%</strong><span>de facturas asociadas</span></div>
        <div><strong>99%</strong><span>de adecuaciones con al menos una factura</span></div>
        <div><strong>97%</strong><span>de precisión al auditar relaciones existentes</span></div>
      </div>

      <button className="details-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <span><small>Caso interactivo</small>{expanded ? 'Ocultar funcionamiento' : 'Ver cómo funciona'}</span><ChevronRight />
      </button>

      <div className={`project-details ${expanded ? 'project-details-open' : ''}`}>
        <div className="project-details-inner" aria-hidden={!expanded} inert={!expanded}>
      <div className="cibeles-demo">
        <div className="reconciliation-panel">
          <div className="demo-toolbar">
            <span className="demo-live"><i /> Motor de conciliación</span>
            <span className="python-runtime"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="" /> Python · motor activo</span>
            <span>{String(activePhase + 1).padStart(2, '0')} / 06</span>
          </div>
          <div className="phase-track">
            {cibelesPhases.map((phase, index) => <span className={index === activePhase ? 'active' : index < activePhase ? 'complete' : ''} key={phase}>{index + 1}</span>)}
          </div>
          <div className="phase-status"><span>{cibelesPhases[activePhase]}</span><span>{Math.round(((activePhase + 1) / cibelesPhases.length) * 100)}%</span></div>
          <div className="reconciliation-stage" ref={stageRef}>
            <div className="data-table">
              <div className="table-label"><Database /> Facturas <small>Perímetro A</small></div>
              {invoiceRows.map((row, index) => <div data-match-node={`invoice-${index}`} className={`data-row ${activePhase >= row.phase ? 'matched' : ''}`} key={row.id}><span><strong>{row.id}</strong><small>{row.meta}</small></span><b>{row.amount}</b><i /></div>)}
            </div>
            <svg className="match-lines" viewBox={`0 0 ${matchLayout.width} ${matchLayout.height}`} aria-hidden="true">
              {matchLayout.paths.map((path, index) => <path className={`${activePhase >= path.phase ? 'matched' : ''} ${path.grouped ? 'grouped' : ''}`} d={path.d} key={index} />)}
            </svg>
            <div className={`sum-node ${activePhase >= 2 ? 'visible' : ''}`}><span>Σ</span><strong>12.480 €</strong><small>Importe + descripción</small></div>
            <div className="data-table">
              <div className="table-label"><Boxes /> Adecuaciones <small>Perímetro B</small></div>
              {adaptationRows.map((row, index) => <div data-match-node={`adaptation-${index}`} className={`data-row reverse ${activePhase >= row.phase ? 'matched' : ''}`} key={row.id}><i /><span><strong>{row.id}</strong><small>{row.meta}</small></span><b>{row.amount}</b></div>)}
            </div>
            <div className={`historical-check ${activePhase >= 4 ? 'visible' : ''}`}><Check /> Imputación histórica revisada <strong>97% precisión</strong></div>
          </div>
        </div>

        <div className="report-panel">
          <div className="demo-toolbar"><span>Informe automático</span><span className="report-saving">Guardando…</span></div>
          <div className="report-window">
            <div className="slide-sidebar">
              {[0, 1, 2].map((slide) => <span className={activePhase >= slide + 3 ? 'ready' : ''} key={slide}><i /><i /><i /></span>)}
            </div>
            <div className="slide-canvas">
              <small>ANÁLISIS DE CONCILIACIÓN</small>
              <strong>Resumen ejecutivo</strong>
              <div className="slide-kpis"><span><b>{activePhase >= 4 ? '96%' : '—'}</b><small>Facturas asociadas</small></span><span><b>{activePhase >= 4 ? '99%' : '—'}</b><small>Adecuaciones trazadas</small></span></div>
              <div className="slide-chart">{[64, 82, 53, 92, 73, 88].map((height, index) => <i style={{ height: activePhase >= 3 ? `${height}%` : '4%' }} key={index} />)}</div>
            </div>
          </div>
          <div className="export-progress"><span style={{ width: `${((activePhase + 1) / cibelesPhases.length) * 100}%` }} /></div>
          <div className="export-row"><span><b className="powerpoint-badge">P</b> Informe ejecutivo.pptx</span><span className={activePhase === 5 ? 'export-ready' : ''}>{activePhase === 5 ? 'Generado' : 'Procesando'}</span></div>
          <div className="export-row"><span><b className="excel-badge">X</b> Detalle validado.xlsx</span><span className={activePhase === 5 ? 'export-ready' : ''}>{activePhase === 5 ? 'Generado' : 'Procesando'}</span></div>
        </div>
      </div>

      <div className="cibeles-footer">
        <p><strong>Representación conceptual.</strong> Todos los identificadores, importes y visualizaciones son sintéticos. No contiene datos, código ni documentación propiedad del cliente.</p>
        <a href="https://www.ejeprime.com/residencial/blackstone-pone-en-marcha-la-venta-de-la-cartera-de-fidere-y-recibira-ofertas-en-noviembre" target="_blank" rel="noreferrer">Contexto público de la operación <ExternalLink /></a>
      </div>
        </div>
      </div>
    </article>
  )
}

function AlphaEngineShowcase({ project }: { project: Project }) {
  const [expanded, setExpanded] = useState(false)
  const modules = [
    ['Render', 'Graphics2D, transformaciones, alpha y descarte fuera de cámara'],
    ['Escenas', 'GameState, jerarquía de objetos y transiciones con carga asíncrona'],
    ['Objetos', 'GameObject y GameEntity como base extensible por herencia'],
    ['Físicas', 'BoxCollider2D, triggers y detección direccional con márgenes'],
    ['Recursos', 'Carga centralizada de imágenes, fuentes, animaciones y sonido'],
    ['Sistemas', 'Input, UI interactiva, partículas y persistencia de datos'],
  ]

  return (
    <article className="alpha-showcase">
      <div className="alpha-project-meta"><span>02</span><span className="engine-pill"><i /> Motor propio · Java</span></div>
      <div className="alpha-summary">
        <div>
          <p className="project-eyebrow">Arquitectura · Gráficos 2D · Sistemas de juego</p>
          <h3>Un motor construido<br />desde los fundamentos.</h3>
        </div>
        <div className="alpha-summary-copy">
          <p>{project.description}</p>
          <div className="project-tags"><span>Java 17</span><span>AWT · Graphics2D</span><span>Swing · JFrame</span><span>Arquitectura propia</span></div>
        </div>
      </div>
      <div className="alpha-proof">
        <div><strong>42</strong><span>clases Java</span></div>
        <div><strong>21</strong><span>páginas de documentación</span></div>
        <div><strong>1</strong><span>juego funcional incluido</span></div>
      </div>
      <button className="details-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded}>
        <span><small>Caso interactivo</small>{expanded ? 'Ocultar arquitectura' : 'Explorar el motor'}</span><ChevronRight />
      </button>
      <div className={`project-details ${expanded ? 'project-details-open' : ''}`}>
        <div className="project-details-inner" aria-hidden={!expanded} inert={!expanded}>
          <div className="alpha-detail">
            <div className="engine-visual">
              <div className="engine-splash"><img src="/projects/alpha-engine/splash.png" alt="Pantalla de inicio de AlphaEngine2D" /></div>
              <div className="engine-console">
                <div className="console-head"><span><i /><i /><i /></span><small>AlphaEngine2D · frame pipeline</small><b>RUNNING</b></div>
                <div className="engine-pipeline">
                  {['Input', 'Update', 'Collisions', 'Render'].map((step, index) => <div className={`pipeline-step step-${index + 1}`} key={step}><span>{String(index + 1).padStart(2, '0')}</span><strong>{step}</strong><i /></div>)}
                </div>
                <div className="engine-hierarchy">
                  <span>Window.run()</span><i />
                  <span>GameState</span><i />
                  <span>SceneObjects</span><i />
                  <span>GameObject → GameEntity</span>
                </div>
              </div>
            </div>
            <div className="engine-modules">
              <div className="module-heading"><span>Sistemas del motor</span><strong>Diseñados desde cero</strong></div>
              {modules.map(([name, description], index) => <div className="engine-module" key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><p>{description}</p></div>)}
              <div className="engine-links">
                <a href="https://github.com/AlphaCreativeSoftware/AlphaEngine2D" target="_blank" rel="noreferrer"><Code2 /> Ver código <ExternalLink /></a>
                <a href="https://github.com/AlphaCreativeSoftware/AlphaEngine2D/blob/main/DOCUMENTACION(LEER).pdf" target="_blank" rel="noreferrer"><FileText /> Leer documentación <ExternalLink /></a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </article>
  )
}

function App() {
  const [menuOpen, setMenuOpen] = useState(false)
  const [fruitExpanded, setFruitExpanded] = useState(false)
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

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    return () => { document.body.style.overflow = '' }
  }, [menuOpen])

  const closeMenu = () => setMenuOpen(false)

  return (
    <div className="site-shell">
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''}`}>
        <a className="brand" href="#inicio" aria-label="Ir al inicio">MR<span>.</span></a>
        <nav className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
          <a href="#proyectos" onClick={closeMenu}><span>01</span>Proyectos</a>
          <a href="#experiencia" onClick={closeMenu}><span>02</span>Experiencia</a>
          <a href="#sobre-mi" onClick={closeMenu}><span>03</span>Sobre mí</a>
          <a href="#contacto" onClick={closeMenu}><span>04</span>Contacto</a>
        </nav>
        <div className="header-actions">
          <div className="theme-switcher" aria-label="Apariencia">
            <button className={theme === 'system' ? 'active' : ''} onClick={() => setTheme('system')} title="Usar tema del dispositivo" aria-label="Tema automático"><Monitor /></button>
            <button className={theme === 'light' ? 'active' : ''} onClick={() => setTheme('light')} title="Usar tema claro" aria-label="Tema claro"><Sun /></button>
            <button className={theme === 'dark' ? 'active' : ''} onClick={() => setTheme('dark')} title="Usar tema oscuro" aria-label="Tema oscuro"><Moon /></button>
          </div>
          <a className="availability" href="#contacto"><span />Disponible</a>
        </div>
        <button className={`menu-button ${menuOpen ? 'menu-button-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen}>
          <span className="hamburger"><i /><i /><i /></span>
        </button>
        <button className={`nav-backdrop ${menuOpen ? 'nav-backdrop-open' : ''}`} onClick={closeMenu} aria-label="Cerrar menú" tabIndex={menuOpen ? 0 : -1} />
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
            <div><strong>97<span>%</span></strong><small>Precisión sobre millones de registros</small></div>
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
              if (project.index === '01') return <CibelesShowcase key={project.title} />
              if (project.index === '02') return <AlphaEngineShowcase project={project} key={project.title} />
              if (project.index === '03') {
                return (
                  <article className={`fruit-showcase ${fruitExpanded ? 'fruit-showcase-open' : ''}`} key={project.title}>
                    <div className="fruit-content">
                      <div className="project-top"><span>{project.index}</span><span className="published-pill"><span /> Disponible en Google Play</span></div>
                      <div className="fruit-title-row">
                        <img src="/projects/fruit-drop/icon.png" alt="Icono de Fruit Drop" />
                        <div><p className="project-eyebrow">{project.eyebrow}</p><h3>{project.title}</h3></div>
                      </div>
                      <div className="fruit-summary-art"><img src="/projects/fruit-drop/feature.png" alt="Personajes y logotipo de Fruit Drop" /></div>
                      <p className="project-description">{project.description}</p>
                      <div className="fruit-metrics">
                        <div><strong>3 meses</strong><span>De desarrollo hasta publicación</span></div>
                        <div><strong>100%</strong><span>Diseñado y desarrollado por mí</span></div>
                      </div>
                      <div className="project-tags"><span>Unity · C#</span><span>Producto end-to-end</span><span>Monetización</span><span>Servicios cloud</span></div>
                      <a className="store-link" href="https://play.google.com/store/apps/details?id=com.alphacreative.fruitdrop" target="_blank" rel="noreferrer">
                        Ver en Google Play <ExternalLink size={17} />
                      </a>
                      <button className="details-toggle" onClick={() => setFruitExpanded(!fruitExpanded)} aria-expanded={fruitExpanded}>
                        <span><small>Caso interactivo</small>{fruitExpanded ? 'Ocultar funcionamiento' : 'Explorar integraciones'}</span><ChevronRight />
                      </button>
                    </div>
                    <div className={`project-details fruit-project-details ${fruitExpanded ? 'project-details-open' : ''}`}>
                      <div className="project-details-inner" aria-hidden={!fruitExpanded} inert={!fruitExpanded}>
                        <div className="fruit-detail-grid">
                          <div className="fruit-detail-copy">
                      <div className="fruit-integrations">
                        <div className="integration-heading"><span>Ecosistema de producto</span><strong>6 sistemas integrados</strong></div>
                        <div className="integration-map" aria-label="Integraciones técnicas de Fruit Drop">
                          <svg viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true">
                            <path d="M50 50 L17 18" /><path d="M50 50 L83 18" /><path d="M50 50 L12 50" />
                            <path d="M50 50 L88 50" /><path d="M50 50 L17 82" /><path d="M50 50 L83 82" />
                          </svg>
                          <div className="integration-core"><img src="/projects/fruit-drop/icon.png" alt="Fruit Drop" /><i /></div>
                          {[
                            ['UA', 'Unity Ads'], ['PS', 'Play Services'], ['GC', 'Google Cloud'],
                            ['#', 'Rankings'], ['FB', 'Firebase'], ['IAP', 'Unity IAP'],
                          ].map(([short, name], index) => <div className={`integration-node node-${index + 1}`} key={name}><b>{short}</b><span>{name}</span></div>)}
                          {[
                            ['reward +1', 'packet-1'], ['user · score', 'packet-2'], ['cloud save', 'packet-3'],
                            ['#24 ↑', 'packet-4'], ['ES · session', 'packet-5'], ['purchase ✓', 'packet-6'],
                          ].map(([message, className]) => <span className={`integration-packet ${className}`} key={message}>{message}</span>)}
                        </div>
                      </div>
                          </div>
                    <div className="fruit-visual" aria-label="Imágenes del videojuego Fruit Drop">
                      <div className="fruit-feature"><img src="/projects/fruit-drop/feature.png" alt="Arte promocional de Fruit Drop con sus personajes" /></div>
                      <div className="phone-frame"><div className="phone-speaker" /><img src="/projects/fruit-drop/rankings.png" alt="Ranking global dentro de Fruit Drop" /></div>
                      <img className="floating-fruit-icon" src="/projects/fruit-drop/icon.png" alt="" aria-hidden="true" />
                    </div>
                        </div>
                      </div>
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
              <div className="timeline-date">2026 — Ahora</div>
              <div><p className="timeline-company">Prosegur AVOS Tech · BPO Ibercaja</p><h3>Responsable de desarrollo y mantenimiento</h3><p>Evolución de aplicaciones modernas con ASP.NET, React, TypeScript y Azure, junto al mantenimiento de sistemas heredados en Delphi, C y Windows Forms.</p></div>
              <span className="timeline-status">Actual</span>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">Nov. 2025 — 2026</div>
              <div><p className="timeline-company">Testa Homes · Proyecto Cibeles</p><h3>Software de conciliación y análisis</h3><p>Primer proyecto profesional: tres meses creando en Python una solución para transformar, validar y relacionar información financiera, generando análisis e informes automatizados.</p></div>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">2024 — 2025</div>
              <div><p className="timeline-company">DAM · Proyecto final</p><h3>Mundo abierto en Unity 3D</h3><p>Arquitectura de entidades, IA de peatones, vehículos, streaming asíncrono y optimización gráfica en un entorno completo e interactivo.</p></div>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">2024 · 3 meses</div>
              <div><p className="timeline-company">Alpha Creative · Producto independiente</p><h3>Fruit Drop</h3><p>Diseño, desarrollo y publicación de un videojuego móvil completo, integrando monetización, servicios cloud, rankings globales y persistencia de datos.</p></div>
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
          <p className="contact-intro">Estoy abierto a oportunidades donde pueda aportar, aprender y resolver problemas que merezcan la pena. Elige la vía que te resulte más cómoda.</p>
          <div className="contact-actions">
            <a className="contact-card contact-card-primary" href="mailto:alphacreativesoftware@gmail.com">
              <span className="contact-icon"><Mail /></span><span><small>Contacto directo</small><strong>Escribirme por correo</strong></span><ArrowRight />
            </a>
            <a className="contact-card" href="https://www.youtube.com/@alpha.creative" target="_blank" rel="noreferrer">
              <span className="contact-icon"><Play /></span><span><small>Alpha Creative</small><strong>Visitar YouTube</strong></span><ExternalLink />
            </a>
            <a className="contact-card" href="mailto:alphacreativesoftware@gmail.com?subject=Propuesta%20de%20reuni%C3%B3n&body=Hola%20Mikael%2C%0A%0AMe%20gustar%C3%ADa%20proponerte%20una%20reuni%C3%B3n%20para%20hablar%20sobre...">
              <span className="contact-icon"><CalendarDays /></span><span><small>Primera conversación</small><strong>Proponer una reunión</strong></span><ArrowRight />
            </a>
          </div>
          <div className="contact-details">
            <a href="mailto:alphacreativesoftware@gmail.com"><Mail /> alphacreativesoftware@gmail.com</a>
            <a href="tel:+34634460084"><Phone /> +34 634 460 084</a>
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
