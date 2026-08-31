#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = "https://b-aura.es";
const whatsappUrl =
  "https://wa.me/34658876022?text=Hola%20Mariana%2C%20quiero%20saber%20si%20B-Aura%20es%20para%20m%C3%AD.";
const photo = "/assets/images/optimized/content/mariana-presentacion.webp";
const supportPhoto = "/assets/images/optimized/content/nutricion-entrenamiento-apoyo.webp";
const logo = "/assets/images/optimized/brand/bauras_transparente-300x300.webp";
const headerLogo = "/assets/images/optimized/brand/baura-logo-header.webp";
const footerLogo = "/assets/images/optimized/brand/cropped-bauras_transparente-768x547.webp";
const analytics = "/assets/js/google-analytics.js";
const assetVersion = "20260831-footer-logo-hq";
const googleReviewsUrl =
  "https://www.google.com/search?sxsrf=APpeQnsMOJlXXCLAx00mEh2pPhvnIUIKDQ:1788101988463&q=b-aura&si=APenkKm7iecQ4G6P-TsbSMFKIQtv3EFIqRAFw-i8uEbk55Z-_xHp49e161pj9yO2tcNb5ay-ITlo-tuBPzBYig5Iuyb8Bfkv04_xtRRPc4zgsFzgPJfLnBk%3D&uds=AJ5uw18QtvbJHV0_aO48vjl81DB9yFLFuNcBu0_m2YlKdo5NlaNg_s7AwpsTrHYV9Ebo9-fZDTYffiHj1n0XHXnpAsTIhoznc7QQGKvS5kUll3RKEmGxPGE";

const socials = [
  {
    label: "Facebook",
    href: "https://www.facebook.com/profile.php?id=61577253172117",
    icon: "facebook",
  },
  {
    label: "Instagram",
    href: "https://www.instagram.com/nutrib_aura/",
    icon: "instagram",
  },
  {
    label: "TikTok",
    href: "https://www.tiktok.com/@mariana.ucaay.mil",
    icon: "tiktok",
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/mariana-uca%C3%B1ay-milla-50693687/",
    icon: "linkedin",
  },
];

const nav = [
  { href: "/", label: "Inicio" },
  { href: "/servicios/", label: "Programas" },
  { href: "/sobre-mi/", label: "Sobre mí" },
  { href: "/contacto/", label: "Contacto" },
];

const homeFaqs = [
  [
    "¿Necesito tener experiencia entrenando?",
    "No. El entrenamiento se adapta a tu nivel y experiencia.",
  ],
  [
    "¿Puedo realizar el programa desde casa?",
    "Sí. El entrenamiento puede adaptarse al material y espacio del que dispongas.",
  ],
  [
    "¿La alimentación es una dieta cerrada?",
    "No. Trabajamos una estrategia de alimentación individualizada que se adapta a tus necesidades y objetivos.",
  ],
  [
    "¿Cuánto dura el programa?",
    "El compromiso recomendado es de 3 meses, ya que permite trabajar los cambios de forma progresiva y evaluar adecuadamente la evolución.",
  ],
  [
    "¿Tengo seguimiento durante el proceso?",
    "Sí. El programa incluye seguimiento, revisión semanal y ajustes cuando sean necesarios.",
  ],
  [
    "¿Cómo sé si B-Aura es para mí?",
    "Puedes escribirme y contarme qué estás buscando. Te explicaré cómo trabajo y qué opción puede encajar mejor contigo.",
  ],
];

const activePlanIncludes = [
  "Valoración inicial.",
  "Estrategia de alimentación individualizada.",
  "Plan de entrenamiento adaptado.",
  "Seguimiento y revisión de evolución.",
  "Videollamada semanal.",
  "Ajustes según evolución y necesidades.",
  "Materiales y recursos de apoyo.",
  "Comunicación continua durante el proceso.",
];

const googleReviews = [
  {
    name: "CINTHIA SIGUEÑAS POMACHARI",
    text:
      "La Dra. Mariana te acompaña de una forma muy cercana y humana. Te escucha, te entiende y te motiva a mejorar sin presión. Me siento más equilibrada y con mucha más conciencia sobre mi bienestar. Se nota que ama lo que hace, gracias Dra.",
  },
  {
    name: "silvia samame",
    text:
      "Mi experiencia con la Dr. Mariana es una nutricionista comprometida, empática y muy profesional. Sus planes son personalizados y realistas, lo que me ayudó a mejorar mi salud y mi relación con la comida.",
  },
  {
    name: "Ivan Morales",
    text:
      "Las dietas son muy buenas y personalizadas con proteínas y carbohidratos que requiere mi organismo. El seguimiento de la dieta es diario por un personal altamente calificado y semanal brinda reunión virtual para mejorar mis hábitos alimenticios.",
  },
];

const programs = [
  {
    title: "Plan de Bienestar Activo",
    price: "365 €/mes",
    kind: "Servicio principal",
    text:
      "Un programa diseñado para quienes quieren dejar de empezar de cero y construir una forma de cuidarse que puedan mantener en el tiempo.",
    forWhom:
      "Para hombres y mujeres de 30 a 60 años que quieren trabajar nutrición, entrenamiento y hábitos dentro de una misma estrategia.",
    includes: activePlanIncludes,
    main: true,
  },
  {
    title: "Nutrición",
    price: "245 €/mes",
    kind: "Alternativa",
    text:
      "Una estrategia de alimentación individualizada que puedas aplicar en tu día a día sin vivir pendiente de restricciones constantes.",
    forWhom:
      "Para quien necesita organizar mejor sus comidas, mejorar composición corporal o recuperar una relación más práctica con la alimentación.",
    includes: [
      "Valoración inicial.",
      "Estrategia de alimentación individualizada.",
      "Revisión de hábitos diarios.",
      "Seguimiento semanal.",
      "Ajustes según evolución.",
    ],
  },
  {
    title: "Entrenamiento",
    price: "205 €/mes",
    kind: "Alternativa",
    text:
      "Un plan de ejercicio adaptado a tu nivel, disponibilidad, recursos y objetivo físico.",
    forWhom:
      "Para quien quiere volver a entrenar o mejorar fuerza y condición física con una guía clara y realista.",
    includes: [
      "Valoración inicial.",
      "Plan de entrenamiento adaptado.",
      "Revisión de progreso.",
      "Ajustes semanales.",
      "Consejos de recuperación y hábitos.",
    ],
  },
];

const icons = {
  facebook:
    '<svg aria-hidden="true" viewBox="0 0 448 512"><path d="M400 32H48C21.5 32 0 53.5 0 80v352c0 26.5 21.5 48 48 48h137.3V327.7h-63V256h63v-54.6c0-62.1 37-96.5 93.7-96.5 27.1 0 55.5 4.8 55.5 4.8v61h-31.3c-30.8 0-40.4 19.1-40.4 38.7V256h68.8l-11 71.7h-57.8V480H400c26.5 0 48-21.5 48-48V80c0-26.5-21.5-48-48-48z"/></svg>',
  instagram:
    '<svg aria-hidden="true" viewBox="0 0 24 24" fill="none"><rect x="3.2" y="3.2" width="17.6" height="17.6" rx="5" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="none" stroke="currentColor" stroke-width="2"/><circle cx="17.4" cy="6.8" r="1.2" fill="currentColor"/></svg>',
  tiktok:
    '<svg aria-hidden="true" viewBox="0 0 32 32"><path d="M16.7 0h5.2c.1 2 .8 4.1 2.3 5.6 1.5 1.5 3.6 2.2 5.7 2.4v5.4a12 12 0 0 1-5.6-1.3c-.8-.3-1.5-.8-2.2-1.2 0 3.9 0 7.8-.1 11.7-.1 1.9-.7 3.7-1.8 5.3a9.5 9.5 0 0 1-7.9 4.3 10 10 0 0 1-5.4-1.4 10.3 10.3 0 0 1-4.9-7.6v-2a10.3 10.3 0 0 1 11.6-9c0 2-.1 3.9-.1 5.9a4.3 4.3 0 0 0-4 .5 4.5 4.5 0 0 0-1.8 2.3c-.3.7-.2 1.4-.2 2.1a4.5 4.5 0 0 0 4.7 3.8 4.3 4.3 0 0 0 3.7-2.1c.2-.4.5-.9.5-1.4.2-2.4.1-4.8.1-7.1 0-5.4 0-10.8.1-16.2z"/></svg>',
  linkedin:
    '<svg aria-hidden="true" viewBox="0 0 448 512"><path d="M416 32H31.9C14.3 32 0 46.5 0 64.3v383.4C0 465.5 14.3 480 31.9 480H416c17.6 0 32-14.5 32-32.3V64.3C448 46.5 433.6 32 416 32zM135.4 416H69V202.2h66.5V416zM102.2 173a38.5 38.5 0 1 1 0-77 38.5 38.5 0 0 1 0 77zM384.3 416h-66.4V312c0-24.8-.5-56.7-34.5-56.7-34.6 0-39.9 27-39.9 54.9V416h-66.4V202.2h63.7v29.2h.9c8.9-16.8 30.6-34.5 62.9-34.5 67.2 0 79.7 44.3 79.7 101.9V416z"/></svg>',
  whatsapp:
    '<svg aria-hidden="true" viewBox="0 0 448 512"><path d="M380.9 97.1A222.4 222.4 0 0 0 224.1 32C101 32 1 132 1 255a222.6 222.6 0 0 0 29.8 111.3L0 480l116.4-30.6A222.6 222.6 0 0 0 224.1 478h.1c123.1 0 223.1-100 223.1-223 0-59.6-23.2-115.6-66.4-157.9zM224.2 438.7h-.1a185.1 185.1 0 0 1-94.4-25.9l-6.8-4-69 18.1 18.4-67.2-4.4-6.9a184 184 0 0 1-28.2-97.8c0-101.5 82.7-184.1 184.4-184.1 49.2 0 95.5 19.2 130.4 54.1a183.2 183.2 0 0 1 54 130.2c0 101.5-82.7 183.5-184.3 183.5zm101.1-138c-5.5-2.8-32.8-16.2-37.9-18-5.1-1.9-8.8-2.8-12.5 2.8-3.7 5.5-14.3 18-17.6 21.8-3.2 3.7-6.5 4.2-12 1.4-32.6-16.3-54-29.1-75.5-66-5.7-9.8 5.7-9.1 16.3-30.3 1.8-3.7.9-6.9-.5-9.7-1.4-2.8-12.5-30.1-17.1-41.2-4.5-10.8-9.1-9.3-12.5-9.5-3.2-.2-6.9-.2-10.6-.2a20.5 20.5 0 0 0-14.8 6.9c-5.1 5.5-19.4 19-19.4 46.3s19.9 53.7 22.6 57.4c2.8 3.7 39.1 59.7 94.8 83.7 35.2 15.2 49 16.5 66.6 13.8 10.7-1.6 32.8-13.4 37.4-26.4 4.6-13 4.6-24.1 3.2-26.4-1.3-2.5-5-3.9-10.5-6.4z"/></svg>',
  form:
    '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h8l4 4v14H6z" fill="none" stroke="currentColor" stroke-width="1.8"/><path d="M14 3v5h5M9 12h6M9 16h6" fill="none" stroke="currentColor" stroke-width="1.8"/></svg>',
};

function socialLinks(extraClass = "", items = socials) {
  return `<div class="social-links ${extraClass}" aria-label="Redes sociales">
${items
  .map(
    (social) =>
      `<a href="${social.href}" target="_blank" rel="noopener noreferrer" aria-label="${social.label}">${icons[social.icon]}</a>`,
  )
  .join("\n")}
</div>`;
}

function header(currentPath) {
  return `<header class="site-header">
  <div class="container header-inner">
    <a class="brand" href="/" aria-label="Inicio de B-Aura">
      <img class="brand-logo" src="${headerLogo}" alt="B-Aura" width="78" height="58">
    </a>
    <nav class="primary-nav" data-primary-nav aria-label="Navegación principal">
      ${nav
        .map(
          (item) =>
            `<a href="${item.href}"${item.href === currentPath ? ' aria-current="page"' : ""}>${item.label}</a>`,
        )
        .join("")}
    </nav>
    <div class="header-actions">
      ${socialLinks("header-social", socials)}
      <button class="menu-toggle" type="button" data-menu-toggle aria-expanded="false" aria-label="Abrir menú">
        <span></span><span></span><span></span>
      </button>
    </div>
  </div>
</header>`;
}

function footer() {
  return `<footer class="footer">
  <div class="container">
    <div class="footer-grid">
      <div class="footer-brand">
        <img class="footer-logo" src="${footerLogo}" alt="B-Aura" width="768" height="547" loading="lazy">
        <p>Nutrición estratégica individualizada.<br>Entrenamiento adaptado a tu agenda.<br>Resultados sostenibles en el tiempo.</p>
      </div>
      <div>
        <h3>Navegación</h3>
        <ul>
          <li><a href="/">Inicio</a></li>
          <li><a href="/servicios/">Programas</a></li>
          <li><a href="/sobre-mi/">Sobre mí</a></li>
          <li><a href="/contacto/">Contacto</a></li>
        </ul>
      </div>
      <div>
        <h3>Redes sociales</h3>
        ${socialLinks()}
      </div>
      <div>
        <h3>Legal</h3>
        <ul>
          <li><a href="/aviso-legal/">Aviso legal</a></li>
          <li><a href="/politica-privacidad/">Política de privacidad</a></li>
          <li><a href="/politica-cookies/">Política de cookies</a></li>
        </ul>
      </div>
    </div>
    <div class="footer-bottom">© ${new Date().getFullYear()} B-Aura. Nutrición y entrenamiento con acompañamiento profesional.</div>
  </div>
</footer>`;
}

function pageShell({ currentPath, title, description, bodyClass = "", main, noindex = false }) {
  const canonical = new URL(currentPath, siteUrl).toString();
  return `<!doctype html>
<html lang="es">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1">
  <title>${title}</title>
  <meta name="description" content="${description}">
  <meta name="robots" content="${noindex ? "noindex, follow" : "index, follow, max-image-preview:large"}">
  <link rel="canonical" href="${canonical}">
  <meta property="og:locale" content="es_ES">
  <meta property="og:type" content="website">
  <meta property="og:site_name" content="B-Aura">
  <meta property="og:title" content="${title}">
  <meta property="og:description" content="${description}">
  <meta property="og:url" content="${canonical}">
  <meta property="og:image" content="${siteUrl}${photo}">
  <meta property="og:image:alt" content="Mariana, nutricionista y creadora de B-Aura">
  <meta name="twitter:card" content="summary_large_image">
  <meta name="twitter:title" content="${title}">
  <meta name="twitter:description" content="${description}">
  <meta name="twitter:image" content="${siteUrl}${photo}">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Montserrat:wght@400;500;600;700;800&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="/wp-content/uploads/elementor/google-fonts/css/lora.css">
  <link rel="stylesheet" href="/assets/css/baura-redesign.css?v=${assetVersion}">
  <link rel="icon" href="/assets/images/optimized/brand/cropped-bauras_transparente-100x100.webp">
</head>
<body class="${bodyClass}">
  <a class="skip-link" href="#contenido">Saltar al contenido</a>
  ${header(currentPath)}
  <main id="contenido">
${main}
  </main>
  ${footer()}
  <a class="floating-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer" aria-label="Hablar por WhatsApp">${icons.whatsapp}</a>
  <script src="/assets/js/baura-redesign.js?v=${assetVersion}" defer></script>
  <script src="${analytics}" defer></script>
</body>
</html>
`;
}

function ctaChooser(id, label = "QUIERO SABER SI B-AURA ES PARA MÍ", center = false) {
  const optionsId = `${id}-options`;
  return `<div class="cta-stack${center ? " center" : ""}">
  <button class="button button-primary" type="button" data-contact-toggle aria-expanded="false" aria-controls="${optionsId}">${label}</button>
  <p class="cta-note">Puedes elegir cómo contactar conmigo.</p>
  <div class="contact-options" id="${optionsId}" hidden>
    <a class="contact-option" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">
      ${icons.whatsapp}
      <span><strong>Hablar por WhatsApp</strong><span>Contacto directo.</span></span>
    </a>
    <a class="contact-option" href="/contacto/#formulario">
      ${icons.form}
      <span><strong>Enviar formulario</strong><span>Escribir desde la web.</span></span>
    </a>
  </div>
</div>`;
}

function programCtaStrip() {
  return `<div class="program-cta-strip">
  <div class="container program-cta-inner">
    <div class="program-cta-copy">
      <h2>¿Estás preparado/a para dejar de empezar de cero?</h2>
      <p>No necesitas hacerlo perfecto. Necesitas una estrategia que puedas mantener.</p>
    </div>
    <div class="strip-actions">
      <a class="button button-primary" href="/contacto/">QUIERO SABER SI B-AURA ES PARA MÍ</a>
      <a class="button button-whatsapp" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">${icons.whatsapp}<span>WhatsApp</span></a>
      <a class="button button-outline-rose" href="/contacto/#formulario">${icons.form}<span>Formulario</span></a>
    </div>
  </div>
</div>`;
}

function checkList(items, className = "check-list") {
  return `<ul class="${className}">
${items.map((item) => `  <li>${item}</li>`).join("\n")}
</ul>`;
}

function resultsFeatureList(items) {
  return `<div class="results-feature-list">
${items
  .map(
    ([title, text, icon]) =>
      `  <div class="results-feature">${serviceIcon(icon)}<div><h3>${title}</h3><p>${text}</p></div></div>`,
  )
  .join("\n")}
</div>`;
}

function testimonialCards() {
  return `<div class="card-grid three testimonial-grid">
${googleReviews
  .map(
    ({ name, text }) =>
      `          <article class="testimonial-card"><h3>${name}</h3><p>${text}</p></article>`,
  )
  .join("\n")}
        </div>
        <div class="reviews-action">
          <a class="button button-secondary" href="${googleReviewsUrl}" target="_blank" rel="noopener noreferrer">Ver todas las reseñas</a>
        </div>`;
}

function serviceIcon(type) {
  const svg = {
    bowl:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M6.5 12a5.5 5.5 0 0 0 11 0"/><path d="M9 17.5h6"/><path d="M9.5 9c1.4-2.2 3.4-3.1 6.2-3.3"/><path d="M15.8 5.7c.1 2.3-1.5 3.7-4.4 3.7"/></svg>',
    certificate:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M6 3h9l3 3v15H6z"/><path d="M15 3v4h3"/><path d="M9 10h6"/><path d="M9 13h7"/><path d="M9 16h6"/><path d="M9 19h4"/></svg>',
    graduation:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M3 9l9-4 9 4-9 4-9-4z"/><path d="M7 11.5V15c2.7 2 7.3 2 10 0v-3.5"/><path d="M20 10v5"/></svg>',
    experience:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M9 7V5.8C9 4.8 9.8 4 10.8 4h2.4c1 0 1.8.8 1.8 1.8V7"/><path d="M5 7h14a2 2 0 0 1 2 2v8a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V9a2 2 0 0 1 2-2z"/><path d="M3 12h18"/><path d="M10 12v2h4v-2"/></svg>',
    nutrition:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M6.5 12a5.5 5.5 0 0 0 11 0"/><path d="M9 17.5h6"/><path d="M9.5 9c1.4-2.2 3.4-3.1 6.2-3.3"/><path d="M15.8 5.7c.1 2.3-1.5 3.7-4.4 3.7"/></svg>',
    training:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4.7 14.9 9.1 19.3"/><path d="M6.6 12.9 11.1 17.4"/><path d="M12.9 6.6 17.4 11.1"/><path d="M14.9 4.7 19.3 9.1"/><path d="M9.1 15.4 15.4 9.1"/><path d="M3.8 16.7l3.5 3.5M16.7 3.8l3.5 3.5"/></svg>',
    habits:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20V9"/><path d="M12 11c-3.3 0-5-1.9-5-5 3.5.1 5 2.1 5 5z"/><path d="M12 14c3.5 0 5.3-2 5.3-5.3-3.7.1-5.3 2.2-5.3 5.3z"/></svg>',
    tracking:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 4.5h6"/><path d="M8.5 12l2 2 4.5-5"/><path d="M8.5 17h7"/></svg>',
  };

  return `<span class="service-icon">${svg[type]}</span>`;
}

function heroTagIcon(type) {
  const svg = {
    nutrition:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M5 12h14"/><path d="M6.5 12a5.5 5.5 0 0 0 11 0"/><path d="M9 17.5h6"/><path d="M9.5 9c1.4-2.2 3.4-3.1 6.2-3.3"/><path d="M15.8 5.7c.1 2.3-1.5 3.7-4.4 3.7"/></svg>',
    training:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M4.7 14.9 9.1 19.3"/><path d="M6.6 12.9 11.1 17.4"/><path d="M12.9 6.6 17.4 11.1"/><path d="M14.9 4.7 19.3 9.1"/><path d="M9.1 15.4 15.4 9.1"/><path d="M3.8 16.7l3.5 3.5M16.7 3.8l3.5 3.5"/></svg>',
    habits:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><path d="M12 20V9"/><path d="M12 11c-3.3 0-5-1.9-5-5 3.5.1 5 2.1 5 5z"/><path d="M12 14c3.5 0 5.3-2 5.3-5.3-3.7.1-5.3 2.2-5.3 5.3z"/></svg>',
    tracking:
      '<svg aria-hidden="true" viewBox="0 0 24 24"><rect x="5" y="4" width="14" height="16" rx="2"/><path d="M9 4.5h6"/><path d="M8.5 12l2 2 4.5-5"/><path d="M8.5 17h7"/></svg>',
  };

  return `<span class="hero-tag-icon">${svg[type]}</span>`;
}

function homePage() {
  const identification = [
    "Empiezas dietas que consigues mantener unas semanas, pero después las abandonas.",
    "Quieres perder grasa o mejorar tu composición corporal sin vivir pendiente de las restricciones.",
    "Te falta tiempo para organizar tus comidas y entrenamientos.",
    "Sabes qué deberías hacer, pero te cuesta mantener la constancia.",
    "Quieres volver a entrenar y sentirte con más energía.",
    "Estás cansado/a de empezar de nuevo cada lunes.",
  ];

  const forWhom = [
    "Quieres mejorar tu composición corporal.",
    "Quieres perder grasa sin recurrir a dietas extremas.",
    "Necesitas organizar mejor tu alimentación.",
    "Quieres volver a entrenar o mejorar tu condición física.",
    "Tienes poco tiempo y necesitas que el plan se adapte a tu agenda.",
    "Te cuesta mantener la constancia cuando tienes mucho trabajo o responsabilidades.",
    "Quieres sentirte con más energía y recuperar buenos hábitos.",
    "Buscas acompañamiento profesional durante el proceso.",
  ];

  const results = [
    ["Mejorar tu composición corporal", "Trabajando alimentación, entrenamiento y hábitos.", "habits"],
    ["Organizar tu alimentación", "Sin depender de restricciones constantes.", "nutrition"],
    ["Mejorar tu fuerza y condición física", "Con un entrenamiento adaptado a tu nivel.", "training"],
    ["Construir hábitos sostenibles", "Para que cuidarte forme parte de tu vida.", "habits"],
    ["Sentirte con más energía y confianza", "A medida que avanzas.", "tracking"],
  ];

  return pageShell({
    currentPath: "/",
    title: "B-Aura | Nutrición y entrenamiento para volver a sentirte bien",
    description:
      "B-Aura combina nutrición, entrenamiento, hábitos y seguimiento para ayudarte a mejorar tu composición corporal, energía y bienestar.",
    main: `    <section class="hero">
      <div class="container hero-grid">
        <div class="hero-copy">
          <span class="eyebrow">Nutrición · Entrenamiento · Hábitos · Seguimiento</span>
          <h1>Nutrición y entrenamiento para volver a <span>sentirte bien.</span></h1>
          <p class="lead">Un acompañamiento profesional para mejorar tu alimentación, recuperar tu energía y ponerte en forma con una estrategia que se adapte a tu vida real.</p>
          <p class="hero-note">Para hombres y mujeres de 30 a 60 años que buscan resultados sostenibles sin dietas extremas ni entrenamientos imposibles.</p>
          ${ctaChooser("hero")}
          <div class="hero-tags" aria-label="Áreas de trabajo">
            <span>${heroTagIcon("nutrition")}Nutrición</span>
            <span>${heroTagIcon("training")}Entrenamiento</span>
            <span>${heroTagIcon("habits")}Hábitos</span>
            <span>${heroTagIcon("tracking")}Seguimiento</span>
          </div>
        </div>
        <div class="hero-visual">
          <figure class="portrait-frame hero-photo">
            <img src="${photo}" alt="Mariana, nutricionista y creadora de B-Aura" width="900" height="909" fetchpriority="high">
            <figcaption class="portrait-badge"><strong>Mariana Ucañay Milla</strong><span>Nutricionista y creadora de B-Aura</span></figcaption>
          </figure>
        </div>
      </div>
    </section>

    <section class="section section-identification">
      <div class="container">
        <div class="section-header center">
          <h2>¿Te resulta difícil cuidarte <span class="text-rose">cuando</span> tu vida no se detiene?</h2>
        </div>
        <div class="identification-grid">
          ${checkList(identification)}
          <div class="quote-card">
            <img src="${logo}" alt="" width="82" height="82">
            <p>No necesitas otro plan que abandonar.<br>Necesitas una estrategia que puedas mantener.</p>
          </div>
          <figure class="support-image">
            <img src="${supportPhoto}" alt="Alimentación y entrenamiento como parte de una estrategia de bienestar" width="1200" height="800" loading="lazy">
          </figure>
        </div>
      </div>
    </section>

    <section class="section section-dark solution-band">
      <div class="container">
        <div class="section-header center">
          <h2>Una estrategia integral para cuidar de ti <span>sin complicarte la vida.</span></h2>
          <p>En B-Aura trabajamos alimentación, entrenamiento y hábitos dentro de un mismo proceso, adaptándolo a tus objetivos, necesidades y ritmo de vida.</p>
        </div>
        <div class="card-grid">
          <article class="service-card">${serviceIcon("nutrition")}<h3>Nutrición</h3><p>Una estrategia de alimentación individualizada que puedas aplicar en tu día a día.</p></article>
          <article class="service-card">${serviceIcon("training")}<h3>Entrenamiento</h3><p>Un plan de ejercicio adaptado a tu nivel, disponibilidad y recursos.</p></article>
          <article class="service-card">${serviceIcon("habits")}<h3>Hábitos</h3><p>Trabajamos los hábitos que influyen en tu bienestar y en tu capacidad para mantener los resultados.</p></article>
          <article class="service-card">${serviceIcon("tracking")}<h3>Seguimiento</h3><p>No recibes un plan y desapareces. Revisamos tu evolución y hacemos los ajustes necesarios durante el proceso.</p></article>
        </div>
      </div>
    </section>

    <section class="section program-section" id="programa">
      <div class="container">
        <div class="program-layout">
          <article class="program-card home-program-card">
            <div class="program-summary">
              <p class="program-kicker">Programa principal</p>
              <h2>Plan de Bienestar Activo</h2>
              <p class="lead">Nutrición + entrenamiento + hábitos + seguimiento</p>
              <p>Un programa diseñado para quienes quieren dejar de empezar de cero y construir una forma de cuidarse que puedan mantener en el tiempo.</p>
              <div class="price">365 €/mes</div>
              <p class="price-note">Compromiso recomendado: 3 meses.</p>
              ${ctaChooser("programa")}
            </div>
            <div class="program-includes">
              <h3>Incluye:</h3>
              ${checkList(activePlanIncludes, "feature-list")}
            </div>
          </article>
          <aside class="offer-column" aria-label="Servicios adicionales">
            <article class="mini-card offer-card">${serviceIcon("bowl")}<div><h3>Nutrición</h3><div class="mini-price">245 €/mes</div></div><a href="/servicios/#nutricion" aria-label="Ver programa de nutrición">›</a></article>
            <article class="mini-card offer-card">${serviceIcon("training")}<div><h3>Entrenamiento</h3><div class="mini-price">205 €/mes</div></div><a href="/servicios/#entrenamiento" aria-label="Ver programa de entrenamiento">›</a></article>
          </aside>
        </div>
      </div>
      ${programCtaStrip()}
    </section>

    <section class="section section-dark audience-results-section">
      <div class="container audience-results-grid">
        <article class="audience-panel">
          <h2>B-Aura es para ti si...</h2>
          ${checkList(forWhom, "check-list audience-list")}
        </article>
        <article class="audience-panel results-panel">
          <h2>Tu objetivo no es hacerlo perfecto.<br>Es poder mantenerlo.</h2>
          ${resultsFeatureList(results)}
        </article>
      </div>
    </section>

    <section class="section section-rose" id="testimonios">
      <div class="container">
        <div class="section-header center">
          <h2>Lo que dicen quienes han trabajado conmigo</h2>
        </div>
        ${testimonialCards()}
      </div>
    </section>

    <section class="section home-about-section">
      <div class="container about-strip">
        <figure class="portrait-frame about-strip-photo">
          <img src="${photo}" alt="Mariana Ucañay Milla" width="900" height="909" loading="lazy">
        </figure>
        <div class="about-strip-copy">
          <h2>Hola, soy Mariana.</h2>
          <p class="lead">Nutricionista y creadora de B-Aura.</p>
          <p>Soy Licenciada en Nutrición y Dietética y Máster en Nutrición Humana y Dietética Aplicada.</p>
          <p>Cuento con más de 11 años de experiencia en el ámbito de la nutrición y el entrenamiento.</p>
          <p>He creado B-Aura para ofrecer una forma de trabajar que vaya más allá de entregar una dieta o un entrenamiento: integrar alimentación, movimiento y hábitos dentro de una estrategia que pueda adaptarse a la vida real.</p>
          <a class="button button-secondary about-button" href="/sobre-mi/">CONOCE MI HISTORIA</a>
        </div>
        <div class="about-credentials" aria-label="Formación y experiencia">
          <div class="credential-item">${serviceIcon("certificate")}<span>Licenciada en Nutrición y Dietética</span></div>
          <div class="credential-item">${serviceIcon("graduation")}<span>Máster en Nutrición Humana y Dietética Aplicada</span></div>
          <div class="credential-item">${serviceIcon("experience")}<span>Experiencia profesional en nutrición y entrenamiento</span></div>
        </div>
      </div>
    </section>

    <section class="section section-dark process-section">
      <div class="container">
        <div class="section-header center">
          <h2>Empezar es más sencillo de lo que parece.</h2>
        </div>
        <div class="steps-grid">
          <article class="step-card"><span class="step-number">01</span><h3>Cuéntame qué quieres conseguir</h3><p>Escríbeme y cuéntame qué quieres mejorar y qué estás buscando.</p></article>
          <article class="step-card"><span class="step-number">02</span><h3>Valoramos tu situación</h3><p>Conocemos tus objetivos, necesidades y contexto para determinar si B-Aura es adecuado para ti.</p></article>
          <article class="step-card"><span class="step-number">03</span><h3>Empezamos</h3><p>Diseñamos tu estrategia y comenzamos el acompañamiento.</p></article>
          <article class="step-card"><span class="step-number">04</span><h3>Evolucionamos contigo</h3><p>Revisamos tu evolución y realizamos los ajustes necesarios durante el proceso.</p></article>
        </div>
        <div class="section-cta">${ctaChooser("como-funciona", "QUIERO SABER SI B-AURA ES PARA MÍ", true)}</div>
      </div>
    </section>

    <section class="section">
      <div class="container">
        <div class="section-header center">
          <h2>Preguntas frecuentes</h2>
        </div>
        <div class="faq-list">
          ${homeFaqs.map(([q, a]) => `<details><summary>${q}</summary><p>${a}</p></details>`).join("")}
        </div>
      </div>
    </section>

    <section class="section section-rose final-cta">
      <div class="container">
        <h2>¿Estás preparado/a para dejar de empezar de cero?</h2>
        <p class="lead centered">No necesitas hacerlo perfecto. Necesitas una estrategia que puedas mantener.</p>
        ${ctaChooser("final", "QUIERO SABER SI B-AURA ES PARA MÍ", true)}
      </div>
    </section>`,
  });
}

function programsPage() {
  return pageShell({
    currentPath: "/servicios/",
    title: "Programas | B-Aura",
    description:
      "Plan de Bienestar Activo, Nutrición y Entrenamiento de B-Aura: opciones de acompañamiento profesional desde 205 €/mes.",
    main: `    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Programas B-Aura</span>
        <h1>Nutrición, entrenamiento y hábitos con una estrategia clara.</h1>
        <p class="lead">El Plan de Bienestar Activo es el servicio principal. Después puedes encontrar opciones centradas en nutrición o entrenamiento.</p>
      </div>
    </section>

    <section class="section">
      <div class="container">
        ${programs
          .map(
            (program) => `<article class="service-detail${program.main ? " main" : ""}" id="${program.title === "Nutrición" ? "nutricion" : program.title === "Entrenamiento" ? "entrenamiento" : "bienestar-activo"}">
          <div>
            <p class="program-kicker">${program.kind}</p>
            <h2>${program.title}</h2>
            <p class="lead">${program.text}</p>
            <h3>Para quién es</h3>
            <p>${program.forWhom}</p>
            <h3>Qué incluye</h3>
            ${checkList(program.includes, "feature-list")}
          </div>
          <aside class="price-panel">
            <div class="price">${program.price}</div>${program.main ? "\n            <p class=\"price-note\">Compromiso recomendado: 3 meses.</p>" : ""}
            <p>Escríbeme y cuéntame qué quieres mejorar. Te explicaré cómo funciona y qué opción puede encajar mejor contigo.</p>
            ${ctaChooser(`servicio-${program.title.toLowerCase().replaceAll(" ", "-")}`)}
          </aside>
        </article>`,
          )
          .join("")}
      </div>
    </section>`,
  });
}

function aboutPage() {
  return pageShell({
    currentPath: "/sobre-mi/",
    title: "Sobre mí | Mariana Ucañay Milla",
    description:
      "Conoce a Mariana, nutricionista y creadora de B-Aura, y su forma de integrar alimentación, entrenamiento y hábitos en la vida real.",
    main: `    <section class="page-hero">
      <div class="container split-grid">
        <div>
          <span class="eyebrow">Sobre mí</span>
          <h1>Hola, soy Mariana.</h1>
          <p class="lead">Nutricionista y creadora de B-Aura.</p>
          <p>Soy Licenciada en Nutrición y Dietética y Máster en Nutrición Humana y Dietética Aplicada. Cuento con más de 11 años de experiencia en el ámbito de la nutrición y el entrenamiento.</p>
        </div>
        <figure class="portrait-frame">
          <img src="${photo}" alt="Mariana Ucañay Milla" width="900" height="909" fetchpriority="high">
        </figure>
      </div>
    </section>

    <section class="section">
      <div class="container split-grid">
        <div>
          <span class="eyebrow">Mi trayectoria</span>
          <h2>Una forma de trabajar basada en ciencia, contexto y seguimiento.</h2>
        </div>
        <div>
          <p>Durante mi trayectoria he acompañado a personas que querían mejorar su alimentación, volver a entrenar, organizar sus hábitos y sentirse con más energía sin depender de planes extremos.</p>
          <p>B-Aura nace para integrar alimentación, movimiento y hábitos dentro de una estrategia que pueda adaptarse a la vida real.</p>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-header">
          <span class="eyebrow">Formación</span>
          <h2>Formación y experiencia.</h2>
        </div>
        <div class="card-grid three">
          <article class="result-card"><h3>Licenciada en Nutrición y Dietética</h3><p>Base profesional para trabajar alimentación desde una mirada rigurosa.</p></article>
          <article class="result-card"><h3>Máster en Nutrición Humana y Dietética Aplicada</h3><p>Profundización en estrategia nutricional y aplicación práctica.</p></article>
          <article class="result-card"><h3>Experiencia profesional en nutrición y entrenamiento</h3><p>Más de 11 años acompañando procesos de mejora de hábitos, energía y composición corporal.</p></article>
        </div>
      </div>
    </section>

    <section class="section">
      <div class="container split-grid">
        <div>
          <span class="eyebrow">Por qué nació B-Aura</span>
          <h2>Porque cuidarte no debería depender de empezar de cero cada lunes.</h2>
        </div>
        <div>
          <p>He creado B-Aura para ofrecer una forma de trabajar que vaya más allá de entregar una dieta o un entrenamiento.</p>
          <p>El objetivo es construir una estrategia que tenga en cuenta tus horarios, responsabilidades, nivel de energía, recursos y objetivos, para que puedas sostener el proceso en el tiempo.</p>
        </div>
      </div>
    </section>

    <section class="section section-soft">
      <div class="container">
        <div class="section-header center">
          <span class="eyebrow">Cómo trabajo</span>
          <h2>Alimentación, movimiento y hábitos dentro de un mismo proceso.</h2>
        </div>
        <div class="steps-grid">
          <article class="step-card"><span class="step-number">01</span><h3>Escuchamos tu contexto</h3><p>Objetivos, horarios, experiencia, necesidades y barreras reales.</p></article>
          <article class="step-card"><span class="step-number">02</span><h3>Diseñamos la estrategia</h3><p>Nutrición y entrenamiento se adaptan a lo que puedes mantener.</p></article>
          <article class="step-card"><span class="step-number">03</span><h3>Revisamos evolución</h3><p>No te quedas con un plan fijo: ajustamos durante el proceso.</p></article>
          <article class="step-card"><span class="step-number">04</span><h3>Construimos continuidad</h3><p>Buscamos que cuidarte forme parte de tu vida, no de una etapa.</p></article>
        </div>
        <div class="section-cta">${ctaChooser("sobre-mi-cta", "QUIERO SABER SI B-AURA ES PARA MÍ", true)}</div>
      </div>
    </section>`,
  });
}

function contactForm() {
  return `<form class="contact-form" name="contacto-b-aura" method="POST" action="/contacto/" data-netlify="true" netlify-honeypot="bot-field" data-baura-contact-form id="formulario">
  <input type="hidden" name="form-name" value="contacto-b-aura">
  <p class="bot-field"><label>No rellenes este campo <input name="bot-field"></label></p>
  <div class="form-grid">
    <div class="field">
      <label for="nombre">Nombre</label>
      <input id="nombre" name="nombre" autocomplete="name" required>
    </div>
    <div class="field">
      <label for="email">Email</label>
      <input id="email" type="email" name="email" autocomplete="email" required>
    </div>
    <div class="field">
      <label for="telefono">WhatsApp / teléfono</label>
      <input id="telefono" type="tel" name="telefono" autocomplete="tel" required>
    </div>
    <div class="field">
      <label for="servicio">¿Qué servicio te interesa?</label>
      <select id="servicio" name="servicio" required>
        <option value="">Selecciona una opción</option>
        <option>Plan de Bienestar Activo</option>
        <option>Nutrición</option>
        <option>Entrenamiento</option>
        <option>No estoy seguro/a</option>
      </select>
    </div>
    <div class="field-full">
      <label for="mejorar">¿Qué te gustaría mejorar?</label>
      <textarea id="mejorar" name="mejorar" required></textarea>
    </div>
  </div>
  <label class="checkbox-field">
    <input type="checkbox" name="privacidad" required>
    <span>He leído y acepto la <a href="/politica-privacidad/">Política de Privacidad</a>.</span>
  </label>
  <label class="checkbox-field">
    <input type="checkbox" name="marketing_consent" value="1">
    <span>Quiero recibir noticias y novedades de B-Aura por email.</span>
  </label>
  <button class="button button-primary" type="submit">QUIERO CONTACTAR</button>
  <div class="form-status" data-form-status role="status" aria-live="polite"></div>
</form>`;
}

function contactPage() {
  return pageShell({
    currentPath: "/contacto/",
    title: "Contacto | B-Aura",
    description:
      "Contacta con Mariana por WhatsApp o mediante formulario para saber si B-Aura es adecuado para ti.",
    main: `    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Contacto</span>
        <h1>¿Hablamos?</h1>
        <p class="lead">Si quieres saber si B-Aura es adecuado para ti, puedes contactar conmigo de la forma que te resulte más cómoda.</p>
      </div>
    </section>

    <section class="section">
      <div class="container contact-layout">
        <aside class="contact-card">
          <h2>Elige cómo contactar</h2>
          <p>Puedes hablar directamente por WhatsApp o enviar el formulario si prefieres escribir desde la web.</p>
          <a class="button button-primary" href="${whatsappUrl}" target="_blank" rel="noopener noreferrer">HABLAR POR WHATSAPP</a>
          <a class="button button-secondary" href="#formulario">ENVIAR FORMULARIO</a>
          <div>
            <h3>Redes sociales</h3>
            ${socialLinks()}
          </div>
        </aside>
        <div>
          <div class="section-header">
            <span class="eyebrow">Formulario</span>
            <h2>Cuéntame qué quieres mejorar.</h2>
          </div>
          ${contactForm()}
        </div>
      </div>
    </section>`,
  });
}

function thanksPage() {
  return pageShell({
    currentPath: "/contacto/gracias/",
    title: "Mensaje recibido | B-Aura",
    description: "Gracias por contactar con B-Aura. Mariana responderá lo antes posible.",
    noindex: true,
    main: `    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Mensaje recibido</span>
        <h1>Gracias por escribirme.</h1>
        <p class="lead">He recibido tu mensaje y me pondré en contacto contigo lo antes posible.</p>
        <p><a class="button button-primary" href="/">Volver al inicio</a></p>
      </div>
    </section>`,
  });
}

const legalContentByPath = {
  "/aviso-legal/": `<p class="legal-updated">Última actualización: 31 de agosto de 2026</p>
          <p>Este aviso legal regula el acceso, navegación y uso del sitio web <a href="https://b-aura.es/">https://b-aura.es/</a>, titularidad de B-Aura.</p>

          <h2>1. Datos identificativos del titular</h2>
          <div class="legal-table-wrap">
            <table>
              <tbody>
                <tr><th>Dato</th><th>Información</th></tr>
                <tr><td>Titular</td><td>Mariana Ucañay Milla</td></tr>
                <tr><td>Nombre comercial</td><td>B-Aura</td></tr>
                <tr><td>DNI/NIF</td><td>60848454-E</td></tr>
                <tr><td>Domicilio profesional</td><td>Travesía de la Fuente 2, 28823 Coslada (Madrid)</td></tr>
                <tr><td>Correo electrónico</td><td><a href="mailto:mariana03011991@gmail.com">mariana03011991@gmail.com</a></td></tr>
                <tr><td>Teléfono / WhatsApp</td><td><a href="tel:+34658876022">+34 658 876 022</a></td></tr>
                <tr><td>Sitio web</td><td><a href="https://b-aura.es/">https://b-aura.es/</a></td></tr>
                <tr><td>Actividad</td><td>Servicios de asesoramiento y acompañamiento en nutrición, entrenamiento y hábitos saludables, así como contenidos informativos relacionados.</td></tr>
                <tr><td>Datos profesionales</td><td>Licenciada en Nutrición y Dietética y Máster en Nutrición Humana y Dietética Aplicada. Si la actividad estuviera sujeta a colegiación, autorización administrativa, registro profesional u otra mención obligatoria, deberán incorporarse aquí los datos correspondientes.</td></tr>
              </tbody>
            </table>
          </div>
          <h2>2. Objeto del sitio web</h2>
          <p>El sitio web tiene finalidad informativa y de contacto. A través de sus páginas se presentan los servicios de B-Aura, contenidos sobre nutrición, entrenamiento y hábitos, vías de contacto y, en su caso, información sobre programas, precios o recursos disponibles.</p>

          <h2>3. Condiciones de uso</h2>
          <p>La persona usuaria se compromete a utilizar este sitio web de forma lícita, diligente y respetuosa, sin dañar los sistemas, contenidos o derechos de B-Aura o de terceros. Queda prohibido introducir código malicioso, intentar acceder a zonas no autorizadas, usar el sitio para fines ilícitos o emplear los contenidos de manera que pueda perjudicar la imagen, intereses o derechos de B-Aura.</p>

          <h2>4. Servicios, precios y contratación</h2>
          <p>La información publicada sobre servicios, programas o precios tiene carácter informativo. Antes de contratar cualquier servicio se facilitarán las condiciones aplicables, incluyendo precio final, impuestos, forma de pago, duración, alcance del servicio y condiciones de cancelación o desistimiento cuando proceda.</p>
          <p>Los contenidos de la web no sustituyen un diagnóstico, tratamiento médico ni atención sanitaria urgente. Si tienes una patología, lesión, embarazo, medicación activa, antecedentes clínicos relevantes o sospecha de trastorno de la conducta alimentaria, consulta con un profesional sanitario antes de iniciar cambios de alimentación o entrenamiento.</p>

          <h2>5. Propiedad intelectual e industrial</h2>
          <p>Los textos, imágenes, logotipos, diseño, estructura, código y demás contenidos del sitio web pertenecen a B-Aura o se utilizan con autorización o licencia suficiente. No se permite su reproducción, distribución, transformación o comunicación pública sin autorización previa, salvo en los supuestos legalmente permitidos.</p>

          <h2>6. Enlaces externos</h2>
          <p>Este sitio puede incluir enlaces a WhatsApp, redes sociales u otras páginas de terceros. B-Aura no controla sus contenidos, políticas de privacidad, cookies ni prácticas de seguridad. Al acceder a sitios externos, la persona usuaria queda sujeta a las condiciones y políticas de dichos terceros.</p>

          <h2>7. Responsabilidad</h2>
          <p>B-Aura procura que la información del sitio sea clara, actualizada y correcta, pero no garantiza la ausencia de errores puntuales, interrupciones técnicas o desactualizaciones. B-Aura no será responsable de daños derivados del uso indebido de la web, de decisiones tomadas únicamente a partir de contenidos generales o de incidencias causadas por terceros proveedores.</p>

          <h2>8. Protección de datos y cookies</h2>
          <p>El tratamiento de datos personales se explica en la <a href="/politica-privacidad/">Política de privacidad</a>. El uso de cookies y tecnologías similares se detalla en la <a href="/politica-cookies/">Política de cookies</a>.</p>

          <h2>9. Legislación aplicable</h2>
          <p>Este sitio web se rige por la legislación española y europea aplicable. Si la persona usuaria actúa como consumidora, cualquier controversia se someterá a los juzgados y tribunales que correspondan conforme a la normativa de consumidores y usuarios.</p>`,
  "/politica-privacidad/": `<p class="legal-updated">Última actualización: 31 de agosto de 2026</p>
          <p>Esta política explica cómo B-Aura trata los datos personales de las personas que navegan por la web, contactan a través del formulario, WhatsApp, correo electrónico o redes sociales, solicitan información o contratan servicios.</p>

          <h2>1. Responsable del tratamiento</h2>
          <div class="legal-table-wrap">
            <table>
              <tbody>
                <tr><th>Dato</th><th>Información</th></tr>
                <tr><td>Responsable</td><td>Mariana Ucañay Milla, B-Aura</td></tr>
                <tr><td>DNI/NIF</td><td>60848454-E</td></tr>
                <tr><td>Domicilio profesional</td><td>Travesía de la Fuente 2, 28823 Coslada (Madrid)</td></tr>
                <tr><td>Email de contacto</td><td><a href="mailto:mariana03011991@gmail.com">mariana03011991@gmail.com</a></td></tr>
                <tr><td>Teléfono / WhatsApp</td><td><a href="tel:+34658876022">+34 658 876 022</a></td></tr>
              </tbody>
            </table>
          </div>
          <h2>2. Datos personales que podemos tratar</h2>
          <ul>
            <li>Datos identificativos y de contacto: nombre, email, teléfono o usuario de redes sociales.</li>
            <li>Datos incluidos en el formulario: servicio de interés, mensaje enviado, aceptación de la política de privacidad y consentimiento para recibir comunicaciones si lo marcas.</li>
            <li>Datos de comunicaciones: mensajes enviados por email, WhatsApp, redes sociales o formularios.</li>
            <li>Datos relacionados con objetivos, hábitos, alimentación, entrenamiento, medidas corporales o salud cuando los facilites voluntariamente durante una consulta o prestación de servicios.</li>
            <li>Datos técnicos y de navegación: página visitada, interacción con botones de contacto y datos de analítica si has aceptado las cookies correspondientes.</li>
          </ul>
          <p>En el primer contacto, evita enviar información clínica o datos especialmente sensibles que no sean necesarios. Si posteriormente fuera imprescindible tratar datos de salud para prestar un servicio, se solicitará la información y consentimiento adecuados.</p>

          <h2>3. Finalidades y bases jurídicas</h2>
          <div class="legal-table-wrap">
            <table>
              <tbody>
                <tr><th>Finalidad</th><th>Base jurídica</th></tr>
                <tr><td>Responder consultas y solicitudes enviadas por formulario, WhatsApp, email o redes sociales.</td><td>Consentimiento de la persona interesada y aplicación de medidas precontractuales solicitadas.</td></tr>
                <tr><td>Gestionar la relación profesional, preparar propuestas, prestar servicios de nutrición, entrenamiento y hábitos, hacer seguimiento y comunicarnos contigo.</td><td>Ejecución de contrato o medidas precontractuales. Cuando proceda tratar datos de salud, consentimiento explícito y obligaciones profesionales aplicables.</td></tr>
                <tr><td>Enviar noticias, novedades o comunicaciones comerciales de B-Aura.</td><td>Consentimiento, mediante la casilla específica del formulario o solicitud equivalente.</td></tr>
                <tr><td>Enviar confirmaciones automáticas de recepción de mensajes y gestionar contactos de email.</td><td>Interés legítimo en atender correctamente la comunicación y, cuando sea marketing, consentimiento.</td></tr>
                <tr><td>Analizar el uso de la web y medir conversiones como clics en WhatsApp o envíos de formulario.</td><td>Consentimiento para cookies o tecnologías de analítica.</td></tr>
                <tr><td>Mantener la seguridad del sitio, prevenir spam, fraudes o usos indebidos, y cumplir obligaciones legales.</td><td>Interés legítimo y cumplimiento de obligaciones legales.</td></tr>
              </tbody>
            </table>
          </div>

          <h2>4. Destinatarios y proveedores</h2>
          <p>B-Aura no vende tus datos personales. Para prestar el servicio y mantener la web pueden intervenir proveedores tecnológicos o profesionales bajo las garantías correspondientes:</p>
          <ul>
            <li>Netlify, para alojamiento web, despliegue y gestión de formularios.</li>
            <li>Resend, para envío de confirmaciones por email y, si lo aceptas, gestión de comunicaciones.</li>
            <li>Google, para Google Analytics cuando aceptas la medición y para la carga de tipografías o recursos técnicos de la web.</li>
            <li>WhatsApp, Facebook, Instagram, TikTok, LinkedIn u otras plataformas cuando decides contactar o interactuar con B-Aura a través de esos servicios.</li>
            <li>Asesorías, proveedores administrativos, legales o técnicos cuando sea necesario para obligaciones profesionales o legales.</li>
          </ul>
          <p>Algunos proveedores pueden tratar datos fuera del Espacio Económico Europeo. En esos casos se utilizarán garantías adecuadas conforme al RGPD, como cláusulas contractuales tipo u otros mecanismos válidos.</p>

          <h2>5. Plazos de conservación</h2>
          <ul>
            <li>Consultas no contratadas: durante el tiempo necesario para responder y hacer seguimiento razonable, con carácter general hasta 12 meses salvo que solicites antes su supresión.</li>
            <li>Clientes y servicios contratados: durante la relación profesional y los plazos necesarios para atender responsabilidades legales, fiscales, contables o profesionales.</li>
            <li>Comunicaciones comerciales: hasta que retires tu consentimiento o solicites la baja.</li>
            <li>Datos de analítica: según la configuración de Google Analytics y el plazo de las cookies indicado en la <a href="/politica-cookies/">Política de cookies</a>.</li>
          </ul>

          <h2>6. Derechos de las personas interesadas</h2>
          <p>Puedes ejercer tus derechos de acceso, rectificación, supresión, oposición, limitación del tratamiento, portabilidad y retirada del consentimiento escribiendo a <a href="mailto:mariana03011991@gmail.com">mariana03011991@gmail.com</a>. También puedes reclamar ante la Agencia Española de Protección de Datos en <a href="https://www.aepd.es/" target="_blank" rel="noopener noreferrer">www.aepd.es</a> si consideras que tus derechos no han sido atendidos correctamente.</p>

          <h2>7. Menores de edad</h2>
          <p>Los servicios y formularios de B-Aura no están dirigidos a menores de 14 años. Si una persona menor necesita orientación, deberá intervenir su madre, padre, tutor o representante legal.</p>

          <h2>8. Seguridad y confidencialidad</h2>
          <p>B-Aura aplica medidas técnicas y organizativas razonables para proteger los datos personales frente a accesos no autorizados, pérdida, alteración o divulgación indebida. La información relacionada con salud, hábitos o situación personal se tratará con especial confidencialidad.</p>

          <h2>9. Cambios en esta política</h2>
          <p>Esta política podrá actualizarse cuando cambien los servicios, proveedores, formularios o requisitos legales. La fecha de la última actualización se mostrará siempre al inicio de la página.</p>`,
  "/politica-cookies/": `<p class="legal-updated">Última actualización: 31 de agosto de 2026</p>
          <p>Esta política explica qué cookies y tecnologías similares puede utilizar B-Aura en <a href="https://b-aura.es/">https://b-aura.es/</a>, para qué sirven y cómo puedes aceptar, rechazar o cambiar tus preferencias.</p>

          <h2>1. Qué son las cookies</h2>
          <p>Las cookies son pequeños archivos que un sitio web puede guardar en tu navegador. También existen tecnologías similares, como el almacenamiento local del navegador, que permiten recordar preferencias o medir el uso de la web.</p>

          <h2>2. Qué tecnologías utiliza B-Aura</h2>
          <p>La web de B-Aura utiliza una tecnología técnica para recordar tu elección sobre analítica y puede usar Google Analytics 4 únicamente si aceptas la medición. La analítica está desactivada por defecto y no se carga si rechazas las cookies o si no hay un identificador de medición activo.</p>
          <p>B-Aura no ha previsto cookies publicitarias ni de perfilado comercial en el código actual del sitio. Si en el futuro se añaden nuevas herramientas, esta política se actualizará.</p>

          <h2>3. Cookies y tecnologías identificadas</h2>
          <div class="legal-table-wrap">
            <table>
              <tbody>
                <tr><th>Nombre</th><th>Tipo</th><th>Proveedor</th><th>Finalidad</th><th>Duración</th></tr>
                <tr><td>baura_analytics_consent</td><td>Preferencia técnica en almacenamiento local</td><td>B-Aura</td><td>Recordar si aceptaste o rechazaste la medición de Google Analytics para no mostrar el aviso en cada visita.</td><td>Hasta que cambies la preferencia o borres los datos del navegador.</td></tr>
                <tr><td>_ga</td><td>Analítica</td><td>Google Analytics</td><td>Distinguir usuarios únicos y elaborar estadísticas agregadas de navegación.</td><td>2 años por defecto.</td></tr>
                <tr><td>_ga_&lt;container-id&gt;</td><td>Analítica</td><td>Google Analytics</td><td>Mantener el estado de la sesión y medir la interacción con la web.</td><td>2 años por defecto.</td></tr>
              </tbody>
            </table>
          </div>
          <p>Las cookies de Google Analytics solo se instalan después de aceptar la medición. La duración real puede verse limitada por la configuración del navegador.</p>

          <h2>4. Gestión del consentimiento</h2>
          <p>Al entrar en la web, el banner permite aceptar o rechazar la medición. Ambas opciones deben estar disponibles de forma clara y al mismo nivel. Puedes cambiar tu decisión en cualquier momento desde este botón o borrando los datos del sitio en tu navegador.</p>
          <div class="legal-actions">
            <button class="button button-secondary" type="button" onclick="window.bauraAnalytics?.reset()">Cambiar preferencia de cookies</button>
          </div>

          <h2>5. Cómo desactivar cookies desde el navegador</h2>
          <p>También puedes bloquear, eliminar o configurar cookies desde las opciones de privacidad de tu navegador. Ten en cuenta que bloquear algunas tecnologías puede afectar al funcionamiento o a la medición anónima y agregada de la web.</p>

          <h2>6. Terceros y enlaces externos</h2>
          <p>La web incluye enlaces a WhatsApp y redes sociales. Esos terceros pueden utilizar sus propias cookies o tecnologías cuando accedes a sus páginas o aplicaciones. B-Aura no controla esas cookies externas; revisa las políticas de cada plataforma antes de interactuar con ellas.</p>

          <h2>7. Actualizaciones</h2>
          <p>B-Aura podrá actualizar esta política cuando cambien las cookies, proveedores o herramientas del sitio. La fecha de última actualización aparecerá al inicio de esta página.</p>`,
};

function legalPage(pathname, title) {
  const legalContent = legalContentByPath[pathname];

  return pageShell({
    currentPath: pathname,
    title: `${title} | B-Aura`,
    description: `${title} de B-Aura.`,
    noindex: true,
    main: `    <section class="page-hero">
      <div class="container">
        <span class="eyebrow">Legal</span>
        <h1>${title}</h1>
      </div>
    </section>
    <section class="section">
      <div class="container">
        <article class="legal-card">
          ${legalContent}
        </article>
      </div>
    </section>`,
  });
}

const files = new Map([
  ["index.html", homePage()],
  ["servicios/index.html", programsPage()],
  ["sobre-mi/index.html", aboutPage()],
  ["contacto/index.html", contactPage()],
  ["contacto/gracias/index.html", thanksPage()],
  ["aviso-legal/index.html", legalPage("/aviso-legal/", "Aviso legal")],
  ["politica-privacidad/index.html", legalPage("/politica-privacidad/", "Política de privacidad")],
  ["politica-cookies/index.html", legalPage("/politica-cookies/", "Política de cookies")],
]);

for (const [file, content] of files) {
  const target = path.join(root, file);
  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.writeFile(target, content, "utf8");
}

console.log(`Generated ${files.size} redesigned B-Aura pages.`);
