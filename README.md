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

## Formulario de contacto

El formulario de `contacto/index.html` esta adaptado para Netlify Forms. Para que Netlify lo recoja:

1. Publica el sitio de nuevo en Netlify.
2. En Netlify, comprueba que la deteccion de formularios esta activa en `Forms`.
3. Tras el despliegue, envia una prueba desde `/contacto/`.
4. Las entradas apareceran en `Forms`; para recibirlas por correo, crea una notificacion de formulario en `Project configuration > Notifications > Emails and webhooks`.

### Avisos y respuesta automatica con Resend

Netlify guarda las entradas en `Forms`. Para recibir una copia por correo, crea una notificacion de formulario y pon como destinatario el correo que quieras usar, por ejemplo `contacto@b-aura.es`.

El formulario tiene un campo `email`, asi que las notificaciones de Netlify podran usarlo como `Reply-To` para responder directamente al cliente.

Tambien hay una respuesta automatica preparada con Resend:

1. En Resend, verifica el dominio `b-aura.es` o el remitente `contacto@b-aura.es`.
2. Crea una API key en Resend.
3. En Netlify, ve a `Project configuration > Environment variables`.
4. Crea `RESEND_API_KEY` con la API key de Resend.
5. Opcionalmente crea `CONTACT_AUTOREPLY_FROM` con `B Aura <contacto@b-aura.es>`.
6. Opcionalmente crea `CONTACT_REPLY_TO` con `contacto@b-aura.es`.
7. Redepliega el sitio y envia una prueba desde `/contacto/`.

No hace falta usar `Project configuration > Emails > Configuration` de Netlify para esta autorespuesta.
