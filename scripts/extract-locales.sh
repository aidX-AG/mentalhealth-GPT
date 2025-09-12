#!/usr/bin/env bash
# =============================================================================
# 📜 scripts/extract-locales.sh
# -----------------------------------------------------------------------------
# [i18n-extractor] v2.0.0 — 2025-09-12
#
# Zweck:
#   - Orchestriert die Extraktion von i18n-Keys aus .tsx
#   - Erzeugt pro Namespace eine JSON-Datei in public/locales/en/
#   - Baut ein Sammel-JSON locales/en.json (alle Keys ohne Spezial-Namespaces)
#
# Nutzung:
#   chmod +x scripts/extract-locales.sh
#   scripts/extract-locales.sh
# -----------------------------------------------------------------------------
set -euo pipefail
shopt -s globstar nullglob

REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

EXTRACT="node scripts/extract-locales-core.js"

# Vorbedingungen prüfen
command -v node >/dev/null 2>&1 || { echo "❌ Node.js nicht gefunden"; exit 1; }
[[ -f scripts/extract-locales-core.js ]] || { echo "❌ scripts/extract-locales-core.js fehlt"; exit 1; }

mkdir -p public/locales/en
mkdir -p locales

# -----------------------------------------------------------------------------
# 15 Spezial-Namespaces
# -----------------------------------------------------------------------------
declare -A NSMAP=(
  [applications]="app/applications/**/*.tsx"
  [audio-transcription]="app/audio-transcription/**/*.tsx"
  [checkout]="app/checkout/**/*.tsx"
  [diagnosis-support]="app/diagnosis-support/**/*.tsx"
  [documentation-reports]="app/documentation-reports/**/*.tsx"
  [generation-socials-post]="app/generation-socials-post/**/*.tsx"
  [home]="app/page.tsx app/home/**/*.tsx"
  [pricing]="app/pricing/**/*.tsx"
  [sign-in]="app/sign-in/**/*.tsx"
  [supervision-training]="app/supervision-training/**/*.tsx"
  [thanks]="app/thanks/**/*.tsx"
  [therapy-support]="app/therapy-support/**/*.tsx"
  [updates-and-faq]="app/updates-and-faq/**/*.tsx"
  [video-analysis]="app/video-analysis/**/*.tsx"
  [pagelist]="app/pagelist/**/*.tsx"
)

echo "➡️  Extract: Namespaces → public/locales/en/<ns>.json"
for ns in "${!NSMAP[@]}"; do
  globs=${NSMAP[$ns]}
  expanded=( $globs )

  if ((${#expanded[@]} == 0)); then
    echo "   • $ns → übersprungen (keine Source-Dateien gefunden)"
    continue
  fi

  echo "   • $ns → public/locales/en/${ns}.json"
  $EXTRACT $globs --ns "$ns" --out "public/locales/en/${ns}.json"
done

# -----------------------------------------------------------------------------
# Sammelbecken
# -----------------------------------------------------------------------------
EXCLUDE_NS=$(IFS=, ; echo "${!NSMAP[*]}")
echo "➡️  Extract: Sammelbecken → locales/en.json (ohne Spezial-Namespaces)"

$EXTRACT app/**/{page,layout}.tsx \
  --out locales/en.json \
  --exclude-ns "$EXCLUDE_NS"

echo "✅ Fertig: 15 Spezial-JSONs + locales/en.json aktualisiert."
# =============================================================================
