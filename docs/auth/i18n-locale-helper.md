# i18n Locale Helper – Stable Locale Prefix Routing
Version: v1.0 – 2025-12-20

## Problem
In App Router-Setups mit optionalen Locale-Prefixes (`/de`, `/fr`, `/es`) kommt es leicht zu Inkonsistenzen:
- Links ohne Prefix springen auf Default (EN)
- Query-basierte Pages verlieren Locale-Kontext
- UX wirkt „sprunghaft“

## Ziel
Ein helper stellt sicher:
- Navigation bleibt in der gewählten Sprache (Prefix bleibt erhalten)
- Default (EN) bleibt ohne Prefix
- Links werden konsistent gebaut, ohne Copy/Paste-Lokik in jeder Komponente

## Empfohlenes Verhalten
- Wenn URL mit `/de|/fr|/es` startet → Prefix beibehalten
- Sonst Prefix = "" (EN)

## Beispiel-Helper (Konzept)
- Input: `pathname` (z.B. von `usePathname()`)
- Output: `localePrefix` ("", "/de", "/fr", "/es")

## Einsatz-Orte (typisch)
- Sign-in Form → Link auf Passkey Sign-in Half-Page
- Create Account Flow → Links auf Setup Pages
- Mobile Auth Pages / Cross-Device Flows
- Jede neue Page, die eine locale-sensitive Navigation macht

## Health-Grade Guidance
- Kein „hardcode start with de“
- Prefix immer aus URL ableiten oder aus zentraler Spracheinstellung, wenn vorhanden
- Bei Sprachenwechsel in Settings: idealerweise globale Source of Truth (z.B. gespeicherte Preference + Router update).
  - Wenn Settings-Sprachenwechsel existiert: helper + zentrale Spracheinstellung müssen zusammenarbeiten (Policy: Settings > URL).

## Test-Checkliste
- Start auf `/de/...` → alle Links bleiben `/de/...`
- Start auf `/...` (EN) → Links ohne Prefix
- Direct entry auf `/fr/passkey-signin?...` bleibt FR
