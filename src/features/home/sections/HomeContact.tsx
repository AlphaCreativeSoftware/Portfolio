import { ArrowUpRight, Mail } from 'lucide-react'
import { site } from '../../../shared/config/site'

export function HomeContact() {
  return (
    <section className="home-contact home-container" id="contacto" aria-labelledby="home-contact-title">
      <div><p className="home-eyebrow">03 / La siguiente conversación</p><h2 id="home-contact-title">¿Tienes algo<br /><em>en mente?</em></h2></div>
      <div className="home-contact-copy"><p>Una idea, un reto técnico o una oportunidad.<br className="home-desktop-break" /> Cuéntame qué te gustaría construir.</p>
        <a className="home-email-link" href={'mailto:' + site.email}><Mail size={18} /><span>{site.email}</span><ArrowUpRight size={18} /></a>
        <a className="home-quiet-link" href={site.social.linkedin} target="_blank" rel="noreferrer">También en LinkedIn<ArrowUpRight size={15} /></a>
      </div>
    </section>
  )
}
