// scripts/po-to-json.js
// "Best-of-breed minimal": PO -> flaches JSON-Dict { msgid: msgstr || msgid }
// - Unterstützt beliebige Kontexte (msgctxt), ohne Komplexität zu erhöhen.
// - Fällt immer auf Text-as-Key zurück, wenn msgstr leer ist.
// - Mehrsprachig nutzbar: `node scripts/po-to-json.js de`
// - Output: locales/<lang>.json

const fs = require('fs');
const path = require('path');
const gettextParser = require('gettext-parser');

// Sprache aus CLI-Arg, Default 'en'
const lang = process.argv[2] || 'en';

const PO_DIR = path.join(process.cwd(), 'locales');
const poFile = path.join(PO_DIR, `${lang}.po`);
const outputFile = path.join(PO_DIR, `${lang}.json`);

if (!fs.existsSync(PO_DIR)) {
  fs.mkdirSync(PO_DIR, { recursive: true });
}

if (!fs.existsSync(poFile)) {
  console.warn(`⚠️  Keine PO-Datei gefunden: ${poFile}`);
  console.warn(`   -> Schreibe leeres JSON-Dict nach ${outputFile}`);
  fs.writeFileSync(outputFile, '{}\n', 'utf8');
  process.exit(0);
}

const poBuffer = fs.readFileSync(poFile);
const parsed = gettextParser.po.parse(poBuffer);

// Flaches Dict aufbauen
const dict = {};

// Über alle Kontexte iterieren ('' = default, weitere ctxs möglich)
for (const [ctxName, ctxEntries] of Object.entries(parsed.translations || {})) {
  for (const [msgid, entry] of Object.entries(ctxEntries || {})) {
    // Header-Eintrag überspringen (msgid === '')
    if (!msgid) continue;

    const singular = entry?.msgstr?.[0] || '';
    const fallback = msgid; // Text-as-Key Fallback

    // Wenn ein Kontext existiert, den Key stabil zusammensetzen.
    // Wir benutzen \u0004 (Gettext-Standard-Trenner) – kollidiert nicht mit normalem Text.
    const hasContext = entry && entry.msgctxt && String(entry.msgctxt).length > 0;
    const baseKey = hasContext ? `${entry.msgctxt}\u0004${msgid}` : msgid;

    // Wert bestimmen (leere msgstr -> Fallback auf Key)
    const value = singular && singular.trim().length > 0 ? singular : fallback;

    dict[baseKey] = value;

    // (Optional) Wenn es Pluralformen gibt, könntest du sie hier ebenfalls
    // ablegen – für unsere minimalistische „Text as Key“-Strategie lassen
    // wir das absichtlich weg. Bei Bedarf:
    //
    // if (entry.msgid_plural) {
    //   const plural = entry.msgstr?.[1] || entry.msgid_plural;
    //   dict[`${baseKey}__plural`] = plural;
    // }
  }
}

// Schön formatiert schreiben
fs.writeFileSync(outputFile, JSON.stringify(dict, null, 2) + '\n', 'utf8');

console.log(`✅ PO → JSON fertig: ${path.relative(process.cwd(), outputFile)}`);
