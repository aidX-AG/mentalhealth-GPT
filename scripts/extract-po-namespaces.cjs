#!/usr/bin/env node
/**
 * scripts/extract-po-namespaces.cjs
 *
 * Extrahiert i18n-Strings aus Code und schreibt POT-Dateien pro Namespace.
 * - Namespace wird aus dem Pfad erkannt: app/<ns>/page.tsx → <ns>.pot
 * - CSV (Semikolon): scripts/mapping/i18n-key-mapping.csv
 *     Header: namespace;newKeySuggestion;text
 *     Wir matchen NUR per `text` → `newKeySuggestion` (oldkey ignoriert).
 * - Fallback, wenn CSV nicht trifft: reverse lookup aus locales/en/<ns>.json
 * - Letzter Fallback: stabiler Auto-Key (<ns>.auto.<sha1>)
 */

const fs = require("fs");
const path = require("path");
const crypto = require("crypto");

const ROOT = process.cwd();
const LOCALES_DIR = path.join(ROOT, "locales");
const POT_DIR = path.join(LOCALES_DIR, "pot");
const EN_DIR = path.join(LOCALES_DIR, "en");
const CSV_PATH = path.join(ROOT, "scripts", "mapping", "i18n-key-mapping.csv");

// Die 16 Namespaces
const NAMESPACES = new Set([
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

// ---------- Helpers ----------
function ensureDir(p) {
  if (!fs.existsSync(p)) fs.mkdirSync(p, { recursive: true });
}

function readJson(p) {
  try {
    return JSON.parse(fs.readFileSync(p, "utf8"));
  } catch {
    return null;
  }
}

function stableKeyFromText(ns, text) {
  const h = crypto.createHash("sha1").update(text).digest("hex").slice(0, 8);
  return `${ns}.auto.${h}`;
}

function detectNamespaceByPath(filePath) {
  const p = filePath.replace(/\\/g, "/");
  const m = p.match(/\/app\/([^/]+)\/page\.(t|j)sx?$/i);
  if (!m) return "core";
  const ns = m[1];
  return NAMESPACES.has(ns) ? ns : "core";
}

// Robustes Normalisieren für CSV/Code-Matching (keine Änderung am msgid!)
function normalizeText(s) {
  if (!s) return "";
  return String(s)
    .replace(/\r\n/g, "\n")               // CRLF → LF
    .replace(/\u00A0/g, " ")              // NBSP → Space
    .replace(/[ \t]+/g, " ")              // mehrfach-Whitespace → 1 Space
    .replace(/[\u2018\u2019]/g, "'")      // ’‘ → '
    .replace(/[\u201C\u201D]/g, '"')      // “ ” → "
    .replace(/\u2013|\u2014/g, "-")       // – — → -
    .trim();
}

function extractTextsFromCode(src) {
  // findet t("…") / t('…') und _("…") / _('…')
  const results = [];
  const patterns = [
    /\bt\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*\)/g,
    /\bt\(\s*'([^'\\]*(?:\\.[^'\\]*)*)'\s*\)/g,
    /\b_\(\s*"([^"\\]*(?:\\.[^"\\]*)*)"\s*\)/g,
    /\b_\(\s*'([^'\\]*(?:\\.[^'\\]*)*)'\s*\)/g,
  ];
  for (const re of patterns) {
    let m;
    while ((m = re.exec(src))) {
      const raw = m[1] ?? "";
      // nur minimale Unescapes; msgid bleibt ORIGINAL (ohne Normalisierung!)
      const text = raw.replace(/\\"/g, '"').replace(/\\'/g, "'").trim();
      if (text) results.push(text);
    }
  }
  return Array.from(new Set(results));
}

function loadReverseMapForNamespace(ns) {
  // locales/en/<ns>.json → { key: "English" } ⇒ reverse: normalized("English") -> key
  const map = new Map();
  const p = path.join(EN_DIR, `${ns}.json`);
  const json = readJson(p);
  if (!json) return map;
  for (const [key, en] of Object.entries(json)) {
    if (typeof en === "string" && en.trim()) {
      map.set(normalizeText(en), key);
    }
  }
  return map;
}

function splitCsvLineSemicolon(line) {
  // simpler Semikolon-Parser mit Quotes-Unterstützung
  const out = [];
  let cur = "";
  let inQ = false;
  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' && line[i - 1] !== "\\") {
      inQ = !inQ;
      continue;
    }
    if (ch === ";" && !inQ) {
      out.push(cur);
      cur = "";
      continue;
    }
    cur += ch;
  }
  out.push(cur);
  return out.map((s) => s.replace(/^"(.*)"$/, "$1"));
}

function loadCsvOverrides() {
  // Map<namespace, Map<normalizedText, newKeySuggestion>>
  const perNs = new Map();
  if (!fs.existsSync(CSV_PATH)) return perNs;
  const raw = fs.readFileSync(CSV_PATH, "utf8").replace(/^\uFEFF/, ""); // BOM weg

  const lines = raw.split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length < 2) return perNs;

  const header = splitCsvLineSemicolon(lines[0]).map((h) => h.trim().toLowerCase());
  const idxNs = header.indexOf("namespace");
  const idxNew = header.indexOf("newkeysuggestion");
  const idxText = header.indexOf("text");
  if (idxNs < 0 || idxNew < 0 || idxText < 0) return perNs;

  for (let i = 1; i < lines.length; i++) {
    const cols = splitCsvLineSemicolon(lines[i]);
    const ns = (cols[idxNs] || "").trim();
    const key = (cols[idxNew] || "").trim();
    const txt = (cols[idxText] || "").trim();
    if (!ns || !key || !txt) continue;

    const norm = normalizeText(txt);
    if (!perNs.has(ns)) perNs.set(ns, new Map());
    perNs.get(ns).set(norm, key);
  }
  return perNs;
}

function potHeader() {
  return [
    'msgid ""',
    'msgstr ""',
    '"Project-Id-Version: mentalhealthgpt\\n"',
    '"Language: \\n"',
    '"Content-Type: text/plain; charset=utf-8\\n"',
    '"Content-Transfer-Encoding: 8bit\\n"',
    '"Plural-Forms: nplurals=2; plural=(n != 1);\\n"',
    "",
  ].join("\n");
}

function escapePo(s) {
  return s.replace(/\\/g, "\\\\").replace(/"/g, '\\"');
}

// ---------- Main ----------
(function main() {
  const files = process.argv.slice(2).map((p) => path.resolve(p));
  if (files.length === 0) {
    console.error("❌ Bitte mind. 1 Datei angeben, z.B.: app/pricing/page.tsx");
    process.exit(1);
  }
  ensureDir(POT_DIR);

  // CSV Overrides laden
  const csvPerNs = loadCsvOverrides();

  // Sammeln ns → Map<originalMsgidText, resolvedKey>
  const perNs = new Map();

  for (const file of files) {
    if (!fs.existsSync(file)) {
      console.warn(`⚠️  Datei nicht gefunden: ${path.relative(ROOT, file)}`);
      continue;
    }

    const ns = detectNamespaceByPath(file);
    if (ns === "core") {
      console.warn(`⚠️  Datei wirkt nicht wie Namespace-Page: ${path.relative(ROOT, file)} → core (übersprungen)`);
      continue;
    }

    const src = fs.readFileSync(file, "utf8");
    const texts = extractTextsFromCode(src);
    if (!perNs.has(ns)) perNs.set(ns, new Map());
    const bucket = perNs.get(ns);

    // Reverse-Map aus locales/en/<ns>.json
    const reverse = loadReverseMapForNamespace(ns);
    // CSV-Map für diesen Namespace
    const csvMap = csvPerNs.get(ns) || new Map();

    for (const msgid of texts) {
      const norm = normalizeText(msgid);

      // 1) CSV-Match?
      let key = csvMap.get(norm);
      if (key) {
        bucket.set(msgid, key);
        continue;
      }

      // 2) Reverse-Map?
      key = reverse.get(norm);
      if (key) {
        bucket.set(msgid, key);
        continue;
      }

      // 3) Fallback: Auto-Key
      key = stableKeyFromText(ns, norm);
      console.warn(`⚠️  Kein Key gefunden für [${ns}] "${msgid}" → generiert: ${key}`);
      bucket.set(msgid, key);
    }
  }

  // Schreiben
  let total = 0;
  for (const [ns, map] of perNs) {
    const outPath = path.join(POT_DIR, `${ns}.pot`);
    const lines = [potHeader()];
    const entries = Array.from(map.entries()).sort((a, b) => a[0].localeCompare(b[0]));

    for (const [en, key] of entries) {
      lines.push(`#. key: ${key}`);
      lines.push(`msgid "${escapePo(en)}"`);
      lines.push('msgstr ""');
      lines.push("");
      total++;
    }

    fs.writeFileSync(outPath, lines.join("\n"), "utf8");
    console.log(`✅ POT geschrieben: ${path.relative(ROOT, outPath)} (${entries.length} Einträge)`);
  }

  console.log(`\n🎉 Fertig. Insgesamt ${total} msgid-Einträge in ${perNs.size} POT-Datei(en).`);
})();
