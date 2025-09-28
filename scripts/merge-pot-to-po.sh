#!/usr/bin/env bash
set -euo pipefail

# Sprachen, die aus Weblate kommen
LANGS=("de_CH" "fr_CH")

# Alle Namespaces außer "core"
NAMESPACES=(
  "applications"
  "audio-transcription"
  "checkout"
  "common"
  "diagnosis-support"
  "documentation-reports"
  "generation-socials-post"
  "home"
  "pricing"
  "sign-in"
  "supervision-training"
  "thanks"
  "therapy-support"
  "updates-and-faq"
  "video-analysis"
)

ROOT="$(pwd)"
POT_DIR="$ROOT/locales/pot"

echo "🔁 Merging updated POT → PO (ohne core)..."
for ns in "${NAMESPACES[@]}"; do
  POT_FILE="$POT_DIR/$ns.pot"
  if [[ ! -f "$POT_FILE" ]]; then
    echo "⚠️  POT fehlt, überspringe: $POT_FILE"
    continue
  fi
  for lang in "${LANGS[@]}"; do
    PO_FILE="$ROOT/locales/$lang/$ns.po"
    if [[ ! -f "$PO_FILE" ]]; then
      echo "⚠️  PO fehlt, überspringe: $PO_FILE"
      continue
    fi
    echo "→ $lang/$ns: msgmerge --update"
    # --backup=off: keine .po~ Backups
    # (Optional: --no-fuzzy-matching entfernen, wenn du Fuzzy behalten willst)
    msgmerge --update --backup=off "$PO_FILE" "$POT_FILE"
  done
done

echo "✅ Fertig: POT → PO zusammengeführt (Namespaces). core.po bleibt unverändert."
