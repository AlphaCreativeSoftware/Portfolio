import { ArrowRight, Bot } from 'lucide-react'
import type { Project } from '../types'
import { AlphaCreativeMark } from '../../../shared/ui/AlphaCreativeMark'

export function AiShowcase({ project }: { project: Project }) {

  return (
    <article className="ai-showcase featured-showcase">
      <div className="ai-project-meta"><span>{project.index}</span><div className="project-meta-end"><AlphaCreativeMark /><span className="ai-pill"><i /> Proyecto personal</span></div></div>
      <div className="ai-hero">
        <div className="ai-summary">
          <p className="project-eyebrow">{project.eyebrow}</p>
          <h3>{project.title}</h3>
          {project.tagline && <p className="project-tagline">{project.tagline}</p>}
          <p>{project.description}</p>
          <div className="project-tags">{project.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
        <div className="ai-chat" aria-label="Demostración de conversación con el agente de IA">
          <div className="ai-chat-header">
            <span className="ai-chat-avatar"><Bot /></span>
            <span><strong>Agente de Mikael</strong><small><i /> IA local disponible</small></span>
            <b>Privado</b>
          </div>
          <div className="ai-chat-body">
            <div className="ai-chat-message ai-chat-user">¿Qué puedes hacer por mí?</div>
            <div className="ai-chat-typing" aria-hidden="true"><i /><i /><i /></div>
            <div className="ai-chat-message ai-chat-agent">
              <span className="ai-chat-agent-icon"><Bot /></span>
              <p>Hola, soy el agente de IA de Mikael Rodríguez. Me encargo de tareas relacionadas con desarrollo y automatización: puedo responder y enviar correos con el tono que prefieras, contestar mensajes de WhatsApp y auditar aplicaciones en busca de errores y nuevas soluciones.</p>
            </div>
          </div>
          <div className="ai-chat-input"><span>Escribe una tarea…</span><ArrowRight /></div>
        </div>
      </div>
      <div className="ai-capabilities">
        <div><strong>Correo</strong><span>Redacta y responde con tu tono</span></div>
        <div><strong>Mensajería</strong><span>Contesta tus mensajes de WhatsApp</span></div>
        <div><strong>Auditoría</strong><span>Detecta errores y propone mejoras</span></div>
      </div>
    </article>
  )
}
