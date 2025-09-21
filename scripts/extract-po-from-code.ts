// scripts/extract-po-from-code.ts
import { GettextExtractor, JsExtractors } from 'gettext-extractor';
import * as path from 'path';

// Ein einzelnes, breites Glob-Muster
const SOURCE_GLOB = '{app,components,templates,constants,mocks}/**/*.{ts,tsx}';

const extractor = new GettextExtractor();

extractor.createJsParser([
  // _("<text>")
  JsExtractors.callExpression('_', { arguments: { text: 0 } }),

  // t("<text>")  ← Alias von _
  JsExtractors.callExpression('t', { arguments: { text: 0 } }),

  // p_("<text>", "<context>")
  JsExtractors.callExpression('p_', { arguments: { text: 0, context: 1 } }),

  // n_("<singular>", "<plural>", count) → nur Strings
  JsExtractors.callExpression('n_', { arguments: { text: 0, textPlural: 1 } }),

  // np_("<singular>", "<plural>", "<context>", count) → nur Strings + Kontext
  JsExtractors.callExpression('np_', { arguments: { text: 0, textPlural: 1, context: 2 } }),
]).parseFilesGlob(SOURCE_GLOB);

// Ausgabepfad
const outDir = path.join(process.cwd(), 'locales', 'pot');
const outFile = path.join(outDir, 'core.pot');

extractor.savePotFile(outFile);
extractor.printStats();
console.log(`✅ POT aus Code extrahiert: ${path.relative(process.cwd(), outFile)}`);
