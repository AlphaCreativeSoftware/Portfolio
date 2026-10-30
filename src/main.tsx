import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { routes } from './app/routes'
import { getLegacyPortfolioDestination } from './app/routePaths'
import './styles.css'

const legacyDestination = getLegacyPortfolioDestination(window.location.pathname, window.location.hash, window.location.search)
if (legacyDestination) window.history.replaceState(window.history.state, '', legacyDestination)
const router = createBrowserRouter(routes)

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
)
