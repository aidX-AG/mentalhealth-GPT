/**
 * Transifex Native SSR Codemod (AST-basiert)
 * - Ersetzt JSXText sicher durch {t('key')}
 * - Keys aus Pfad + Text: section.component.slug
 * - Skip, wenn Text führenden/nachlaufenden Whitespace hat (Sicherheit)
 * - Ersetzt String-Attribute (placeholder,title,alt,aria-label) mit {t('key')}
 */

const path = require('path');

function toSlug(s) {
  return s
    .toLowerCase()
    .normalize('NFKD').replace(/[\u0300-\u036f]/g, '') // Diakritika raus
    .replace(/['"’‘`]+/g, '')
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '')
    .slice(0, 50);
}

function deriveKey(filePath, text) {
  const parts = filePath.split(path.sep);
  // suche "templates/<X>/..." oder "app/<X>/..."
  const i = parts.findIndex(p => p === 'templates' || p === 'app');
  if (i === -1 || i + 1 >= parts.length) return null;

  const sectionRaw = parts[i + 1] || 'app';
  const section = toSlug(sectionRaw) || 'app';

  const file = parts[parts.length - 1] || 'index.tsx';
  const base = (file.split('.')[0] || 'index');
  const component = toSlug(base) || 'index';

  const phrase = toSlug(text);
  if (!phrase) return null;

  return `${section}.${component}.${phrase}`;
}

function looksTranslatable(text) {
  const t = text.trim();
  if (!t) return false;
  if (t.length < 2) return false;
  // nur Satzzeichen/Emojis vermeiden
  if (!/[a-zA-Z\u00C0-\u024F]/.test(t)) return false;
  return true;
}

module.exports = function transformer(file, api) {
  const src = file.source;
  const j = api.jscodeshift;
  const root = j(src);

  // Import { t } aus @transifex/native sicherstellen
  const hasTxImport = root.find(j.ImportDeclaration, { source: { value: '@transifex/native' } });
  const alreadyHasT =
    hasTxImport.nodes().some(d => (d.specifiers || []).some(s => s.imported && s.imported.name === 't'));

  if (!alreadyHasT) {
    root.get().node.program.body.unshift(
      j.importDeclaration([j.importSpecifier(j.identifier('t'))], j.literal('@transifex/native'))
    );
  }

  let changed = false;

  // 1) JSXText-Knoten → {t('key')}
  root.find(j.JSXText).forEach(p => {
    const original = p.value.value;
    if (!looksTranslatable(original)) return;

    // Sicherheitsgurt: wenn führend/nachlaufend Whitespace, skip (kein Risko, Layout zu brechen)
    if (original !== original.trim()) return;

    const key = deriveKey(file.path, original);
    if (!key) return;

    // Ersetze Textknoten durch Ausdruck {t('key')}
    j(p).replaceWith(
      j.jsxExpressionContainer(
        j.callExpression(j.identifier('t'), [j.stringLiteral(key)])
      )
    );
    changed = true;
  });

  // 2) String-Attribute → {t('key')}
  const ATTRS = new Set(['placeholder', 'title', 'alt', 'aria-label']);
  root.find(j.JSXAttribute).forEach(p => {
    const name = p.value.name && p.value.name.name;
    if (!ATTRS.has(name)) return;
    const val = p.value.value;
    if (!val || val.type !== 'Literal' && val.type !== 'StringLiteral') return;

    const text = (val.value || '').toString();
    if (!looksTranslatable(text)) return;

    const key = deriveKey(file.path, text) || text;
    p.value.value = j.jsxExpressionContainer(
      j.callExpression(j.identifier('t'), [j.stringLiteral(key)])
    );
    changed = true;
  });

  return changed ? root.toSource({ quote: 'single' }) : src;
};
