#!/usr/bin/env node
/**
 * i18n extractor v2.1.0
 * Usage:
 *   node scripts/extract-locales-core.js <globs...> --ns <name> --out <file>
 *   node scripts/extract-locales-core.js <globs...> --out <file> --exclude-ns ns1,ns2
 *   node scripts/extract-locales-core.js <globs...> --out <file> --only-prefix common
 *   node scripts/extract-locales-core.js <globs...> --out <file> --exclude-prefix p1,p2
 */
import fs from "fs";
import path from "path";

const args = process.argv.slice(2);
if (args.length === 0) {
  console.error("❌ Keine Input-Dateien angegeben");
  process.exit(1);
}

let outFile = null;
let ns = null;
let excludeNs = [];
let onlyPrefix = null;
let excludePrefix = [];
const files = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--out") outFile = args[++i];
  else if (a === "--ns") ns = args[++i];
  else if (a === "--exclude-ns") excludeNs = args[++i].split(",").map(s => s.trim()).filter(Boolean);
  else if (a === "--only-prefix") onlyPrefix = args[++i];
  else if (a === "--exclude-prefix") excludePrefix = args[++i].split(",").map(s => s.trim()).filter(Boolean);
  else files.push(a);
}

if (!outFile) {
  console.error("❌ --out fehlt");
  process.exit(1);
}

// --- Dateien sammeln (Globs expandiert der Bash-Wrapper) ---
const existing = files.filter(f => fs.existsSync(f));

// --- Keys extrahieren: t("...") | t('...') | t(`...`) ---
const keyRegex = /t\(\s*["'`]([^"'`]+)["'`]\s*[\),]/g;
const keys = new Set();

for (const f of existing) {
  const code = fs.readFileSync(f, "utf8");
  let m;
  while ((m = keyRegex.exec(code)) !== null) {
    keys.add(m[1]);
  }
}

let final = Array.from(keys);

// Optional: Namespace-Härtung – wenn --ns übergeben wurde, nimm nur Keys mit "ns."
if (ns) {
  final = final.filter(k => k.startsWith(ns + "."));
}

// Exclude Namespaces (für Sammelbecken)
if (!ns && excludeNs.length > 0) {
  final = final.filter(k => !excludeNs.includes(k.split(":")[0]) && !excludeNs.includes(k.split(".")[0]));
}

// Only-Prefix (z. B. common.*)
if (onlyPrefix) {
  final = final.filter(k => k.startsWith(onlyPrefix + "."));
}

// Exclude-Prefix (z. B. common aus Sammelbecken raus)
if (excludePrefix.length > 0) {
  final = final.filter(k => !excludePrefix.some(p => k.startsWith(p + ".")));
}

final = Array.from(new Set(final)).sort();

// --- JSON schreiben ---
const outDir = path.dirname(outFile);
fs.mkdirSync(outDir, { recursive: true });

const outObj = {};
for (const k of final) outObj[k] = "";

fs.writeFileSync(outFile, JSON.stringify(outObj, null, 2), "utf8");
console.log(`   ✅ ${final.length} Keys → ${outFile}`);
