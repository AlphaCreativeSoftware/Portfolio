import { useEffect } from 'react'
import { site } from '../config/site'

type PageMetadata = { title: string; description: string; path: string; noIndex?: boolean }

export function usePageMetadata({ title, description, path, noIndex = false }: PageMetadata) {
  useEffect(() => {
    document.title = title
    const url = site.origin + path
    const values = {
      'meta[name="description"]': description,
      'meta[property="og:title"]': title,
      'meta[property="og:description"]': description,
      'meta[property="og:url"]': url,
      'meta[name="twitter:title"]': title,
      'meta[name="twitter:description"]': description,
    }
    for (const [selector, value] of Object.entries(values)) document.querySelector(selector)?.setAttribute('content', value)
    document.querySelector('link[rel="canonical"]')?.setAttribute('href', url)
    let robots = document.querySelector<HTMLMetaElement>('meta[name="robots"]')
    if (noIndex && !robots) {
      robots = document.createElement('meta')
      robots.name = 'robots'
      document.head.append(robots)
    }
    if (robots) robots.content = noIndex ? 'noindex, follow' : 'index, follow'
  }, [title, description, path, noIndex])
}
