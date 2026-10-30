import { ArrowRight } from 'lucide-react'
import type { ComponentType } from 'react'
import type { Project, ProjectPresentation } from '../types'
import { SectionHeading } from '../../../shared/ui/SectionHeading'
import { projects } from '../data/projects'
import { CibelesShowcase } from '../projects/CibelesShowcase'
import { AlphaEngineShowcase } from '../projects/AlphaEngineShowcase'
import { FruitDropShowcase } from '../projects/FruitDropShowcase'
import { AiShowcase } from '../projects/AiShowcase'
import { ProjectCard } from '../projects/ProjectCard'

const presentations: Record<ProjectPresentation, ComponentType<{ project: Project }>> = {
  cibeles: CibelesShowcase,
  'alpha-engine': AlphaEngineShowcase,
  'fruit-drop': FruitDropShowcase,
  assistant: AiShowcase,
  standard: ProjectCard,
}

export function ProjectsSection({ navigateTo }: { navigateTo: (section: string) => void }) {

  return (
    <section className="section projects-section" id="proyectos">
      <SectionHeading number="02" eyebrow="Trabajo seleccionado" title={<>Proyectos con<br /><em>intención.</em></>} description="No me interesa construir por construir. Cada proyecto es una oportunidad para aprender, resolver y llevar una idea un poco más lejos." />
      <div className="project-grid">
        {projects.map((project) => {
          const Showcase = presentations[project.presentation]
          return <Showcase project={project} key={project.id} />
        })}
      </div>
      <div className="more-work">
        <p>También he construido mundos abiertos 3D, herramientas de ciberseguridad y proyectos editoriales.</p>
        <a href="#contacto" onClick={() => navigateTo('contacto')}>Hablemos de ellos <ArrowRight size={17} /></a>
      </div>
    </section>
  )
}
