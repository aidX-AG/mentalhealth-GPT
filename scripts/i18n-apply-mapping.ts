/* scripts/i18n-apply-mapping.ts
   Liest i18n-key-mapping.csv (namespace,oldKey,newKeySuggestion,text)
   → ersetzt Keys in Code (i18next.t("ns.oldKey" …) → i18next.t("ns.newKey" …))
   → verschiebt Werte in locales/en/<namespace>.json: oldKey → newKey
   Flags:
     --mapping <pfad>      CSV-Datei (Default: i18n-key-mapping.csv)
     --include <glob>      Mehrfach nutzbar: Code-Dateien
     --locales <glob>      z.B. "locales/en/*.json"
     --write               Änderungen wirklich schreiben (sonst Dry-Run)
*/

import fg from "fast-glob";
import fs from "fs";
import fse from "fs-extra";
import path from "path";
import readline from "readline";
import yargs from "yargs";
import { hideBin } from "yargs/helpers";

type MapRow = { namespace: string; oldKey: string; newKey: string; text?: string };

const argv = yargs(hideBin(process.argv))
  .option("mapping", { type: "string", default: "i18n-key-mapping.csv" })
  .option("include", { type: "array", default: [] })
  .option("locales", { type: "string", demandOption: true })
  .option("write", { type: "boolean", default: false })
  .parseSync();

const WRITE = argv.write as boolean;

async function readCsv(file: string): Promise<MapRow[]> {
  const stream = fs.createReadStream(file, "utf8");
  const rl = readline.createInterface({ input: stream, crlfDelay: Infinity });
  const rows: MapRow[] = [];
  let header: string[] | null = null;

  for await (const raw of rl) {
    const line = raw.trim();
    if (!line) continue;
    // naive CSV split: erlaubt Kommas in Text durch Anführungszeichen
    const cols: string[] = [];
    let cur = "";
    let inQ = false;
    for (let i = 0; i < line.length; i++) {
      const ch = line[i];
      if (ch === '"') {
        inQ = !inQ;
        continue;
      }
      if (ch === "," && !inQ) {
        cols.push(cur);
        cur = "";
      } else cur += ch;
    }
    cols.push(cur);

    if (!header) {
      header = cols;
      continue;
    }
    const obj: any = {};
    header.forEach((h, i) => (obj[h.trim()] = (cols[i] ?? "").trim()));
    const m: MapRow = {
      namespace: obj.namespace,
      oldKey: obj.oldKey,
      newKey: obj.newKeySuggestion,
      text: obj.text,
    };
    if (m.namespace && m.oldKey && m.newKey) rows.push(m);
  }
  return rows;
}

function replaceInCodeBuf(buf: string, ns: string, oldKey: string, newKey: string) {
  // Ersetzt i18next.t("ns.oldKey" …) → i18next.t("ns.newKey" …)
  // unterstützt ' und " und optionale Leerzeichen
  const patterns = [
    new RegExp(
      String.raw`i18next\.t\(\s*['"]${escapeReg(ns)}\.${escapeReg(oldKey)}['"]`,
      "g",
    ),
    // optional: t("ns.oldKey") – falls irgendwo direkt t verwendet würde
    new RegExp(String.raw`\bt\(\s*['"]${escapeReg(ns)}\.${escapeReg(oldKey)}['"]`, "g"),
  ];
  let changed = 0;
  let out = buf;
  for (const re of patterns) {
    out = out.replace(re, (m) => {
      changed++;
      return m.replace(`${ns}.${oldKey}`, `${ns}.${newKey}`);
    });
  }
  return { out, changed };
}

function escapeReg(s: string) {
  return s.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

async function replaceInCode(map: MapRow[], includes: string[]) {
  const files = await fg(includes as string[], { dot: false });
  let total = 0;
  const touched: string[] = [];

  for (const file of files) {
    const src = fs.readFileSync(file, "utf8");
    let buf = src;
    let fileChanges = 0;

    for (const { namespace, oldKey, newKey } of map) {
      const r = replaceInCodeBuf(buf, namespace, oldKey, newKey);
      if (r.changed) {
        buf = r.out;
        fileChanges += r.changed;
      }
    }

    if (fileChanges) {
      touched.push(`${file} (${fileChanges})`);
      total += fileChanges;
      if (WRITE) fs.writeFileSync(file, buf, "utf8");
    }
  }

  return { total, touched };
}

async function updateLocales(map: MapRow[], localesGlob: string) {
  const files = await fg(localesGlob, { dot: false });
  // Datei → JSON Objekt
  const jsonByNs: Record<string, { path: string; data: any }> = {};
  for (const p of files) {
    const ns = path.basename(p, ".json");
    const data = (await fse.pathExists(p)) ? fse.readJsonSync(p) : {};
    jsonByNs[ns] = { path: p, data };
  }

  let moved = 0;
  const moves: string[] = [];

  for (const { namespace, oldKey, newKey, text } of map) {
    const entry = jsonByNs[namespace];
    if (!entry) continue;
    const src = entry.data;
    if (Object.prototype.hasOwnProperty.call(src, oldKey)) {
      const val = src[oldKey];
      // move
      src[newKey] = val;
      delete src[oldKey];
      moved++;
      moves.push(`${namespace}: ${oldKey} → ${newKey}`);
    } else if (text && !Object.prototype.hasOwnProperty.call(src, newKey)) {
      // Falls alter Key fehlt, aber Text existiert: unter neuem Key anlegen (hilfreich)
      src[newKey] = text;
      moved++;
      moves.push(`${namespace}: +${newKey} (from CSV text)`);
    }
  }

  if (WRITE) {
    for (const { path: p, data } of Object.values(jsonByNs)) {
      // hübsch speichern
      fse.writeJsonSync(p, data, { spaces: 2 });
    }
  }

  return { moved, moves };
}

(async () => {
  const mapping = await readCsv(argv.mapping as string);
  if (!mapping.length) {
    console.error("❌ Mapping ist leer oder nicht lesbar.");
    process.exit(1);
  }

  console.log(`🔎 Mapping-Zeilen: ${mapping.length}`);
  console.log(`✍️  Modus: ${WRITE ? "WRITE" : "DRY-RUN"}`);

  // CODE
  const includes = (argv.include as string[]).length
    ? (argv.include as string[])
    : ["app/**/*.{ts,tsx}", "components/**/*.{ts,tsx}", "templates/**/*.{ts,tsx}"];
  const code = await replaceInCode(mapping, includes);
  console.log(`\n— CODE —\nÄnderungen: ${code.total}`);
  code.touched.slice(0, 30).forEach((l) => console.log("  • " + l));
  if (code.touched.length > 30) console.log(`  … +${code.touched.length - 30} weitere Dateien`);

  // LOCALES
  const loc = await updateLocales(mapping, argv.locales as string);
  console.log(`\n— LOCALES —\nVerschobene/angelegte Keys: ${loc.moved}`);
  loc.moves.slice(0, 30).forEach((l) => console.log("  • " + l));
  if (loc.moves.length > 30) console.log(`  … +${loc.moves.length - 30} weitere Moves`);

  if (!WRITE) {
    console.log("\nℹ️ Dry-Run beendet. Mit --write anwenden.");
  } else {
    console.log("\n✅ Änderungen geschrieben.");
  }
})();
