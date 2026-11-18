import type { RouteObject } from 'react-router-dom'
import App from '../App'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RouteErrorPage } from '../pages/RouteErrorPage'
import { PagePending } from '../components/layout/PagePending'
import { siteAreas } from '../shared/config/areas'
import { toolCatalog, toolPath } from '../features/tools/catalog'

export const routes: RouteObject[] = [{
  Component: App,
  ErrorBoundary: RouteErrorPage,
  HydrateFallback: PagePending,
  children: [
    {
      index: true,
      Component: HomePage,
    },
    {
      path: siteAreas.tools.to,
      lazy: async () => ({ Component: (await import('../pages/ToolsPage')).ToolsPage }),
    },
    ...toolCatalog.map((entry): RouteObject => ({
      path: toolPath(entry.slug),
      lazy: async () => {
        const [{ ToolPage }, { default: Tool }] = await Promise.all([import('../pages/ToolPage'), entry.load()])
        return { Component: () => <ToolPage entry={entry}><Tool /></ToolPage> }
      },
    })),
    {
      path: siteAreas.portfolio.to.slice(1),
      lazy: async () => ({ Component: (await import('../pages/PortfolioPage')).PortfolioPage }),
    },
    { path: '*', Component: NotFoundPage },
  ],
}]
