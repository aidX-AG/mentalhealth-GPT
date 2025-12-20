# Create Account – Passkey Setup Half-Page
Version: v1.0 – 2025-12-20

## Ziel
Beim Erstellen eines Accounts wird der Passkey-Setup-Flow in einer eigenen Half-Page (links Hero, rechts Form) geführt – konsistent mit unserem SignInPage-Layout und i18n-Setup.

## Beteiligte Komponenten & Pages
- Page (App Router):
  - `app/passkey-setup/page.tsx` (plus locale-copies unter `app/de/...`, `app/fr/...`, `app/es/...`)
- Template:
  - `templates/SignInPage/index.tsx` (Layout: linke Hero-Spalte, rechte Form-Spalte)
- Form:
  - `templates/SignInPage/PasskeyForm.tsx` im Modus `setup` (Default)

## Flow (Setup)
1. User startet Create Account Prozess (Email/Flow-Entscheid im UI).
2. Passkey Setup Half-Page wird geladen.
3. `PasskeyForm` startet Setup:
   - `POST /auth/webauthn/cross-device/start` mit Body `{ email, flow: "register" }`
4. UI zeigt QR-Code und pollt Status:
   - `GET /auth/webauthn/cross-device/status?session_id=...`
5. Bei `completed`:
   - serverseitige Session wird via `POST /auth/webauthn/cross-device/consume` ausgestellt (Cookie).
6. Weiterleitung zurück (z.B. `/sign-in` oder definierter Next Step).

## Security / Health-Grade Guarantees
- Session Cookie ist HTTP-only (nicht im JS lesbar).
- DB speichert nur Hash (Session token niemals im Klartext).
- Polling hat Guard/Timeout (kein Endlos-Loop).
- Consume stellt Cookie deterministisch aus (kein „scheinbar logged-in“ Zustand).

## i18n / Locale
- Alle Texte in `sign-in` / `passkey` Namespaces.
- Locale wird über Pfad-Prefix (`/de`, `/fr`, `/es`) oder Default ohne Prefix (`en`) bestimmt.
- Falls Links von dieser Page auf andere Pages gehen: immer locale-aware (Helper nutzen).

## Test-Checkliste
- Setup Page öffnet im richtigen Layout (Hero links, Form rechts).
- QR erscheint.
- Nach erfolgreichem Mobile-Confirm: Session ist aktiv (`GET /auth/me` => authenticated true).
- Keine Sprache springt auf Englisch zurück, wenn auf /de /fr /es gestartet.
