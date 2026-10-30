import { Link, useLocation } from 'react-router-dom'

export function RouteErrorPage() {
  const { pathname, search, hash } = useLocation()
  return (
    <main className="route-message" id="main-content" tabIndex={-1}>
      <span className="brand">MR<span>.</span></span>
      <p className="home-eyebrow">No hemos podido abrir esta página</p>
      <h1>Vamos a<br />intentarlo de nuevo.</h1>
      <p>Puede haber una actualización o un problema de conexión.</p>
      <div><a className="button button-primary" href={pathname + search + hash}>Volver a cargar</a><Link className="text-link" to="/">Ir al inicio</Link></div>
    </main>
  )
}
