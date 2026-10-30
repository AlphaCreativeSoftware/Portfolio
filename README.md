# El espacio de Mikael Rodríguez

Web personal construida con React, TypeScript, Vite y React Router.

- `/`: portada personal y acceso a mis espacios.
- `/portfolio`: proyectos, experiencia, habilidades y forma de trabajar.

## Estructura y evolución

El portfolio está separado en páginas, funcionalidades, componentes compartidos y
estilos por responsabilidad. El sistema solar y los controles de apariencia son
independientes de las páginas, y se comparten entre la portada y el portfolio.

Consulta [la guía de arquitectura](docs/architecture.md) para localizar cada módulo,
añadir proyectos y preparar nuevas páginas sin volver a concentrarlo todo en `App.tsx`.

```bash
npm test
npm run check
```

`check` ejecuta las pruebas y el build de producción. No requiere dependencias de test adicionales.

La dirección de diseño, las rutas y el espacio previsto para un futuro retrato
animado se explican en [la guía de la portada](docs/homepage.md).

## Desarrollo local

```bash
npm install
npm run dev
```

La terminal mostrará una URL local, normalmente `http://localhost:5173`.

## Compilación

```bash
npm run build
```

El resultado listo para publicar se genera en `dist/`.

## Publicación gratuita recomendada

### Cloudflare Pages

1. Sube este proyecto a un repositorio de GitHub.
2. En Cloudflare, abre **Workers & Pages** y crea una aplicación de Pages.
3. Conecta el repositorio.
4. Usa `npm run build` como comando de compilación y `dist` como directorio de salida.
5. Cloudflare proporcionará gratuitamente un subdominio `*.pages.dev` y publicará de nuevo con cada push.

### Vercel

1. Importa el repositorio desde el panel de Vercel.
2. Vercel detectará Vite automáticamente.
3. Publica el proyecto para obtener un subdominio `*.vercel.app`.

Un dominio personalizado es opcional y normalmente tiene coste anual; el alojamiento y los subdominios anteriores pueden utilizarse gratuitamente.

## Antes de publicar

- Verificar que los enlaces y datos de contacto siguen vigentes.
- Revisar el peso de los assets y el comportamiento del vídeo en dispositivos reales.
- Confirmar qué información profesional puede mostrarse públicamente.
- Confirmar rutas, metadatos y configuración del hosting si se añaden más páginas.
