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

