import { useOnceVisible } from '../../../shared/hooks/useOnceVisible'
import { experience } from '../data/experience'

export function ExperienceSection() {
  const experienceHeadingReveal = useOnceVisible<HTMLHeadingElement>(.5)

  return (
    <section className="section experience-section" id="experiencia">
      <div className="section-heading compact">
        <div><p className="kicker"><span>03</span> Trayectoria</p><h2 ref={experienceHeadingReveal.elementRef} className={experienceHeadingReveal.visible ? 'gradient-play' : ''}>Aprender rápido.<br /><em>Entregar mejor.</em></h2></div>
      </div>
      <div className="timeline">
        {experience.map((entry) => (
          <article className={entry.variant ? 'timeline-item ' + entry.variant : 'timeline-item'} key={entry.id}>
            <div className="timeline-date">{entry.date}</div>
            <div><p className="timeline-company">{entry.company}</p><h3>{entry.title}</h3><p>{entry.description}</p></div>
            {entry.status && <span className={entry.variant === 'independent' ? 'timeline-status timeline-status-independent' : 'timeline-status'}>{entry.status}</span>}
          </article>
        ))}
      </div>
    </section>
  )
}
