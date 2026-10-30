import { ExternalLink } from 'lucide-react'
import type { Project } from '../types'
import { AlphaCreativeMark } from '../../../shared/ui/AlphaCreativeMark'
import { useDisclosure } from '../../../shared/hooks/useDisclosure'
import { useOnceVisible } from '../../../shared/hooks/useOnceVisible'
import { AnimatedMetric } from '../../../shared/ui/AnimatedMetric'
import { DetailsToggle } from '../../../shared/ui/DetailsToggle'

export function FruitDropShowcase({ project }: { project: Project }) {
  const { expanded: fruitExpanded, detailsMounted: fruitDetailsMounted, toggleDetails: toggleFruitDetails } = useDisclosure()
  const fruitMetricsReveal = useOnceVisible<HTMLDivElement>()
  return (
    <article className={`fruit-showcase featured-showcase ${fruitExpanded ? 'fruit-showcase-open' : ''}`}>
      <div className="fruit-content">
        <div className="project-top"><span>{project.index}</span><div className="project-meta-end"><AlphaCreativeMark /><span className="published-pill"><span /> Disponible en Google Play</span></div></div>
        <div className="fruit-hero">
          <div className="fruit-copy">
            <div className="fruit-title-row">
              <img src="/projects/fruit-drop/icon.png" alt="Icono de Fruit Drop" loading="lazy" decoding="async" />
              <div>
                <p className="project-eyebrow">{project.eyebrow}</p>
                <h3>{project.title}</h3>
                {project.tagline && <p className="project-tagline">{project.tagline}</p>}
              </div>
            </div>
            <p className="project-description">{project.description}</p>
            <div className="fruit-metrics" ref={fruitMetricsReveal.elementRef}>
              <div><AnimatedMetric value={3} suffix=" meses" play={fruitMetricsReveal.visible} count={false} /><span>De desarrollo hasta publicación</span></div>
              <div><AnimatedMetric value={100} suffix="%" play={fruitMetricsReveal.visible} /><span>Diseñado y desarrollado por mí</span></div>
            </div>
              <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
            <a className="store-link" href="https://play.google.com/store/apps/details?id=com.alphacreative.fruitdrop" target="_blank" rel="noreferrer">
              Ver en Google Play <ExternalLink size={17} />
            </a>
            <DetailsToggle expanded={fruitExpanded} controls="fruit-drop-details" onToggle={toggleFruitDetails} openLabel="Explorar integraciones" closeLabel="Ocultar funcionamiento" />
          </div>
          <div className="fruit-product-stage" aria-label="Presentación visual de Fruit Drop">
            <img className="fruit-stage-art" src="/projects/fruit-drop/feature.png" alt="Personajes y logotipo de Fruit Drop" loading="lazy" decoding="async" />
            <img className="fruit-stage-icon" src="/projects/fruit-drop/icon.png" alt="" aria-hidden="true" loading="lazy" decoding="async" />
            <div className="fruit-stage-phone"><span /><img src="/projects/fruit-drop/rankings-card.jpg" alt="Ranking global de Fruit Drop" loading="lazy" decoding="async" fetchPriority="low" /></div>
            <span className="fruit-stage-label">Live on Google Play</span>
          </div>
        </div>
      </div>
      <div id="fruit-drop-details" className={`project-details fruit-project-details ${fruitExpanded ? 'project-details-open' : ''}`}>
        {fruitDetailsMounted && (
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
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
