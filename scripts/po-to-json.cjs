#!/usr/bin/env node
/**
 * scripts/po-to-json.cjs
 *
 * Build JSON translations from POT/PO:
 *
 * CORE (Text→Text):
 *   - en.json from POT/core.pot (msgid → msgid)
 *   - de.json / fr.json from de_CH/core.po / fr_CH/core.po (msgid → msgstr || msgid)
 *
 * NAMESPACES (Key→Text; keys are in comments "#. key: ..."):
 *   - locales/en/<ns>.json from POT/<ns>.pot  (key → msgid)
 *   - locales/de/<ns>.json from de_CH/<ns>.po (key → msgstr || msgid)
 *   - locales/fr/<ns>.json from fr_CH/<ns>.po (key → msgstr || msgid)
 *
 * Usage:
 *   node scripts/po-to-json.cjs en
 *   node scripts/po-to-json.cjs de_CH
 *   node scripts/po-to-json.cjs fr_CH
 */

const fs = require('fs');
const path = require('path');
const gettextParser = require('gettext-parser');

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, 'locales');
const POT_DIR = path.join(LOCALES_DIR, 'pot');

const srcArg = process.argv[2]; // 'en' | 'de_CH' | 'fr_CH'
if (!srcArg) {
  console.error('❌ Bitte Quellsprache angeben: en | de_CH | fr_CH');
  process.exit(1);
}

const isEN = srcArg === 'en';
const targetLang =
  isEN ? 'en' :
  (srcArg.startsWith('de') ? 'de' :
   srcArg.startsWith('fr') ? 'fr' :
   (srcArg.split('_')[0] || srcArg));

/** Utility */
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function parsePoLike(buffer) {
  // works for both .po and .pot
  return gettextParser.po.parse(buffer);
}

/** Read keys from "#. key: <jsonKey>" developer comments */
function getKeysFromComments(item) {
  const c = item && item.comments ? item.comments.extracted : '';
  if (!c) return [];
  const s = Array.isArray(c) ? c.join('\n') : String(c);
  return s
    .split(/\r?\n/)
    .map(l => l.trim())
    .filter(Boolean)
    .map(l => {
      const m = l.match(/^key:\s*(.+)$/i);
      return m ? m[1].trim() : l; // tolerate lines without "key:" prefix
    })
    .filter(Boolean)
    .filter((v, i, arr) => arr.indexOf(v) === i); // unique
}

/** Build CORE */
function buildCore() {
  const outFile = path.join(LOCALES_DIR, `${targetLang}.json`);
  const dict = Object.create(null);

  if (isEN) {
    // EN from POT/core.pot (msgid → msgid)
    const potPath = path.join(POT_DIR, 'core.pot');
    if (!fs.existsSync(potPath)) {
      console.error(`❌ POT fehlt: ${potPath}`);
      process.exit(1);
    }
    const po = parsePoLike(fs.readFileSync(potPath));
    for (const ctx of Object.keys(po.translations || {})) {
      const entries = po.translations[ctx] || {};
      for (const id of Object.keys(entries)) {
        if (!id) continue; // header
        const item = entries[id];
        const en = item.msgid || '';
        if (!en.trim()) continue;
        dict[en] = en;
      }
    }
  } else {
    // de_CH / fr_CH from core.po (msgid → msgstr || msgid)
    const srcCore = path.join(LOCALES_DIR, srcArg, 'core.po');
    if (!fs.existsSync(srcCore)) {
      console.error(`❌ CORE-PO fehlt: ${srcCore}`);
      process.exit(1);
    }
    const po = parsePoLike(fs.readFileSync(srcCore));
    for (const ctx of Object.keys(po.translations || {})) {
      const entries = po.translations[ctx] || {};
      for (const id of Object.keys(entries)) {
        if (!id) continue;
        const item = entries[id];
        const en = item.msgid || '';
        if (!en.trim()) continue;
        const tr = (item.msgstr && item.msgstr[0]) ? item.msgstr[0].trim() : '';
        dict[en] = tr || en;
      }
    }
  }

  fs.writeFileSync(outFile, JSON.stringify(dict, null, 2), 'utf8');
  console.log(`✅ CORE geschrieben: ${path.relative(ROOT, outFile)} (${Object.keys(dict).length} Einträge)`);
}

/** Build Namespaces */
function buildNamespaces() {
  if (!fs.existsSync(POT_DIR)) {
    console.warn(`⚠️  Verzeichnis fehlt: ${POT_DIR} – überspringe Namespaces.`);
    return;
  }
  // detect list of namespaces from POT folder (authoritative)
  const allPot = fs.readdirSync(POT_DIR)
    .filter(f => f.endsWith('.pot') && f !== 'core.pot');

  for (const potName of allPot) {
    const ns = path.basename(potName, '.pot');
    const outDir = path.join(LOCALES_DIR, targetLang);
    ensureDir(outDir);
    const outFile = path.join(outDir, `${ns}.json`);
    const dict = Object.create(null);

    if (isEN) {
      // EN from POT: key(s) in comments → English text in msgid
      const potPath = path.join(POT_DIR, potName);
      const po = parsePoLike(fs.readFileSync(potPath));
      for (const ctx of Object.keys(po.translations || {})) {
        const entries = po.translations[ctx] || {};
        for (const id of Object.keys(entries)) {
          if (!id) continue; // header
          const item = entries[id];
          const enText = item.msgid || '';
          if (!enText.trim()) continue;
          const keys = getKeysFromComments(item);
          for (const k of keys) dict[k] = enText;
        }
      }
    } else {
      // DE/FR from PO: key(s) in comments → msgstr || msgid
      const poPath = path.join(LOCALES_DIR, srcArg, `${ns}.po`);
      if (!fs.existsSync(poPath)) {
        console.warn(`⚠️  Überspringe fehlendes Namespace-PO: ${poPath}`);
        continue;
      }
      const po = parsePoLike(fs.readFileSync(poPath));
      for (const ctx of Object.keys(po.translations || {})) {
        const entries = po.translations[ctx] || {};
        for (const id of Object.keys(entries)) {
          if (!id) continue; // header
          const item = entries[id];
          const tr = (item.msgstr && item.msgstr[0]) ? item.msgstr[0].trim() : '';
          const enText = item.msgid || '';
          if (!enText.trim()) continue;
          const keys = getKeysFromComments(item);
          for (const k of keys) dict[k] = tr || enText;
        }
      }
    }

    fs.writeFileSync(outFile, JSON.stringify(dict, null, 2), 'utf8');
    console.log(`✅ NS geschrieben: ${path.relative(ROOT, outFile)} (${Object.keys(dict).length} Einträge)`);
  }
}

/** Run */
buildCore();
buildNamespaces();
