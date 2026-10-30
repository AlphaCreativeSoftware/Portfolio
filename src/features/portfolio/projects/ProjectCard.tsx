import { Check } from 'lucide-react'
import type { Project } from '../types'
import { AlphaCreativeMark } from '../../../shared/ui/AlphaCreativeMark'

export function ProjectCard({ project }: { project: Project }) {
  const Icon = project.icon
  return (
    <article className={`project-card ${project.className}`}>
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
}
