import { professionalStrengths, skillGroups } from '../data/skills'
import { SectionHeading } from '../../../shared/ui/SectionHeading'

export function SkillsSection() {

  return (
    <section className="section skills-section" id="habilidades">
      <SectionHeading number="04" eyebrow="Habilidades" title={<>Un stack amplio.<br /><em>Un mismo criterio.</em></>} description="Tecnologías y herramientas que he utilizado para construir aplicaciones empresariales, productos propios, automatizaciones y experiencias interactivas." />
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
  )
}
