import type { RouteObject } from 'react-router-dom'
import App from '../App'
import { HomePage } from '../pages/HomePage'
import { NotFoundPage } from '../pages/NotFoundPage'
import { RouteErrorPage } from '../pages/RouteErrorPage'
import { PagePending } from '../components/layout/PagePending'

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
      path: 'portfolio',
      lazy: async () => ({ Component: (await import('../pages/PortfolioPage')).PortfolioPage }),
    },
    { path: '*', Component: NotFoundPage },
  ],
}]
