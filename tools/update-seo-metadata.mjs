#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const siteUrl = normalizeSiteUrl(process.env.SITE_URL || "https://b-aura.es");
const lastmod = process.env.SEO_LASTMOD || new Date().toISOString().slice(0, 10);

const brandName = "B-Aura";
const defaultImagePath = "/wp-content/uploads/2025/06/Baura_acompanamiento_nutricion_deporte-1024x683.jpg";
const logoPath = "/assets/images/optimized/brand/baura-1024x381.webp";
const socialProfiles = [
  "https://www.facebook.com/profile.php?id=61577253172117",
  "https://www.instagram.com/nutrib_aura/",
  "https://www.tiktok.com/@mariana.ucaay.mil",
  "https://www.linkedin.com/in/mariana-uca%C3%B1ay-milla-50693687/",
];

const indexRobots = "index, follow, max-image-preview:large";
const noindexRobots = "noindex, follow";

const pages = [
  {
    file: "index.html",
    path: "/",
    title: "B-Aura | Nutrición, deporte y bienestar en Madrid",
    description:
      "Acompañamiento nutricional, movimiento y hábitos saludables para transformar tu estilo de vida con ciencia, autocuidado y calma.",
    image: "/wp-content/uploads/2025/06/Baura_acompanamiento_nutricion_deporte-1024x683.jpg",
    priority: "1.0",
    changefreq: "weekly",
  },
  {
    file: "servicios/index.html",
    path: "/servicios/",
    title: "Servicios de nutrición y bienestar | B-Aura",
    description:
      "Planes de bienestar activo, asesoría nutricional y entrenamiento personalizado para mejorar hábitos, energía y salud de forma sostenible.",
    image: "/wp-content/uploads/2025/06/Baura_acompanamiento_nutricion_deporte-1024x683.jpg",
    breadcrumb: "Servicios",
    priority: "0.9",
    changefreq: "weekly",
  },
  {
    file: "asesorias/index.html",
    path: "/asesorias/",
    title: "Asesorías nutricionales personalizadas | B-Aura",
    description:
      "Sesiones y planes de nutrición adaptados a tus objetivos, necesidades de bienestar y hábitos diarios, con acompañamiento cercano y práctico.",
    image: "/wp-content/uploads/2026/02/diet-concept-with-female-scientist-healthy-food-1024x683.jpg",
    breadcrumb: "Asesorías",
    priority: "0.85",
    changefreq: "weekly",
  },
  {
    file: "cursos/index.html",
    path: "/cursos/",
    title: "Cursos y recursos de nutrición y bienestar | B-Aura",
    description:
      "Guías, retos y formaciones de B-Aura para aprender sobre alimentación saludable, autocuidado y hábitos sostenibles a tu ritmo.",
    image: "/assets/images/optimized/brand/cropped-bauras_transparente.webp",
    breadcrumb: "Cursos",
    priority: "0.8",
    changefreq: "weekly",
  },
  {
    file: "blog/index.html",
    path: "/blog/",
    title: "Por qué las dietas no funcionan | Blog B-Aura",
    description:
      "Reflexiones y consejos sobre nutrición, salud, autocuidado y hábitos sostenibles para sentirte bien sin dietas rígidas ni culpa.",
    image: "/assets/images/optimized/brand/baura-1024x381.webp",
    breadcrumb: "Blog",
    schemaType: "Blog",
    priority: "0.75",
    changefreq: "weekly",
  },
  {
    file: "sobre-mi/index.html",
    path: "/sobre-mi/",
    title: "Sobre B-Aura | Mariana Ucañay Milla",
    description:
      "Conoce a Mariana Ucañay Milla, nutricionista especializada en salud integrativa, nutrición estratégica y entrenamiento funcional.",
    image: "/wp-content/uploads/2025/06/imagen-presentacion.jpg",
    breadcrumb: "Sobre mí",
    schemaType: "AboutPage",
    priority: "0.75",
    changefreq: "monthly",
  },
  {
    file: "testimonios/index.html",
    path: "/testimonios/",
    title: "Testimonios de nutrición y bienestar | B-Aura",
    description:
      "Experiencias de personas que han trabajado con B-Aura para mejorar su alimentación, sus hábitos y su bienestar personal.",
    image: "/assets/images/optimized/brand/baura-1024x381.webp",
    breadcrumb: "Testimonios",
    priority: "0.7",
    changefreq: "monthly",
  },
  {
    file: "contacto/index.html",
    path: "/contacto/",
    title: "Contacto | B-Aura nutrición y bienestar",
    description:
      "Contacta con B-Aura para resolver dudas, solicitar asesoría o empezar tu proceso de nutrición, bienestar y autocuidado.",
    image: "/assets/images/optimized/brand/baura-1024x381.webp",
    breadcrumb: "Contacto",
    schemaType: "ContactPage",
    priority: "0.8",
    changefreq: "monthly",
  },
  {
    file: "carrito/index.html",
    path: "/carrito/",
    title: "Carrito | B-Aura",
    description: "Revisa los productos o servicios seleccionados en B-Aura antes de finalizar tu compra.",
    robots: noindexRobots,
    breadcrumb: "Carrito",
  },
  {
    file: "finalizar-compra/index.html",
    path: "/finalizar-compra/",
    title: "Finalizar compra | B-Aura",
    description: "Completa tu compra de productos, cursos o servicios de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Finalizar compra",
  },
  {
    file: "mi-cuenta/index.html",
    path: "/mi-cuenta/",
    title: "Mi cuenta | B-Aura",
    description: "Accede a tu cuenta de cliente de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Mi cuenta",
  },
  {
    file: "contacto/gracias/index.html",
    path: "/contacto/gracias/",
    title: "Mensaje recibido | B-Aura",
    description: "Gracias por contactar con B-Aura. Te responderemos lo antes posible.",
    robots: noindexRobots,
    breadcrumb: "Mensaje recibido",
  },
  {
    file: "author/mariana03011991gmail-com/index.html",
    path: "/author/mariana03011991gmail-com/",
    title: "Archivo de autora | B-Aura",
    description: "Archivo interno de autora de B-Aura.",
    robots: noindexRobots,
    breadcrumb: "Autora",
  },
  {
    file: "tienda/index.html",
    path: "/tienda/",
    canonicalPath: "/",
    title: "Redirección a B-Aura",
    description: "Página de redirección hacia la página principal de B-Aura.",
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
  return absoluteUrl(page.canonicalPath || page.path);
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
    email: "contacto@b-aura.es",
    telephone: "+34 658 876 022",
    address: {
      "@type": "PostalAddress",
      addressLocality: "Madrid",
      addressCountry: "ES",
    },
    founder: {
      "@type": "Person",
      name: "Mariana Ucañay Milla",
      jobTitle: "Nutricionista especializada en nutrición y bienestar",
    },
    sameAs: socialProfiles,
  };
}

function websiteSchema() {
  return {
    "@type": "WebSite",
    "@id": `${siteUrl}/#website`,
    url: `${siteUrl}/`,
    name: brandName,
    description: "Nutrición, deporte y bienestar con acompañamiento personalizado.",
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
      "@id": `${siteUrl}/#organization`,
    },
    primaryImageOfPage: {
      "@type": "ImageObject",
      url: pageImage(page),
    },
  };
}

function breadcrumbSchema(page) {
  if ((page.canonicalPath || page.path) === "/") {
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

  const graph = [organizationSchema(), websiteSchema(), webpageSchema(page)];
  const breadcrumbs = breadcrumbSchema(page);

  if (breadcrumbs) {
    graph.push(breadcrumbs);
  }

  return JSON.stringify(
    {
      "@context": "https://schema.org",
      "@graph": graph,
    },
    null,
    2,
  ).replaceAll("</script", "<\\/script");
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
    '<meta property="og:image:alt" content="B-Aura nutrición, deporte y bienestar">',
    '<meta name="twitter:card" content="summary_large_image">',
    `<meta name="twitter:title" content="${escapeHtml(page.title)}">`,
    `<meta name="twitter:description" content="${escapeHtml(page.description)}">`,
    `<meta name="twitter:image" content="${escapeHtml(image)}">`,
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
    .replace(/<meta\b(?=[^>]*\bname=["'](?:description|robots|twitter:card|twitter:title|twitter:description|twitter:image)["'])[^>]*>\s*/gi, "")
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
  let next = html.replace(/<html(?![^>]*\blang=)([^>]*)>/i, "<html lang=\"es\"$1>");
  next = next.replace(/(<link rel="profile" href="https:\/\/gmpg\.org\/xfn\/11">)[ \t]+/g, "$1");
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
    <lastmod>${escapeXml(lastmod)}</lastmod>
    <changefreq>${escapeXml(page.changefreq || "monthly")}</changefreq>
    <priority>${escapeXml(page.priority || "0.5")}</priority>
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
    await fs.writeFile(file, nextHtml);
    changed += 1;
  }
}

const generatedFiles = [
  ["sitemap.xml", sitemapXml()],
  ["robots.txt", robotsTxt()],
];

for (const [name, contents] of generatedFiles) {
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
