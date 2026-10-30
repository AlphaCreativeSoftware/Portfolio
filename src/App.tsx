import { AppearanceProvider } from './features/appearance/AppearanceProvider'
import { Outlet, ScrollRestoration } from 'react-router-dom'
import { RouteAccessibility } from './app/RouteAccessibility'
import { DestinationMotionProvider } from './components/layout/DestinationMotionProvider'

/** Composition root. New pages belong in pages/, not in this component. */
export default function App() {
  return (
    <AppearanceProvider>
      <RouteAccessibility />
      <DestinationMotionProvider><Outlet /></DestinationMotionProvider>
      <ScrollRestoration />
    </AppearanceProvider>
  )
}
