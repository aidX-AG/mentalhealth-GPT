/**
 * i18n Proper-Keys Codemod (v2.1)
 * Änderungen in dieser Version:
 *  - Locale-Ordner (z.B. app/de/...) werden bei Namespace-Ableitung übersprungen
 *  - Pfadbasierter Ausschluss der 15 Client-Namespaces bleibt erhalten
 *  - Verbesserte Kategorie-Heuristik (title/subtitle/…)
 *  - Kürzerer Hash (3 Zeichen) im Tail zur Kollisionsvermeidung
 *
 * Aufrufe:
 *   npx jscodeshift -t scripts/codemods/i18n-proper-keys.js app --parser=tsx --dry
 *   npx jscodeshift -t scripts/codemods/i18n-proper-keys.js app --parser=tsx
 */

const path = require('path');
const crypto = require('crypto');

// *** Pfadbasiert auszuschließende /app/<dir>/ Namespaces (Client-Ready) ***
const EXCLUDE_DIRS = [
  'applications',
  'audio-transcription',
  'checkout',
  'diagnosis-support',
  'documentation-reports',
  'generation-socials-post',
  'home',
  'pricing',
  'sign-in',
  'supervision-training',
  'thanks',
  'therapy-support',
  'updates-and-faq',
  'video-analysis',
  'pagelist',
];

// Locale-Verzeichnisse, die direkt nach /app/ vorkommen können
const LOCALE_DIRS = new Set([
  'en','de','fr','it','es','pt','nl','pl','sv','da','nb','fi','cs','sk','sl','hu','ro','bg','el','tr'
]);

// Technische Ordner, die wir bei der Namespace-Ableitung überspringen
const SKIP_DIRS = new Set(['api','lib','utils','types','styles']);

// Attribute, die als Strings nach t('...','Default') migriert werden
const ATTRS = new Set(['placeholder','title','alt','aria-label']);

// Proper-Key-Detektion
const PROPER_KEY_RE = /^[a-z0-9_-]+\.[a-z0-9_.-]+$/;

function looksTranslatable(text) {
  if (!text) return false;
  const t = text.trim();
  if (t.length < 2) return false;
  // vermeide rein symbolische Strings
  if (!/[A-Za-z\u00C0-\u024F]/.test(t)) return false;
  return true;
}

function toSlug(s) {
  return (s || '')
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '')
    .replace(/['"’‘`]+/g, '')
    .replace(/[^a-zA-Z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .toLowerCase()
    .slice(0, 50);
}

// *** NEU/angepasst: robust gegen Locale-Verzeichnisse ***
function deriveNamespace(filePath) {
  const parts = filePath.split(path.sep);
  const appIdx = parts.indexOf('app');
  const templatesIdx = parts.indexOf('templates');
  let i = Math.max(appIdx, templatesIdx);
  if (i === -1) return 'app';

  // Schrittweise zum ersten relevanten Segment nach app/templates
  let idx = i + 1;

  // 1) Locale-Verzeichnisse überspringen (explizite Liste oder 2-Buchstaben-Codes)
  while (idx < parts.length && (LOCALE_DIRS.has(parts[idx]) || /^[a-z]{2}$/.test(parts[idx]))) idx++;

  // 2) Technische Ordner überspringen
  while (idx < parts.length && SKIP_DIRS.has(parts[idx])) idx++;

  const candidate = parts[idx] || 'app';
  return toSlug(candidate) || 'app';
}

// *** NEU/angepasst: pfadbasiert + 'use client' + Locale-Zweige skippen ***
function shouldTransformThisFile(absPath) {
  // 'use client' immer skippen
  try {
    const src = require('fs').readFileSync(absPath, 'utf8');
    if (src.includes(`'use client'`) || src.includes(`"use client"`)) return false;
  } catch {
    // wenn nicht lesbar, lieber nicht anfassen
    return false;
  }

  // Normalisiere Pfad auf POSIX
  const p = absPath.split(path.sep).join('/');

  // /app/<EXCLUDE_DIR>/ vollständig auslassen
  for (const dir of EXCLUDE_DIRS) {
    if (p.includes(`/app/${dir}/`) || p.endsWith(`/app/${dir}/page.tsx`) || p.endsWith(`/app/${dir}/layout.tsx`)) {
      return false;
    }
  }

  // komplette Locale-Zweige app/<locale>/... auslassen
  const parts = p.split('/');
  const appIx = parts.indexOf('app');
  if (appIx !== -1 && appIx + 1 < parts.length) {
    const maybeLocale = parts[appIx + 1];
    if (LOCALE_DIRS.has(maybeLocale) || /^[a-z]{2}$/.test(maybeLocale)) {
      return false;
    }
  }

  return true;
}

// *** NEU/angepasst: feinere Kategorien + Fallbacks ***
function categoryFromProp(propName, text) {
  if (!propName) return 'body.text';
  const p = String(propName).toLowerCase();
  const t = String(text || '').toLowerCase();

  if (p.includes('title')) return 'sections.title';
  if (p.includes('subtitle') || p.includes('description')) return 'sections.subtitle';
  if (p.includes('label')) return 'labels';
  if (p.includes('placeholder')) return 'form.placeholder';
  if (p.includes('button') || p.includes('cta')) return 'buttons';
  if (p.includes('error') || p.includes('warning')) return 'validation.errors';
  if (p.includes('success') || p.includes('confirm')) return 'validation.success';

  // Heuristik auf Textbasis
  if (t.includes('?')) return 'faq.questions';
  if (t.length > 50) return 'body.paragraph';

  return 'body.text';
}

// *** NEU/angepasst: Hash auf 3 Zeichen reduziert ***
function tailFromText(text, context = '') {
  const cleaned = (text || '')
    .replace(/&[^;\s]+;/g, ' ')
    .replace(/[^\p{L}\p{N}\s]/gu, ' ')
    .toLowerCase()
    .trim()
    .split(/\s+/)
    .filter(w => w && !'the a an and of for to with your our is are in on by at this that it be'.split(' ').includes(w))
    .slice(0, 8)
    .join('_') || 'text';
  const hash = crypto.createHash('md5').update((text || '') + context).digest('hex').slice(0, 3);
  return `${cleaned}_${hash}`;
}

function ensureTImported(j, root) {
  const txImports = root.find(j.ImportDeclaration, { source: { value: '@transifex/native' } });
  if (txImports.size() > 0) {
    let hasT = false;
    txImports.forEach(p => {
      const specs = p.value.specifiers || [];
      if (specs.some(s => s.type === 'ImportSpecifier' && s.imported && s.imported.name === 't')) {
        hasT = true;
      }
    });
    if (!hasT) {
      const first = txImports.at(0);
      const node = first.get().value;
      node.specifiers = node.specifiers || [];
      node.specifiers.push(j.importSpecifier(j.identifier('t')));
    }
  } else {
    root.get().node.program.body.unshift(
      j.importDeclaration([j.importSpecifier(j.identifier('t'))], j.literal('@transifex/native'))
    );
  }
}

module.exports = function transformer(file, api) {
  const src = file.source;
  const j = api.jscodeshift;
  const root = j(src);

  if (!shouldTransformThisFile(file.path)) return src;

  const ns = deriveNamespace(file.path);
  let changed = false;

  ensureTImported(j, root);

  function makeTCall(key, defLiteral) {
    return j.callExpression(
      j.identifier('t'),
      [j.stringLiteral(key), j.stringLiteral(defLiteral)]
    );
  }

  // JSXText → {t('ns.category.tail','Original')}
  root.find(j.JSXText).forEach(p => {
    const original = p.value.value;
    if (!looksTranslatable(original)) return;
    if (original !== original.trim()) return; // Sicherheitsgurt

    const context = `${file.path}:${p.value.loc && p.value.loc.start ? p.value.loc.start.line : ''}`;
    const tail = tailFromText(original, context);
    const key = `${ns}.body.text.${tail}`;

    const parent = p.parent && p.parent.value;
    if (parent && parent.type === 'JSXElement') {
      j(p).replaceWith(j.jsxExpressionContainer(makeTCall(key, original.trim())));
      changed = true;
    }
  });

  // String-Attribute → {t('ns.category.tail','Original')}
  root.find(j.JSXAttribute).forEach(p => {
    const name = p.value.name && p.value.name.name;
    if (!ATTRS.has(name)) return;

    const v = p.value.value;
    const isStr = v && (v.type === 'Literal' || v.type === 'StringLiteral');
    if (!isStr) return;

    const text = String(v.value || '');
    if (!looksTranslatable(text)) return;

    const context = `${file.path}:${p.value.loc && p.value.loc.start ? p.value.loc.start.line : ''}`;
    const cat = categoryFromProp(name, text);
    const tail = tailFromText(text, context);
    const key = `${ns}.${cat}.${tail}`;

    p.value.value = j.jsxExpressionContainer(makeTCall(key, text));
    changed = true;
  });

  // t("Freitext") → t('ns.body.text.tail','Default')
  root.find(j.CallExpression, { callee: { name: 't' } }).forEach(p => {
    const args = p.value.arguments || [];
    if (args.length === 0) return;

    const a0 = args[0];
    if (!a0 || (a0.type !== 'Literal' && a0.type !== 'StringLiteral')) return;

    const first = String(a0.value || '');
    if (PROPER_KEY_RE.test(first)) {
      // Proper-Key: optional Default anhängen, wenn fehlt (lassen wir so)
      return;
    }

    if (!looksTranslatable(first)) return;

    const context = `${file.path}:${p.value.loc && p.value.loc.start ? p.value.loc.start.line : ''}`;
    const tail = tailFromText(first, context);
    const key = `${ns}.body.text.${tail}`;

    j(p).replaceWith(makeTCall(key, first));
    changed = true;
  });

  return changed ? root.toSource({ quote: 'single', reuseWhitespace: false }) : src;
};
