import fs from "node:fs/promises";
import path from "node:path";
import sharp from "sharp";

const root = process.cwd();
const uploadsDir = path.join(root, "wp-content", "uploads");
const publicAssetsDir = path.join(root, "assets", "images");
const originalsDir = path.join(publicAssetsDir, "originals");
const optimizedDir = path.join(publicAssetsDir, "optimized");
const manifestPath = path.join(publicAssetsDir, "manifest.json");
const htmlSearchRoots = [
  path.join(root, "index.html"),
  ...await listTopLevelPageDirs(root),
];

const CATEGORY_PATTERNS = [
  { category: "icons", pattern: /\b(globe|tag|lock|quality)[-_]/i },
  { category: "brand", pattern: /\b(baura|bauras|logo|cropped)[-_a-z0-9]*/i },
];

const toPosix = (value) => value.split(path.sep).join("/");
const sitePath = (absolutePath) => `/${toPosix(path.relative(root, absolutePath))}`;

async function listTopLevelPageDirs(baseDir) {
  const entries = await fs.readdir(baseDir, { withFileTypes: true });
  const ignored = new Set([".git", "assets", "node_modules", "tools", "wp-content", "wp-includes"]);

  return entries
    .filter((entry) => entry.isDirectory() && !ignored.has(entry.name))
    .map((entry) => path.join(baseDir, entry.name));
}

async function walkFiles(dir, predicate) {
  const entries = await fs.readdir(dir, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    const absolutePath = path.join(dir, entry.name);

    if (entry.isDirectory()) {
      files.push(...await walkFiles(absolutePath, predicate));
      continue;
    }

    if (!predicate || predicate(absolutePath)) {
      files.push(absolutePath);
    }
  }

  return files;
}

function categoryFor(filePath) {
  const fileName = path.basename(filePath);
  const match = CATEGORY_PATTERNS.find(({ pattern }) => pattern.test(fileName));
  return match?.category ?? "content";
}

async function uniqueAssetPath(baseDir, category, fileName, usedPaths) {
  const parsed = path.parse(fileName);
  let candidate = path.join(baseDir, category, fileName);
  let index = 2;

  while (usedPaths.has(candidate)) {
    candidate = path.join(baseDir, category, `${parsed.name}-${index}${parsed.ext}`);
    index += 1;
  }

  usedPaths.add(candidate);
  return candidate;
}

async function convertPngs() {
  const pngFiles = await walkFiles(uploadsDir, (filePath) => filePath.toLowerCase().endsWith(".png"));
  const usedOriginalPaths = new Set();
  const usedOptimizedPaths = new Set();
  const manifest = [];
  const htmlReplacements = new Map();

  for (const sourcePath of pngFiles.sort()) {
    const category = categoryFor(sourcePath);
    const fileName = path.basename(sourcePath);
    const originalCopyPath = await uniqueAssetPath(originalsDir, category, fileName, usedOriginalPaths);
    const optimizedFileName = `${path.parse(originalCopyPath).name}.webp`;
    const optimizedPath = await uniqueAssetPath(optimizedDir, category, optimizedFileName, usedOptimizedPaths);

    await fs.mkdir(path.dirname(originalCopyPath), { recursive: true });
    await fs.mkdir(path.dirname(optimizedPath), { recursive: true });
    await fs.copyFile(sourcePath, originalCopyPath);

    const metadata = await sharp(sourcePath).metadata();
    const sourceStats = await fs.stat(sourcePath);

    await sharp(sourcePath)
      .webp({
        effort: 4,
        quality: metadata.hasAlpha ? 90 : 82,
        smartSubsample: true,
      })
      .toFile(optimizedPath);

    const optimizedStats = await fs.stat(optimizedPath);
    const sourceUrl = sitePath(sourcePath);
    const optimizedUrl = sitePath(optimizedPath);

    htmlReplacements.set(sourceUrl, optimizedUrl);

    manifest.push({
      source: sourceUrl,
      organizedOriginal: sitePath(originalCopyPath),
      optimized: optimizedUrl,
      category,
      width: metadata.width,
      height: metadata.height,
      hasAlpha: Boolean(metadata.hasAlpha),
      originalBytes: sourceStats.size,
      optimizedBytes: optimizedStats.size,
      savingsPercent: Number(((1 - optimizedStats.size / sourceStats.size) * 100).toFixed(2)),
    });
  }

  await fs.mkdir(publicAssetsDir, { recursive: true });
  await fs.writeFile(`${manifestPath}.tmp`, `${JSON.stringify(manifest, null, 2)}\n`, "utf8");
  await fs.rename(`${manifestPath}.tmp`, manifestPath);

  return { manifest, htmlReplacements };
}

async function updateHtmlReferences(replacements) {
  const htmlFiles = [];

  for (const searchRoot of htmlSearchRoots) {
    const stat = await fs.stat(searchRoot).catch(() => null);
    if (!stat) {
      continue;
    }

    if (stat.isFile() && searchRoot.endsWith(".html")) {
      htmlFiles.push(searchRoot);
      continue;
    }

    if (stat.isDirectory()) {
      htmlFiles.push(...await walkFiles(searchRoot, (filePath) => filePath.endsWith(".html")));
    }
  }

  const uniqueHtmlFiles = [...new Set(htmlFiles)];
  let changedFiles = 0;
  let replacementCount = 0;

  for (const htmlFile of uniqueHtmlFiles) {
    const original = await fs.readFile(htmlFile, "utf8");
    let updated = original;

    for (const [sourceUrl, optimizedUrl] of replacements) {
      const before = updated;
      updated = updated.split(sourceUrl).join(optimizedUrl);
      if (before !== updated) {
        replacementCount += before.split(sourceUrl).length - 1;
      }
    }

    if (updated !== original) {
      await fs.writeFile(htmlFile, updated, "utf8");
      changedFiles += 1;
    }
  }

  return { changedFiles, replacementCount };
}

const { manifest, htmlReplacements } = await convertPngs();
const htmlUpdate = await updateHtmlReferences(htmlReplacements);
const originalBytes = manifest.reduce((sum, item) => sum + item.originalBytes, 0);
const optimizedBytes = manifest.reduce((sum, item) => sum + item.optimizedBytes, 0);
const savingsPercent = originalBytes > 0
  ? Number(((1 - optimizedBytes / originalBytes) * 100).toFixed(2))
  : 0;

console.log(`Converted ${manifest.length} PNG files to WebP.`);
console.log(`PNG total: ${(originalBytes / 1024).toFixed(1)} KB`);
console.log(`WebP total: ${(optimizedBytes / 1024).toFixed(1)} KB`);
console.log(`Savings: ${savingsPercent}%`);
console.log(`Updated ${htmlUpdate.changedFiles} HTML files (${htmlUpdate.replacementCount} references).`);
