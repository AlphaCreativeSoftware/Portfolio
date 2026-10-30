import { BookOpen, Play } from 'lucide-react'
import { GitHubIcon, YouTubeIcon } from '../../../shared/ui/SocialIcons'
import { site } from '../../../shared/config/site'

export const independentSpaces = [
  {
    id: 'alpha-creative',
    number: '02',
    category: 'Marca independiente',
    title: 'Alpha Creative.',
    description: 'Productos digitales, publicaciones y contenido técnico bajo mi marca independiente.',
    linkGroups: [
      {
        id: 'products',
        label: 'Productos y publicaciones',
        links: [
          { label: 'Google Play', ariaLabel: 'Ver aplicaciones en Google Play', href: site.social.apps, icon: Play },
          { label: 'Amazon', ariaLabel: 'Ver publicaciones en Amazon', href: site.social.books, icon: BookOpen },
        ],
      },
      {
        id: 'resources',
        label: 'Código y contenido',
        links: [
          { label: 'GitHub', ariaLabel: 'Ver repositorios en GitHub', href: site.social.github, icon: GitHubIcon },
          { label: 'YouTube', ariaLabel: 'Ver contenido técnico en YouTube', href: site.social.youtube, icon: YouTubeIcon },
        ],
      },
    ],
  },
] as const
