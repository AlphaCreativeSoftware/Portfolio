import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties } from 'react'
import {
  ArrowDownRight,
  ArrowRight,
  Bot,
  Boxes,
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
  Sun,
} from 'lucide-react'

type Project = {
  index: string
  title: string
  tagline?: string
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

const sectionIds = ['inicio', 'proyectos', 'experiencia', 'habilidades', 'sobre-mi', 'contacto'] as const
const sectionLabels: Record<(typeof sectionIds)[number], string> = {
  inicio: 'Inicio',
  proyectos: 'Proyectos',
  experiencia: 'Experiencia',
  habilidades: 'Habilidades',
  'sobre-mi': 'Sobre mí',
  contacto: 'Contacto',
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
    tagline: 'Un ecosistema móvil ideado desde cero hasta su lanzamiento.',
    eyebrow: 'Producto · Mobile · Monetización',
    description: 'Videojuego Android diseñado, desarrollado y publicado de principio a fin, incluyendo compras, anuncios, ranking y sincronización en la nube.',
    result: 'Publicado en Google Play',
    tags: ['Unity', 'C#', 'Google Play'],
    className: 'project-orange',
    icon: Gamepad2,
  },
  {
    index: '04',
    title: 'Asistente de IA local',
    tagline: 'Inteligencia útil que respeta tus datos en tu hardware.',
    eyebrow: 'IA · Privacidad · Infraestructura',
    description: 'Ecosistema híbrido de asistentes personalizados que combina modelos locales con servicios cloud para equilibrar capacidad, coste y privacidad.',
    result: 'IA útil sobre hardware propio',
    tags: ['LLMs', 'LM Studio', 'OpenClaw'],
    className: 'project-blue',
    icon: Bot,
  },
]

const skillGroups = [
  {
    number: '01',
    title: 'Desarrollo de software',
    description: 'Aplicaciones modernas, sistemas heredados, motores y producto interactivo.',
    icon: Code2,
    skills: ['C#', 'ASP.NET / .NET', 'React', 'TypeScript', 'JavaScript', 'Python', 'Java', 'C', 'Delphi', 'Windows Forms', 'HTML & CSS', 'SQL'],
  },
  {
    number: '02',
    title: 'Cloud, datos & entrega',
    description: 'Integraciones, automatización y despliegue de soluciones de principio a fin.',
    icon: Database,
    skills: ['Azure', 'Docker', 'Git', 'GitHub', 'REST APIs', 'Firebase', 'Google Cloud', 'Vercel', 'ETL', 'Excel & PowerPoint'],
  },
  {
    number: '03',
    title: 'Entornos & creación',
    description: 'Herramientas utilizadas para programar, diseñar y construir experiencias completas.',
    icon: Boxes,
    skills: ['Visual Studio', 'VS Code', 'IntelliJ IDEA', 'Android Studio', 'Unity Editor', 'Java AWT / Swing', 'Blender', 'Mixamo'],
  },
  {
    number: '04',
    title: 'IA, sistemas & seguridad',
    description: 'IA comercial y local, infraestructura propia y laboratorios técnicos controlados.',
    icon: Bot,
    skills: ['OpenAI / ChatGPT', 'Codex', 'LM Studio', 'OpenClaw', 'LLMs locales', 'Linux', 'Kali Linux', 'Metasploit'],
  },
]

const professionalStrengths = [
  ['Aprendizaje autónomo', 'Investigo y convierto conocimiento nuevo en software funcional.'],
  ['Ownership end-to-end', 'Asumo el problema completo, desde el análisis hasta la entrega.'],
  ['Criterio de producto', 'Conecto decisiones técnicas con usuario, proceso y negocio.'],
  ['Comunicación transversal', 'Traduzco complejidad para perfiles técnicos y de dirección.'],
]

const marqueeItems = ['Software', 'Automatización', 'Inteligencia artificial', 'Producto', 'Datos']

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

function AlphaCreativeMark() {
  return (
    <span className="alpha-brand" aria-label="Proyecto de Alpha Creative" title="Alpha Creative">
      <span className="alpha-brand-logo" aria-hidden="true">
        <img className="alpha-logo-light" src="/brands/alpha-creative/logo-black.png" alt="" />
        <img className="alpha-logo-dark" src="/brands/alpha-creative/logo-white.png" alt="" />
      </span>
      <span className="alpha-brand-label">Alpha Creative</span>
    </span>
  )
}

type AnimatedMetricProps = {
  value: number
  play: boolean
  suffix?: string
  prefix?: string
  delay?: number
  duration?: number
  count?: boolean
}

function useOnceVisible<T extends HTMLElement>(threshold = .32) {
  const elementRef = useRef<T>(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const element = elementRef.current
    if (!element || visible) return
    const observer = new IntersectionObserver(([entry]) => {
      if (!entry.isIntersecting) return
      setVisible(true)
      observer.disconnect()
    }, { threshold })
    observer.observe(element)
    return () => observer.disconnect()
  }, [threshold, visible])

  return { elementRef, visible }
}

function AnimatedMetric({ value, play, suffix = '', prefix = '', delay = 0, duration = 1250, count = true }: AnimatedMetricProps) {
  const animatedRef = useRef(false)
  const [displayValue, setDisplayValue] = useState(count ? 0 : value)
  const [animating, setAnimating] = useState(false)
  const [complete, setComplete] = useState(false)

  useEffect(() => {
    if (!play || animatedRef.current) return
    let frame = 0
    let timer = 0
    animatedRef.current = true
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setDisplayValue(value)
      setComplete(true)
      return
    }
    setAnimating(true)
    if (!count) {
      timer = window.setTimeout(() => {
        setAnimating(false)
        setComplete(true)
      }, delay + duration)
      return () => window.clearTimeout(timer)
    }
    timer = window.setTimeout(() => {
      const startedAt = performance.now()
      const tick = (now: number) => {
        const progress = Math.min(1, (now - startedAt) / duration)
        const eased = 1 - Math.pow(1 - progress, 3)
        setDisplayValue(Math.round(value * eased))
        if (progress < 1) frame = window.requestAnimationFrame(tick)
        else {
          setAnimating(false)
          setComplete(true)
        }
      }
      frame = window.requestAnimationFrame(tick)
    }, delay)
    return () => {
      window.clearTimeout(timer)
      if (frame) window.cancelAnimationFrame(frame)
    }
  }, [count, delay, duration, play, value])

  return <strong className={`metric-value ${animating ? 'metric-counting' : ''} ${complete ? 'metric-complete' : ''}`} style={{ '--metric-duration': `${duration}ms` } as CSSProperties} aria-label={`${prefix}${value}${suffix}`}>{prefix}{displayValue}{suffix}</strong>
}

function CibelesShowcase() {
  const [activePhase, setActivePhase] = useState(0)
  const [expanded, setExpanded] = useState(false)
  const [isVisible, setIsVisible] = useState(false)
  const showcaseRef = useRef<HTMLElement>(null)
  const stageRef = useRef<HTMLDivElement>(null)
  const resultsReveal = useOnceVisible<HTMLDivElement>()
  const [matchLayout, setMatchLayout] = useState<{ width: number; height: number; paths: MatchPath[] }>({ width: 1, height: 1, paths: [] })

  useEffect(() => {
    if (!expanded) {
      setActivePhase(0)
      return
    }
    if (!isVisible) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      setActivePhase(cibelesPhases.length - 1)
      return
    }
    const timer = window.setInterval(() => setActivePhase((phase) => (phase + 1) % cibelesPhases.length), 1800)
    return () => window.clearInterval(timer)
  }, [expanded, isVisible])

  useEffect(() => {
    const showcase = showcaseRef.current
    if (!showcase) return
    const observer = new IntersectionObserver(([entry]) => setIsVisible(entry.isIntersecting), { rootMargin: '120px 0px', threshold: .01 })
    observer.observe(showcase)
    return () => observer.disconnect()
  }, [])

  useLayoutEffect(() => {
    if (!expanded) return
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
  }, [expanded])

  return (
    <article className="cibeles-showcase featured-showcase" ref={showcaseRef} data-visible={isVisible}>
      <div className="cibeles-project-meta"><span>01</span><span className="professional-pill"><i /><span><small>Proyecto profesional</small>Testa Homes</span></span></div>
      <div className="cibeles-heading">
        <div>
          <p className="project-eyebrow">Python · Análisis de datos de negocio</p>
          <h3>Proyecto Cibeles</h3>
          <p className="project-tagline">De datos inconexos a decisiones demostrables.</p>
        </div>
        <div className="cibeles-summary">
          <p>Diseñé una herramienta para reconstruir la trazabilidad entre facturas de obra y adecuaciones inmobiliarias, aplicando una lógica progresiva de transformación, validación y conciliación.</p>
          <div className="project-tags"><span>Python</span><span>Conciliación financiera</span><span>Millones de registros</span><span>Reporting automático</span></div>
        </div>
      </div>

      <div className="cibeles-results" ref={resultsReveal.elementRef}>
        <div><AnimatedMetric value={96} suffix="%" play={resultsReveal.visible} /><span>de facturas asociadas</span></div>
        <div><AnimatedMetric value={99} suffix="%" play={resultsReveal.visible} /><span>de adecuaciones con al menos una factura</span></div>
        <div><AnimatedMetric value={97} suffix="%" play={resultsReveal.visible} /><span>de precisión al auditar relaciones existentes</span></div>
      </div>

      <button className="details-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="cibeles-details">
        <span><small>Caso interactivo</small>{expanded ? 'Ocultar funcionamiento' : 'Ver cómo funciona'}</span><ChevronRight />
      </button>

      <div id="cibeles-details" className={`project-details ${expanded ? 'project-details-open' : ''}`}>
        <div className="project-details-inner" aria-hidden={!expanded} inert={!expanded}>
      <div className="cibeles-demo">
        <div className="reconciliation-panel">
          <div className="demo-toolbar">
            <span className="demo-live"><i /> Motor de conciliación</span>
            <span className="python-runtime"><img src="https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg" alt="" loading="lazy" decoding="async" /> Python · motor activo</span>
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
  const proofReveal = useOnceVisible<HTMLDivElement>()
  const modules = [
    ['Render', 'Graphics2D, transformaciones, alpha y descarte fuera de cámara'],
    ['Escenas', 'GameState, jerarquía de objetos y transiciones con carga asíncrona'],
    ['Objetos', 'GameObject y GameEntity como base extensible por herencia'],
    ['Físicas', 'BoxCollider2D, triggers y detección direccional con márgenes'],
    ['Recursos', 'Carga centralizada de imágenes, fuentes, animaciones y sonido'],
    ['Sistemas', 'Input, UI interactiva, partículas y persistencia de datos'],
  ]

  return (
    <article className="alpha-showcase featured-showcase">
      <div className="alpha-project-meta"><span>02</span><div className="project-meta-end"><AlphaCreativeMark /><span className="engine-pill"><i /> Motor propio · Java</span></div></div>
      <div className="alpha-summary">
        <div>
          <p className="project-eyebrow">Arquitectura · Gráficos 2D · Sistemas de juego</p>
          <h3>AlphaEngine2D</h3>
          <p className="project-tagline">Un motor construido desde los fundamentos.</p>
        </div>
        <div className="alpha-summary-copy">
          <p>{project.description}</p>
          <div className="project-tags"><span>Java 17</span><span>AWT · Graphics2D</span><span>Swing · JFrame</span><span>Arquitectura propia</span></div>
        </div>
      </div>
      <div className="alpha-proof" ref={proofReveal.elementRef}>
        <div><AnimatedMetric value={42} play={proofReveal.visible} /><span>clases Java</span></div>
        <div><AnimatedMetric value={21} play={proofReveal.visible} /><span>páginas de documentación</span></div>
        <div><AnimatedMetric value={1} play={proofReveal.visible} count={false} /><span>juego funcional incluido</span></div>
      </div>
      <button className="details-toggle" onClick={() => setExpanded(!expanded)} aria-expanded={expanded} aria-controls="alpha-engine-details">
        <span><small>Caso interactivo</small>{expanded ? 'Ocultar arquitectura' : 'Explorar el motor'}</span><ChevronRight />
      </button>
      <div id="alpha-engine-details" className={`project-details ${expanded ? 'project-details-open' : ''}`}>
        <div className="project-details-inner" aria-hidden={!expanded} inert={!expanded}>
          <div className="alpha-detail">
            <div className="engine-visual">
              <div className="engine-splash"><img src="/projects/alpha-engine/splash.png" alt="Pantalla de inicio de AlphaEngine2D" loading="lazy" decoding="async" /></div>
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
  const navRef = useRef<HTMLElement>(null)
  const menuButtonRef = useRef<HTMLButtonElement>(null)
  const marqueeRef = useRef<HTMLElement>(null)
  const scrollProgressRef = useRef<HTMLSpanElement>(null)
  const scrolledRef = useRef(false)
  const activeSectionRef = useRef('inicio')
  const indicatorTimerRef = useRef<number | null>(null)
  const navigationTargetRef = useRef<string | null>(null)
  const navigationTimerRef = useRef<number | null>(null)
  const fruitMetricsReveal = useOnceVisible<HTMLDivElement>()
  const [menuOpen, setMenuOpen] = useState(false)
  const [fruitExpanded, setFruitExpanded] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [activeSection, setActiveSection] = useState('inicio')
  const [navIndicator, setNavIndicator] = useState({ x: 0, y: 0, width: 0, height: 0, visible: false, moving: false })
  const [theme, setTheme] = useState<Theme>(() => (localStorage.getItem('portfolio-theme') as Theme) || 'system')
  const updateActiveSection = (section: string) => {
    if (activeSectionRef.current === section) return
    activeSectionRef.current = section
    setActiveSection(section)
  }

  useEffect(() => {
    let frame = 0
    const updatePageState = () => {
      frame = 0
      const nextScrolled = window.scrollY > 24
      if (scrolledRef.current !== nextScrolled) {
        scrolledRef.current = nextScrolled
        setScrolled(nextScrolled)
      }
      const scrollable = document.documentElement.scrollHeight - window.innerHeight
      const progress = scrollable > 0 ? window.scrollY / scrollable : 0
      if (scrollProgressRef.current) scrollProgressRef.current.style.transform = `scaleX(${Math.min(1, Math.max(0, progress))})`
      document.documentElement.style.setProperty('--scroll-y', `${window.scrollY}px`)

      const marker = window.innerHeight * .32
      const navigationTarget = navigationTargetRef.current
      if (navigationTarget) {
        const destination = document.getElementById(navigationTarget)
        const destinationBox = destination?.getBoundingClientRect()
        if (!destinationBox || destinationBox.top > marker || destinationBox.bottom <= marker) return
        navigationTargetRef.current = null
        if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
        updateActiveSection(navigationTarget)
        return
      }

      let currentSection = 'inicio'
      for (const id of sectionIds) {
        const section = document.getElementById(id)
        if (section && section.getBoundingClientRect().top <= marker) currentSection = id
        else break
      }
      if (window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 2) currentSection = 'contacto'
      updateActiveSection(currentSection)
    }
    const onScroll = () => {
      if (!frame) frame = window.requestAnimationFrame(updatePageState)
    }
    updatePageState()
    const pageResizeObserver = new ResizeObserver(onScroll)
    pageResizeObserver.observe(document.documentElement)
    window.addEventListener('scroll', onScroll)
    window.addEventListener('resize', onScroll)
    return () => {
      if (frame) window.cancelAnimationFrame(frame)
      pageResizeObserver.disconnect()
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('resize', onScroll)
    }
  }, [])

  useLayoutEffect(() => {
    let disposed = false
    let retryTimer: number | null = null
    const updateIndicator = () => {
      const nav = navRef.current
      const target = nav?.querySelector<HTMLAnchorElement>(`a[href="#${activeSection}"]`)
      if (!nav || !target) {
        setNavIndicator((current) => ({ ...current, visible: false }))
        return
      }
      const navBox = nav.getBoundingClientRect()
      const targetBox = target.getBoundingClientRect()
      if (targetBox.width < 1 || targetBox.height < 1) {
        retryTimer = window.setTimeout(updateIndicator, 80)
        return
      }
      setNavIndicator((current) => {
        const next = {
          x: targetBox.left - navBox.left,
          y: targetBox.top - navBox.top,
          width: targetBox.width,
          height: targetBox.height,
        }
        const changed = !current.visible || Math.abs(current.x - next.x) > .5 || Math.abs(current.y - next.y) > .5 || Math.abs(current.width - next.width) > .5
        return { ...next, visible: true, moving: changed }
      })
      if (indicatorTimerRef.current) window.clearTimeout(indicatorTimerRef.current)
      indicatorTimerRef.current = window.setTimeout(() => {
        setNavIndicator((current) => ({ ...current, moving: false }))
      }, 520)
    }
    const frame = window.requestAnimationFrame(updateIndicator)
    const settleTimer = window.setTimeout(updateIndicator, 180)
    const resizeObserver = new ResizeObserver(updateIndicator)
    if (navRef.current) resizeObserver.observe(navRef.current)
    document.fonts?.ready.then(() => { if (!disposed) updateIndicator() })
    window.addEventListener('resize', updateIndicator)
    return () => {
      disposed = true
      window.cancelAnimationFrame(frame)
      window.clearTimeout(settleTimer)
      if (retryTimer) window.clearTimeout(retryTimer)
      resizeObserver.disconnect()
      window.removeEventListener('resize', updateIndicator)
      if (indicatorTimerRef.current) window.clearTimeout(indicatorTimerRef.current)
    }
  }, [activeSection, menuOpen])

  useLayoutEffect(() => {
    const targets = document.querySelectorAll<HTMLElement>('.section-heading, .project-card, .cibeles-showcase, .alpha-showcase, .fruit-showcase, .timeline-item, .skill-group, .strengths-panel, .about-profile, .work-method, .about-now, .contact-card')
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
      targets.forEach((target) => target.classList.add('in-view'))
      return
    }
    targets.forEach((target, index) => {
      target.classList.add('scroll-reveal')
      target.style.setProperty('--reveal-delay', `${(index % 4) * 55}ms`)
    })
    const revealObserver = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) return
        entry.target.classList.add('in-view')
        revealObserver.unobserve(entry.target)
      })
    }, { rootMargin: '0px 0px -8% 0px', threshold: .08 })
    targets.forEach((target) => revealObserver.observe(target))
    return () => revealObserver.disconnect()
  }, [])

  useEffect(() => {
    const marquee = marqueeRef.current
    if (!marquee) return
    const observer = new IntersectionObserver(([entry]) => marquee.classList.toggle('marquee-running', entry.isIntersecting), { threshold: .01 })
    observer.observe(marquee)
    return () => observer.disconnect()
  }, [])

  useEffect(() => {
    document.documentElement.dataset.theme = theme
    localStorage.setItem('portfolio-theme', theme)
    const systemTheme = window.matchMedia('(prefers-color-scheme: dark)')
    const syncBrowserTheme = () => {
      const darkTheme = theme === 'dark' || (theme === 'system' && systemTheme.matches)
      document.querySelector<HTMLMetaElement>('meta[name="theme-color"]')?.setAttribute('content', darkTheme ? '#000000' : '#ffffff')
    }
    syncBrowserTheme()
    if (theme === 'system') systemTheme.addEventListener('change', syncBrowserTheme)
    return () => systemTheme.removeEventListener('change', syncBrowserTheme)
  }, [theme])

  useEffect(() => {
    document.body.style.overflow = menuOpen ? 'hidden' : ''
    if (!menuOpen) return () => { document.body.style.overflow = '' }
    const closeOnEscape = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') return
      setMenuOpen(false)
      window.requestAnimationFrame(() => menuButtonRef.current?.focus())
    }
    const desktopQuery = window.matchMedia('(min-width: 901px)')
    const closeOnDesktop = (event: MediaQueryListEvent) => { if (event.matches) setMenuOpen(false) }
    window.addEventListener('keydown', closeOnEscape)
    desktopQuery.addEventListener('change', closeOnDesktop)
    return () => {
      document.body.style.overflow = ''
      window.removeEventListener('keydown', closeOnEscape)
      desktopQuery.removeEventListener('change', closeOnDesktop)
    }
  }, [menuOpen])

  useEffect(() => () => {
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
  }, [])

  useEffect(() => {
    const cancelProgrammaticNavigation = () => {
      if (!navigationTargetRef.current) return
      navigationTargetRef.current = null
      if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
      window.dispatchEvent(new Event('scroll'))
    }
    window.addEventListener('wheel', cancelProgrammaticNavigation, { passive: true })
    window.addEventListener('touchstart', cancelProgrammaticNavigation, { passive: true })
    return () => {
      window.removeEventListener('wheel', cancelProgrammaticNavigation)
      window.removeEventListener('touchstart', cancelProgrammaticNavigation)
    }
  }, [])

  const closeMenu = () => setMenuOpen(false)
  const currentSectionLabel = sectionLabels[activeSection as keyof typeof sectionLabels] || 'Inicio'
  const navigateTo = (section: string) => {
    const restoreMenuFocus = menuOpen
    navigationTargetRef.current = section
    updateActiveSection(section)
    closeMenu()
    if (restoreMenuFocus) window.requestAnimationFrame(() => menuButtonRef.current?.focus({ preventScroll: true }))
    if (navigationTimerRef.current) window.clearTimeout(navigationTimerRef.current)
    navigationTimerRef.current = window.setTimeout(() => {
      navigationTargetRef.current = null
      window.dispatchEvent(new Event('scroll'))
    }, 1400)
  }

  return (
    <div className="site-shell">
      <a className="skip-link" href="#main-content">Saltar al contenido</a>
      <header className={`topbar ${scrolled ? 'topbar-scrolled' : ''} ${menuOpen ? 'topbar-menu-open' : ''}`}>
        <span className="scroll-progress" ref={scrollProgressRef} />
        <a className="brand" href="#inicio" aria-label="Ir al inicio" onClick={() => navigateTo('inicio')}>MR<span>.</span></a>
        <span className="mobile-section-label" key={activeSection}>{currentSectionLabel}</span>
        <nav id="site-navigation" ref={navRef} className={menuOpen ? 'nav nav-open' : 'nav'} aria-label="Navegación principal">
          <span
            className={`nav-indicator ${navIndicator.visible ? 'nav-indicator-visible' : ''} ${navIndicator.moving ? 'nav-indicator-moving' : ''}`}
            style={{
              '--indicator-x': `${navIndicator.x}px`,
              '--indicator-y': `${navIndicator.y}px`,
              '--indicator-width': `${navIndicator.width}px`,
              '--indicator-height': `${navIndicator.height}px`,
            } as CSSProperties}
            aria-hidden="true"
          ><i /></span>
          <a className={activeSection === 'proyectos' ? 'active' : ''} aria-current={activeSection === 'proyectos' ? 'page' : undefined} href="#proyectos" onClick={() => navigateTo('proyectos')}><span>02</span>Proyectos</a>
          <a className={activeSection === 'experiencia' ? 'active' : ''} aria-current={activeSection === 'experiencia' ? 'page' : undefined} href="#experiencia" onClick={() => navigateTo('experiencia')}><span>03</span>Experiencia</a>
          <a className={activeSection === 'habilidades' ? 'active' : ''} aria-current={activeSection === 'habilidades' ? 'page' : undefined} href="#habilidades" onClick={() => navigateTo('habilidades')}><span>04</span>Habilidades</a>
          <a className={activeSection === 'sobre-mi' ? 'active' : ''} aria-current={activeSection === 'sobre-mi' ? 'page' : undefined} href="#sobre-mi" onClick={() => navigateTo('sobre-mi')}><span>05</span>Sobre mí</a>
          <a className={activeSection === 'contacto' ? 'active' : ''} aria-current={activeSection === 'contacto' ? 'page' : undefined} href="#contacto" onClick={() => navigateTo('contacto')}><span>06</span>Contacto</a>
        </nav>
        <div className="header-actions">
          <div className="theme-switcher" data-active-theme={theme} role="group" aria-label="Apariencia">
            <button className={theme === 'system' ? 'active' : ''} aria-pressed={theme === 'system'} onClick={() => setTheme('system')} title="Usar tema del dispositivo" aria-label="Tema automático"><Monitor /></button>
            <button className={theme === 'light' ? 'active' : ''} aria-pressed={theme === 'light'} onClick={() => setTheme('light')} title="Usar tema claro" aria-label="Tema claro"><Sun /></button>
            <button className={theme === 'dark' ? 'active' : ''} aria-pressed={theme === 'dark'} onClick={() => setTheme('dark')} title="Usar tema oscuro" aria-label="Tema oscuro"><Moon /></button>
          </div>
          <a className="availability" href="#contacto" onClick={() => navigateTo('contacto')}><span />Disponible</a>
        </div>
        <button ref={menuButtonRef} className={`menu-button ${menuOpen ? 'menu-button-open' : ''}`} onClick={() => setMenuOpen(!menuOpen)} aria-label={menuOpen ? 'Cerrar menú' : 'Abrir menú'} aria-expanded={menuOpen} aria-controls="site-navigation">
          <span className="hamburger"><i /><i /><i /></span>
        </button>
        <button className={`nav-backdrop ${menuOpen ? 'nav-backdrop-open' : ''}`} onClick={() => { closeMenu(); window.requestAnimationFrame(() => menuButtonRef.current?.focus()) }} aria-label="Cerrar menú" tabIndex={menuOpen ? 0 : -1} />
      </header>

      <main id="main-content" tabIndex={-1}>
        <section className="hero" id="inicio">
          <div className="hero-orbit orbit-one" />
          <div className="hero-orbit orbit-two" />
          <p className="kicker reveal"><span>01</span> Software developer · Madrid</p>
          <div className="hero-copy">
            <h1>Construyo software<br />que convierte lo<br /><em>complejo</em> en útil.</h1>
            <p>Hola, soy <strong>Mikael Rodríguez</strong>. Diseño productos, automatizaciones y soluciones de datos e IA con una obsesión sencilla: que funcionen y generen impacto real.</p>
          </div>
          <div className="hero-actions">
            <a className="button button-primary" href="#proyectos" onClick={() => navigateTo('proyectos')}>Explorar proyectos <ArrowDownRight size={18} /></a>
            <a className="text-link" href="#sobre-mi" onClick={() => navigateTo('sobre-mi')}>Conocer mi historia <ArrowRight size={17} /></a>
          </div>
          <div className="hero-stats">
            <div><strong>97<span>%</span></strong><small>Precisión sobre millones de registros</small></div>
            <div><strong>185<span>K</span></strong><small>Visualizaciones en YouTube</small></div>
            <div><strong>10<span>+</span></strong><small>Años creando y aprendiendo</small></div>
          </div>
        </section>

        <section className="marquee" ref={marqueeRef} aria-hidden="true">
          <div className="marquee-track">
            {[0, 1].map((copy) => <div className="marquee-group" key={copy}>{marqueeItems.map((item) => <span key={item}>{item}<i>·</i></span>)}</div>)}
          </div>
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
                  <article className={`fruit-showcase featured-showcase ${fruitExpanded ? 'fruit-showcase-open' : ''}`} key={project.title}>
                    <div className="fruit-content">
                      <div className="project-top"><span>{project.index}</span><div className="project-meta-end"><AlphaCreativeMark /><span className="published-pill"><span /> Disponible en Google Play</span></div></div>
                      <div className="fruit-title-row">
                        <img src="/projects/fruit-drop/icon.png" alt="Icono de Fruit Drop" loading="lazy" decoding="async" />
                        <div>
                          <p className="project-eyebrow">{project.eyebrow}</p>
                          <h3>{project.title}</h3>
                          {project.tagline && <p className="project-tagline">{project.tagline}</p>}
                        </div>
                      </div>
                      <div className="fruit-summary-art"><img src="/projects/fruit-drop/feature.png" alt="Personajes y logotipo de Fruit Drop" loading="lazy" decoding="async" /></div>
                      <p className="project-description">{project.description}</p>
                      <div className="fruit-metrics" ref={fruitMetricsReveal.elementRef}>
                        <div><AnimatedMetric value={3} suffix=" meses" play={fruitMetricsReveal.visible} count={false} /><span>De desarrollo hasta publicación</span></div>
                        <div><AnimatedMetric value={100} suffix="%" play={fruitMetricsReveal.visible} /><span>Diseñado y desarrollado por mí</span></div>
                      </div>
                      <div className="project-tags"><span>Unity · C#</span><span>Producto end-to-end</span><span>Monetización</span><span>Servicios cloud</span></div>
                      <a className="store-link" href="https://play.google.com/store/apps/details?id=com.alphacreative.fruitdrop" target="_blank" rel="noreferrer">
                        Ver en Google Play <ExternalLink size={17} />
                      </a>
                      <button className="details-toggle" onClick={() => setFruitExpanded(!fruitExpanded)} aria-expanded={fruitExpanded} aria-controls="fruit-drop-details">
                        <span><small>Caso interactivo</small>{fruitExpanded ? 'Ocultar funcionamiento' : 'Explorar integraciones'}</span><ChevronRight />
                      </button>
                    </div>
                    <div id="fruit-drop-details" className={`project-details fruit-project-details ${fruitExpanded ? 'project-details-open' : ''}`}>
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
                          <div className="integration-core"><img src="/projects/fruit-drop/icon.png" alt="Fruit Drop" loading="lazy" decoding="async" /><i /></div>
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
                      <div className="fruit-feature"><img src="/projects/fruit-drop/feature.png" alt="Arte promocional de Fruit Drop con sus personajes" loading="lazy" decoding="async" /></div>
                      <div className="phone-frame"><div className="phone-speaker" /><img src="/projects/fruit-drop/rankings.png" alt="Ranking global dentro de Fruit Drop" loading="lazy" decoding="async" /></div>
                      <img className="floating-fruit-icon" src="/projects/fruit-drop/icon.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
                    </div>
                        </div>
                      </div>
                    </div>
                  </article>
                )
              }
              return (
                <article className={`project-card ${project.className}`} key={project.title}>
                  <div className="project-top"><span>{project.index}</span><div className="project-meta-end"><AlphaCreativeMark /><Icon size={28} /></div></div>
                  <p className="project-eyebrow">{project.eyebrow}</p>
                  <h3>{project.title}</h3>
                  {project.tagline && <p className="project-tagline">{project.tagline}</p>}
                  <p className="project-description">{project.description}</p>
                  <div className="project-result"><Check size={16} /> {project.result}</div>
                  <div className="tag-list">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
                  <span className="project-status"><Check size={14} /> Proyecto personal</span>
                </article>
              )
            })}
          </div>
          <div className="more-work">
            <p>También he construido mundos abiertos 3D, herramientas de ciberseguridad y proyectos editoriales.</p>
            <a href="#contacto" onClick={() => navigateTo('contacto')}>Hablemos de ellos <ArrowRight size={17} /></a>
          </div>
        </section>

        <section className="section experience-section" id="experiencia">
          <div className="section-heading compact">
            <div><p className="kicker"><span>03</span> Trayectoria</p><h2>Aprender rápido.<br /><em>Entregar mejor.</em></h2></div>
          </div>
          <div className="timeline">
            <article className="timeline-item current">
              <div className="timeline-date">Feb. 2026 — Ahora</div>
              <div><p className="timeline-company">Prosegur AVOS Tech · BPO Ibercaja</p><h3>Responsable de desarrollo y mantenimiento</h3><p>Desarrollo de nuevas aplicaciones y evolución de soluciones existentes con ASP.NET, React, TypeScript y Azure. Estimación y organización del trabajo técnico, junto con la gestión de aplicaciones y componentes críticos de la red operativa del BPO. Responsabilidad también sobre sistemas heredados en Delphi, C y Windows Forms.</p></div>
              <span className="timeline-status">Actual</span>
            </article>
            <article className="timeline-item independent">
              <div className="timeline-date">2020 — Actualidad</div>
              <div><p className="timeline-company">Alpha Creative · Marca propia</p><h3>Fundador y creador de producto</h3><p>Creación y desarrollo de una marca independiente bajo la que diseño, publico y comercializo software, productos digitales y proyectos editoriales. Gestión end-to-end de producto, identidad, contenido, distribución y presencia online.</p></div>
              <span className="timeline-status timeline-status-independent">En activo</span>
            </article>
            <article className="timeline-item">
              <div className="timeline-date">Nov. 2025 — Feb. 2026</div>
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

        <section className="section skills-section" id="habilidades">
          <div className="section-heading">
            <div><p className="kicker"><span>04</span> Habilidades</p><h2>Un stack amplio.<br /><em>Un mismo criterio.</em></h2></div>
            <p>Tecnologías y herramientas que he utilizado para construir aplicaciones empresariales, productos propios, automatizaciones y experiencias interactivas.</p>
          </div>
          <div className="skills-matrix">
            {skillGroups.map((group) => {
              const Icon = group.icon
              return (
                <article className="skill-group" key={group.title}>
                  <div className="skill-group-heading">
                    <span>{group.number}</span>
                    <Icon />
                    <div><h3>{group.title}</h3><p>{group.description}</p></div>
                  </div>
                  <div className="skill-tags">
                    {group.skills.map((skill) => <span key={skill}>{skill}</span>)}
                  </div>
                </article>
              )
            })}
          </div>
          <div className="strengths-panel">
            <div className="strengths-intro"><span>Más allá del stack</span><h3>Cómo aporto al equipo</h3></div>
            {professionalStrengths.map(([title, text]) => <article key={title}><h4>{title}</h4><p>{text}</p></article>)}
          </div>
        </section>

        <section className="section capabilities-section" id="sobre-mi">
          <div className="section-heading about-heading">
            <div><p className="kicker"><span>05</span> Cómo trabajo</p><h2>Ingeniería con<br /><em>visión de producto.</em></h2></div>
            <p>Construyo software entendiendo el sistema completo: la tecnología, el usuario, el proceso y el objetivo de negocio.</p>
          </div>
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
          <div className="work-method" aria-label="Mi proceso de trabajo">
            <div className="method-label"><span>Mi proceso</span><strong>Del problema al resultado</strong></div>
            <article><span>01</span><h3>Entender</h3><p>Contexto, usuario, proceso y restricciones.</p></article>
            <article><span>02</span><h3>Diseñar</h3><p>Arquitectura, experiencia e integraciones.</p></article>
            <article><span>03</span><h3>Construir</h3><p>Desarrollo end-to-end con ownership real.</p></article>
            <article><span>04</span><h3>Validar</h3><p>Datos, feedback e impacto medible.</p></article>
          </div>
          <div className="about-now">
            <span><i /> Ahora</span><p>Responsable de desarrollo y mantenimiento de aplicaciones en el BPO de Ibercaja.</p><strong>Madrid · Software · Producto · IA aplicada</strong>
          </div>
        </section>

        <section className="contact-section" id="contacto">
          <div className="contact-glow" />
          <p className="kicker"><span>06</span> El siguiente proyecto</p>
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
        <a className="brand" href="#inicio" onClick={() => navigateTo('inicio')}>MR<span>.</span></a>
        <p>Diseñado y desarrollado por Mikael Rodríguez.</p>
        <a href="#inicio" onClick={() => navigateTo('inicio')}>Volver arriba <ArrowRight size={15} /></a>
      </footer>
    </div>
  )
}

export default App
