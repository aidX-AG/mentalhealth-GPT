# Logout – Health-Grade Session Revocation
Version: v1.0 – 2025-12-20

## Ziel
Logout muss:
- User auf der aktuellen Seite lassen (kein Redirect-Zwang)
- Session serverseitig revoken (DB) und Cookie löschen
- UI zuverlässig auf „logged out“ wechseln über `/auth/me` als Source of Truth
- idempotent sein (mehrfach klicken ist OK)

---

## Backend (node-git)

### Routes
- `POST /auth/logout`
- `GET /auth/me`

### Session-Modell
- Cookie: `mhgpt_session` (HTTP-only, Secure, SameSite=strict)
- DB: `user_sessions` mit `token_hash`, `expires_at`, `revoked_at`, `revoke_reason`, `ip`, `user_agent`

### Single Source of Truth (DRY)
- Hashing: `hashSessionToken(rawToken)` in `session.js`
- Cookie-Options: `buildSessionCookieOptions()` in `session.js`
- Revoke + Cookie clear: `revokeSessionAndClearCookie({ req, res, reason })` in `session.js`

### Ablauf `POST /auth/logout`
1. `revokeSessionAndClearCookie`:
   - liest Cookie
   - löscht Cookie robust (mit/ohne Domain)
   - revoket Session in DB (setzt `revoked_at`, `revoke_reason`)
2. Response:
   - `204 No Content`

---

## Frontend (frontend repo)

### Logout Client
- `lib/auth/logout.ts`
- `POST /auth/logout` mit `credentials: "include"` (Cookie muss mit)

### UI Wiring
- `components/RightSidebar/Profile/ProfileLoggedIn.tsx`
- Klick „Log out“:
  1. `await logout()`
  2. `refresh()` aus `useAuth()` (triggert `GET /auth/me`)
- Kein Redirect → Seite bleibt stabil
- UI wechselt anhand `/auth/me` Antwort auf LoggedOut-Komponente

---

## Security / Health-Grade Guarantees
- Kein Client-Auth-Fake-State, nur `/auth/me` entscheidet
- DB speichert nur Hash, niemals Klartext-Token
- Logout ist idempotent: ohne Cookie -> 204
- Forensic: revoke_reason + revoked_at (optional ip/ua beim create)

---

## Test-Checkliste
- Nach Login: `/auth/me` => authenticated true
- Klick Logout:
  - `/auth/logout` => 204
  - `/auth/me` => 401 authenticated false
  - UI zeigt LoggedOut
- Kein Redirect, kein Page-Reload nötig (nur UI refresh)
