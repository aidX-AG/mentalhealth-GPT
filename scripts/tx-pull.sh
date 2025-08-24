#!/usr/bin/env bash
set -euo pipefail

echo "➡️  Pulling locales from Transifex …"

# Prüfen, ob Token/Secret gesetzt sind
: "${TRANSIFEX_TOKEN:?TRANSIFEX_TOKEN fehlt in der Umgebung}"
: "${TRANSIFEX_SECRET:?TRANSIFEX_SECRET fehlt in der Umgebung}"

# Zielordner
mkdir -p locales

# Nacheinander ziehen (CLI akzeptiert effektiv nur 1 --locale je Aufruf)
for LOCALE in en de_CH fr_CH; do
  echo "   → $LOCALE"
  npx txjs-cli pull \
    --token="$TRANSIFEX_TOKEN" \
    --secret="$TRANSIFEX_SECRET" \
    -f locales/ \
    --locale="$LOCALE"
done

# Aliase setzen (Next/Loader erwarten de.json und fr.json)
[[ -f locales/de_CH.json ]] && cp -f locales/de_CH.json locales/de.json
[[ -f locales/fr_CH.json ]] && cp -f locales/fr_CH.json locales/fr.json

echo "✅ Pulled: en, de_CH, fr_CH"
echo "✅ Aliases: locales/de.json, locales/fr.json bereit"
