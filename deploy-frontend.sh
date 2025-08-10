#!/bin/bash
# === FRONTEND DEPLOYMENT SCRIPT (safe & incremental) ===
# Ziel: /opt/docker/nginx/html

set -euo pipefail

REPO=~/git/frontend-git
DEST=/opt/docker/nginx/html

echo "➡️  Gehe ins Repo …"
cd "$REPO"

echo "⬇️  Pull main …"
git pull origin main

echo "📦 npm ci …"
npm ci

echo "⚙️  Build …"
npm run build

echo "📁 Stelle Zielstruktur sicher …"
sudo mkdir -p "$DEST" \
             "$DEST/locales/en" "$DEST/locales/de" "$DEST/locales/fr" \
             "$DEST/images"

echo "🚀 Sync Build (out/ → html/) mit --delete …"
sudo rsync -av --delete --checksum --human-readable "$REPO/out/" "$DEST/"

echo "🗣️  Sync Locales (inkrementell, ohne delete) …"
if [ -d "$REPO/public/locales" ]; then
  sudo rsync -av --checksum --human-readable "$REPO/public/locales/en/" "$DEST/locales/en/"
  sudo rsync -av --checksum --human-readable "$REPO/public/locales/de/" "$DEST/locales/de/"
  sudo rsync -av --checksum --human-readable "$REPO/public/locales/fr/" "$DEST/locales/fr/"
else
  echo "ℹ️  Keine public/locales gefunden – Überspringe."
fi

echo "🖼️  Sync Images (inkrementell, ohne delete) …"
if [ -d "$REPO/public/images" ]; then
  sudo rsync -av --checksum --human-readable "$REPO/public/images/" "$DEST/images/"
else
  echo "ℹ️  Keine public/images gefunden – Überspringe."
fi

echo "✅ Deployment fertig."
