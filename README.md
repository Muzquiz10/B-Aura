# B-Aura static site

Este repositorio contiene una exportacion estatica de WordPress. Para trabajar con el sitio sin perder compatibilidad, la estructura queda separada por responsabilidad:

- `index.html` y carpetas como `servicios/`, `cursos/`, `contacto/`: paginas publicas editables.
- `assets/images/originals/`: copias organizadas de los PNG originales del sitio.
- `assets/images/optimized/`: versiones WebP generadas para cargar en la web.
- `assets/images/manifest.json`: inventario de originales, WebP y ahorro de peso.
- `wp-content/` y `wp-includes/`: estructura heredada de WordPress. Conviene mantenerla porque muchas rutas y estilos dependen de ella.
- `tools/`: scripts de mantenimiento del proyecto.

## Imagenes

Las imagenes PNG originales de WordPress no se borran ni se mueven. El comando de optimizacion crea copias organizadas y genera WebP:

```bash
npm install
npm run optimize:images
```

El script convierte los PNG de `wp-content/uploads`, actualiza las paginas HTML publicas para usar los WebP optimizados y deja el detalle de cada archivo en `assets/images/manifest.json`.

## Probar en local

Las rutas del sitio son absolutas, asi que es mejor verlo con servidor local:

```bash
npm run serve
```

Por defecto abre el sitio en `http://localhost:4173`.
