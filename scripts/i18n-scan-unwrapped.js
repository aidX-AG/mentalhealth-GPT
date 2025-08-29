#!/usr/bin/env node
/**
 * i18n-scan-unwrapped.js
 *
 * Findet *unübersetzte* statische Texte in .ts/.tsx-Dateien.
 * - Durchsucht jetzt auch "use client"-Dateien (gewünscht)
 * - Ignoriert node_modules/.next/public/... und i18n keys
 * - Minimiert False Positives (Icon-Namen, Tailwind-Strings, URLs, Assets, Codefragmente)
 *
 * Usage:
 *   node scripts/i18n-scan-unwrapped.js components templates constants mocks | tee /tmp/i18n_scan_all.txt
 */

const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;

const ROOT = process.cwd();
const EXT_OK = new Set([".ts", ".tsx"]);
const IGNORE_DIRS = [
  "node_modules",
  ".git",
  ".next",
  "out",
  "build",
  "dist",
  "public",
  ".vercel",
  ".cache",
  "coverage",
  ".turbo",
  ".idea",
  ".vscode",
  "i18n", // keys werden hier abgelegt – nicht scannen
];

// Text-Props (bewusst OHNE 'name', um Icon-Namen etc. zu ignorieren)
const TEXT_PROPS = new Set([
  "title","subtitle","content","description","details",
  "label","date","cta","button","text","placeholder",
  "alt","aria-label","heading","caption","tooltip","helperText"
]);

function isIgnoredDir(p) {
  const parts = p.split(path.sep);
  return parts.some((seg) => IGNORE_DIRS.includes(seg));
}

function isStringLiteralLike(node) {
  return (
    (node && node.type === "StringLiteral") ||
    (node && node.type === "TemplateLiteral" && node.expressions.length === 0)
  );
}
function literalToString(node) {
  if (!node) return null;
  if (node.type === "StringLiteral") return node.value;
  if (node.type === "TemplateLiteral" && node.expressions.length === 0) {
    return node.quasis.map((q) => q.value.cooked ?? q.value.raw).join("");
  }
  return null;
}

function looksLikeTailwind(s) {
  // sehr einfache Heuristik: viele tokens mit '-' und keine Satzzeichen/Wörter
  const str = (s || "").trim();
  if (!str) return false;
  // wenn Leerzeichen-getrennte Tokens fast alle pattern "aaa-bbb" o.ä. sind
  const tokens = str.split(/\s+/);
  if (tokens.length < 2) return false;
  let styled = 0;
  for (const tok of tokens) {
    if (/^[!]?[\w:[\]-]+$/.test(tok) && /-/.test(tok)) styled++;
  }
  return styled >= Math.max(2, Math.floor(tokens.length * 0.6));
}

function looksLikeCodeOrURL(s) {
  const str = (s || "").trim();
  if (!str) return true;
  if (/^https?:\/\//i.test(str)) return true;
  if (/[<{}`]/.test(str)) return true;              // vermeidet Codefragmente/JSX
  if (/^\w+\.(jpg|png|webp|svg|mp3|wav|pdf)$/i.test(str)) return true; // Assets
  if (/^[#./?&=_-]+$/.test(str)) return true;       // reine Symbole/URLs
  if (/^\d{1,4}([./-]\d{1,2})?([./-]\d{1,4})?$/.test(str)) return true; // Datum/Version
  if (looksLikeTailwind(str)) return true;          // Tailwind classlist als String
  return false;
}

function alreadyWrappedT(node) {
  return node &&
    node.type === "CallExpression" &&
    node.callee &&
    node.callee.type === "Identifier" &&
    node.callee.name === "t";
}

function scanFile(file) {
  const src = fs.readFileSync(file, "utf8");

  let ast;
  try {
    ast = parse(src, {
      sourceType: "module",
      plugins: ["jsx", "typescript"],
    });
  } catch (e) {
    console.error(`! Parser-Fehler in ${file}: ${e.message}`);
    return [];
  }

  const hits = [];
  const pushHit = (loc, kind, text) => {
    const clean = (text || "").replace(/\s+/g, " ").trim();
    if (!clean || looksLikeCodeOrURL(clean)) return;
    const where = `${loc.start.line}:${loc.start.column + 1}`;
    hits.push({ where, kind, text: clean });
  };

  traverse(ast, {
    // reiner JSX-Text: <div>Text</div>
    JSXText(path) {
      const text = (path.node.value || "").replace(/\s+/g, " ").trim();
      if (!text) return;

      // bereits {t("…")} drumherum?
      if (
        path.parent &&
        path.parent.type === "JSXExpressionContainer" &&
        path.parent.expression &&
        path.parent.expression.type === "CallExpression" &&
        path.parent.expression.callee &&
        path.parent.expression.callee.type === "Identifier" &&
        path.parent.expression.callee.name === "t"
      ) {
        return;
      }

      pushHit(path.node.loc, "JSXText", text);
    },

    // { "Text" } im JSX
    JSXExpressionContainer(path) {
      const expr = path.node.expression;
      if (!isStringLiteralLike(expr)) return;
      const text = literalToString(expr);
      if (!text) return;

      if (alreadyWrappedT(expr)) return;

      pushHit(path.node.loc, "JSXExpr:string", text);
    },

    // title="…", placeholder="…", alt="…", aria-label="…", …
    JSXAttribute(path) {
      const name = path.node.name;
      if (!name || name.type !== "JSXIdentifier") return;
      const propName = name.name;

      // Nur Whitelist-Props auswerten (kein 'name' → vermeidet Icon-Namen)
      if (!TEXT_PROPS.has(propName)) return;

      const val = path.node.value;
      if (!val) return;

      // {t("…")}?
      if (val.type === "JSXExpressionContainer" && alreadyWrappedT(val.expression)) return;

      if (!isStringLiteralLike(val)) return;
      const text = literalToString(val);
      if (!text) return;

      pushHit(path.node.loc, `JSXAttr:${propName}`, text);
    },

    // Objekt-Literale: { title: "…", content: `…` }
    ObjectProperty(path) {
      const keyNode = path.node.key;
      const keyName =
        keyNode.type === "Identifier" ? keyNode.name :
        keyNode.type === "StringLiteral" ? keyNode.value : null;
      if (!keyName || !TEXT_PROPS.has(keyName)) return;

      const val = path.node.value;

      // schon t("…")?
      if (alreadyWrappedT(val)) return;

      if (!isStringLiteralLike(val)) return;
      const text = literalToString(val);
      if (!text) return;

      pushHit(path.node.loc, `ObjProp:${keyName}`, text);
    },
  });

  return hits;
}

function walk(input, out = []) {
  const st = fs.statSync(input);
  if (st.isDirectory()) {
    if (isIgnoredDir(path.relative(ROOT, input))) return out;
    for (const name of fs.readdirSync(input)) {
      walk(path.join(input, name), out);
    }
  } else if (st.isFile()) {
    const ext = path.extname(input);
    if (!EXT_OK.has(ext)) return out;
    if (/\.keys\.ts$/.test(input)) return out; // keine Key-Collector-Dateien
    out.push(input);
  }
  return out;
}

// --- main ---
(function main() {
  const roots = process.argv.slice(2);
  if (roots.length === 0) {
    console.error("Usage: node scripts/i18n-scan-unwrapped.js <dir-or-file> [...more]");
    process.exit(1);
  }

  const files = roots.flatMap((r) => {
    const p = path.resolve(r);
    if (!fs.existsSync(p)) return [];
    return walk(p, []);
  });

  let total = 0;
  for (const file of files) {
    const rel = path.relative(ROOT, file);
    const hits = scanFile(file);
    if (!hits.length) continue;

    console.log(`— ${rel}`);
    for (const h of hits) {
      total++;
      const preview = h.text.length > 180 ? h.text.slice(0, 177) + "…" : h.text;
      console.log(`  ${h.where}  [${h.kind}]  ${preview}`);
    }
    console.log();
  }

  console.log(`Gefundene Einträge: ${total}`);
})();
