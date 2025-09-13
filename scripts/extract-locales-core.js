#!/usr/bin/env node
/**
 * i18n extractor v3.2.1 (best-of-breed)
 *
 * - ns-filter=none: EXTRAHIERT NUR PROP-WERTE (prop={t("…")}, Arrays, Objekte, Funktionsaufrufe).
 *   Freistehende t("…") werden ignoriert -> weniger Rauschen, stabilere Keys.
 * - Kategorien aus Prop-Namen (labels / placeholders / sections.<...> / form.<...> / …).
 * - Common-Promotion (Exact-Match Value -> common.key) via --common-dict/--out-common.
 * - De-dupe:
 *    • pro Namespace anhand des Textwerts (verhindert zigfach gleiche tails aus vielen Dateien)
 *    • plus Sicherheits-De-dupe bei fertigen Schlüsseln.
 * - Prefix-Modus (klassisch) bleibt vollständig erhalten.
 */

import fs from "fs";
import path from "path";

// ----------------------- CLI -----------------------
const args = process.argv.slice(2);
if (args.length === 0) { console.error("❌ Keine Input-Dateien angegeben"); process.exit(1); }

let outFile = null;
let ns = null;
let nsFilter = "prefix"; // "prefix" | "none"
let excludeNs = [];
let onlyPrefix = null;
let excludePrefix = [];
let commonDictPath = null;
let outCommonPath = null;
const files = [];

for (let i = 0; i < args.length; i++) {
  const a = args[i];
  if (a === "--out") outFile = args[++i];
  else if (a === "--ns") ns = args[++i];
  else if (a === "--ns-filter") nsFilter = (args[++i] || "prefix");
  else if (a === "--exclude-ns") excludeNs = args[++i].split(",").map(s=>s.trim()).filter(Boolean);
  else if (a === "--only-prefix") onlyPrefix = args[++i];
  else if (a === "--exclude-prefix") excludePrefix = args[++i].split(",").map(s=>s.trim()).filter(Boolean);
  else if (a === "--common-dict") commonDictPath = args[++i];
  else if (a === "--out-common") outCommonPath = args[++i];
  else files.push(a);
}
if (!outFile) { console.error("❌ --out fehlt"); process.exit(1); }

// ----------------------- Helpers -----------------------
const hasNsPrefix = (key, prefix) =>
  key.startsWith(prefix + ".") || key.startsWith(prefix + ":");

// Tail aus English-Text
const toTail = (s) => {
  const cleaned = (s || "")
    .replace(/&[^;\s]+;/g, " ")
    .replace(/[^\p{L}\p{N}\s]/gu, " ")
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(w => w && !"the a an and of for to with your our is are in on by at this that it be".split(" ").includes(w))
    .slice(0, 6)
    .join(" ");
  const camel = cleaned.replace(/(?:^\w|[\s_-]\w)/g, m => m.replace(/[\s_-]/g, "").toUpperCase());
  const c = camel.charAt(0).toLowerCase() + camel.slice(1);
  return (c || "text").slice(0, 30);
};

// Prop → Kategorie
const PROP_CATEGORY = [
  [/^title$/i,                       "sections.title"],
  [/^subtitle$/i,                    "body.subheading"],
  [/^(label|.*Label)$/i,             "labels"],
  [/^(placeholder|.*Placeholder)$/i, "placeholders"],
  [/^faq(Title|Items)$/i,            "sections.faq"],
  [/^search.*$/i,                    "form.search"],
  [/^email.*$/i,                     "form.email"],
  [/^card(Number|Details|Cvc|Exp).*$/i, "form"],
  [/^billing.*$/i,                   "sections.billing"],
  [/^applyPromo.*$/i,                "sections.apply-promo-code"],
  [/^save(Label)?$/i,                "badges.save"],
  [/^popular(Label)?$/i,             "sections.popular"],
  [/^price(Amount|Period)?$/i,       "fragments.price"],
  [/^features$/i,                    "sections.features"],
  [/^yearly(Label)?$/i,              "sections.yearly"],
  [/^monthly(Label)?$/i,             "sections.monthly"],
  [/^pay(Prefix|Label)?$/i,          "sections.pay"],
  [/^perMonth(Suffix)?$/i,           "sections.per-month"],
];
const guessCategoryFromProp = (prop) => {
  for (const [re, cat] of PROP_CATEGORY) if (re.test(prop)) return cat;
  return "body.text";
};

// propName={ ... } – Werte herausziehen, die t("…") enthalten (inkl. Arrays/Objekte/Funktionsargs)
const findPropTValues = (code) => {
  const results = []; // {prop,val}
  // Finde prop={...} Blöcke (leichtgewichtig; für JSX reicht das in der Praxis gut)
  const propBlockRe = /([A-Za-z_][A-Za-z0-9_]*)\s*=\s*\{([^}]*)\}/g;
  let m;
  while ((m = propBlockRe.exec(code)) !== null) {
    const prop = m[1];
    const block = m[2];
    const tRe = /t\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
    let mm;
    while ((mm = tRe.exec(block)) !== null) {
      results.push({ prop, val: mm[1] });
    }
  }
  return results;
};

// Generische t("…") – nur für Prefix-Modus gebraucht
const findAllTCalls = (code) => {
  const re = /t\(\s*["'`]([^"'`]+)["'`]\s*[\),]/g;
  const list = [];
  let m; while ((m = re.exec(code)) !== null) list.push(m[1]);
  return list;
};

// ----------------------- Load files -----------------------
const existing = files.filter(f => fs.existsSync(f));
const fileCodeCache = new Map();
for (const f of existing) fileCodeCache.set(f, fs.readFileSync(f, "utf8"));

// ----------------------- common dict (optional) -----------------------
let commonDictValueToKeys = null;
if (commonDictPath && fs.existsSync(commonDictPath)) {
  try {
    const dict = JSON.parse(fs.readFileSync(commonDictPath, "utf8"));
    commonDictValueToKeys = new Map();
    for (const [k, v] of Object.entries(dict)) {
      if (typeof v !== "string") continue;
      const arr = commonDictValueToKeys.get(v) || [];
      arr.push(k);
      commonDictValueToKeys.set(v, arr);
    }
  } catch (e) {
    console.error(`⚠️ common-dict konnte nicht geladen werden: ${e.message}`);
  }
}

// ----------------------- Build -----------------------
const outObj = {};
const outCommonObjAppend = {};

// 1) Klassischer Prefix-Modus: direkte Keys übernehmen
if (ns && nsFilter === "prefix") {
  const keys = [];
  for (const f of existing) {
    const code = fileCodeCache.get(f) || "";
    for (const val of findAllTCalls(code)) keys.push(val);
  }
  for (const k of keys) {
    if (!hasNsPrefix(k, ns)) continue;
    if (onlyPrefix && !hasNsPrefix(k, onlyPrefix)) continue;
    if (excludePrefix.length && excludePrefix.some(p => hasNsPrefix(k, p))) continue;
    outObj[k] = "";
  }
} else {
  // 2) ns-filter=none: PROP-ONLY EXTRAKTION
  // De-dupe pro Namespace: identische Textwerte nur 1x keyen
  const handledTextNamespace = new Set();

  for (const f of existing) {
    const code = fileCodeCache.get(f) || "";
    const pairs = findPropTValues(code); // {prop,val}

    for (const { prop, val } of pairs) {
      if (handledTextNamespace.has(val)) continue;

      // Bereits Key?
      if (/^[a-z0-9_-]+[.:]/i.test(val)) {
        if (onlyPrefix && !hasNsPrefix(val, onlyPrefix)) continue;
        if (excludePrefix.length && excludePrefix.some(p => hasNsPrefix(val, p))) continue;
        outObj[val] = "";
        handledTextNamespace.add(val);
        continue;
      }

      // Common-Promotion (Exact-Match)
      if (commonDictValueToKeys && commonDictValueToKeys.has(val)) {
        for (const ck of commonDictValueToKeys.get(val)) outCommonObjAppend[ck] = "";
        handledTextNamespace.add(val);
        continue;
      }

      // In Namespace-Key umformen
      const cat = guessCategoryFromProp(prop);
      const key = `${ns}.${cat}.${toTail(val)}`;
      outObj[key] = "";
      handledTextNamespace.add(val);
    }
  }
}

// Only-/Exclude-Prefix als Sicherheitsnetz
if (onlyPrefix) {
  for (const k of Object.keys(outObj)) if (!hasNsPrefix(k, onlyPrefix)) delete outObj[k];
}
if (excludePrefix.length > 0) {
  for (const k of Object.keys(outObj)) if (excludePrefix.some(p => hasNsPrefix(k, p))) delete outObj[k];
}

// ----------------------- write out -----------------------
const outDir = path.dirname(outFile);
fs.mkdirSync(outDir, { recursive: true });
const sortedMain = Object.keys(outObj).sort()
  .reduce((acc, k) => (acc[k] = outObj[k], acc), {});
fs.writeFileSync(outFile, JSON.stringify(sortedMain, null, 2), "utf8");
console.log(`   ✅ ${Object.keys(sortedMain).length} Keys → ${outFile}`);

// common-append (merge)
if (outCommonPath && Object.keys(outCommonObjAppend).length > 0) {
  let current = {};
  try {
    if (fs.existsSync(outCommonPath)) current = JSON.parse(fs.readFileSync(outCommonPath, "utf8") || "{}");
  } catch { current = {}; }
  for (const ck of Object.keys(outCommonObjAppend)) {
    if (!current.hasOwnProperty(ck)) current[ck] = "";
  }
  const sortedCommon = Object.keys(current).sort()
    .reduce((acc, k) => (acc[k] = current[k], acc), {});
  fs.mkdirSync(path.dirname(outCommonPath), { recursive: true });
  fs.writeFileSync(outCommonPath, JSON.stringify(sortedCommon, null, 2), "utf8");
  console.log(`   ➕ ${Object.keys(outCommonObjAppend).length} promoted → ${outCommonPath}`);
}
