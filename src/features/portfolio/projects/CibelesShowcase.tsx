import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import { Boxes, Check, Database, ExternalLink } from 'lucide-react'
import { useDisclosure } from '../../../shared/hooks/useDisclosure'
import { useOnceVisible } from '../../../shared/hooks/useOnceVisible'
import { AnimatedMetric } from '../../../shared/ui/AnimatedMetric'
import { DetailsToggle } from '../../../shared/ui/DetailsToggle'
import { adaptationRows, cibelesPhases, invoiceRows } from '../data/cibeles'
import type { Project } from '../types'

type MatchPath = {
  d: string
  phase: number
  grouped?: boolean
}

export function CibelesShowcase({ project }: { project: Project }) {
  const [activePhase, setActivePhase] = useState(0)
  const { expanded, detailsMounted, toggleDetails } = useDisclosure()
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
      <div className="cibeles-project-meta"><span>{project.index}</span><span className="professional-pill"><i /><span>Proyecto profesional</span></span></div>
      <div className="cibeles-hero">
        <div className="cibeles-heading">
          <p className="project-eyebrow">{project.eyebrow}</p>
          <h3>{project.title}</h3>
          <p className="project-tagline">{project.tagline}</p>
          <p>{project.description}</p>
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </div>

      <div className="cibeles-results" ref={resultsReveal.elementRef}>
        <div><AnimatedMetric value={96} suffix="%" play={resultsReveal.visible} /><span>de facturas asociadas</span></div>
        <div><AnimatedMetric value={99} suffix="%" play={resultsReveal.visible} /><span>de adecuaciones con al menos una factura</span></div>
        <div><AnimatedMetric value={97} suffix="%" play={resultsReveal.visible} /><span>de precisión al auditar relaciones existentes</span></div>
      </div>

      <DetailsToggle expanded={expanded} controls="cibeles-details" onToggle={toggleDetails} openLabel="Ver cómo funciona" closeLabel="Ocultar funcionamiento" />

      <div id="cibeles-details" className={`project-details ${expanded ? 'project-details-open' : ''}`}>
        {detailsMounted && (
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
        )}
      </div>
    </article>
  )
}
