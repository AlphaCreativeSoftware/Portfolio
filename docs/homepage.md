# Portada personal

## Dirección

La portada presenta a Mikael, no una lista de servicios ni una repetición del
portfolio. La secuencia es: presentación → áreas de la web → contacto.

El nombre marca la jerarquía principal. La escena orbital utiliza los colores del
ambiente existente, con círculos elípticos y un reloj de Madrid. No contiene tarjetas,
capturas ni iconos de proyectos. Portfolio y Alpha Creative enlazan
a productos y perfiles que ya existen. No hay destinos vacíos ni estadísticas inventadas.

Los espaciados comparten una medida de contenido de 1.240 px y gutters fluidos.
Las dos áreas tienen una jerarquía equilibrada, con dos columnas en escritorio y
tableta y tarjetas apiladas en móvil. Alpha Creative reúne Google Play, Amazon,
GitHub y YouTube en dos grupos: productos/publicaciones y código/contenido. No hay
una tarjeta de Publicaciones separada. El portfolio se presenta como un
resumen con acceso a proyectos, experiencia y competencias; no se duplican los
casos ni las imágenes de cada proyecto en la portada. La biografía y el empleo actual
permanecen exclusivamente en el portfolio.

## Navegación compartida

La cabecera utiliza el mismo estilo de ancho completo en ambas páginas. Se eliminó
el estado «Disponible» y la variante flotante exclusiva de la portada.

- `SiteDestinations`: selector global «Web principal / Portfolio», con `aria-current="page"`.
- Navegación local: enlaces a secciones de la página actual, con `aria-current="location"`.
- Escritorio: selector global junto a la marca y enlaces locales en el centro.
- Móvil: etiqueta de área compacta y discreta («Principal» / «Portfolio») y sección
  activa en caja normal, separadas por un trazo fino. El nombre accesible conserva
  «Web principal». En el hero solo aparece el área, sin separador.
  Al abrir el menú, el selector global aparece primero y las secciones locales
  debajo de «En esta página».

Al abrir el menú se restablece su scroll. La apertura mediante teclado enfoca el
primer enlace; Escape devuelve el foco al botón del menú.

El selector global tiene una sola cápsula de selección, con el mismo tratamiento
de superficie que el selector de tema. `DestinationMotionProvider` conserva el
el destino y el origen de la transición por clave de navegación entre montajes,
sin guardar estado en el navegador. La cabecera saliente no consume el origen de
la entrante; StrictMode tampoco lo altera. En escritorio, la cápsula recorre los enlaces en 440 ms, también
al usar el historial. Las posiciones y anchuras se miden a partir de los enlaces:
añadir un destino no requiere nuevos offsets CSS. ResizeObserver y la carga de
fuentes reajustan la geometría sin animaciones de reposicionamiento. No hay bucles
de animación, dependencias nuevas ni retrasos artificiales en la navegación.
Con reduced-motion el cambio es inmediato. El menú móvil se abre directamente
sobre el destino actual y nunca reproduce una selección antigua al reabrirse.

Regresión opcional de navegador: `node scripts/check-navigation-motion.mjs`
(con Playwright disponible, o `PLAYWRIGHT_MODULE_PATH` apuntando al módulo externo).
`BASE_URL` permite probar el servidor dev o el preview del build. La prueba exige
que la cápsula visible recorra más de 40 px y termine sus 440 ms en la cabecera
conectada, no solo que arranque. Incluye ida/vuelta, historial, reduced-motion y
ausencia de animación en móvil.

## Rutas y carga

- `/`: `HomePage`, cargada en la entrada.
- `/portfolio`: carga diferida por ruta, conservando sus casos interactivos y vídeo.
- `/portfolio#experiencia`, etc.: enlaces profundos a secciones.
- Las URLs desconocidas muestran una recuperación 404 en la aplicación.

La portada no descarga el vídeo, las capturas del motor ni el módulo de la página
de portfolio. El tema y la iluminación no se reinician al cambiar de página.
La única dependencia de ejecución añadida es React Router 7.18.

Los proyectos del portfolio conservan su presentación y sus interacciones. El
cambio de página ya no depende de un enlace ambiguo «Inicio» ni del logotipo.

## Glass y movimiento

Blur contenido en superficies pequeñas y solo en escritorio para las tarjetas.
En móvil se usan fondos más opacos, sin blur en tarjetas ni en la cabecera. El
satélite decorativo se pausa fuera del viewport y con reduced-motion. Las entradas
del hero no alteran la geometría final de las órbitas. Los gradientes de iluminación
se apagan antes de alcanzar los bordes de sus cajas, para no crear rectángulos visibles.

En pantallas de hasta 600 px, la escena solar se integra como fondo decorativo
junto a la identidad, sin reservar una fila entre la introducción y las áreas.
Se ocultan las anotaciones de la escena y el disco ambiental duplicado; la luz
global y los controles del ciclo solar permanecen activos. En escritorio se
conserva la composición lateral.

Las fuentes son las mismas —Manrope y DM Sans—, ahora servidas localmente en WOFF2
con sus licencias OFL en `public/fonts/`. Solo se precargan los dos subconjuntos latinos;
el extendido se solicita si el contenido lo necesita.

## Futuro retrato por scroll

No se ha añadido un canvas vacío ni una secuencia simulada. `HomeOrbit` es el punto
de sustitución del contenido visual del hero: se puede cambiar el arte manteniendo
la tipografía, el layout y la navegación.

Cuando existan los fotogramas habrá que definir su cantidad, dimensiones, encuadre,
compresión y variantes móviles. Después se podrá implementar una secuencia con
carga progresiva, un único canvas y un fotograma estático para reduced-motion.
No se reserva memoria ni se precargan assets inexistentes en esta entrega.

## Hosting y metadatos

`vercel.json` incluye un rewrite para rutas sin extensión. En Cloudflare Pages se
mantiene el fallback SPA por defecto, sin un `404.html` estático que lo desactive.
Los recursos existentes deben servirse como recursos, no reescribirse a HTML.
[Documentación de Cloudflare Pages](https://developers.cloudflare.com/pages/configuration/serving-pages/).

Títulos, descripción y canonical cambian por página en el cliente. Esta entrega no
añade SSR, prerenderizado ni imágenes sociales específicas por ruta. Si la futura
web incorpora artículos públicos, convendrá abordar esa capa antes de publicarlos.

## Validación

`npm run check` ejecuta las pruebas de módulos, catálogos, rutas, enlaces profundos,
compatibilidad de URLs, contenido, assets y build. También se realizaron capturas
en cinco anchuras, en claro/oscuro, y recorridos de navegador para comprobar menú,
temas, persistencia, historial, anclas y los tres casos interactivos del portfolio.
Los artefactos de QA están en `.artifacts/home/`, ignorado por Git.

Las pautas de presentación de la skill Sites se han aplicado a la progresión
narrativa y a mantener destinos reales; el proyecto sigue siendo local y no se ha publicado.
