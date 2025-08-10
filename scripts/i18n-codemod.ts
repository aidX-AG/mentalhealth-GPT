/* 
Automatischer i18n-Codemod (TSX)
- Sucht UI-Texte (JSXText) & relevante String-Props (placeholder, alt, title, aria-label, label, helperText)
- Ersetzt durch i18next.t("<ns>.<key>", { defaultValue: "<Originaltext>" })
- Schreibt/merged locales/en/<ns>.json
- Dry-Run default; mit --write werden Code & JSON geschrieben
*/

import {
  Project,
  SyntaxKind,
  JsxAttribute,
  JsxElement,
  JsxFragment,
  JsxSelfClosingElement,
  JsxOpeningElement,
  SourceFile,
  QuoteKind,
  IndentationText,
  JsxText
} from "ts-morph";
import fg from "fast-glob";
import { ensureFileSync, readJsonSync, writeJsonSync, pathExistsSync } from "fs-extra";
import * as path from "path";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

/* ---- lokale Case-Helper: keine externen Abhängigkeiten ---- */
function splitWords(input: string): string[] {
  return input
    .replace(/['’]/g, "")
    .replace(/[^A-Za-z0-9]+/g, " ")
    .replace(/([a-z0-9])([A-Z])/g, "$1 $2")
    .trim()
    .split(/\s+/)
    .filter(Boolean);
}
function paramCaseLocal(input: string): string {
  return splitWords(input).map(w => w.toLowerCase()).join("-");
}
function snakeCaseLocal(input: string): string {
  return splitWords(input).map(w => w.toLowerCase()).join("_");
}

/* ---- Konfig ---- */
const ATTR_KEYS = new Set(["placeholder", "alt", "title", "aria-label", "label", "helperText"]);
const TEXT_MIN_LEN = 1;
const TEXT_MAX_LEN = 300;
const LOCALES_DIR = "locales/en";

const argv = yargs(hideBin(process.argv))
  .option("include", { type: "array", default: ["app/**/*.tsx", "components/**/*.tsx", "templates/**/*.tsx"] })
  .option("exclude", { type: "array", default: ["**/*.d.ts", "**/_*.tsx"] })
  .option("write",   { type: "boolean", default: false })
  .help().parseSync();

const project = new Project({
  skipAddingFilesFromTsConfig: true,
  manipulationSettings: {
    quoteKind: QuoteKind.Double,
    useTrailingCommas: false,
    indentationText: IndentationText.TwoSpaces
  }
});

/* ---- State ---- */
const pending: Record<string, Record<string, string>> = {};
type Replacement = { node: JsxText | JsxAttribute; code: string; isAttr: boolean };
const batches = new Map<SourceFile, Replacement[]>();
const seqByFile = new Map<string, number>();
function nextSeq(sf: SourceFile): number {
  const k = sf.getFilePath();
  const n = (seqByFile.get(k) || 0) + 1;
  seqByFile.set(k, n);
  return n;
}

/* ---- Main ---- */
async function main() {
  const files = await fg(argv.include as string[], { ignore: argv.exclude as string[], dot: false });
  if (files.length === 0) {
    console.log("ℹ️ Keine Dateien gefunden für:", argv.include);
    return;
  }
  files.forEach(f => project.addSourceFileAtPathIfExists(f));

  const results: Array<{ file: string; replaced: number; nsUsed: Set<string> }> = [];

  for (const sf of project.getSourceFiles()) {
    const ns = inferNamespace(sf.getFilePath());
    const nsUsed = new Set<string>();

    // 1) JSX-Textknoten
    sf.forEachDescendant(node => {
      if (node.getKind() !== SyntaxKind.JsxText) return;
      const jtx = node as JsxText;
      const raw = jtx.getText();
      const text = raw.replace(/\s+/g, " ").trim();
      if (!text) return;
      if (text.length < TEXT_MIN_LEN || text.length > TEXT_MAX_LEN) return;
      if (looksLikeCodeOrUrl(text)) return;
      if (/\bi18next\.t\s*\(/.test(text)) return; // schon i18n

      const tag = parentTag(node.getParent()?.getParent());
      const key = makeKey(ns, tag, text, nextSeq(sf));

      nsUsed.add(ns);
      addPending(ns, key, text);

      queueReplace(sf, {
        node: jtx,
        code: `{i18next.t("${ns}.${key}", { defaultValue: ${JSON.stringify(text)} })}`,
        isAttr: false
      });
    });

    // 2) relevante String-Attribute
    const jsxSelfClosing = sf.getDescendantsOfKind(SyntaxKind.JsxSelfClosingElement);
    const jsxOpening = sf.getDescendantsOfKind(SyntaxKind.JsxOpeningElement);
    const jsxSelectors = [...jsxSelfClosing, ...jsxOpening] as Array<JsxSelfClosingElement | JsxOpeningElement>;

    for (const el of jsxSelectors) {
      for (const attr of el.getAttributes()) {
        if (!JsxAttribute.isJsxAttribute(attr)) continue;

        const name = attr.getNameNode().getText();
        if (!ATTR_KEYS.has(name)) continue;

        const init = attr.getInitializer();
        if (!init || init.getKind() !== SyntaxKind.StringLiteral) continue;

        const text = init.getText().slice(1, -1);
        if (!text) continue;
        if (looksLikeCodeOrUrl(text)) continue;

        const tagName = (el as any).getTagNameNode?.()?.getText?.() || "node";
        const key = makeKey(ns, `${tagName}.${name}`, text, nextSeq(sf));

        nsUsed.add(ns);
        addPending(ns, key, text);

        queueReplace(sf, {
          node: attr,
          code: `{i18next.t("${ns}.${key}", { defaultValue: ${JSON.stringify(text)} })}`,
          isAttr: true
        });
      }
    }

    const batch = batches.get(sf) || [];
    if (batch.length > 0) {
      ensureI18nextImport(sf);
      for (const usedNs of Array.from(nsUsed)) flushJson(usedNs);
      results.push({ file: rel(sf.getFilePath()), replaced: batch.length, nsUsed });
    }
  }

  // 3) Anwenden
  if (argv.write) {
    for (const [sf, repls] of batches.entries()) {
      const attrs = repls.filter(r => r.isAttr);
      const texts = repls.filter(r => !r.isAttr);
      for (const r of [...attrs, ...texts]) {
        if (JsxAttribute.isJsxAttribute(r.node)) r.node.setInitializer(r.code);
        else (r.node as JsxText).replaceWithText(r.code);
      }
    }
    await project.save();
  }

  // Report
  if (results.length === 0) {
    console.log("ℹ️ Keine Ersetzungen (Dry-Run oder keine passenden Texte).");
  } else {
    const total = results.reduce((a, r) => a + r.replaced, 0);
    console.log(`✅ ${argv.write ? "Geschrieben" : "Dry-Run"}: ${results.length} Dateien, ${total} Ersetzungen.`);
    results.forEach(r => console.log(`  • ${r.file} (${r.replaced}) [${Array.from(r.nsUsed).join(", ")}]`));
  }
}

/* ---- Helpers ---- */
function queueReplace(sf: SourceFile, r: Replacement) {
  const arr = batches.get(sf) || [];
  arr.push(r);
  batches.set(sf, arr);
}

function ensureI18nextImport(sf: SourceFile) {
  const hasImport = sf.getImportDeclarations().some(d => d.getModuleSpecifierValue() === "i18next");
  if (!hasImport) sf.addImportDeclaration({ defaultImport: "i18next", moduleSpecifier: "i18next" });
}

function addPending(ns: string, key: string, value: string) {
  pending[ns] ||= {};
  if (pending[ns][key]) {
    let n = 2;
    let cand = `${key}_${String(n).padStart(2, "0")}`;
    while (pending[ns][cand]) { n++; cand = `${key}_${String(n).padStart(2, "0")}`; }
    key = cand;
  }
  pending[ns][key] = value;
}

function flushJson(ns: string) {
  const outPath = path.join(LOCALES_DIR, `${ns}.json`);
  ensureFileSync(outPath);
  const existing = pathExistsSync(outPath) ? readJsonSafe(outPath) : {};
  const merged = { ...existing, ...pending[ns] };
  if (argv.write) writeJsonSync(outPath, merged, { spaces: 2 });
  pending[ns] = {};
}

function parentTag(node: any): string {
  if (!node) return "node";
  if (JsxElement.isJsxElement(node)) return node.getOpeningElement().getTagNameNode().getText();
  if (JsxFragment.isJsxFragment(node)) return "fragment";
  if ((node as any).getTagNameNode) return (node as any).getTagNameNode().getText?.() || "node";
  return "node";
}

function inferNamespace(filePath: string): string {
  const relPath = rel(filePath);
  const parts = relPath.split(path.sep);

  // app/<ns>/page.tsx → ns = <ns>
  const appIdx = parts.indexOf("app");
  if (appIdx >= 0 && parts[appIdx + 2] === "page.tsx") return sanitizeNs(parts[appIdx + 1]);

  // templates/<Name>Page/** → ns = name
  const tmplIdx = parts.indexOf("templates");
  if (tmplIdx >= 0 && parts[tmplIdx + 1]) {
    const raw = parts[tmplIdx + 1].replace(/Page$/i, "");
    return sanitizeNs(paramCaseLocal(raw));
  }

  // components/** → ns = common
  return "common";
}

function sanitizeNs(ns: string): string {
  return paramCaseLocal(ns); // z. B. "VideoAnalysis" → "video-analysis"
}

function makeKey(ns: string, tag: string, text: string, seq: number): string {
  const first = text.trim().split(/\s+/).slice(0, 5).join(" ");
  const base = snakeCaseLocal(first.replace(/[^\w\s]/g, "")).replace(/_{2,}/g, "_").slice(0, 40);
  const tagSlug = (tag || "text").toLowerCase().replace(/[^a-z0-9_-]/g, "");
  return `${tagSlug || "text"}_${base || "text"}_${String(seq).padStart(2, "0")}`;
}

function looksLikeCodeOrUrl(s: string): boolean {
  if (/https?:\/\//i.test(s)) return true;
  if (/[{<>=}]/.test(s)) return true;
  if (/^\s*$/.test(s)) return true;
  return false;
}

function rel(p: string) {
  return path.relative(process.cwd(), p);
}

function readJsonSafe(p: string) {
  try { return readJsonSync(p); } catch { return {}; }
}

main().catch(e => {
  console.error("❌ Codemod Fehler:", e);
  process.exit(1);
});
