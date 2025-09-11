#!/usr/bin/env node
/**
 * extract-locales.js
 * Extrahiert EN-Texte aus TSX/TS-Dateien und schreibt sie in:
 *   - public/locales/en.json           (Keys ohne Präfix)
 *   - public/locales/en/<module>.json  (Keys mit Präfix)
 *
 * Unterstützt:
 *   t('module.key', 'English text')
 *   <Trans i18nKey="module.key">English text</Trans>
 */

const fs = require('fs');
const path = require('path');

if (process.argv.length < 3) {
  console.error('Usage: node scripts/extract-locales.js <file.tsx>');
  process.exit(1);
}

const filePath = path.resolve(process.argv[2]);
if (!fs.existsSync(filePath)) {
  console.error(`File not found: ${filePath}`);
  process.exit(1);
}

const repoRoot = process.cwd();
const outDir = path.join(repoRoot, 'public', 'locales', 'en');
const outCommon = path.join(repoRoot, 'public', 'locales', 'en.json');
fs.mkdirSync(outDir, { recursive: true });

const src = fs.readFileSync(filePath, 'utf8');

// Regex: t("key", "English text")
const reT = /t\s*\(\s*['"]([^'"]+)['"]\s*,\s*['"]([^'"]+)['"]\s*\)/g;
// Regex: <Trans i18nKey="key">English text</Trans>
const reTrans = /<Trans[^>]*\bi18nKey\s*=\s*["']([^"']+)["'][^>]*>([\s\S]*?)<\/Trans>/g;

function nsAndKey(fullKey) {
  const idx = fullKey.indexOf('.');
  if (idx === -1) return { ns: null, key: fullKey }; // kein Präfix → common
  return { ns: fullKey.slice(0, idx), key: fullKey.slice(idx + 1) };
}

function loadJSON(p) {
  try {
    return JSON.parse(fs.readFileSync(p, 'utf8'));
  } catch {
    return {};
  }
}
function saveJSON(p, obj) {
  fs.writeFileSync(p, JSON.stringify(obj, null, 2) + '\n', 'utf8');
}

const updatesRoot = {};
const updatesByNs = new Map();

// Matches durchgehen
for (const m of src.matchAll(reT)) {
  const { ns, key } = nsAndKey(m[1].trim());
  const text = m[2].trim();
  if (!text) continue;
  if (!ns) updatesRoot[key] = { string: text };
  else {
    if (!updatesByNs.has(ns)) updatesByNs.set(ns, {});
    updatesByNs.get(ns)[key] = { string: text };
  }
}
for (const m of src.matchAll(reTrans)) {
  const { ns, key } = nsAndKey(m[1].trim());
  const text = m[2].replace(/<[^>]+>/g, '').trim();
  if (!text) continue;
  if (!ns) updatesRoot[key] = { string: text };
  else {
    if (!updatesByNs.has(ns)) updatesByNs.set(ns, {});
    updatesByNs.get(ns)[key] = { string: text };
  }
}

// Speichern
if (Object.keys(updatesRoot).length) {
  const curr = loadJSON(outCommon);
  const next = { ...curr, ...updatesRoot };
  saveJSON(outCommon, next);
  console.log(`✔ Updated en.json (+${Object.keys(updatesRoot).length})`);
}
for (const [ns, kv] of updatesByNs.entries()) {
  const out = path.join(outDir, `${ns}.json`);
  const curr = loadJSON(out);
  const next = { ...curr, ...kv };
  saveJSON(out, next);
  console.log(`✔ Updated en/${ns}.json (+${Object.keys(kv).length})`);
}
