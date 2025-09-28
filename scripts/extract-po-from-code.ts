#!/usr/bin/env ts-node
/**
 * scripts/extract-po-from-code.ts
 *
 * CORE-Extraktor:
 *  - durchsucht Code und schreibt *nur* in locales/pot/core.pot
 *  - schließt alle 16 Namespaces (app/<ns>/...) strikt aus
 *  - schließt zusätzlich lokalisierte Routen (app/de/**, app/fr/**) aus
 *
 * Usage:
 *   npx ts-node --compiler-options '{"module":"commonjs"}' scripts/extract-po-from-code.ts
 */

import { GettextExtractor, JsExtractors } from "gettext-extractor";
import * as fs from "fs";
import * as path from "path";

const ROOT = process.cwd();
const SRC_DIRS = ["app", "components", "templates", "constants", "mocks"];
const OUT_DIR = path.join(ROOT, "locales", "pot");
const OUT_FILE = path.join(OUT_DIR, "core.pot");

// ---- Namespaces, die NICHT in core.pot landen dürfen ----
const NAMESPACES = new Set<string>([
  "applications",
  "audio-transcription",
  "checkout",
  "common",
  "diagnosis-support",
  "documentation-reports",
  "generation-socials-post",
  "home",
  "pricing",
  "sign-in",
  "supervision-training",
  "thanks",
  "therapy-support",
  "updates-and-faq",
  "video-analysis",
]);

// ggf. erweitern
const LOCALE_SEGMENTS = new Set<string>(["de", "fr"]);

// ---------- File sammeln ----------
function isTsLike(file: string) {
  return file.endsWith(".ts") || file.endsWith(".tsx");
}

function walk(dir: string): string[] {
  const out: string[] = [];
  if (!fs.existsSync(dir)) return out;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const e of entries) {
    const full = path.join(dir, e.name);
    if (e.isDirectory()) out.push(...walk(full));
    else if (e.isFile() && isTsLike(full)) out.push(full);
  }
  return out;
}

function shouldExclude(p: string): boolean {
  const norm = p.replace(/\\/g, "/");
  // Exclude: app/<namespace>/** und app/de/**, app/fr/**
  const m = norm.match(/\/app\/([^/]+)\//);
  if (m) {
    const seg = m[1];
    if (NAMESPACES.has(seg)) return true;
    if (LOCALE_SEGMENTS.has(seg)) return true;
  }
  return false;
}

function collectCoreFiles(): string[] {
  let files: string[] = [];
  for (const base of SRC_DIRS) files.push(...walk(path.join(ROOT, base)));
  return files.map((f) => path.resolve(f)).filter((f) => !shouldExclude(f));
}

// ---------- Extract ----------
const extractor = new GettextExtractor();
const parser = extractor.createJsParser([
  JsExtractors.callExpression("_", { arguments: { text: 0 } }),
  JsExtractors.callExpression("t", { arguments: { text: 0 } }),
  JsExtractors.callExpression("p_", { arguments: { text: 0, context: 1 } }),
  JsExtractors.callExpression("n_", { arguments: { text: 0, textPlural: 1 } }),
  JsExtractors.callExpression("np_", {
    arguments: { text: 0, textPlural: 1, context: 2 },
  }),
]);

const files = collectCoreFiles();
// ⬇️ kompatibel mit allen Versionen: pro Datei parseString verwenden
for (const f of files) {
  const src = fs.readFileSync(f, "utf8");
  parser.parseString(src, path.relative(ROOT, f));
}

// ---------- Save ----------
if (!fs.existsSync(OUT_DIR)) fs.mkdirSync(OUT_DIR, { recursive: true });
extractor.savePotFile(OUT_FILE);
extractor.printStats();
console.log(`✅ CORE-POT geschrieben: ${path.relative(ROOT, OUT_FILE)}`);
