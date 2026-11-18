# Atlas AV

Ruta: `/herramientas/atlas-av`. La primera versión sigue los trayectos entre Madrid (Atocha y Chamartín) y Barcelona Sants, València Joaquín Sorolla o Sevilla Santa Justa, en ambos sentidos. Para evitar falsos positivos, un tren que solo atraviesa un corredor no se incluye automáticamente. Alta velocidad y larga distancia se muestran de entrada; Regional / Media Distancia es opcional. Cercanías y Rodalies no se incluyen.

## Fuentes

- [Trenalia](https://trenalia.org/api): identificador, producto, origen/destino, estado y próxima parada. Se conserva su atribución. Un retraso solo entra en estadísticas si el dato indica origen Renfe o Adif; las proyecciones de la fuente no se contabilizan.
- Los paneles de las cinco estaciones en la API de Trenalia complementan el catálogo de OUIGO e iryo para las próximas dos horas. Se cruzan por operador, número normalizado y sentido del corredor. La llegada programada viene del horario; la prevista requiere una actualización de llegada atribuida a Adif. No se interpolan trenes a partir de horarios. Si faltan datos, Atlas AV enlaza a los [paneles oficiales de Adif](https://www.adif.es/w/60000-madrid-pta-de-atocha?tipoBusqueda=proximasLlegadas); no los lee directamente.
- [Renfe Data](https://data.renfe.com/es/dataset/posicion-vehiculos-av-ld-md), CC BY 4.0: coordenadas GPS. Se cruzan por número de tren con un servicio Renfe que la fuente clasifique como observado, se rechazan posiciones ambiguas o antiguas y se distingue la hora del vehículo de la hora del fichero. Si el fichero de Renfe no es reciente, se usa solo el feed GPS de Trenalia como respaldo, marcado como tal. No se usa su feed de estimaciones como GPS.
- Sin GPS, solo se usa una posición que Trenalia marque como estimada cuando se disponga de un retraso de Renfe o Adif. Los servicios solo programados se listan sin marcador. El número de servicios encontrados varía por operador y hora; un operador sin filas no implica que no esté circulando ningún tren suyo.
- [Natural Earth](https://www.naturalearthdata.com/downloads/110m-cultural-vectors/110m-admin-0-countries/): contornos simplificados de la península ibérica. Las líneas del mapa son guías entre estaciones, no geometría oficial de las vías ni un método de estimación propio.

## Funcionamiento

`api/atlas-av.ts` usa la misma normalización que el endpoint local de Vite. Caché en proceso y CDN de 20 segundos; el navegador consulta cada 30 segundos mientras la pestaña está visible. Los paneles se consultan en paralelo y se reutilizan durante 50 segundos por proceso; un fallo de un panel no bloquea los demás ni el catálogo principal. Se descartan paneles con más de dos minutos. Si la lectura principal tampoco se renueva, se ocultan marcadores y estadísticas. No hay base de datos ni claves. El mapa y sus estilos se cargan solo al abrir Atlas AV.

Para revisar una instalación, comprueba `/api/atlas-av` y después la ruta de la herramienta. Una respuesta `502` indica que no se obtuvo el catálogo operativo, no que no circulen trenes. Antes de anunciar cobertura continua, contrastar muestras de varios días y franjas con Adif. No usar para decisiones operativas ni de seguridad ferroviaria.
