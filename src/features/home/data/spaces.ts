import { BookOpen, Play } from 'lucide-react'
import { GitHubIcon, YouTubeIcon } from '../../../shared/ui/SocialIcons'
import { site } from '../../../shared/config/site'

export const independentSpaces = [
  {
    id: 'alpha-creative',
    number: '02',
    category: 'Producto independiente',
    title: 'Alpha Creative.',
    description: 'La marca bajo la que doy vida a software, productos digitales y proyectos editoriales.',
    links: [
      { label: 'Apps en Google Play', href: site.social.apps, icon: Play },
      { label: 'Libros en Amazon', href: site.social.books, icon: BookOpen },
    ],
  },
  {
    id: 'open-work',
    number: '03',
    category: 'Conocimiento abierto',
    title: 'Construir. Compartir.',
    description: 'Código, herramientas y lo que voy aprendiendo por el camino. Porque crear también es compartir.',
    links: [
      { label: 'YouTube', href: site.social.youtube, icon: YouTubeIcon },
      { label: 'GitHub', href: site.social.github, icon: GitHubIcon },
    ],
  },
] as const

export const selectedWork = [
  { name: 'Cibeles Analytics', field: 'Datos & automatización', type: 'data' },
  { name: 'AlphaEngine2D', field: 'Ingeniería desde cero', type: 'engine' },
  { name: 'Fruit Drop', field: 'Producto publicado', type: 'fruit' },
] as const
