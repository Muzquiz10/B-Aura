import http from "node:http";
import fs from "node:fs/promises";
import path from "node:path";

const root = process.cwd();
const portArgIndex = process.argv.indexOf("--port");
const port = Number(process.env.PORT || (portArgIndex >= 0 ? process.argv[portArgIndex + 1] : 4173));

const mimeTypes = {
  ".css": "text/css; charset=utf-8",
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".jpg": "image/jpeg",
  ".jpeg": "image/jpeg",
  ".png": "image/png",
  ".svg": "image/svg+xml",
  ".webp": "image/webp",
  ".woff": "font/woff",
  ".woff2": "font/woff2",
};

function resolveRequestPath(url) {
  const pathname = decodeURIComponent(new URL(url, `http://localhost:${port}`).pathname);
  const requestedPath = path.normalize(path.join(root, pathname));

  if (!requestedPath.startsWith(root)) {
    return null;
  }

  return requestedPath;
}

async function resolveFilePath(requestedPath) {
  const stat = await fs.stat(requestedPath).catch(() => null);

  if (stat?.isDirectory()) {
    return path.join(requestedPath, "index.html");
  }

  if (stat?.isFile()) {
    return requestedPath;
  }

  const htmlFallback = `${requestedPath}.html`;
  const fallbackStat = await fs.stat(htmlFallback).catch(() => null);

  return fallbackStat?.isFile() ? htmlFallback : null;
}

const server = http.createServer(async (request, response) => {
  const requestedPath = resolveRequestPath(request.url);

  if (!requestedPath) {
    response.writeHead(403);
    response.end("Forbidden");
    return;
  }

  const filePath = await resolveFilePath(requestedPath);

  if (!filePath) {
    response.writeHead(404);
    response.end("Not found");
    return;
  }

  const extension = path.extname(filePath).toLowerCase();
  const contentType = mimeTypes[extension] || "application/octet-stream";
  const body = await fs.readFile(filePath);

  response.writeHead(200, {
    "Content-Type": contentType,
    "Cache-Control": "no-cache",
  });
  response.end(body);
});

server.listen(port, () => {
  console.log(`B-Aura static site: http://localhost:${port}`);
});
