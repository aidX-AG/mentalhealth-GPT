#!/usr/bin/env bash
# =============================================================================
# 📜 scripts/extract-locales.sh
# -----------------------------------------------------------------------------
# [i18n-extractor] v1.0.1 — 2025-09-12
#
# Zweck:
#   - Extrahiert die 15 "use client"-Spezialfälle nach:
#       public/locales/en/<namespace>.json
#   - Baut zusätzlich das Sammelbecken (alles andere) in:
#       locales/en.json  (ohne die 15 Spezial-Namespaces)
#
# Nutzung:
#   chmod +x scripts/extract-locales.sh
#   scripts/extract-locales.sh
#
# Abhängigkeiten:
#   - Bash >= 4
#   - Node.js (>= 18)
#   - scripts/extract-locales.js (JS-Extractor)
# -----------------------------------------------------------------------------
set -euo pipefail

# Bash-Glob-Verhalten: ** aktivieren; leere Globs verwerfen
shopt -s globstar nullglob

# Repo-Root ermitteln
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

EXTRACT="node scripts/extract-locales.js"

# Vorbedingungen prüfen
if ! command -v node >/dev/null 2>&1; then
  echo "❌ Node.js nicht gefunden"
  exit 1
fi
if [[ ! -f scripts/extract-locales.js ]]; then
  echo "❌ scripts/extract-locales.js fehlt"
  exit 1
fi

# Zielverzeichnisse sicherstellen
mkdir -p public/locales/en
mkdir -p locales

# -----------------------------------------------------------------------------
# 15 Spezial-Namespaces: links = Namespace (Dateiname), rechts = Quell-Globs
# Hinweis: Mehrere Globs durch Leerzeichen trennen.
# -----------------------------------------------------------------------------
declare -A NSMAP=(
  [applications]="app/applications/**/*.tsx"
  [audio-transcription]="app/audio-transcription/**/*.tsx"
  [checkout]="app/checkout/**/*.tsx"
  [diagnosis-support]="app/diagnosis-support/**/*.tsx"
  [documentation-reports]="app/documentation-reports/**/*.tsx"
  [generation-socials-post]="app/generation-socials-post/**/*.tsx"
  # Home: deckt die Root-Startseite (app/page.tsx) und ggf. Unterordner ab
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

  # Globs expandieren (durch nullglob können leere Treffer entstehen)
  # shellcheck disable=SC2086
  expanded=( $globs )

  if ((${#expanded[@]} == 0)); then
    echo "   • $ns → übersprungen (keine Source-Dateien gefunden)"
    continue
  fi

  echo "   • $ns → public/locales/en/${ns}.json"
  # bewusst unquoted, damit Shell-Globs expandieren
  # shellcheck disable=SC2086
  $EXTRACT $globs --ns "$ns" --out "public/locales/en/${ns}.json"
done

# -----------------------------------------------------------------------------
# Sammelbecken: alles außerhalb der 15 Spezial-Namespaces
# -----------------------------------------------------------------------------
EXCLUDE_NS=$(IFS=, ; echo "${!NSMAP[*]}")

echo "➡️  Extract: Sammelbecken → locales/en.json (ohne Spezial-Namespaces)"
$EXTRACT app/**/{page,layout}.tsx \
  --out locales/en.json \
  --exclude-ns "$EXCLUDE_NS"

echo "✅ Fertig: 15 Spezial-JSONs + locales/en.json aktualisiert."
# =============================================================================
