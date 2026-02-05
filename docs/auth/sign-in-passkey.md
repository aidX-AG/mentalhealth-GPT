# Sign In – Passkey Sign-in Half-Page
Version: v1.0 – 2025-12-20

## Ziel
Der Passkey Sign-in QR-Code Flow ist auf einer separaten Half-Page ausgelagert (nicht mehr „unter dem Button“ auf der Sign-in Form). Layout bleibt identisch zum Passkey Setup.

## Beteiligte Komponenten & Pages
- Sign-in Form (Email/Password + Button):
  - `templates/SignInPage/Form/SignIn/index.tsx`
- Passkey Sign-in Page:
  - `app/passkey-signin/page.tsx`
  - Locale-copies:
    - `app/de/passkey-signin/page.tsx`
    - `app/fr/passkey-signin/page.tsx`
    - `app/es/passkey-signin/page.tsx`
- Passkey UI/Logic:
  - `templates/SignInPage/PasskeyForm.tsx` im Modus `signin`
- Layout:
  - `templates/SignInPage/index.tsx`

## Flow (Signin)
1. User ist auf Sign-in Form (Email/Password Felder).
2. Klick auf „Sign in with passkey“:
   - navigiert locale-aware auf:
     - `${localePrefix}/passkey-signin?email=<encoded>`
3. Passkey Sign-in Page rendert:
   - SignInPage Layout (Hero links) + `PasskeyForm mode="signin" email=<from query>`
4. Autostart:
   - `PasskeyForm` startet (bei valid Email) automatisch:
     - `POST /auth/webauthn/cross-device/login/start` mit `{ email }`
5. QR Code wird angezeigt; Status Polling:
   - `GET /auth/webauthn/cross-device/status?session_id=...`
6. Bei `completed`:
   - `POST /auth/webauthn/cross-device/consume` (credentials include) → Cookie wird gesetzt
7. Nach Success:
   - Redirect/Navigation zu `/` (oder definierter Zielpfad)

## QR „Create new QR-Code“
- Der „Create new QR-Code“ Button erscheint nur, wenn QR abläuft oder Status in error/timeout endet.
- Normalfall: QR wird automatisch gestartet und angezeigt, ohne zusätzliche Klicks.

## i18n / Locale Konsistenz
- Sign-in Form muss locale-aware navigieren:
  - Link zur Passkey Sign-in Page immer mit Prefix `/de|/fr|/es` oder ohne Prefix (en).
- Empfohlen: zentraler Helper `getLocalePrefixFromPathname(pathname)` (siehe Sprach-Helper Doc).

## Test-Checkliste
- Von `/de/sign-in` → Button führt zu `/de/passkey-signin?...`
- Texte bleiben in DE, kein Fallback auf EN.
- QR erscheint automatisch (wenn Email gültig).
- Nach mobile confirm: `/auth/me` => authenticated true und UI zeigt logged-in state.
