#!/usr/bin/env node
/**
 * scripts/tx-extract-from-file.js
 * Extrahiert alle t("…") Strings aus einer TSX/JSX-Datei und gibt JSON-Liste zurück.
 */

const fs = require("fs");

const file = process.argv[2];
if (!file) {
  console.error("Usage: node scripts/tx-extract-from-file.js <file.tsx>");
  process.exit(1);
}

const src = fs.readFileSync(file, "utf8");

// Regulärer Ausdruck: findet t("…") oder t('…')
const regex = /t\(\s*["'`]([^"'`]+)["'`]\s*\)/g;

let match;
const keys = [];
while ((match = regex.exec(src)) !== null) {
  keys.push(match[1]);
}

// JSON ausgeben
process.stdout.write(JSON.stringify(keys, null, 2));
