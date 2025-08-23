#!/bin/bash
# === FRONTEND DEPLOYMENT SCRIPT (safe & incremental) ===
# Ziel: /opt/docker/nginx/html

set -euo pipefail

REPO="$HOME/git/frontend-git"
DEST="/opt/docker/nginx/html"

echo "➡️  Gehe ins Repo …"
cd "$REPO"

# ── ENV aus .env.local laden (für TRANSIFEX_TOKEN/SECRET, etc.)
if [ -f ".env.local" ]; then
  # nur Zeilen KEY=VALUE ohne Kommentare exportieren
  export $(grep -E '^[A-Z0-9_]+=' .env.local | xargs) || true
fi

# Optional: sicherstellen, dass TX‑Token vorhanden sind (falls build -> tx:pull nutzt)
if grep -q '"tx:pull"' package.json; then
  : "${TRANSIFEX_TOKEN:?TRANSIFEX_TOKEN fehlt (in .env.local oder Environment setzen)}"
  : "${TRANSIFEX_SECRET:?TRANSIFEX_SECRET fehlt (in .env.local oder Environment setzen)}"
fi

echo "⬇️  Pull main …"
git pull --ff-only origin main

echo "📦 npm ci …"
npm ci --no-audit --no-fund

echo "⚙️  Build …"
npm run build

# Next.js (App Router) mit `output: 'export'` schreibt nach ./out.
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

echo "🗣️  Sync Locales (inkrementell, ohne delete) …"
# ⚠️ Bei dir liegen die TX-Dateien unter ./locales/*.json (nicht in public/)
if [ -d "$REPO/locales" ]; then
  # Als JSON-Files direkt neben die Site legen (vom Client lesbar via nginx-Route /locales/)
  sudo rsync -av --checksum --human-readable "$REPO/locales/en.json" "$DEST/locales/en/" 2>/dev/null || true
  sudo rsync -av --checksum --human-readable "$REPO/locales/de.json" "$DEST/locales/de/" 2>/dev/null || true
  sudo rsync -av --checksum --human-readable "$REPO/locales/fr.json" "$DEST/locales/fr/" 2>/dev/null || true
else
  echo "ℹ️  Ordner ./locales nicht gefunden – Überspringe."
fi

echo "🖼️  Sync Images (inkrementell, ohne delete) …"
if [ -d "$REPO/public/images" ]; then
  sudo rsync -av --checksum --human-readable "$REPO/public/images/" "$DEST/images/"
else
  echo "ℹ️  Keine public/images gefunden – Überspringe."
fi

echo "✅ Deployment fertig."
