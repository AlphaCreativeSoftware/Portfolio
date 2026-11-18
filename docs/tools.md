# Herramientas

`/herramientas` muestra las utilidades publicadas. Cuando no hay ninguna, presenta un estado vacío; las URLs de herramientas no registradas siguen usando la página 404.

Para publicar una utilidad, crea un componente con exportación por defecto en su propia carpeta dentro de `src/features/tools/` y registra una entrada en `catalog.ts` con `slug`, `title`, `description` y `load: () => import('./nombre-de-la-utilidad/NombreDeLaUtilidad')`. Usa un slug único en minúsculas, separado por guiones. El catálogo crea la tarjeta y la ruta `/herramientas/<slug>` a partir de la misma entrada. La implementación de cada utilidad se carga al entrar en ella, no al abrir el catálogo.

`ToolPage` aporta los metadatos, la cabecera y el enlace de vuelta al catálogo. `shared/config/areas.ts` define el orden del menú global.
