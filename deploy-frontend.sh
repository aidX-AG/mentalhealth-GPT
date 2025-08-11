#!/bin/bash
# === FRONTEND DEPLOYMENT SCRIPT (safe & incremental) ===
# Ziel: /opt/docker/nginx/html

set -euo pipefail

REPO="$HOME/git/frontend-git"
DEST="/opt/docker/nginx/html"

echo "➡️  Gehe ins Repo …"
cd "$REPO"

echo "⬇️  Pull main …"
git pull --ff-only origin main

echo "📦 npm ci …"
# Reproduzierbare Builds aus package-lock; schneller & sicherer als 'npm install'
npm ci

echo "⚙️  Build …"
npm run build

# Next.js (App Router) schreibt bei 'output: export' nach ./out.
# Falls es mal fehlschlägt, hier hart abbrechen, statt leeres Verzeichnis zu syncen.
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
# --delete nur für den Build-Ordner, damit alte _next-Assets & HTML wegkommen.
# --checksum vermeidet unnötige Kopien bei gleicher Datei.
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
