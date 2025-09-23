#!/usr/bin/env node
/**
 * json-to-pot.js
 * Erzeugt pro JSON-Namespace (locales/en/*.json) eine .pot-Datei (locales/pot/<ns>.pot)
 * - msgid  = JSON-Key (z.B. "checkout.sections.hero-title")
 * - msgstr = "" (leer, weil POT-Template)
 * - #. extracted comment = englischer Quelltext (für Übersetzer als Hinweis)
 */

const fs = require('fs');
const path = require('path');
const gettextParser = require('gettext-parser');

const ROOT = process.cwd();
const EN_DIR = path.join(ROOT, 'locales', 'en');        // Quelle: deine 15 JSONs
const OUT_DIR = path.join(ROOT, 'locales', 'pot');      // Ziel: POT-Dateien

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

// evtl. tief verschachtelte JSONs flatten (a.b.c = value)
function flattenObject(obj, prefix = '', out = {}) {
  if (obj && typeof obj === 'object' && !Array.isArray(obj)) {
    for (const k of Object.keys(obj)) {
      const next = prefix ? `${prefix}.${k}` : k;
      flattenObject(obj[k], next, out);
    }
  } else {
    out[prefix] = obj;
  }
  return out;
}

function buildPotFromJson(jsonPath) {
  const ns = path.basename(jsonPath, '.json'); // z.B. "checkout"
  const raw = JSON.parse(fs.readFileSync(jsonPath, 'utf8'));
  const flat = flattenObject(raw);

  const po = {
    charset: 'utf-8',
    headers: {
      'project-id-version': 'mentalhealthgpt',
      'language': '',
      'content-type': 'text/plain; charset=UTF-8',
      'content-transfer-encoding': '8bit',
      'plural-forms': 'nplurals=2; plural=(n != 1);'
    },
    translations: { '': {} }
  };

  // Leerer Header-Eintrag (Pflicht in gettext)
  po.translations[''][''] = {
    msgid: '',
    msgstr: ['']
  };

  let count = 0;
  for (const [key, value] of Object.entries(flat)) {
    if (typeof value !== 'string' || !value.trim()) continue;

    const id = String(value);                 // << msgid = EN-Text
    // Standard-Kontext (leer): alle Einträge unter '' ablegen
    if (!po.translations['']) po.translations[''] = {};

    // Eintrag ohne msgctxt erzeugen
    po.translations[''][id] = {
      msgid: id,
      msgstr: [''],
      // optionaler Hinweis für Reviewer:
      comments: { extracted: `key: ${key}` }
    };

    count++;
  }

  ensureDir(OUT_DIR);
  const outFile = path.join(OUT_DIR, `${ns}.pot`);
  const compiled = gettextParser.po.compile(po);
  fs.writeFileSync(outFile, compiled);
  console.log(`✅ POT geschrieben: ${path.relative(ROOT, outFile)}  (${count} Einträge)`);
  return count;
}

(function main() {
  if (!fs.existsSync(EN_DIR)) {
    console.error(`❌ Verzeichnis fehlt: ${EN_DIR}`);
    process.exit(1);
  }
  const files = fs.readdirSync(EN_DIR)
    .filter(f => f.endsWith('.json') && f !== 'en.json'); // zentrale en.json ausschließen

  if (files.length === 0) {
    console.warn(`⚠️  Keine Namespaced-JSONs gefunden in ${EN_DIR} (nur "en.json" vorhanden?)`);
    process.exit(0);
  }

  let total = 0;
  for (const f of files) {
    const p = path.join(EN_DIR, f);
    total += buildPotFromJson(p);
  }
  console.log(`\n🎉 Fertig. Insgesamt ${total} msgid-Einträge in ${files.length} POT-Dateien.`);
})();
