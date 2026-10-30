import { ArrowRight, BookOpen, CalendarDays, ExternalLink, Mail, Phone, Play } from 'lucide-react'
import { GitHubIcon, LinkedInIcon, YouTubeIcon } from '../../../shared/ui/SocialIcons'

export function ContactSection() {

  return (
    <section className="contact-section" id="contacto">
      <div className="contact-glow" />
      <p className="kicker"><span>06</span> El siguiente proyecto</p>
      <h2>¿Construimos algo<br /><em>que importe?</em></h2>
      <p className="contact-intro">Estoy abierto a oportunidades donde pueda aportar, aprender y resolver problemas que merezcan la pena. Elige la vía que te resulte más cómoda.</p>
      <div className="contact-actions">
        <a className="contact-card contact-card-primary" href="mailto:alphacreativesoftware@gmail.com">
          <span className="contact-icon"><Mail /></span><span><small>Contacto directo</small><strong>Escribirme por correo</strong></span><ArrowRight />
        </a>
        <a className="contact-card" href="https://www.linkedin.com/in/mikael-rodr%C3%ADguez-l%C3%B3pez-512b50329/" target="_blank" rel="noreferrer">
          <span className="contact-icon"><LinkedInIcon /></span><span><small>Perfil profesional</small><strong>Conectar en LinkedIn</strong></span><ExternalLink />
        </a>
        <a className="contact-card" href="https://github.com/AlphaCreativeSoftware" target="_blank" rel="noreferrer">
          <span className="contact-icon"><GitHubIcon /></span><span><small>Código y proyectos</small><strong>Explorar GitHub</strong></span><ExternalLink />
        </a>
      </div>
      <div className="social-presence" aria-label="Otros perfiles y publicaciones">
        <span className="social-presence-label">También publico en</span>
        <div className="social-presence-links">
          <a href="https://www.youtube.com/@alpha.creative" target="_blank" rel="noreferrer"><YouTubeIcon /><span>YouTube</span><ExternalLink /></a>
          <a href="https://play.google.com/store/apps/dev?id=4852540663954087438&amp;hl=es_SV" target="_blank" rel="noreferrer"><Play /><span>Google Play</span><ExternalLink /></a>
          <a href="https://www.amazon.es/s?i=stripbooks&amp;rh=p_27%3AMikael%2BRodr%25C3%25ADguez%2BL%25C3%25B3pez&amp;ref=dp_byline_sr_book_1" target="_blank" rel="noreferrer"><BookOpen /><span>Amazon</span><ExternalLink /></a>
        </div>
      </div>
      <div className="contact-details">
        <a href="mailto:alphacreativesoftware@gmail.com?subject=Propuesta%20de%20reuni%C3%B3n&amp;body=Hola%20Mikael%2C%0A%0AMe%20gustar%C3%ADa%20proponerte%20una%20reuni%C3%B3n%20para%20hablar%20sobre..."><CalendarDays /> Proponer una reunión</a>
        <a href="mailto:alphacreativesoftware@gmail.com"><Mail /> alphacreativesoftware@gmail.com</a>
        <a href="tel:+34634460084"><Phone /> +34 634 460 084</a>
      </div>
    </section>
  )
}
