import fs from "fs";
import path from "path";
import readline from "readline";
import changeCase from "change-case";

/**
 * Usage:
 *  TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/i18n-key-shorten.ts --dry
 *  TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/i18n-key-shorten.ts --write
 *
 * Input: i18n-key-mapping.csv  (namespace,oldKey,newKeySuggestion,englishText)
 * Output (write): überschreibt nur Spalte 3 (newKeySuggestion)
 */

const CSV = path.resolve("i18n-key-mapping.csv");
const MAX_TAIL = 30;                // max Länge des „Inhalts-Tails“
const KEEP_WORDS = 6;               // wie viele sinnvolle Wörter in den Tail
const STOP = new Set(["the","a","an","and","of","for","to","with","your","our","is","are","in","on","by","at","this","that","it","be"]);
const TYPE_MAP: Array<[RegExp, string]> = [
  [/^button_|^btn_/, "buttons"],
  [/^fieldlabel_/, "labels"],
  [/^fieldplaceholder_/, "placeholders"],
  [/^label_/, "labels"],
  [/^placeholder_/, "placeholders"],
  [/^imagealt_|^alt_/, "alt"],
  [/^chattitle_|^chat_/, "chat"],
  [/^node_|^fragment_/, "fragments"],
  [/^div_|^p_|^span_|^h\d_/, "body"],
];

function detectType(oldKey: string): string {
  for (const [re, v] of TYPE_MAP) {
    if (re.test(oldKey)) return typeof v === "function" ? (v as any)(oldKey) : v;
  }
  return "body";
}

function cleanWords(s: string): string[] {
  // Emojis/HTML-Entities/Quotes/Punct raus; Zahlen/Wörter behalten
  const noEntities = s.replace(/&[^;\s]+;/g, " ");
  const noEmoji = noEntities.replace(/[\p{Extended_Pictographic}\p{Emoji_Presentation}]/gu, " ");
  const cleaned = noEmoji.replace(/[^\p{L}\p{N}\s]/gu, " ");
  return cleaned
    .toLowerCase()
    .split(/\s+/)
    .filter(w => w && !STOP.has(w) && w.length > 1);
}

function makeTailFromEnglish(english: string): string {
  const words = cleanWords(english).slice(0, KEEP_WORDS);
  if (words.length === 0) return "text";
  const camel = changeCase.camelCase(words.join(" "));
  return camel.slice(0, MAX_TAIL);
}

function shortenTailIfNeeded(tail: string): string {
  const t = changeCase.camelCase(tail.replace(/[^a-zA-Z0-9\s._-]/g, " "));
  return t.length > MAX_TAIL ? t.slice(0, MAX_TAIL) : t || "text";
}

async function run(write = false) {
  if (!fs.existsSync(CSV)) {
    console.error(`❌ Not found: ${CSV}`);
    process.exit(1);
  }
  const rl = readline.createInterface({ input: fs.createReadStream(CSV, "utf8") });
  const out: string[] = [];
  const seen = new Set<string>();

  let header = "";
  for await (const lineRaw of rl) {
    const line = lineRaw.replace(/\r?\n$/, "");
    if (!line.trim()) { out.push(lineRaw); continue; }

    // naive CSV Split: wir erwarten keine eingebetteten Kommas außer evtl. im Text -> in der mapping.csv besser in Quotes
    const cols = parseCsvLine(line);

    if (!header) { header = line; out.push(lineRaw); continue; }
    if (cols.length < 4) { out.push(lineRaw); continue; }

    const [ns, oldKey, newKeySuggestionRaw, english] = cols;
    let newKeySuggestion = newKeySuggestionRaw;

    const type = detectType(oldKey);
    // tail ist hinter dem Namespace-Part
    let tail = newKeySuggestion.split(".").pop() || "";

    const looksSluggy = /[-_]{2,}|[a-z0-9-]{25,}/.test(tail);
    const tooLong = tail.length > MAX_TAIL;
    const emptyTail = !tail || tail === "text" || tail === "section" || tail === "title";

    if (emptyTail || tooLong || looksSluggy) {
      const tailFromEn = makeTailFromEnglish(english);
      const head = ns.includes(".") ? ns : `${ns}.${type}`;
      let next = `${head}.${tailFromEn}`;

      // de-dupe
      let cnt = 2;
      while (seen.has(next)) {
        next = `${head}.${tailFromEn}_${cnt++}`;
      }
      newKeySuggestion = next;
    }

    seen.add(newKeySuggestion);
    const row = write
      ? [ns, oldKey, newKeySuggestion, english]
      : [ns, oldKey, newKeySuggestion, english]; // gleiche Ausgabe; "write" steuert nur Datei-Overwrite am Ende

    out.push(row.map(escapeCsv).join(","));
  }

  if (write) {
    fs.writeFileSync(CSV, out.join("\n") + "\n", "utf8");
    console.log("✅ mapping updated:", CSV);
  } else {
    console.log("🔎 preview (first 30 lines):");
    console.log(out.slice(0, 30).join("\n"));
    console.log("\nℹ️ Run with --write to apply.");
  }
}

function parseCsvLine(line: string): string[] {
  // simple parser supporting quotes around fields
  const res: string[] = [];
  let cur = "";
  let inQ = false;

  for (let i = 0; i < line.length; i++) {
    const ch = line[i];
    if (ch === '"' ) {
      if (inQ && line[i+1] === '"') { cur += '"'; i++; }
      else inQ = !inQ;
    } else if (ch === "," && !inQ) {
      res.push(cur); cur = "";
    } else {
      cur += ch;
    }
  }
  res.push(cur);
  return res;
}

function escapeCsv(s: string): string {
  if (/[",\n]/.test(s)) return `"${s.replace(/"/g, '""')}"`;
  return s;
}

const write = process.argv.includes("--write");
run(write).catch(e => { console.error(e); process.exit(1); });
