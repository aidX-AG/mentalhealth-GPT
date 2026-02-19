#!/bin/bash
set -euo pipefail

REPO="/home/ubuntu/git/frontend-git"
DEST="/opt/docker/nginx/html"

echo "🚀 DEV DEPLOYMENT - TEST VERSION"

echo "➡️  Wechsle ins Repo …"
cd "$REPO"

echo "⬇️  Sicherstellen dass dev aktuell ist …"
git checkout dev
git fetch origin
git fetch github 2>/dev/null || true
git reset --hard origin/dev

echo "📦  npm install …"
npm install

echo "⚙️  npm run build …"
npm run build

if [[ ! -d "out" ]]; then
  echo "❌ Build fehlgeschlagen: ./out existiert nicht"
  exit 1
fi

# 1) public/ zuerst (Images, PDF Worker, Locales) — vor --delete, damit sie nie gelöscht werden
echo "🖼   Kopiere public/ Inhalte (Images, Worker, Locales) …"
mkdir -p "$DEST"
if [[ -d "public" ]]; then
  rsync -av public/ "$DEST/"
fi

# 2) Next.js Build mit --delete (räumt alte _next/static Chunks auf)
# Exit-Code 23 = einige alte Dateien konnten nicht gelöscht werden (Permission Denied
# auf bereits servierten _next/static Cache-Dateien). Unkritisch — Build ist korrekt.
echo "🧹  Deploye Next.js Build zu Nginx (mit Cleanup alter Chunks) …"
set +e
rsync -av --delete \
  --exclude='images/**' \
  --exclude='uploads/**' \
  --exclude='.well-known/**' \
  out/ "$DEST/"
RSYNC_EXIT=$?
set -e

if [ "$RSYNC_EXIT" -ne 0 ] && [ "$RSYNC_EXIT" -ne 23 ]; then
  echo "❌ rsync fehlgeschlagen mit Exit-Code $RSYNC_EXIT"
  exit 1
fi
if [ "$RSYNC_EXIT" -eq 23 ]; then
  echo "⚠️  rsync code 23: Einige alte _next/static Dateien konnten nicht gelöscht werden (Permission Denied). Unkritisch."
fi

echo "✅  DEV DEPLOYMENT FERTIG! App ist live mit dev Version"
