#!/bin/bash
set -euo pipefail

# Pfade anpassen falls nötig
REPO="$HOME/git/frontend-git"
DEST="/opt/docker/nginx/html"

echo "➡️  Wechsle ins Repo …"
cd "$REPO"

echo "⬇️  Pull von origin/main (Fast-Forward only) …"
git fetch origin
git checkout main
git pull --ff-only origin main

echo "📦  npm ci …"
npm ci

# PO -> JSON passiert in prebuild; danach regulärer Build …
echo "⚙️  npm run build …"
npm run build

# ./out ist nach next build vorhanden (output: 'export'), kein 'npm run export' nötig

# Sicherheitscheck: gibt es ./out?
if [[ ! -d "out" ]]; then
  echo "❌ ./out wurde nicht erzeugt (prüfe next.config.mjs: output: 'export'). Abbruch."
  exit 1
fi

echo "🧹  Zielordner vorbereiten (alte Dateien entfernen, aber Bilder behalten) …"
mkdir -p "$DEST"
rsync -av --delete \
  --exclude='images/**' \
  --exclude='uploads/**' \
  --exclude='.well-known/**' \
  out/ "$DEST/"

# Optional: statische Medien aus dem Repo ins Ziel mergen (nur neue/aktualisierte Dateien)
if [[ -d "public" ]]; then
  echo "🖼   public/ → $DEST/ mergen (ohne Löschen) …"
  rsync -av public/ "$DEST/"
fi

# Cachebusting-Marker schreiben (hilfreich für Diagnosen)
if command -v git >/dev/null 2>&1; then
  GITHASH="$(git rev-parse --short HEAD)"
  date +"%Y-%m-%dT%H:%M:%S%z  $GITHASH" > "$DEST/.deployment-hash"
fi

# Nginx neu laden (falls via systemd)
if command -v systemctl >/dev/null 2>&1; then
  echo "🔁  Nginx reload …"
  sudo systemctl reload nginx || true
fi

echo "✅  Deployment fertig: $DEST (Build + Export von $(basename "$REPO"))"
