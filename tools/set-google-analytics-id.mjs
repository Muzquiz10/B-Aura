#!/usr/bin/env node

import { promises as fs } from "node:fs";
import path from "node:path";

const root = process.cwd();
const excludedDirectories = new Set([".git", "node_modules", "trush"]);
const scriptSrc = "/assets/js/google-analytics.js";
const marker = `src="${scriptSrc}"`;
const tagPattern = /<script\b(?=[^>]*\bsrc=["']\/assets\/js\/google-analytics\.js["'])[^>]*><\/script>\s*/i;

const args = process.argv.slice(2);
const clearId = args.includes("--clear");
const cliId = args.find((arg) => !arg.startsWith("--"));
const envId = process.env.GA_MEASUREMENT_ID || process.env.PUBLIC_GA_MEASUREMENT_ID || "";
const requestedId = clearId ? "" : (cliId || envId).trim().toUpperCase();
const hasRequestedId = clearId || Boolean(requestedId);

if (requestedId && !/^G-[A-Z0-9]+$/.test(requestedId)) {
  throw new Error(`Invalid Google Analytics Measurement ID: ${requestedId}`);
}

function analyticsTag(measurementId) {
  const idAttribute = measurementId ? ` data-ga-measurement-id="${measurementId}"` : ` data-ga-measurement-id=""`;
  return `<script defer src="${scriptSrc}"${idAttribute}></script>`;
}

async function listHtmlFiles(directory) {
  const entries = await fs.readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.isDirectory()) {
      if (excludedDirectories.has(entry.name)) {
        continue;
      }

      files.push(...(await listHtmlFiles(path.join(directory, entry.name))));
      continue;
    }

    if (entry.isFile() && entry.name.endsWith(".html")) {
      files.push(path.join(directory, entry.name));
    }
  }

  return files;
}

function getExistingMeasurementId(html) {
  const match = html.match(tagPattern);

  if (!match) {
    return "";
  }

  return match[0].match(/\bdata-ga-measurement-id=["']([^"']*)["']/i)?.[1] || "";
}

function updateHtml(html) {
  const currentId = getExistingMeasurementId(html);
  const measurementId = hasRequestedId ? requestedId : currentId;
  const nextTag = analyticsTag(measurementId);

  if (html.includes(marker)) {
    return html.replace(tagPattern, `${nextTag}\n`);
  }

  if (!/<head\b[^>]*>/i.test(html)) {
    throw new Error("Missing <head> tag");
  }

  return html.replace(/<head\b[^>]*>/i, (headTag) => `${headTag}\n${nextTag}\n`);
}

const htmlFiles = await listHtmlFiles(root);
let changed = 0;

for (const file of htmlFiles) {
  const html = await fs.readFile(file, "utf8");
  const nextHtml = updateHtml(html);

  if (nextHtml !== html) {
    await fs.writeFile(file, nextHtml);
    changed += 1;
  }
}

console.log(`Google Analytics tag checked in ${htmlFiles.length} HTML files; updated ${changed}.`);

if (!requestedId) {
  console.log("No Measurement ID was provided. Existing IDs were preserved; any newly inserted tags remain inactive until an ID is set.");
}
