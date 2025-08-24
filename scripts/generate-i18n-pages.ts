/* scripts/generate-i18n-pages.ts
 * Liest scripts/i18n-routes.json als MAP:
 *   { "UpdatesAndFaqPage": "updates-and-faq", ... }
 * ODER optional:
 *   { "UpdatesAndFaqPage": { "route": "updates-and-faq", "props": { ... } } }
 *
 * Erzeugt Server-Pages je Locale:
 *  - EN: app/<route>/page.tsx   (route "" => app/page.tsx)
 *  - DE: app/de/<route>/page.tsx (route "" => app/de/page.tsx)
 *  - FR: app/fr/<route>/page.tsx (route "" => app/fr/page.tsx)
 *
 * Verwendet unseren fs‑Loader "@/lib/i18n-static" und macht t() lokal.
 *
 * Run:
 *   TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/generate-i18n-pages.ts
 *   TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/generate-i18n-pages.ts --force
 */
import fs from "node:fs";
import path from "node:path";

type RoutesMapValue =
  | string
  | {
      route: string;
      props?: Record<string, any>;
    };

type RoutesMap = Record<string, RoutesMapValue>;

const FORCE = process.argv.includes("--force");
const cwd = process.cwd();
const routesFile = path.join(cwd, "scripts", "i18n-routes.json");

if (!fs.existsSync(routesFile)) {
  console.error(`❌ scripts/i18n-routes.json nicht gefunden: ${routesFile}`);
  process.exit(1);
}

const LOCALES = Array.from(
  new Set(
    (process.env.TX_AVAILABLE_LOCALES || "en,de,fr")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean)
      .concat("en") // sicherstellen, dass en dabei ist
  )
);

let routesRaw: unknown;
try {
  routesRaw = JSON.parse(fs.readFileSync(routesFile, "utf8"));
} catch (e) {
  console.error("❌ Konnte scripts/i18n-routes.json nicht parsen:", e);
  process.exit(1);
}

if (
  !routesRaw ||
  typeof routesRaw !== "object" ||
  Array.isArray(routesRaw)
) {
  console.error("❌ scripts/i18n-routes.json muss ein Objekt (Map) sein.");
  process.exit(1);
}
const routes: RoutesMap = routesRaw as RoutesMap;

function serializePropValue(v: any, localeVar = "t"): string {
  if (typeof v === "string") return `${localeVar}(${JSON.stringify(v)})`;
  if (Array.isArray(v)) {
    if (v.every((x) => typeof x === "string")) {
      return `[${v.map((x) => `${localeVar}(${JSON.stringify(x)})`).join(", ")}]`;
    }
    return JSON.stringify(v);
  }
  if (v === null || ["number", "boolean"].includes(typeof v)) {
    return JSON.stringify(v);
  }
  if (v && typeof v === "object") {
    const entries = Object.entries(v).map(([k, val]) => {
      if (typeof val === "string")
        return `${JSON.stringify(k)}: ${localeVar}(${JSON.stringify(val)})`;
      if (Array.isArray(val) && val.every((x) => typeof x === "string")) {
        return `${JSON.stringify(k)}: [${val
          .map((x) => `${localeVar}(${JSON.stringify(x)})`)
          .join(", ")}]`;
      }
      return `${JSON.stringify(k)}: ${JSON.stringify(val)}`;
    });
    return `{ ${entries.join(", ")} }`;
  }
  return JSON.stringify(v);
}

function makePageSource(
  templateName: string,
  locale: string,
  props: Record<string, any>
): string {
  const templateImport = `@/templates/${templateName}`;
  const serializedProps =
    Object.keys(props).length === 0
      ? ""
      : " " +
        Object.entries(props)
          .map(([k, v]) => `${k}={${serializePropValue(v)}}`)
          .join(" ");
  return `import PageView from "${templateImport}";
import { loadMessages, makeT } from "@/lib/i18n-static";

export default function Page() {
  const messages = loadMessages(${JSON.stringify(locale)});
  const t = makeT(messages);
  return <PageView${serializedProps} />;
}
`;
}

function ensureDir(p: string) {
  fs.mkdirSync(p, { recursive: true });
}

function writeIfMissing(file: string, content: string) {
  if (fs.existsSync(file) && !FORCE) {
    console.log(`↪︎ SKIP (existiert): ${path.relative(cwd, file)}`);
    return;
  }
  fs.writeFileSync(file, content, "utf8");
  console.log(`✓ WRITE: ${path.relative(cwd, file)}`);
}

for (const [templateName, value] of Object.entries(routes)) {
  const route = typeof value === "string" ? value : value?.route;
  const props = typeof value === "string" ? {} : value?.props || {};

  if (typeof route !== "string") {
    console.warn(
      `⚠︎ Ungültiger Eintrag für "${templateName}": ${JSON.stringify(value)}`
    );
    continue;
  }

  for (const loc of LOCALES) {
    const isEN = loc === "en";
    const rootDir = isEN ? path.join(cwd, "app") : path.join(cwd, "app", loc);
    const dir =
      route === "" ? rootDir : path.join(rootDir, route.replace(/^\/+/, ""));
    ensureDir(dir);
    const file = path.join(dir, "page.tsx");
    const src = makePageSource(templateName, isEN ? "en" : loc, props);
    writeIfMissing(file, src);
  }
}

console.log("✅ Fertig: Server-Pages für alle Routen/Locales generiert.");
