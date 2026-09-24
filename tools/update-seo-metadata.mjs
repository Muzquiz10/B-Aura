#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || "https://b-aura.es");
// Update each page's lastmod only after a substantive content or metadata change.

const brandName = "B-Aura";
const defaultImagePath = "/assets/images/optimized/content/mariana-presentacion.webp";
const logoPath = "/assets/images/optimized/brand/bauras_transparente-300x300.webp";
const socialProfiles = [
  "https://www.facebook.com/profile.php?id=61577253172117",
  "https://www.instagram.com/nutrib_aura/",
  "https://www.tiktok.com/@mariana.ucaay.mil",
  "https://www.linkedin.com/in/mariana-uca%C3%B1ay-milla-50693687/",
];

const indexRobots = "index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1";
const noindexRobots = "noindex, follow";

const pages = [
  {
    file: "index.html",
    path: "/",
    title: "Nutrición y entrenamiento para perder peso | B-Aura",
    description:
      "Mejora tu alimentación y composición corporal con nutrición, entrenamiento y hábitos adaptados a ti. Acompañamiento 1:1 con Mariana, nutricionista de B-Aura.",
    lastmod: "2026-09-24",
    image: defaultImagePath,
  },
  {
    file: "servicios/index.html",
    path: "/servicios/",
    title: "Programas de nutrición y entrenamiento personal | B-Aura",
    description:
      "Descubre Bienestar Activo 90 y los planes de nutrición y entrenamiento de B-Aura. Estrategia individualizada, seguimiento semanal y ajustes según tu evolución.",
    lastmod: "2026-09-24",
    image: defaultImagePath,
    breadcrumb: "Programas",
  },
  {
    file: "sobre-mi/index.html",
    path: "/sobre-mi/",
    title: "Mariana Ucañay Milla, nutricionista | B-Aura",
    description:
      "Conoce a Mariana Ucañay Milla, licenciada en Nutrición y Dietética, máster en Nutrición Humana y Dietética Aplicada y creadora de B-Aura. Más de 11 años de experiencia.",
    lastmod: "2026-09-24",
    image: defaultImagePath,
    breadcrumb: "Sobre mí",
    schemaType: "AboutPage",
  },
  {
    file: "contacto/index.html",
    path: "/contacto/",
    title: "Contacta con Mariana, nutricionista de B-Aura",
    description:
      "Cuéntale a Mariana tus objetivos por WhatsApp o formulario. Consulta los programas de nutrición y entrenamiento y descubre qué opción de B-Aura encaja contigo.",
    lastmod: "2026-09-24",
    image: defaultImagePath,
    breadcrumb: "Contacto",
    schemaType: "ContactPage",
  },
  {
    file: "aviso-legal/index.html",
    path: "/aviso-legal/",
    title: "Aviso legal | B-Aura",
    description: "Aviso legal de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Aviso legal",
  },
  {
    file: "politica-privacidad/index.html",
    path: "/politica-privacidad/",
    title: "Política de privacidad | B-Aura",
    description: "Política de privacidad de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Política de privacidad",
  },
  {
    file: "politica-cookies/index.html",
    path: "/politica-cookies/",
    title: "Política de cookies | B-Aura",
    description: "Política de cookies de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Política de cookies",
  },
  {
    file: "contacto/gracias/index.html",
    path: "/contacto/gracias/",
    title: "Mensaje recibido | B-Aura",
    description: "Gracias por contactar con B-Aura. Mariana responderá lo antes posible.",
    robots: noindexRobots,
    breadcrumb: "Mensaje recibido",
  },
  {
    file: "asesorias/index.html",
    path: "/asesorias/",
    title: "Programas | B-Aura",
    description: "Página heredada no enlazada. Consulta los programas actuales de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Programas",
  },
  {
    file: "cursos/index.html",
    path: "/cursos/",
    title: "Programas | B-Aura",
    description: "Página heredada no enlazada. Consulta los programas actuales de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Programas",
  },
  {
    file: "blog/index.html",
    path: "/blog/",
    title: "B-Aura",
    description: "El blog de B-Aura está oculto temporalmente.",
    robots: noindexRobots,
    breadcrumb: "Blog",
  },
  {
    file: "testimonios/index.html",
    path: "/testimonios/",
    title: "Testimonios | B-Aura",
    description: "Sección de testimonios de B-Aura preparada para opiniones reales autorizadas.",
    robots: noindexRobots,
    breadcrumb: "Testimonios",
  },
  {
    file: "carrito/index.html",
    path: "/carrito/",
    title: "B-Aura",
    description: "Página heredada no enlazada.",
    robots: noindexRobots,
    breadcrumb: "Carrito",
  },
  {
    file: "finalizar-compra/index.html",
    path: "/finalizar-compra/",
    title: "B-Aura",
    description: "Página heredada no enlazada.",
    robots: noindexRobots,
    breadcrumb: "Finalizar compra",
  },
  {
    file: "mi-cuenta/index.html",
    path: "/mi-cuenta/",
    title: "B-Aura",
    description: "Página heredada no enlazada.",
    robots: noindexRobots,
    breadcrumb: "Mi cuenta",
  },
  {
    file: "author/mariana03011991gmail-com/index.html",
    path: "/author/mariana03011991gmail-com/",
    title: "Sobre mí | Mariana Ucañay Milla",
    description: "Página heredada no enlazada.",
    robots: noindexRobots,
    breadcrumb: "Autora",
  },
  {
    file: "tienda/index.html",
    path: "/tienda/",
    title: "B-Aura",
    description: "Página heredada no enlazada.",
    robots: noindexRobots,
    breadcrumb: "Tienda",
  },
];

function normalizeSiteUrl(value) {
  const parsed = new URL(value);
  parsed.hash = "";
  parsed.search = "";
  return parsed.toString().replace(/\/$/, "");
}

function absoluteUrl(urlPath) {
  return new URL(urlPath, `${siteUrl}/`).toString();
}

function escapeHtml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function escapeXml(value) {
  return String(value)
    .replaceAll("&", "&amp;")
    .replaceAll('"', "&quot;")
    .replaceAll("'", "&apos;")
    .replaceAll("<", "&lt;")
    .replaceAll(">", "&gt;");
}

function pageCanonical(page) {
  // Excluded legacy pages are not duplicates of the home or services pages.
  // Keep their own canonical URL and use noindex to exclude them.
  return absoluteUrl(page.path);
}

function pageImage(page) {
  return absoluteUrl(page.image || defaultImagePath);
}

function organizationSchema() {
  return {
    "@type": "Organization",
    "@id": `${siteUrl}/#organization`,
    name: brandName,
    url: `${siteUrl}/`,
    logo: {
      "@type": "ImageObject",
      url: absoluteUrl(logoPath),
    },
    image: absoluteUrl(defaultImagePath),
    founder: {
      "@id": `${siteUrl}/#mariana`,
    },
    sameAs: socialProfiles.filter((url) => !url.includes("linkedin.com/in/")),
  };
}

function personSchema() {
  return {
    "@type": "Person",
    "@id": `${siteUrl}/#mariana`,
    name: "Mariana Ucañay Milla",
    url: absoluteUrl("/sobre-mi/"),
    image: absoluteUrl(defaultImagePath),
    jobTitle: "Nutricionista y creadora de B-Aura",
    description: "Licenciada en Nutrición y Dietética y Máster en Nutrición Humana y Dietética Aplicada, con más de 11 años de experiencia en nutrición y entrenamiento.",
    sameAs: socialProfiles.filter((url) => url.includes("linkedin.com/in/")),
    worksFor: { "@id": `${siteUrl}/#organization` },
    mainEntityOfPage: { "@id": `${absoluteUrl("/sobre-mi/")}#webpage` },
  };
}

function servicesSchema() {
  const services = [
    ["bienestar-activo", "Bienestar Activo 90", "Nutrición, entrenamiento y hábitos", "Acompañamiento individualizado 1:1 durante 90 días con estrategia de alimentación, entrenamiento adaptado, videollamada semanal y seguimiento."],
    ["nutricion", "Nutrición", "Asesoramiento nutricional individualizado", "Valoración inicial, estrategia de alimentación individualizada, revisión de hábitos y seguimiento semanal con ajustes según evolución."],
    ["entrenamiento", "Entrenamiento", "Entrenamiento personal", "Plan de ejercicio adaptado al nivel, disponibilidad y recursos, con revisión de progreso y ajustes semanales."],
  ].map(([fragment, name, serviceType, description]) => ({
    "@type": "Service",
    "@id": `${absoluteUrl("/servicios/")}#servicio-${fragment}`,
    url: `${absoluteUrl("/servicios/")}#${fragment}`,
    name,
    serviceType,
    description,
    provider: { "@id": `${siteUrl}/#organization` },
  }));
  return [
    {
      "@type": "ItemList",
      "@id": `${absoluteUrl("/servicios/")}#programas`,
      name: "Programas de nutrición y entrenamiento de B-Aura",
      numberOfItems: services.length,
      itemListElement: services.map((service, index) => ({
        "@type": "ListItem",
        position: index + 1,
        item: { "@id": service["@id"] },
      })),
    },
    ...services,
  ];
}

function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: brandName,
    description: "Nutrición, entrenamiento, hábitos y seguimiento con acompañamiento profesional.",
    inLanguage: "es-ES",
    publisher: {
      "@id": `${siteUrl}/#organization`,
    },
  };
}

function webpageSchema(page) {
  const type = page.schemaType ? ["WebPage", page.schemaType] : "WebPage";

  return {
    "@type": type,
    "@id": `${pageCanonical(page)}#webpage`,
    url: pageCanonical(page),
    name: page.title,
    description: page.description,
    inLanguage: "es-ES",
    isPartOf: {
      "@id": `${siteUrl}/#website`,
    },
    about: {
      "@id": `${siteUrl}/#${page.path === "/sobre-mi/" ? "mariana" : "organization"}`,
    },
    ...(page.path === "/sobre-mi/" ? { mainEntity: { "@id": `${siteUrl}/#mariana` } } : {}),
    ...(page.path === "/servicios/" ? { mainEntity: { "@id": `${absoluteUrl("/servicios/")}#programas` } } : {}),
    ...(page.path !== "/" ? { breadcrumb: { "@id": `${pageCanonical(page)}#breadcrumb` } } : {}),
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: pageImage(page),
    },
  };
}

function breadcrumbSchema(page) {
  if (page.path === "/") {
    return null;
  }

  return {
    "@type": "BreadcrumbList",
    "@id": `${pageCanonical(page)}#breadcrumb`,
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Inicio",
        item: `${siteUrl}/`,
      },
      {
        "@type": "ListItem",
        position: 2,
        name: page.breadcrumb || page.title.replace(/\s+\|\s+B-Aura$/, ""),
        item: pageCanonical(page),
      },
    ],
  };
}

function structuredData(page) {
  if ((page.robots || indexRobots).startsWith("noindex")) {
    return "";
  }

  const graph = [organizationSchema(), personSchema(), websiteSchema(), webpageSchema(page)];
  if (page.path === "/servicios/") graph.push(...servicesSchema());
  const breadcrumbs = breadcrumbSchema(page);

  if (breadcrumbs) {
    graph.push(breadcrumbs);
  }

  return JSON.stringify({ "@context": "https://schema.org", "@graph": graph }, null, 2).replaceAll(
    "</script",
    "<\\/script",
  );
}

function seoBlock(page) {
  const robots = page.robots || indexRobots;
  const canonical = pageCanonical(page);
  const image = pageImage(page);
  const jsonLd = structuredData(page);
  const tags = [
    "<!-- B-Aura SEO metadata -->",
    `<title>${escapeHtml(page.title)}</title>`,
    `<meta name="description" content="${escapeHtml(page.description)}">`,
    `<meta name="robots" content="${escapeHtml(robots)}">`,
    `<link rel="canonical" href="${escapeHtml(canonical)}">`,
    '<meta property="og:locale" content="es_ES">',
    '<meta property="og:type" content="website">',
    `<meta property="og:site_name" content="${escapeHtml(brandName)}">`,
    `<meta property="og:title" content="${escapeHtml(page.title)}">`,
    `<meta property="og:description" content="${escapeHtml(page.description)}">`,
    `<meta property="og:url" content="${escapeHtml(canonical)}">`,
    `<meta property="og:image" content="${escapeHtml(image)}">`,
    '<meta property="og:image:alt" content="Mariana, nutricionista y creadora de B-Aura">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
    '<meta name="twitter:image:alt" content="Mariana, nutricionista y creadora de B-Aura">',
  ];

  if (jsonLd) {
    tags.push(`<script id="baura-seo-jsonld" type="application/ld+json">\n${jsonLd}\n</script>`);
  }

  tags.push("<!-- /B-Aura SEO metadata -->");

  return tags.join("\n");
}

function removeManagedSeo(head) {
  return head
    .replace(/<!-- B-Aura SEO metadata -->[\s\S]*?<!-- \/B-Aura SEO metadata -->\s*/gi, "")
    .replace(/<script\b(?=[^>]*\bid=["']baura-seo-jsonld["'])[^>]*>[\s\S]*?<\/script>\s*/gi, "")
    .replace(/<title\b[^>]*>[\s\S]*?<\/title>\s*/gi, "")
    .replace(/<meta\b(?=[^>]*\bname=["'](?:description|robots|twitter:card|twitter:title|twitter:description|twitter:image|twitter:image:alt)["'])[^>]*>\s*/gi, "")
    .replace(/<meta\b(?=[^>]*\bproperty=["'](?:og:locale|og:type|og:site_name|og:title|og:description|og:url|og:image|og:image:alt)["'])[^>]*>\s*/gi, "")
    .replace(/<link\b(?=[^>]*\brel=["']canonical["'])[^>]*>\s*/gi, "");
}

function insertSeoBlock(head, block) {
  const viewportPattern = /<meta\b(?=[^>]*\bname=["']viewport["'])[^>]*>/i;
  const charsetPattern = /<meta\b(?=[^>]*\bcharset=)[^>]*>/i;

  if (viewportPattern.test(head)) {
    return head.replace(viewportPattern, (tag) => `${tag}\n${block}`);
  }

  if (charsetPattern.test(head)) {
    return head.replace(charsetPattern, (tag) => `${tag}\n${block}`);
  }

  return head.replace(/<head\b[^>]*>/i, (tag) => `${tag}\n${block}`);
}

function updateHtml(html, page) {
  let next = html.replace(/<html(?![^>]*\blang=)([^>]*)>/i, '<html lang="es"$1>');
  const headMatch = next.match(/<head\b[^>]*>[\s\S]*?<\/head>/i);

  if (!headMatch) {
    throw new Error("Missing <head> tag");
  }

  const originalHead = headMatch[0];
  const cleanedHead = removeManagedSeo(originalHead);
  const nextHead = insertSeoBlock(cleanedHead, seoBlock(page));

  return `${next.slice(0, headMatch.index)}${nextHead}${next.slice(headMatch.index + originalHead.length)}`;
}

function sitemapXml() {
  const urls = pages.filter((page) => (page.robots || indexRobots) === indexRobots);
  const entries = urls
    .map(
      (page) => `  <url>
    <loc>${escapeXml(pageCanonical(page))}</loc>
    <lastmod>${escapeXml(page.lastmod)}</lastmod>
  </url>`,
    )
    .join("\n");

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${entries}
</urlset>
`;
}

function robotsTxt() {
  return `User-agent: *
Allow: /

Sitemap: ${siteUrl}/sitemap.xml
`;
}

let changed = 0;

for (const page of pages) {
  const file = path.join(root, page.file);
  const html = await fs.readFile(file, "utf8");
  const nextHtml = updateHtml(html, page);

  if (nextHtml !== html) {
    await fs.writeFile(file, nextHtml, "utf8");
    changed += 1;
  }
}

for (const [name, contents] of [
  ["sitemap.xml", sitemapXml()],
  ["robots.txt", robotsTxt()],
]) {
  const file = path.join(root, name);
  let current = "";

  try {
    current = await fs.readFile(file, "utf8");
  } catch (error) {
    if (error.code !== "ENOENT") {
      throw error;
    }
  }

  if (current !== contents) {
    await fs.writeFile(file, contents);
    changed += 1;
  }
}

console.log(`SEO metadata checked for ${pages.length} HTML files; updated ${changed}.`);
console.log(`Canonical site URL: ${siteUrl}`);
