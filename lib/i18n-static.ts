// lib/i18n-static.ts
import fs from "node:fs";
import path from "node:path";

export type Messages = Record<string, string>;

export function loadMessages(locale: string): Messages {
  try {
    const file = path.join(process.cwd(), "locales", `${locale}.json`);
    return JSON.parse(fs.readFileSync(file, "utf8")) as Messages;
  } catch {
    return {};
  }
}

export function makeT(messages: Messages) {
  return (key: string) => messages[key] ?? key;
}
