import fs from "node:fs";
import path from "node:path";

export type Messages = Record<string, string>;

// Transifex liefert Werte als plain string ODER als { string: "…" }
type RawValue = string | { string?: string } | undefined;
type RawMessages = Record<string, RawValue>;

function normalize(raw: RawMessages): Messages {
  const out: Messages = {};
  for (const [k, v] of Object.entries(raw || {})) {
    if (typeof v === "string") {
      out[k] = v;
    } else if (v && typeof v === "object" && typeof v.string === "string") {
      out[k] = v.string;
    } else {
      out[k] = k; // Fallback: Key selbst zurückgeben
    }
  }
  return out;
}

/** Lädt /locales/<locale>.json und normalisiert das TX-Format */
export function loadMessages(locale: string): Messages {
  try {
    const file = path.join(process.cwd(), "locales", `${locale}.json`);
    const raw = JSON.parse(fs.readFileSync(file, "utf8")) as RawMessages;
    return normalize(raw);
  } catch {
    return {};
  }
}

/** Einfaches t() auf Basis des geladenen Dictionaries */
export function makeT(messages: Messages) {
  return (key: string): string => messages[key] ?? key;
}
