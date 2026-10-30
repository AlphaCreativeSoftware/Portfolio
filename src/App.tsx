import { AppearanceProvider } from './features/appearance/AppearanceProvider'
import { PortfolioPage } from './pages/PortfolioPage'

/** Composition root. New pages belong in pages/, not in this component. */
export default function App() {
  return (
    <AppearanceProvider>
      <PortfolioPage />
    </AppearanceProvider>
  )
}
