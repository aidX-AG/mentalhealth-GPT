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

echo "🖼   Kopiere public/ Inhalte (Images, Worker, Locales) …"
mkdir -p "$DEST"
if [[ -d "public" ]]; then
  rsync -av public/ "$DEST/"
fi

echo "🧹  Deploye Next.js Build zu Nginx …"
rsync -av   --exclude='images/**'   --exclude='uploads/**'   --exclude='.well-known/**'   out/ "$DEST/"

echo "✅  DEV DEPLOYMENT FERTIG! App ist live mit dev Version"
