#!/bin/bash
set -euo pipefail

REPO="$HOME/git/frontend-git"
DEST="/opt/docker/nginx/html"

echo "➡️  Gehe ins Repo …"
cd "$REPO"

# ⬅️ NEU: TRANSIFEX_* aus .env.local ins Environment laden
export $(grep -E '^(TRANSIFEX_TOKEN|TRANSIFEX_SECRET)=' .env.local | xargs)

echo "⬇️  Pull main …"
git pull --ff-only origin main

echo "📦 npm ci …"
npm ci

echo "⚙️  Build (inkl. tx:pull) …"
npm run build   # package.json ruft intern `tx:pull` auf

# Build-Output prüfen
if [ ! -d "$REPO/out" ]; then
  echo "❌ Build-Ausgabe fehlt: $REPO/out existiert nicht."
  exit 1
fi

echo "📁 Stelle Zielstruktur sicher …"
sudo mkdir -p \
  "$DEST" \
  "$DEST/locales" \
  "$DEST/images"

echo "🚀 Sync Build (out/ → html/) mit --delete …"
sudo rsync -av --delete --checksum --human-readable "$REPO/out/" "$DEST/"

echo "🗣️  Sync Locales (inkrementell) …"
if [ -d "$REPO/locales" ]; then
  sudo rsync -av --checksum --human-readable \
    --include="*.json" --exclude="*" \
    "$REPO/locales/" "$DEST/locales/"

  # optionale Aliase (falls nur fr_CH/de_CH geliefert werden)
  [ -f "$DEST/locales/de_CH.json" ] && sudo cp -f "$DEST/locales/de_CH.json" "$DEST/locales/de.json" || true
  [ -f "$DEST/locales/fr_CH.json" ] && sudo cp -f "$DEST/locales/fr_CH.json" "$DEST/locales/fr.json" || true
else
  echo "ℹ️  Keine locales/ gefunden – Überspringe."
fi

echo "🖼️  Sync Images (inkrementell) …"
if [ -d "$REPO/public/images" ]; then
  sudo rsync -av --checksum --human-readable "$REPO/public/images/" "$DEST/images/"
else
  echo "ℹ️  Keine public/images gefunden – Überspringe."
fi

echo "✅ Deployment fertig."
