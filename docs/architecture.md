# Arquitectura

La aplicación tiene dos páginas reales: portada (`/`) y portfolio (`/portfolio`).
React Router gestiona las rutas, el historial y la restauración del scroll. El
portfolio se carga de forma diferida. Ambas páginas comparten el ambiente solar,
el tema y los patrones visuales, pero sus contenidos y secciones son independientes.

## Mapa de responsabilidades

```text
src/
  App.tsx                       Proveedores, outlet y restauración de scroll
  app/                         Tabla de rutas, accesibilidad y compatibilidad de URLs
  pages/
    HomePage.tsx                Composición de la portada
    PortfolioPage.tsx           Orden de secciones y configuración de navegación
    NotFoundPage.tsx            Recuperación de URLs inexistentes
    RouteErrorPage.tsx          Recuperación de errores de carga
  components/layout/
    SiteLayout.tsx              Contenedor, ambiente, cabecera y pie comunes
    SiteHeader.tsx              Presentación del menú y controles
    SiteDestinations.tsx        Navegación global entre áreas, separada de las anclas
    SiteFooter.tsx
  features/
    appearance/                Tema, reloj y ciclo solar independientes del portfolio
    home/                      Portada: escena orbital, espacios y narrativa personal
    portfolio/
      data/                    Catálogos, trayectoria y datos de las demostraciones
      sections/                Hero, proyectos, experiencia, habilidades, sobre mí y contacto
      projects/                Una implementación por proyecto destacado
      hooks/                   Movimiento del hero
      types.ts                 Contratos del dominio
  shared/
    config/                    Identidad, dominio y enlaces compartidos
    hooks/                     Visibilidad, navegación, animaciones, vídeo y disclosure
    ui/                        Métricas, cabeceras, controles e iconos compartidos
  styles.css                   Única entrada de estilos; solo imports ordenados
  styles/
    fonts.css                  Fuentes locales con licencias OFL
    tokens.css                 Variables visuales, temas y paleta solar
    base.css                   Reset, accesibilidad y ambiente global
    layout/                    Cabecera y pie
    components/                Patrones compartidos y superficies glass
    projects/                  Proyectos y escenarios de producto
    sections/                  Secciones del portfolio
    motion.css                 Reveal compartido
    responsive.css             Adaptaciones responsive y reduced-motion
    home/                      Estilos de portada, acotados a sus clases
tests/                         Pruebas de contratos, contenido y arquitectura
```

## Reglas de dependencia

- `shared` solo depende de otros módulos de `shared` y de librerías externas.
- `features/appearance` no conoce el portfolio: se puede utilizar en otra página.
- Las páginas componen funcionalidades; no contienen las implementaciones de los proyectos.
- Los componentes de proyecto conservan su estado local. Abrir Fruit Drop no vuelve
  a renderizar toda la página ni otro caso interactivo.
- `App.tsx` no debe crecer con secciones, datos ni efectos de scroll.
- Imports directos, sin archivos barril ni dependencias circulares.

`npm test` comprueba estas fronteras y detecta ciclos entre módulos locales.

## Cómo ampliar

### Editar contenido

Los proyectos están en `features/portfolio/data/projects.ts`, la trayectoria en
`data/experience.ts`, las habilidades en `data/skills.ts` y el proceso en `data/about.ts`.
Los textos específicos de una demostración permanecen en su módulo, no en `App.tsx`.

### Añadir un proyecto

1. Añadir una entrada a `data/projects.ts` con un `id` estable.
2. Usar `presentation: 'standard'` para la tarjeta común.
3. Si necesita una experiencia específica, crear su componente en `projects/`,
   ampliar `ProjectPresentation` y registrarlo en `ProjectsSection.tsx`.

`index` solo controla la numeración visible; ya no decide qué componente se muestra.
Para desplegables reutilizar `useDisclosure` y `DetailsToggle`. El contenido pesado
se monta en la primera apertura y queda `inert` al cerrarse, conservando su estado.
Para vídeos reutilizar `useViewportVideo`: pausa fuera de pantalla, al ocultarse la
pestaña y respeta reduced-motion.

### Añadir otra zona

1. Crear una página en `pages/` y sus funcionalidades en `features/`, sin mezclarlas con el portfolio.
2. Registrar la ruta en `app/routes.tsx`, con `lazy` si su contenido es pesado.
3. Reutilizar el layout y declarar sus secciones en `useSectionNavigation`.
   Registrar los accesos entre páginas en `SiteDestinations`, sin mezclarlos en
   la lista de anclas locales.
4. Usar `usePageMetadata` para título, descripción y canonical. Estos metadatos se
   actualizan en el cliente; no se está haciendo SSR ni prerenderizado SEO por ruta.
5. Añadir su acceso a la portada cuando tenga contenido real y comprobar el fallback del hosting.

Los antiguos enlaces `/#proyectos`, `/#experiencia`, `/#habilidades` y `/#sobre-mi`
se convierten en `/portfolio#…` al arrancar. Las anclas `#inicio` y `#contacto`
pertenecen ahora a la portada. No se usa el hash para simular páginas.

## Estilos: preservar la cascada

Los archivos CSS son globales y se importan **una sola vez** desde `main.tsx` a través
de `styles.css`. No se importan desde cada componente: su orden no debe depender de
qué componente se carga antes.

La división inicial conserva todas las declaraciones y su orden original. Por ello
las reglas transversales de glass y las adaptaciones responsive tienen archivos
explícitos al final de la cascada. No se han introducido CSS Modules, `@layer`,
renombrados de clases ni cambios de especificidad durante esta migración.

Para cambios futuros: editar el archivo propietario del componente y revisar las
reglas responsive existentes antes de añadir otro override. No volver a añadir
estilos sueltos a la entrada `styles.css`.

## Validación

```bash
npm test          # Contratos de la UI, catálogos, assets, ciclos y dependencias
npm run build     # TypeScript estricto y bundle de producción
npm run check     # Ambas comprobaciones
```

Las pruebas de renderizado no sustituyen a las pruebas del navegador. En la
refactorización original se comparó la versión anterior de Git con la modularizada.
La portada se revisó además en Chrome headless a 320, 390, 768, 1024 y 1440 px,
en claro/oscuro y con recorridos entre páginas.
Los artefactos locales de comparación se guardan en `.artifacts/`, ignorado por Git.
Las condiciones y resultados de la comparación original están en
`refactor-validation.md`. Las fuentes actuales son locales, por lo que las nuevas
capturas ya no necesitan sustituirlas por fuentes de respaldo.

Para otra refactorización sin cambios de interfaz, el guard opcional permite
comparar el HTML inicial y la concatenación exacta de CSS:

```bash
node scripts/check-refactor.mjs --capture   # Antes de modificar
node scripts/check-refactor.mjs             # Después de modificar
```

El baseline es local, cubre ambas páginas en tres variantes de apariencia y no
reemplaza una revisión de animaciones e interacciones. Tras un rediseño intencional,
hay que capturar uno nuevo antes de usarlo en una futura extracción sin cambios visuales.
