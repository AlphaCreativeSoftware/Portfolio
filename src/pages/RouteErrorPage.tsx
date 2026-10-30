import { Link, useLocation } from 'react-router-dom'

export function RouteErrorPage() {
  const { pathname, search, hash } = useLocation()
  return (
    <main className="route-message" id="main-content" tabIndex={-1}>
      <span className="brand">MR<span>.</span></span>
      <p className="home-eyebrow">Error de carga</p>
      <h1>No se ha podido<br />cargar la página.</h1>
      <p>Comprueba la conexión y vuelve a intentarlo.</p>
      <div><a className="button button-primary" href={pathname + search + hash}>Volver a cargar</a><Link className="text-link" to="/">Web principal</Link></div>
    </main>
  )
}
