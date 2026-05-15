import fs from "node:fs/promises";
import fsSync from "node:fs";
import path from "node:path";

const root = process.cwd();
const dryRun = process.argv.includes("--dry-run");
const trushRoot = path.join(root, "trush", "static-unused");
const ignoredTopLevel = new Set([
  ".git",
  "assets",
  "node_modules",
  "tools",
  "trush",
  "wp-content",
  "wp-includes",
]);

const pruneRoots = [
  "wp-content/assets",
  "wp-content/plugins",
  "wp-content/themes",
  "wp-content/uploads",
  "wp-includes",
].map((relativePath) => path.join(root, relativePath));

const toPosix = (value) => value.split(path.sep).join("/");
const sitePath = (absolutePath) => `/${toPosix(path.relative(root, absolutePath))}`;

async function listPublicHtmlFiles() {
  const files = [path.join(root, "index.html")];
  const entries = await fs.readdir(root, { withFileTypes: true });

  for (const entry of entries) {
    if (!entry.isDirectory() || ignoredTopLevel.has(entry.name)) {
      continue;
    }

    files.push(...(await walkFiles(path.join(root, entry.name)))
      .filter((file) => file.endsWith(".html")));
  }

  return [...new Set(files)];
}

async function walkFiles(dir) {
  if (!fsSync.existsSync(dir)) {
    return [];
  }

  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walkFiles(absolutePath));
      continue;
    }

    files.push(absolutePath);
  }

  return files;
}

function cleanUrl(value) {
  if (!value) {
    return null;
  }

  let url = value.trim().replace(/^url\((.*)\)$/i, "$1").trim().replace(/^['"]|['"]$/g, "");

  if (
    !url ||
    url === "/" ||
    url.startsWith("#") ||
    url.startsWith("data:") ||
    url.startsWith("blob:") ||
    url.startsWith("mailto:") ||
    url.startsWith("tel:") ||
    /^https?:\/\//i.test(url) ||
    url.startsWith("//") ||
    url.includes("*")
  ) {
    return null;
  }

  return url.split("#")[0].split("?")[0];
}

function resolveUrl(url, fromFile) {
  const cleaned = cleanUrl(url);

  if (!cleaned) {
    return null;
  }

  const absolutePath = cleaned.startsWith("/")
    ? path.normalize(path.join(root, cleaned))
    : path.normalize(path.join(path.dirname(fromFile), cleaned));

  return absolutePath.startsWith(root) ? absolutePath : null;
}

function addReference(url, fromFile, references, queue) {
  const absolutePath = resolveUrl(url, fromFile);

  if (!absolutePath || !fsSync.existsSync(absolutePath) || !fsSync.statSync(absolutePath).isFile()) {
    return;
  }

  references.add(absolutePath);

  if (absolutePath.endsWith(".css")) {
    queue.push(absolutePath);
  }
}

function scanHtml(file, text, references, queue) {
  for (const match of text.matchAll(/(?:^|[\s<])(?:src|href)=("|')(.*?)\1/gis)) {
    addReference(match[2], file, references, queue);
  }

  for (const match of text.matchAll(/\bsrcset=("|')(.*?)\1/gis)) {
    for (const candidate of match[2].split(",")) {
      addReference(candidate.trim().split(/\s+/)[0], file, references, queue);
    }
  }

  for (const match of text.matchAll(/url\(([^)]+)\)/gis)) {
    addReference(match[1], file, references, queue);
  }

  for (const match of text.matchAll(/"(\/(?:wp-content|wp-includes|assets)\/[^"\\]+?)"/g)) {
    addReference(match[1], file, references, queue);
  }
}

function scanCss(file, text, references, queue) {
  for (const match of text.matchAll(/url\(([^)]+)\)/gis)) {
    addReference(match[1], file, references, queue);
  }

  for (const match of text.matchAll(/@import\s+(?:url\()?(['"]?)([^"')\s]+)\1\)?/gis)) {
    addReference(match[2], file, references, queue);
  }
}

async function collectStaticReferences() {
  const queue = await listPublicHtmlFiles();
  const seen = new Set();
  const references = new Set();

  while (queue.length) {
    const file = queue.shift();

    if (seen.has(file)) {
      continue;
    }

    seen.add(file);

    const text = await fs.readFile(file, "utf8");
    if (file.endsWith(".css")) {
      scanCss(file, text, references, queue);
    } else {
      scanHtml(file, text, references, queue);
    }
  }

  return references;
}

async function addManualRuntimeFiles(keepFiles) {
  const elementorJsDir = path.join(root, "wp-content", "plugins", "elementor", "assets", "js");
  const runtimePath = path.join(elementorJsDir, "webpack.runtime.min.js");

  if (fsSync.existsSync(runtimePath)) {
    const runtime = await fs.readFile(runtimePath, "utf8");

    for (const match of runtime.matchAll(/"([^"]+\.bundle\.min\.js)"/g)) {
      keepFiles.add(path.join(elementorJsDir, match[1]));
    }
  }

  [
    "wp-content/plugins/elementor/assets/css/conditionals/apple-webkit.min.css",
    "wp-content/plugins/elementor/assets/css/conditionals/dialog.min.css",
    "wp-content/plugins/elementor/assets/css/conditionals/e-swiper.min.css",
    "wp-content/plugins/elementor/assets/css/conditionals/lightbox.min.css",
    "wp-content/plugins/elementor/assets/lib/dialog/dialog.min.js",
    "wp-content/plugins/elementor/assets/lib/share-link/share-link.min.js",
    "wp-content/plugins/elementor/assets/lib/swiper/v8/css/swiper.min.css",
    "wp-content/plugins/elementor/assets/lib/swiper/v8/swiper.min.js",
  ].forEach((relativePath) => keepFiles.add(path.join(root, relativePath)));
}

function isKeptFile(file, keepFiles) {
  return keepFiles.has(file);
}

async function moveToTrush(file) {
  const target = path.join(trushRoot, path.relative(root, file));

  if (!target.startsWith(trushRoot)) {
    throw new Error(`Unsafe trush target: ${target}`);
  }

  if (dryRun) {
    return target;
  }

  await fs.mkdir(path.dirname(target), { recursive: true });
  await fs.rename(file, target);
  return target;
}

async function removeEmptyDirs(dir) {
  if (!fsSync.existsSync(dir)) {
    return 0;
  }

  let removed = 0;
  const entries = await fs.readdir(dir, { withFileTypes: true });

  for (const entry of entries) {
    if (entry.isDirectory()) {
      removed += await removeEmptyDirs(path.join(dir, entry.name));
    }
  }

  if (pruneRoots.includes(dir)) {
    return removed;
  }

  const remaining = await fs.readdir(dir);

  if (remaining.length === 0 && !dryRun) {
    await fs.rmdir(dir);
    removed += 1;
  }

  return removed;
}

const keepFiles = await collectStaticReferences();
await addManualRuntimeFiles(keepFiles);

const allCandidates = [];
for (const pruneRoot of pruneRoots) {
  allCandidates.push(...await walkFiles(pruneRoot));
}

const moved = [];
const kept = [];
let movedBytes = 0;

for (const file of allCandidates.sort()) {
  const stats = await fs.stat(file);

  if (isKeptFile(file, keepFiles)) {
    kept.push(file);
    continue;
  }

  const target = await moveToTrush(file);
  moved.push({ from: sitePath(file), to: sitePath(target), bytes: stats.size });
  movedBytes += stats.size;
}

let removedEmptyDirs = 0;
for (const pruneRoot of pruneRoots) {
  removedEmptyDirs += await removeEmptyDirs(pruneRoot);
}

const manifest = {
  dryRun,
  generatedAt: new Date().toISOString(),
  movedFiles: moved.length,
  movedMB: Number((movedBytes / 1024 / 1024).toFixed(2)),
  keptFiles: kept.length,
  removedEmptyDirs,
  moved,
  kept: kept.map(sitePath).sort(),
};

if (!dryRun) {
  await fs.mkdir(trushRoot, { recursive: true });
  await fs.writeFile(path.join(root, "trush", "README.txt"), [
    "Archivos movidos por tools/prune-wordpress-static.mjs.",
    "",
    "La web estatica mantiene fuera de esta carpeta los assets que siguen referenciando las paginas publicas.",
    "Si todo funciona en Netlify/local, puedes borrar esta carpeta completa.",
    "",
  ].join("\n"), "utf8");
  await fs.writeFile(path.join(root, "trush", "manifest.json"), `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
}

console.log(JSON.stringify({
  dryRun,
  movedFiles: manifest.movedFiles,
  movedMB: manifest.movedMB,
  keptFiles: manifest.keptFiles,
  removedEmptyDirs,
  trush: sitePath(trushRoot),
}, null, 2));
