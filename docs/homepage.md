# Portada personal

## Dirección

La portada presenta a Mikael, no una lista de servicios ni una repetición del
portfolio. La secuencia es: identidad → espacios → historia personal → conversación.

El nombre marca la jerarquía principal. La escena orbital utiliza los colores del
ambiente existente, con círculos elípticos, un reloj de Madrid y un destino de glass.
El portfolio es la entrada principal; Alpha Creative y conocimiento abierto enlazan
a productos y perfiles que ya existen. No hay destinos vacíos ni estadísticas inventadas.

Los espaciados comparten una medida de contenido de 1.240 px y gutters fluidos.
Las tarjetas secundarias son más discretas que la entrada al portfolio. La mirada
personal y el contacto recuperan el espacio en blanco en lugar de repetir tarjetas.

## Rutas y carga

- `/`: `HomePage`, cargada en la entrada.
- `/portfolio`: carga diferida por ruta, conservando sus casos interactivos y vídeo.
- `/portfolio#experiencia`, etc.: enlaces profundos a secciones.
- Las URLs desconocidas muestran una recuperación 404 en la aplicación.

La portada no descarga el vídeo, las capturas del motor ni el módulo de la página
de portfolio. El tema y la iluminación no se reinician al cambiar de página.
La única dependencia de ejecución añadida es React Router 7.18.

El marcado y los estilos específicos del portfolio no se han rediseñado. Su cabecera
incorpora una salida a Inicio y se ha ajustado el menú a anchuras intermedias para
evitar que se solape con los controles de apariencia.

## Glass y movimiento

Blur contenido en superficies pequeñas y solo en escritorio para las tarjetas.
En móvil se usan fondos más opacos, sin blur en tarjetas ni en la cabecera. El
satélite decorativo se pausa fuera del viewport y con reduced-motion. Las entradas
del hero no alteran la geometría final de las órbitas. Los gradientes de iluminación
se apagan antes de alcanzar los bordes de sus cajas, para no crear rectángulos visibles.

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
