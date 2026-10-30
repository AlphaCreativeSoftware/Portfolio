import { useRef } from 'react'
import type { CSSProperties } from 'react'
import { Code2, ExternalLink, FileText } from 'lucide-react'
import type { Project } from '../types'
import { AlphaCreativeMark } from '../../../shared/ui/AlphaCreativeMark'
import { useDisclosure } from '../../../shared/hooks/useDisclosure'
import { useOnceVisible } from '../../../shared/hooks/useOnceVisible'
import { useViewportVideo } from '../../../shared/hooks/useViewportVideo'
import { AnimatedMetric } from '../../../shared/ui/AnimatedMetric'
import { DetailsToggle } from '../../../shared/ui/DetailsToggle'
import { engineModules } from '../data/alpha-engine'

export function AlphaEngineShowcase({ project }: { project: Project }) {
  const { expanded, detailsMounted, toggleDetails } = useDisclosure()
  const videoRef = useRef<HTMLVideoElement>(null)
  const proofReveal = useOnceVisible<HTMLDivElement>()

  useViewportVideo(videoRef)

  return (
    <article className="alpha-showcase featured-showcase">
      <div className="alpha-project-meta"><span>{project.index}</span><div className="project-meta-end"><AlphaCreativeMark /><span className="engine-pill"><i /> Proyecto educativo</span></div></div>
      <div className="alpha-hero">
        <div className="alpha-summary">
          <p className="project-eyebrow">{project.eyebrow}</p>
          <h3>{project.title}</h3>
          <p className="project-tagline">{project.tagline}</p>
          <p>{project.description}</p>
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="alpha-media-stage">
          <div className="media-chrome"><span><i /><i /><i /></span><small>AlphaEngine2D · Vista previa</small><b><i /> En ejecución</b></div>
          <div className="media-canvas">
            <video ref={videoRef} muted loop playsInline preload="none" poster="/projects/alpha-engine/splash.png" aria-label="Demostración en vídeo de AlphaEngine2D" disablePictureInPicture>
              <source src="/projects/alpha-engine/video_1.webm" type="video/webm" />
              <source src="/projects/alpha-engine/video_1.mp4" type="video/mp4" />
            </video>
            <span className="media-badge">Java · Graphics2D</span>
          </div>
          <div className="media-pipeline" aria-hidden="true">
            {['Entrada', 'Actualización', 'Física', 'Renderizado'].map((step, index) => <span key={step}><i style={{ '--step': index } as CSSProperties} />{step}</span>)}
          </div>
        </div>
      </div>
      <div className="alpha-proof" ref={proofReveal.elementRef}>
        <div><AnimatedMetric value={42} play={proofReveal.visible} /><span>clases Java</span></div>
        <div><AnimatedMetric value={21} play={proofReveal.visible} /><span>páginas de documentación</span></div>
        <div><AnimatedMetric value={1} play={proofReveal.visible} count={false} /><span>juego funcional incluido</span></div>
      </div>
      <DetailsToggle expanded={expanded} controls="alpha-engine-details" onToggle={toggleDetails} openLabel="Explorar el motor" closeLabel="Ocultar arquitectura" />
      <div id="alpha-engine-details" className={`project-details ${expanded ? 'project-details-open' : ''}`}>
        {detailsMounted && (
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
                {engineModules.map(([name, description], index) => <div className="engine-module" key={name}><span>{String(index + 1).padStart(2, '0')}</span><strong>{name}</strong><p>{description}</p></div>)}
                <div className="engine-links">
                  <a href="https://github.com/AlphaCreativeSoftware/AlphaEngine2D" target="_blank" rel="noreferrer"><Code2 /> Ver código <ExternalLink /></a>
                  <a href="https://github.com/AlphaCreativeSoftware/AlphaEngine2D/blob/main/DOCUMENTACION(LEER).pdf" target="_blank" rel="noreferrer"><FileText /> Leer documentación <ExternalLink /></a>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  )
}
