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

### Avisos y respuesta automatica

Netlify guarda las entradas en `Forms`. Para recibir una copia por correo, crea una notificacion de formulario y pon como destinatario el correo que quieras usar, por ejemplo `contacto@b-aura.es`.

El formulario tiene un campo `email`, asi que las notificaciones de Netlify podran usarlo como `Reply-To` para responder directamente al cliente.

Tambien hay una respuesta automatica preparada con Netlify Email Integration:

1. En Netlify, ve a `Project configuration > Emails > Configuration`.
2. Activa la extension de email y elige proveedor: SendGrid, Mailgun o Postmark.
3. Configura las variables necesarias del proveedor y `NETLIFY_EMAILS_SECRET` con alcance para Builds y Functions.
4. Opcionalmente define `CONTACT_AUTOREPLY_FROM`; si no, se usara `contacto@b-aura.es`.
5. Redepliega el sitio y envia una prueba desde `/contacto/`.
