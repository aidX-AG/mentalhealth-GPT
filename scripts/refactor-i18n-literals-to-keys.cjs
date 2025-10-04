#!/usr/bin/env node
/* Refactor i18n literals → namespace keys
 *
 * Usage:
 *   node scripts/refactor-i18n-literals-to-keys.cjs \
 *     --namespace pricing \
 *     --paths "templates components" \
 *     [--pot locales/pot/pricing.pot] \
 *     [--write] [--backup]
 *
 * POT format (Beispiel):
 *   #. key: pricing.sections.hero-title
 *   msgid "AI chat for mental health"
 *   msgstr ""
 */

const fs = require("fs");
const path = require("path");

function parseArgs() {
  const args = process.argv.slice(2);
  const out = {
    namespace: null,
    paths: [],
    pot: null,
    write: false,
    backup: false,
  };
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === "--namespace") out.namespace = args[++i];
    else if (a === "--paths") out.paths = (args[++i] || "").split(/\s+/).filter(Boolean);
    else if (a === "--pot") out.pot = args[++i];
    else if (a === "--write") out.write = true;
    else if (a === "--backup") out.backup = true;
  }
  if (!out.namespace) {
    console.error("❌ Missing --namespace <name>");
    process.exit(1);
  }
  if (!out.paths.length) {
    console.error('❌ Missing --paths "dir1 dir2"');
    process.exit(1);
  }
  return out;
}

function resolvePotPath(namespace, potArg) {
  if (potArg) {
    const abs = path.isAbsolute(potArg) ? potArg : path.join(process.cwd(), potArg);
    return abs;
  }
  // Default: locales/pot/<namespace>.pot
  return path.join(process.cwd(), "locales", "pot", `${namespace}.pot`);
}

function loadPotMap(namespace, potPath) {
  if (!fs.existsSync(potPath)) {
    console.error(`❌ POT not found: ${potPath}`);
    process.exit(1);
  }
  const lines = fs.readFileSync(potPath, "utf8").split(/\r?\n/);

  let currentKey = null;
  let inMsgId = false;
  let msgIdBuf = "";

  const map = new Map(); // literal -> key

  const flushMsgId = () => {
    if (currentKey && inMsgId) {
      const literal = msgIdBuf
        .replace(/\\"/g, '"')
        .replace(/\\n/g, "\n")
        .replace(/\\t/g, "\t");
      if (currentKey.startsWith(namespace + ".")) {
        map.set(literal, currentKey);
      }
    }
    currentKey = null;
    inMsgId = false;
    msgIdBuf = "";
  };

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];

    // key comment
    const mKey = line.match(/^#\.\s*key:\s*([a-z0-9_.-]+)\s*$/i);
    if (mKey) {
      // Falls vorhergehendes msgid offen war, flushen
      flushMsgId();
      currentKey = mKey[1];
      continue;
    }

    // Start msgid
    const mIdStart = line.match(/^msgid\s+"(.*)"\s*$/);
    if (mIdStart) {
      inMsgId = true;
      msgIdBuf = mIdStart[1];
      continue;
    }

    // Fortgesetzte Zeilen: "...."
    const mCont = line.match(/^"(.*)"\s*$/);
    if (inMsgId && mCont) {
      msgIdBuf += mCont[1];
      continue;
    }

    // msgstr startet ⇒ msgid abschließen
    if (inMsgId && /^msgstr\s+/.test(line)) {
      flushMsgId();
      continue;
    }
  }
  // Datei-Ende: evtl. offenes msgid flushen
  flushMsgId();

  return map;
}

function walkFiles(startPaths, exts = [".ts", ".tsx"]) {
  const results = [];
  const q = [...startPaths];
  while (q.length) {
    const p = q.pop();
    if (!fs.existsSync(p)) continue;
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

  // t("...") / t('...') – relativ robust, kein vollständiger Parser
  const rx = /t\(\s*(['"])((?:\\.|(?!\1).)*)\1\s*\)/g;

  let changed = false;
  const replacements = [];
  const out = src.replace(rx, (m, quote, inside) => {
    // Unescape, damit wir mit POT-Literals vergleichen können
    const literal = inside
      .replace(/\\"/g, '"')
      .replace(/\\'/g, "'")
      .replace(/\\n/g, "\n")
      .replace(/\\t/g, "\t");

    const key = litToKey.get(literal);
    if (key) {
      const newCall = `t("${key}")`;
      if (newCall !== m) {
        changed = true;
        replacements.push({ from: m, to: newCall });
      }
      return newCall;
    }
    return m;
  });

  return { changed, out, replacements };
}

function main() {
  const { namespace, paths, write, backup, pot } = parseArgs();
  const potPath = resolvePotPath(namespace, pot);
  const litToKey = loadPotMap(namespace, potPath);

  console.log(`🔎 Namespace: ${namespace}`);
  console.log(`🔎 POT: ${potPath}`);
  console.log(`🔎 POT entries loaded: ${litToKey.size}`);
  console.log(`🔎 Scanning: ${paths.join(", ")}`);

  const files = walkFiles(paths);
  let changedCount = 0;

  for (const f of files) {
    const { changed, out, replacements } = refactorFile(f, litToKey);
    if (changed) {
      console.log(`\n✳ ${f}`);
      for (const r of replacements) {
        if (r.from !== r.to) console.log(`  - ${r.from}  →  ${r.to}`);
      }
      if (write) {
        if (backup) fs.writeFileSync(f + ".bak", fs.readFileSync(f));
        fs.writeFileSync(f, out, "utf8");
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
