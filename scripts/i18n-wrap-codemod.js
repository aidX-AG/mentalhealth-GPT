#!/usr/bin/env node
// i18n-wrap-codemod.js
//
// Zweck
//  - Wrapt statische Texte in .ts/.tsx (ohne "use client") mit t("EN-Text")
//  - Fügt (falls fehlend) am Dateianfang ein:
//       import { getT } from "@/lib/i18n-runtime";
//       const t = getT();
//  - Schreibt Transifex-Keys in i18n/<relativer_pfad_ohne_ext>.keys.ts
//    (eindeutig; z.B. i18n/constants__settings.keys.ts)
//
// WICHTIG
//  - Client-Komponenten (mit "use client") werden ausgelassen
//  - Serverseitige Routenseiten unter app/<locale>/page.tsx werden ausgelassen
//    (die sind bereits i18n-fähig)
//
// Aufruf-Beispiele
//  node scripts/i18n-wrap-codemod.js mocks/updates.tsx constants/settings.tsx
//  node scripts/i18n-wrap-codemod.js $(git ls-files '*.ts' '*.tsx')

const fs = require("fs");
const path = require("path");
const { parse } = require("@babel/parser");
const traverse = require("@babel/traverse").default;
const generate = require("@babel/generator").default;
const t = require("@babel/types");

// Welche Property-Namen in Objekten/JSX-Attributen als Text gelten
const TEXT_PROPS = new Set([
  "title","subtitle","content","description","details",
  "label","name","date","cta","button","text","placeholder",
  "alt","aria-label","heading","caption","tooltip"
]);

// Verzeichnisse/Dateien ignorieren (Artefakte, Assets, bereits i18n-Serverseiten)
const IGNORE_DIRS = [/node_modules/, /\.next\//, /public\//];
const SKIP_FILE = (file) =>
  IGNORE_DIRS.some((re) => re.test(file)) ||
  /\/app\/[^/]+\/page\.tsx$/.test(file); // app/*/page.tsx überspringen

function hasUseClientHeader(src) {
  const first = src.slice(0, 200);
  return /(^|\n)\s*["']use client["'];?/.test(first);
}

function isStringLiteralLike(node) {
  return t.isStringLiteral(node) || (t.isTemplateLiteral(node) && node.expressions.length === 0);
}
function literalToString(node) {
  if (t.isStringLiteral(node)) return node.value;
  if (t.isTemplateLiteral(node) && node.expressions.length === 0) {
    return node.quasis.map(q => q.value.cooked ?? q.value.raw).join("");
  }
  return null;
}

function looksLikeCodeOrURL(s) {
  const str = s.trim();
  if (!str) return true;
  if (/^https?:\/\//i.test(str)) return true;
  if (/[<{}`]/.test(str)) return true; // vermeidet JSX/Code-Fragmente
  if (/^\w+\.(jpg|png|webp|svg|mp3|wav|pdf)$/i.test(str)) return true; // Assets
  return false;
}

function alreadyTCall(node) {
  return t.isCallExpression(node) && t.isIdentifier(node.callee, { name: "t" });
}

function ensureImportGetT(ast) {
  let hasImport = false;
  let lastImport = null;

  for (const node of ast.program.body) {
    if (t.isImportDeclaration(node)) {
      lastImport = node;
      if (node.source.value === "@/lib/i18n-runtime") {
        const hasSpec = node.specifiers.some(
          (s) => t.isImportSpecifier(s) && s.imported.name === "getT"
        );
        if (hasSpec) hasImport = true;
      }
    }
  }

  if (!hasImport) {
    const imp = t.importDeclaration(
      [t.importSpecifier(t.identifier("getT"), t.identifier("getT"))],
      t.stringLiteral("@/lib/i18n-runtime")
    );
    const idx = lastImport ? ast.program.body.indexOf(lastImport) + 1 : 0;
    ast.program.body.splice(idx, 0, imp);
  }

  // const t = getT(); falls nicht vorhanden
  let hasTDecl = ast.program.body.some(
    (n) =>
      t.isVariableDeclaration(n) &&
      n.declarations.some(
        (d) =>
          t.isVariableDeclarator(d) &&
          t.isIdentifier(d.id, { name: "t" }) &&
          t.isCallExpression(d.init) &&
          t.isIdentifier(d.init.callee, { name: "getT" })
      )
  );

  if (!hasTDecl) {
    const decl = t.variableDeclaration("const", [
      t.variableDeclarator(t.identifier("t"), t.callExpression(t.identifier("getT"), [])),
    ]);
    // nach Importen platzieren
    let insertAt = 0;
    while (insertAt < ast.program.body.length && t.isImportDeclaration(ast.program.body[insertAt])) {
      insertAt++;
    }
    ast.program.body.splice(insertAt, 0, decl);
  }
}

function processFile(file) {
  if (SKIP_FILE(file)) return { skipped: true };

  const src = fs.readFileSync(file, "utf8");
  if (hasUseClientHeader(src)) return { skipped: true }; // keine Client-Komponenten anfassen

  const ast = parse(src, { sourceType: "module", plugins: ["jsx", "typescript"] });

  // EN-Quelltexte als Source in TX → wir sammeln alle Originaltexte de-duplicated
  const phrases = new Set();
  let changed = false;

  const recordPhrase = (text) => {
    const clean = String(text).replace(/\s+/g, " ").trim();
    if (clean) phrases.add(clean);
    return clean;
  };

  traverse(ast, {
    // 1) JSXText: <div>Hello</div>  ->  <div>{t("Hello")}</div>
    JSXText(path) {
      const raw = path.node.value;
      const text = raw.replace(/\s+/g, " ").trim();
      if (!text) return;
      if (looksLikeCodeOrURL(text)) return;

      // bereits {t("…")} drumrum?
      if (t.isJSXExpressionContainer(path.parent) && t.isCallExpression(path.parent.expression)) {
        const callee = path.parent.expression.callee;
        if (t.isIdentifier(callee, { name: "t" })) return;
      }

      const phrase = recordPhrase(text);
      path.replaceWith(
        t.jsxExpressionContainer(t.callExpression(t.identifier("t"), [t.stringLiteral(phrase)]))
      );
      changed = true;
    },

    // 2) JSXAttribute: title="…" / placeholder="…" / alt="…" etc.
    JSXAttribute(path) {
      const name = path.node.name;
      if (!t.isJSXIdentifier(name)) return;
      const propName = name.name;
      if (!TEXT_PROPS.has(propName)) return;

      const val = path.node.value;
      if (!val) return;

      if (t.isJSXExpressionContainer(val) && alreadyTCall(val.expression)) return;

      if (!isStringLiteralLike(val)) return;

      const text = literalToString(val);
      if (!text || looksLikeCodeOrURL(text)) return;

      const phrase = recordPhrase(text);
      path.node.value = t.jsxExpressionContainer(
        t.callExpression(t.identifier("t"), [t.stringLiteral(phrase)])
      );
      changed = true;
    },

    // 3) Object literals: { title: "…", content: `…` }
    ObjectProperty(path) {
      const keyNode = path.node.key;
      const keyName =
        t.isIdentifier(keyNode) ? keyNode.name :
        t.isStringLiteral(keyNode) ? keyNode.value :
        null;

      if (!keyName || !TEXT_PROPS.has(keyName)) return;

      const val = path.node.value;

      // schon t("…")?
      if (alreadyTCall(val)) return;

      if (!isStringLiteralLike(val)) return;

      const text = literalToString(val);
      if (!text || looksLikeCodeOrURL(text)) return;

      const phrase = recordPhrase(text);
      path.node.value = t.callExpression(t.identifier("t"), [t.stringLiteral(phrase)]);
      changed = true;
    },

    // 4) NEU: vorhandene t("…")-Aufrufe IMMER einsammeln, auch wenn nichts geändert wird
    CallExpression(path) {
      const callee = path.node.callee;
      if (t.isIdentifier(callee, { name: "t" })) {
        const arg = path.node.arguments?.[0];
        if (t.isStringLiteral(arg)) {
          recordPhrase(arg.value);
        } else if (t.isTemplateLiteral(arg) && arg.expressions.length === 0) {
          recordPhrase(arg.quasis.map(q => q.value.cooked ?? q.value.raw).join(""));
        }
      }
    },
  });

  // Nur Source-Datei überschreiben, wenn wir wirklich etwas geändert haben
  if (changed) {
    ensureImportGetT(ast);
    const { code } = generate(ast, { jsescOption: { minimal: true } });
    fs.writeFileSync(file, code, "utf8");
  }

  // NEU/ÄNDERUNG: Keys-Datei auch dann schreiben, wenn nichts geändert wurde,
  // aber Phrasen gefunden wurden (z.B. manuell bereits vorhandene t("…")).
  if (phrases.size === 0 && !changed) return { changed: false };

  // Keys-Datei schreiben: i18n/<relativer_pfad_ohne_ext>.keys.ts
  const rel = path.relative(process.cwd(), file); // z.B. "constants/settings.tsx"
  const norm = rel.replace(/[\\/]/g, "__").replace(/\.(ts|tsx)$/, ""); // "constants__settings"
  const keysFile = path.join("i18n", `${norm}.keys.ts`);

  let out = `// Auto-generated TX keys for ${rel}. Nicht zur Laufzeit importieren.\n`;
  out += `// txjs-cli sammelt hier die t("…") Aufrufe ein.\n`;
  out += `export {};\n\n`; // macht Datei zum Modul → kein 't'-Redeclare über mehrere Dateien
  out += `const t = (s: string): string => s;\n\n`;

  const sorted = Array.from(phrases).sort((a, b) => a.localeCompare(b));
  for (const phrase of sorted) {
    const safe = String(phrase).replace(/\*\//g, "*\\/");
    out += `// ${safe}\n`;
    out += `t(${JSON.stringify(phrase)});\n`;
  }

  fs.mkdirSync(path.dirname(keysFile), { recursive: true });
  fs.writeFileSync(keysFile, out, "utf8");

  return { changed, keysFile };
}

// --- main ---
(async function main() {
  const files = process.argv.slice(2);
  if (files.length === 0) {
    console.error("Usage: node scripts/i18n-wrap-codemod.js <file1.tsx> <file2.ts> ...");
    process.exit(1);
  }

  let changedCount = 0;
  const keysOut = [];

  for (const f of files) {
    if (!fs.existsSync(f)) continue;
    const res = processFile(f);
    if (!res) continue;
    if (res.changed) changedCount++;
    if (res.keysFile) keysOut.push(res.keysFile);
  }

  console.log(`✔ geändert: ${changedCount} Datei(en)`);
  if (keysOut.length) {
    console.log("✔ Keys-Dateien:");
    keysOut.forEach((k) => console.log("  -", k));
  }
})();
