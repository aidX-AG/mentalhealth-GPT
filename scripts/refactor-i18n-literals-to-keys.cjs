#!/usr/bin/env node
/* Refactor i18n literals → namespace keys
 * Usage:
 *   node scripts/refactor-i18n-literals-to-keys.cjs --namespace pricing --paths "templates components" [--write] [--backup]
 *
 * Expects POT file at: pot/<namespace>.pot
 * POT format:
 *   #. key: pricing.sections.hero-title
 *   msgid "AI chat for mental health"
 *   msgstr ""
 */

const fs = require("fs");
const path = require("path");

function parseArgs() {
  const args = process.argv.slice(2);
  const out = { namespace: null, paths: [], write: false, backup: false };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--namespace") out.namespace = args[++i];
    else if (a === "--paths") out.paths = (args[++i] || "").split(/\s+/).filter(Boolean);
    else if (a === "--write") out.write = true;
    else if (a === "--backup") out.backup = true;
  }
  if (!out.namespace) {
    console.error("❌ Missing --namespace <name>");
    process.exit(1);
  }
  if (!out.paths.length) {
    console.error("❌ Missing --paths \"dir1 dir2\"");
    process.exit(1);
  }
  return out;
}

function loadPotMap(namespace) {
  const potPath = path.join(process.cwd(), "pot", `${namespace}.pot`);
  if (!fs.existsSync(potPath)) {
    console.error(`❌ POT not found: ${potPath}`);
    process.exit(1);
  }
  const lines = fs.readFileSync(potPath, "utf8").split(/\r?\n/);

  let currentKey = null;
  const map = new Map(); // literal -> key

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // comment carrying the key
    const mKey = line.match(/^#\.\s*key:\s*([a-z0-9_.-]+)\s*$/i);
    if (mKey) {
      currentKey = mKey[1]; // e.g. pricing.sections.hero-title
      continue;
    }

    // msgid "literal"
    const mId = line.match(/^msgid\s+"(.*)"\s*$/);
    if (mId && currentKey) {
      const raw = mId[1];
      const literal = raw.replace(/\\"/g, '"'); // unescape quotes
      // only keep entries that belong to the selected namespace
      if (currentKey.startsWith(namespace + ".")) {
        map.set(literal, currentKey);
      }
      currentKey = null;
    }
  }
  return map;
}

function walkFiles(startPaths, exts = [".ts", ".tsx"]) {
  const results = [];
  const q = [...startPaths];
  while (q.length) {
    const p = q.pop();
    const stat = fs.statSync(p);
    if (stat.isDirectory()) {
      for (const e of fs.readdirSync(p)) q.push(path.join(p, e));
    } else {
      const ext = path.extname(p).toLowerCase();
      if (exts.includes(ext)) results.push(p);
    }
  }
  return results;
}

function refactorFile(filename, litToKey) {
  const src = fs.readFileSync(filename, "utf8");

  // Regex für t("...") und t('...')
  // Achtung: kein perfekter Parser, aber robust für übliche Fälle.
  const rx = /t\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*\)/g;

  let changed = false;
  let replacements = [];
  const out = src.replace(rx, (m, quote, inside) => {
    const literal = inside.replace(/\\"/g, '"').replace(/\\'/g, "'");
    const key = litToKey.get(literal);
    if (key) {
      changed = true;
      const newCall = `t("${key}")`;
      replacements.push({ from: m, to: newCall });
      return newCall;
    }
    return m;
  });

  return { changed, out, replacements };
}

function main() {
  const { namespace, paths, write, backup } = parseArgs();
  const litToKey = loadPotMap(namespace);

  console.log(`🔎 Namespace: ${namespace}`);
  console.log(`🔎 POT entries loaded: ${litToKey.size}`);
  console.log(`🔎 Scanning: ${paths.join(", ")}`);

  const files = walkFiles(paths);
  let changedCount = 0;

  for (const f of files) {
    const { changed, out, replacements } = refactorFile(f, litToKey);
    if (changed) {
      console.log(`\n✳ ${f}`);
      for (const r of replacements) {
        if (r.from !== r.to) {
          console.log(`  - ${r.from}  →  ${r.to}`);
        }
      }
      if (write) {
        if (backup) fs.writeFileSync(f + ".bak", fs.readFileSync(f));
        fs.writeFileSync(f, out);
      }
      changedCount++;
    }
  }

  if (!write) {
    console.log(`\n💡 Dry-run complete. Use --write to apply changes.`);
  }
  console.log(`✅ Files with changes: ${changedCount}`);
}

main();
