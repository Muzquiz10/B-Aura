# B-Aura static site

Este repositorio contiene una exportacion estatica de WordPress. Para trabajar con el sitio sin perder compatibilidad, la estructura queda separada por responsabilidad:

- `index.html` y carpetas como `servicios/`, `cursos/`, `contacto/`: paginas publicas editables.
- `assets/images/originals/`: copias organizadas de los PNG originales del sitio.
- `assets/images/optimized/`: versiones WebP generadas para cargar en la web.
- `assets/images/manifest.json`: inventario de originales, WebP y ahorro de peso.
- `wp-content/` y `wp-includes/`: solo conservan los assets que la version estatica todavia referencia.
- `trush/`: archivos heredados de WordPress apartados para revision. Esta carpeta esta ignorada por Git y se puede borrar cuando hayas comprobado la web.
- `tools/`: scripts de mantenimiento del proyecto.
- `netlify.toml`: configuracion minima para publicar esta web estatica en Netlify.

## Imagenes

Las imagenes PNG originales de WordPress no se borran ni se mueven. El comando de optimizacion crea copias organizadas y genera WebP:

```bash
npm install
npm run optimize:images
```

El script convierte los PNG de `wp-content/uploads`, actualiza las paginas HTML publicas para usar los WebP optimizados y deja el detalle de cada archivo en `assets/images/manifest.json`.

## Limpieza de WordPress

Como la web se sirve en Netlify y WordPress ya no se ejecuta aqui, puedes apartar los archivos no usados con:

```bash
npm run prune:wordpress
```

Antes de mover nada, puedes ver el resumen con:

```bash
npm run prune:wordpress:dry
```

El script conserva los CSS, JS, fuentes e imagenes que siguen apareciendo en las paginas HTML y mueve el resto a `trush/static-unused/`.

## Probar en local

Las rutas del sitio son absolutas, asi que es mejor verlo con servidor local:

```bash
npm run serve
```

Por defecto abre el sitio en `http://localhost:4173`.
