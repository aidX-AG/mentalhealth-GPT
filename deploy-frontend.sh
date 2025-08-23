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
  "$DEST/locales/en" "$DEST/locales/de" "$DEST/locales/fr" \
  "$DEST/images"

echo "🚀 Sync Build (out/ → html/) mit --delete …"
sudo rsync -av --delete --checksum --human-readable "$REPO/out/" "$DEST/"

echo "🗣️  Sync Locales (inkrementell) …"
# ⬅️ aus $REPO/locales (nicht public/)
if [ -d "$REPO/locales" ]; then
  sudo rsync -av --checksum --human-readable "$REPO/locales/en/" "$DEST/locales/en/" 2>/dev/null || true
  sudo rsync -av --checksum --human-readable "$REPO/locales/de/" "$DEST/locales/de/" 2>/dev/null || true
  sudo rsync -av --checksum --human-readable "$REPO/locales/fr/" "$DEST/locales/fr/" 2>/dev/null || true
  # Fallback für flache Dateien (en.json/de.json/fr.json)
  [ -f "$REPO/locales/en.json" ] && sudo cp -f "$REPO/locales/en.json" "$DEST/locales/en.json"
  [ -f "$REPO/locales/de.json" ] && sudo cp -f "$REPO/locales/de.json" "$DEST/locales/de.json"
  [ -f "$REPO/locales/fr.json" ] && sudo cp -f "$REPO/locales/fr.json" "$DEST/locales/fr.json"
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
