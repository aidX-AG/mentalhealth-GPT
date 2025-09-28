Der Fehler hat nichts mit .po zu tun — npm parst zuerst deine package.json. Die ist gerade kein gültiges JSON (fehlendes Komma o.ä.). Deshalb bricht npm run … ab.

Fix: package.json reparieren (Scripts-Block)

Mach’s genau so:

nano package.json

Ersetze nur den "scripts"-Block durch diesen gültigen JSON-Block (achte auf alle Kommas):

"scripts": {
  "dev": "next dev",
  "start": "next start",
  "build": "next build",
  "prebuild": "npm run i18n:convert:all",
  "lint": "next lint",
  "optimize-images": "bash ./scripts/optimize-images.sh",

  "i18n:po:code": "ts-node --compiler-options '{\"module\":\"commonjs\"}' scripts/extract-po-from-code.ts",
  "i18n:po:json": "node scripts/json-to-pot.cjs",
  "i18n:po:all": "npm run i18n:po:code && npm run i18n:po:json",

  "i18n:merge:core": "msgmerge --update --backup=off locales/de_CH/core.po locales/pot/core.pot && msgmerge --update --backup=off locales/fr_CH/core.po locales/pot/core.pot",
  "i18n:merge:namespaces": "bash scripts/merge-pot-to-po.sh",
  "i18n:merge:all": "npm run i18n:merge:core && npm run i18n:merge:namespaces",

  "i18n:convert:en": "node scripts/po-to-json.cjs en",
  "i18n:convert:de": "node scripts/po-to-json.cjs de_CH",
  "i18n:convert:fr": "node scripts/po-to-json.cjs fr_CH",
  "i18n:convert:all": "npm run i18n:convert:en && npm run i18n:convert:de && npm run i18n:convert:fr",

  "i18n:codemod:dry": "TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/i18n-codemod.ts",
  "i18n:codemod:write": "TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/i18n-codemod.ts --write",
  "i18n:codemod:one": "TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/i18n-codemod.ts --write --include",
  "i18n:mapping:build": "TS_NODE_PROJECT=tsconfig.scripts.json ts-node scripts/i18n-build-mapping.ts"
}

Speichern, schließen.

Jetzt erneut:

npm run i18n:convert:all


# i18n Workflow (Gettext → Weblate → JSON)

## Begriffe
- **POT** (`locales/pot/*.pot`): Vorlagen aus EN-Quellen (msgid = EN-Text, Kommentar `#. key: …`).
- **PO** (`locales/de_CH|fr_CH/*.po`): Übersetzungen pro Sprache.
- **JSON** (`locales/en.json`, `locales/de.json`, `locales/fr.json` + `locales/*/*.json`): Build-Output für die App.

## Regelbetrieb bei EN-Textänderungen
1. **POT neu erzeugen**
   ```bash
   npm run i18n:po:code && npm run i18n:po:json

	2.	POT → PO mergen

npm run i18n:merge:all
# Falls core geändert wurde, ist das im Merge-Script enthalten.


	3.	Commit & Push

git add locales/pot locales/de_CH locales/fr_CH
git commit -m "i18n: sync PO with updated POT"
git push origin dev


	4.	Weblate
	•	Repository aktualisieren
	•	Übersetzen, dann Push zurück nach GitHub
	5.	PO → JSON bauen

npm run i18n:convert:all
git add locales/en.json locales/de.json locales/fr.json locales/en locales/de locales/fr
git commit -m "i18n: rebuild JSON from PO"
git push origin dev



Build-Hooks
	•	prebuild ruft automatisch i18n:convert:all auf.

Tools
	•	scripts/po-to-json.cjs: baut Core (Text→Text) & Namespaces (Key→Text).
	•	scripts/merge-pot-to-po.sh: mergen aller Namespaces für de_CH & fr_CH.

