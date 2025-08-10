#!/bin/bash

# === FRONTEND DEPLOYMENT SCRIPT ===
# Ort: ~/git/frontend-git/deploy-frontend.sh
# Ausführung: direkt auf der Proxy-VM

set -e  # Stoppe bei Fehlern

echo "➡️  Wechsle ins Projektverzeichnis..."
cd ~/git/frontend-git || exit 1

echo "⬇️  Hole neueste Änderungen von GitHub..."
git pull origin main

echo "📦 Installiere Abhängigkeiten (npm install)..."
npm install

echo "⚙️  Baue Frontend (npm run build)..."
npm run build

echo "🧹 Lösche alten HTML-Build im Zielverzeichnis..."
sudo rm -rf /opt/docker/nginx/html/*

echo "📁 Kopiere neuen Build nach /opt/docker/nginx/html/..."
sudo cp -r ./out/* /opt/docker/nginx/html/

echo "✅ Deployment abgeschlossen!"
