# Arquitectura

Esta refactorización separa responsabilidades **sin rediseñar la interfaz**.
La URL inicial y los enlaces `#proyectos`, `#experiencia`, etc. siguen funcionando.
No hay un router ni una portada nueva todavía: la separación permite introducirlos
cuando exista una segunda página real, sin mezclarla con el portfolio.

## Mapa de responsabilidades

```text
src/
  App.tsx                       Composición de proveedores y página actual
  pages/
    PortfolioPage.tsx           Orden de secciones y configuración de navegación
  components/layout/
    SiteLayout.tsx              Contenedor, ambiente, cabecera y pie comunes
    SiteHeader.tsx              Presentación del menú y controles
    SiteFooter.tsx
  features/
    appearance/                Tema, reloj y ciclo solar independientes del portfolio
    portfolio/
      data/                    Catálogos, trayectoria y datos de las demostraciones
      sections/                Hero, proyectos, experiencia, habilidades, sobre mí y contacto
      projects/                Una implementación por proyecto destacado
      hooks/                   Movimiento del hero
      types.ts                 Contratos del dominio
  shared/
    hooks/                     Visibilidad, navegación, animaciones, vídeo y disclosure
    ui/                        Métricas, cabeceras, controles e iconos compartidos
  styles.css                   Única entrada de estilos; solo imports ordenados
  styles/
    tokens.css                 Variables visuales, temas y paleta solar
    base.css                   Reset, accesibilidad y ambiente global
    layout/                    Cabecera y pie
    components/                Patrones compartidos y superficies glass
    projects/                  Proyectos y escenarios de producto
    sections/                  Secciones del portfolio
    motion.css                 Reveal compartido
    responsive.css             Adaptaciones responsive y reduced-motion
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

### Crear la futura portada

1. Crear `pages/HomePage.tsx` y sus funcionalidades, sin introducirlas en `PortfolioPage`.
2. Reutilizar `AppearanceProvider`, `AmbientScene`, los tokens y los elementos de `shared/ui`.
3. Introducir rutas reales (`/` y `/portfolio`) cuando ambas páginas estén definidas;
   entonces adaptar el menú y los enlaces entre páginas. No simular rutas con condiciones de hash.
4. Añadir carga diferida por página, metadatos/canonical por ruta y fallback SPA en el hosting.

Esta entrega no inventa una portada, un sistema de navegación multipágina ni nuevas dependencias.

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

Las pruebas de renderizado no sustituyen a las pruebas del navegador. En esta
migración se comparó además la versión anterior de Git con la refactorizada en
Chrome headless: escritorio/móvil, claro/oscuro y flujos interactivos.
Los artefactos locales de comparación se guardan en `.artifacts/`, ignorado por Git.
Las capturas se estabilizaron con reloj fijo, reduced-motion y recursos externos
bloqueados; admiten una tolerancia de 2/255 por canal para el compositor de Chrome.

Para otra refactorización sin cambios de interfaz, el guard opcional permite
comparar el HTML inicial y la concatenación exacta de CSS:

```bash
node scripts/check-refactor.mjs --capture   # Antes de modificar
node scripts/check-refactor.mjs             # Después de modificar
```

El baseline es local y no reemplaza una revisión de animaciones e interacciones.
