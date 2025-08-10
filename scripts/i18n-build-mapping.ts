import * as fs from "fs";
import * as path from "path";

const LOCALES_DIR = path.join(process.cwd(), "locales", "en");
const OUT_CSV = path.join(process.cwd(), "i18n-key-mapping.csv");

// Heuristiken: technische Prefixe -> schönere Gruppen
const COMMON_MAP: Record<string, string> = {
  "button_": "common.buttons.",
  "copytoclipboard_": "common.actions.",
  "fieldlabel_": "common.labels.",
  "fieldplaceholder_": "common.placeholders.",
  "selectlabel_": "common.labels.",
  "selecttitle_": "common.labels.",
  "imagealt_": "common.alt.",
  "sliderrangetitle_": "common.controls.",
  "notify_": "common.notify.",
  "node_": "common.badges.",
  "fragment_": "common.fragments.",
  "div_cancel_": "common.buttons.cancel", // Spezialfall
  "div_add_list_": "common.buttons.addList",
  "div_add_chat_list_": "common.headings.addChatList",
};

function suggest(ns: string, key: string, value: string): string {
  // Nur für 'common.json' sehr aggressiv normalisieren:
  if (ns === "common") {
    for (const pref of Object.keys(COMMON_MAP)) {
      if (key.startsWith(pref)) {
        const tail = key.slice(pref.length)
          .replace(/^\d+_?/, "")
          .replace(/_+\d+$/, "")
          .replace(/_+/g, "-");
        const base = COMMON_MAP[pref].endsWith(".") ? COMMON_MAP[pref] + tail : COMMON_MAP[pref];
        return base.replace(/\.$/, "");
      }
    }
    // Fallback: common.misc.*
    return "common.misc." + key
      .replace(/_+\d+$/, "")
      .replace(/_+/g, "-");
  }

  // Für seiten-spezifische Namespaces: grob clustern
  const groups = [
    { test: /^div_/, prefix: `${ns}.sections.` },
    { test: /^(p_|answer_)/, prefix: `${ns}.text.` },
    { test: /^(chat|chattitle)_/, prefix: `${ns}.chat.` },
    { test: /^(inputplaceholder_|inputmaskplaceholder_)/, prefix: `${ns}.form.` },
    { test: /^node_/, prefix: `${ns}.badges.` },
    { test: /^fragment_/, prefix: `${ns}.fragments.` },
  ];
  for (const g of groups) {
    if (g.test.test(key)) {
      const tail = key.replace(/^([a-z]+_)/, "")
        .replace(/_+\d+$/, "")
        .replace(/_+/g, "-");
      return g.prefix + tail;
    }
  }
  // letzter Fallback
  return `${ns}.misc.` + key.replace(/_+\d+$/, "").replace(/_+/g, "-");
}

function main() {
  const files = fs.readdirSync(LOCALES_DIR).filter(f => f.endsWith(".json"));
  const rows: string[] = [];
  rows.push(["namespace","oldKey","newKeySuggestion","text"].join(","));

  for (const file of files) {
    const ns = path.basename(file, ".json");
    const full = path.join(LOCALES_DIR, file);
    const json = JSON.parse(fs.readFileSync(full, "utf8") || "{}");

    for (const [k, v] of Object.entries<string>(json)) {
      const suggestion = suggest(ns, k, v);
      rows.push([ns, k, suggestion, JSON.stringify(v).slice(1,-1)].join(","));
    }
  }
  fs.writeFileSync(OUT_CSV, rows.join("\n"));
  console.log(`✅ Mapping-Vorlage geschrieben: ${OUT_CSV}`);
}

main();
