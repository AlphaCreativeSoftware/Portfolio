# Comprobación de la refactorización

Base comparada: `efa17ea`. No se ha creado ningún commit con estos cambios.

## Alcance

- `App.tsx`: de 1.272 a 11 líneas; solo composición.
- `styles.css`: de 1.044 a 20 líneas; solo imports ordenados.
- Página de portfolio, layout, apariencia, secciones, proyectos y datos separados.
- Sin nuevas dependencias, cambios de rutas ni modificaciones de assets.
- Misma interfaz y mismos textos visibles. Se eliminaron duplicados del catálogo
  que no se mostraban, conservando como fuente los textos que ya usaban las tarjetas.

## Comprobaciones ejecutadas

| Comprobación | Resultado |
| --- | --- |
| `npm run check` | 13 pruebas aprobadas y build correcto |
| `node scripts/check-refactor.mjs` | HTML inicial idéntico en 3 variantes; CSS idéntico y en el mismo orden |
| Comparación visual Chrome, 1440 × 900, claro/oscuro | Sin diferencias superiores a 2/255 por canal |
| Comparación visual Chrome, 390 × 844, claro/oscuro | Sin diferencias superiores a 2/255 por canal |
| Interacciones escritorio/móvil | Navegación, Escape, menú, temas, persistencia, ciclo solar y desplegables correctos |
| Bundle de producción con movimiento activo | Hero, reveal, activación en viewport, reproducción WebM y pausa fuera de pantalla correctos |
| Errores JavaScript durante esos recorridos | Ninguno |

Las capturas visuales cubren toda la página. Para hacerlas deterministas se fijó
la hora, se activó reduced-motion y se bloquearon recursos externos (las mismas
fuentes de respaldo en ambas versiones). Las animaciones y el vídeo se comprobaron
por separado con movimiento activo sobre el bundle de producción.

Esto no equivale a certificar todos los navegadores o dispositivos físicos.

## Bundle

El CSS de producción conserva el hash `index-CMH88qUZ.css`: 89,00 kB, 17,71 kB gzip.
El JavaScript pasó de 254,86 kB a 255,06 kB; 78,60 kB gzip en la versión modular.
La finalidad de esta entrega es mantenibilidad y separación de responsabilidades,
no presentar una refactorización como una mejora de rendimiento medida.

Las capturas, baselines y scripts locales de navegador están en `.artifacts/refactor/`,
fuera del seguimiento de Git. Las pruebas permanentes están en `tests/` y se
ejecutan con Node y Vite, sin herramientas adicionales.
