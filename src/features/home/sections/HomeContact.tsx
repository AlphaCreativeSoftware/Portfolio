import { ArrowUpRight, Mail } from 'lucide-react'
import { site } from '../../../shared/config/site'

export function HomeContact() {
  return (
    <section className="home-contact home-container" id="contacto" aria-labelledby="home-contact-title">
      <div><p className="home-eyebrow">02 / Contacto</p><h2 id="home-contact-title">Contacto<br /><em>profesional.</em></h2></div>
      <div className="home-contact-copy"><p>Para propuestas de colaboración, consultas sobre mis proyectos o contacto profesional.</p>
        <a className="home-email-link" href={'mailto:' + site.email}><Mail size={18} /><span>{site.email}</span><ArrowUpRight size={18} /></a>
        <a className="home-quiet-link" href={site.social.linkedin} target="_blank" rel="noreferrer">Perfil en LinkedIn<ArrowUpRight size={15} /></a>
      </div>
    </section>
  )
}
