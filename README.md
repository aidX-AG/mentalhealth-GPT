alles klar — hier ist eine kleine, knackige README-Ergänzung inkl. genauer nano-Befehle, die erklärt, wie du bei Namespace-Textänderungen die CSV-Mapping-Datei pflegst und den End-to-End-Flow durchziehst.

⸻

1) README-Datei (neu anlegen oder Abschnitt ergänzen)

# neue Datei anlegen (oder öffnen, falls schon vorhanden)
nano README-i18n-namespaces.md

Füge den folgenden Inhalt ein, speichere mit CTRL+O, Enter, beende mit CTRL+X:

# Namespace i18n – Workflow mit CSV-Mapping

Dieser Abschnitt beschreibt, wie **Textänderungen in Namespaces** (z. B. `checkout`, `pricing`, …) sauber durch unseren i18n-Prozess laufen.

## Warum eine CSV-Mapping-Datei?

Für die 16 Namespace-Seiten (jeweils `app/<namespace>/page.tsx`) verwenden wir eine Zuordnung **Englisch-Text → stabiler Key** in  
`scripts/mapping/i18n-key-mapping.csv`.

- So bleiben Keys stabil, auch wenn sich die englischen Texte ändern.
- Der Extractor nutzt **zuerst** die CSV (Match über den Text), **dann** ggf. `locales/en/<ns>.json` als Fallback.  
- Wenn beides nicht passt, erzeugt der Extractor einen **Auto-Key** (`<ns>.auto.<hash>`). Das wollen wir möglichst vermeiden ⇒ CSV pflegen!

## CSV-Format

- Datei: `scripts/mapping/i18n-key-mapping.csv`
- **Semikolon**-getrennt (kein Komma!), **Header muss so heißen**:

namespace;newKeySuggestion;text

- Wenn der Text Anführungszeichen enthält, schreib ihn in **doppelte Quotes** und **doppelte** die inneren Anführungszeichen:

checkout;checkout.terms.accept;“By clicking ““Start Institution plan””, you agree to …”

### Normalisierung (Matching-Regeln)

Das Skript matcht **nur fürs Finden** leicht normalisiert:
- CRLF → LF, NBSP → Space, mehrfacher Whitespace → 1 Space
- „Smart quotes“ → `'` bzw. `"`
- En/Em-Dash → `-`
- **Der eigentliche msgid im .pot bleibt 1:1 wie im Code.**

## Typische Fälle & Beispiele

### A) Du änderst nur den englischen Text, der **Key** soll gleich bleiben

1. Passe den Text in `app/<ns>/page.tsx` an.
2. Öffne die CSV und **aktualisiere die `text`-Spalte** zur gleichen `newKeySuggestion`.

 Beispiel (vorher `Billed now:` → nachher `Billed now`):
 ```csv
 checkout;checkout.notes.billed-now;Billed now:

wird zu

checkout;checkout.notes.billed-now;Billed now

	3.	Extrahiere neu für diesen Namespace:

node scripts/extract-po-namespaces.cjs app/checkout/page.tsx

Erwartung: Kein Auto-Key-Log für diese Zeile.

	4.	(Wenn nötig) Merge POT → PO (für de_CH/fr_CH):

npm run i18n:merge:namespaces


	5.	Konvertiere .po → .json:

npm run i18n:convert:all


	6.	Commit & Push:

git add app/checkout/page.tsx scripts/mapping/i18n-key-mapping.csv locales/pot/checkout.pot locales/*/checkout.po locales/*/checkout.json
git commit -m "i18n(checkout): update EN text, keep key via CSV; re-extract, merge, convert"
git push origin dev



B) Neuer Text, neuer Key im Namespace
	1.	Text in app/<ns>/page.tsx einfügen.
	2.	Neue Zeile in CSV hinzufügen:

pricing;pricing.sections.yearly;Yearly billing


	3.	Extrahieren:

node scripts/extract-po-namespaces.cjs app/pricing/page.tsx


	4.	Merge/Convert wie oben.

C) Du siehst beim Extrahieren Warnungen wie

⚠️ Kein Key gefunden … → generiert: <ns>.auto.xxxxxxxx
	•	Das heißt: Kein CSV-Match und kein Treffer in locales/en/.json.
	•	Lösung: Den exakten EN-Text in CSV eintragen (korrekt quoten!) oder die EN-<ns>.json ergänzen, dann erneut extrahieren.

Befehlsübersicht (Schnellablauf)

# 1) Text im Namespace-Code ändern
nano app/checkout/page.tsx

# 2) CSV aktualisieren (gleicher Key, neuer Text)
nano scripts/mapping/i18n-key-mapping.csv

# 3) Re-extract nur für betroffene Namespaces
node scripts/extract-po-namespaces.cjs app/checkout/page.tsx app/pricing/page.tsx

# 4) POT → PO mergen (de_CH, fr_CH) – falls lokal nötig
npm run i18n:merge:namespaces

# 5) PO → JSON konvertieren
npm run i18n:convert:all

# 6) Commit & Push
git add .
git commit -m "i18n(ns): update texts + CSV; re-extract/merge/convert"
git push origin dev

Hinweise zu Weblate
	•	Weblate arbeitet mit locales/*/<ns>.po.
	•	Unsere .pot (unter locales/pot/*.pot) sind die Templates.
	•	Entweder du mergen & pushst POT/PO selbst (lokal, wie oben), oder Weblate holt sich Änderungen, wenn es so konfiguriert ist.
	•	Nach Übersetzungen: pullen, npm run i18n:convert:all, dann build/deploy.

⸻


---

### 2) (Optional) Mini-Reminder an die CSV selbst anhängen

Wenn du möchstest, packen wir die Regeln als Kopf-Kommentar direkt in die CSV (kommentiert, stört nicht):

```bash
nano scripts/mapping/i18n-key-mapping.csv

Ganz oben (vor der Header-Zeile) nicht einfügen, weil CSV-Parser die Header-Zeile erwartet. Stattdessen ganz unten einen Kommentarblock anhängen (nur zur Doku — wenn du’s lieber oben willst, leg daneben i18n-key-mapping.README.txt an):

# HINWEIS:
# - Trennzeichen ist Semikolon (;)
# - Header: namespace;newKeySuggestion;text
# - Anführungszeichen im Text → Feld in "..." setzen und "" im Inneren doppeln:
#   "By clicking ""Start Institution plan"", you agree to ..."
# - Matching normalisiert nur fürs Finden (Zeilenumbrüche, NBSP, Smart Quotes, Dashes).
# - msgid im .pot bleibt exakt wie im Code.

Speichern (CTRL+O, Enter) und schließen (CTRL+X).

⸻

Wenn du willst, übernehme ich dieselbe Doku auch noch in euer Haupt-README.md.


*******

This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.



Alles klar 👍 — so gehst du vor:

⸻


## 🌐 Internationalisierung (i18n) Workflow

Dieses Projekt verwendet **Gettext (.po/.pot)** und JSON-Dateien für Übersetzungen.

### Übersicht
- `locales/pot/*.pot` → Template-Dateien (nur Quelle, keine Übersetzungen).
- `locales/<lang>_CH/*.po` → Übersetzungsdateien pro Sprache (Deutsch, Französisch).
- `scripts/json-to-pot.cjs` → Erstellt `.pot`-Dateien aus den englischen JSON-Namespace-Dateien.
- `scripts/merge-pot-to-po.sh` → Führt neue `.pot`-Änderungen in bestehende `.po`-Dateien ein.
- `scripts/po-to-json.cjs` → Konvertiert `.po` zurück in JSON für das Frontend.

### Workflow

1. **Texte ändern oder hinzufügen**  
   - Quelltexte liegen in `locales/en/*.json` (Namespaces) und im Code (`_("…")`).

2. **Neue POT-Dateien generieren**  
   ```bash
   npm run i18n:po:json

	3.	POT → PO zusammenführen (z. B. nach Änderungen an Texten)

bash scripts/merge-pot-to-po.sh


	4.	Übersetzungen in Weblate durchführen
	•	Weblate arbeitet mit den .po-Dateien (z. B. locales/de_CH/*.po).
	5.	PO → JSON konvertieren (für das Frontend)

npm run i18n:convert:all


	6.	Resultat
	•	locales/de.json, locales/fr.json → Core-Übersetzungen
	•	locales/de/*.json, locales/fr/*.json → 15 Namespace-Dateien

Hinweise
	•	Core.po = Text-to-Key (msgid ist Text, msgstr ist Übersetzung).
	•	Namespaces.po (applications, checkout, …) = Key-to-Text (msgid ist Text, Key kommt als Kommentar #. key: …).
	•	Bei Änderungen IMMER zuerst POT aktualisieren, dann mergen, dann PO nach JSON konvertieren.

---

### 4. Speichern und schließen  
- `CTRL+O` → Enter → `CTRL+X`  

---

