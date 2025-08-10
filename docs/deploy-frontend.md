
Kurz wichtig: In deiner Umgebung liegt der NGINX-Docroot unter /opt/docker/nginx/html (nicht /opt/frontend). Ich habe den Pfad im Dokument unten korrigiert.

1) Datei anlegen/ändern

cd ~/git/frontend-git
mkdir -p docs
nano docs/deploy-frontend.md

2) Inhalt einfügen (korrigierte Version)

# 🚀 Deployment-Dokumentation: Frontend (Next.js)

## 📦 Projekt: mentalhealthGPT  
Ziel: Bereitstellung des statischen HTML-Frontends via NGINX auf dem Proxy-Server.

---

## 🔧 Voraussetzungen

- GitHub-Repository: `aidX-AG/mentalhealth-GPT`
- Proxy-Server mit NGINX (Docker), **Zielverzeichnis: `/opt/docker/nginx/html/`**
- SSH-Zugang vom Mac auf den Proxy
- Auf dem Proxy: `git`, `node`, `npm` installiert (Host, **nicht** im Container)
- Frontend-Repo auf dem Proxy: `~/git/frontend-git/`

---

## ⚙️ Manueller Deploy-Prozess

### 1) Lokale Entwicklung
```bash
git checkout dev
# Änderungen machen
git commit -am "Feature XYZ"
git push origin dev

2) Merge & Push nach Produktion (main)

git checkout main
git merge dev
git push origin main

3) Auf den Proxy verbinden

ssh ubuntu@proxy-server

4) Deployment starten

cd ~/git/frontend-git
./deploy-frontend.sh


⸻

🛠️ deploy-frontend.sh

#!/bin/bash
set -e
cd ~/git/frontend-git || exit 1
git pull origin main
npm install
npm run build
sudo rm -rf /opt/docker/nginx/html/*
sudo cp -r ./out/* /opt/docker/nginx/html/
echo "✅ Deployment abgeschlossen."

Es wird nur der Inhalt aus out/ nach /opt/docker/nginx/html/ kopiert, nicht der Ordner selbst.

⸻

📂 Struktur (Proxy-Server)

/opt/docker/nginx/html/    # NGINX Root (statischer Build)
/home/ubuntu/git/frontend-git/  # Git-Klon (Branch: main)


⸻

❌ Bitte NICHT
	•	Keine Code-Änderungen direkt auf dem Proxy committen/pushen
	•	Nicht mit anderen Branches als main deployen

⸻

✅ Optionales Housekeeping
	•	npm install -g npm@latest
	•	npm audit fix (oder vorsichtig --force)
	•	Deploy-Skript nur via SSH ausführen

⸻

Stand:10.  August 2025 – Maintainer: Peter Wildhaber

⸻


alte Version:

# 🚀 Deployment-Dokumentation: Frontend (Next.js)

## 📦 Projekt: mentalhealthGPT  
Ziel: Bereitstellung des statischen HTML-Frontends via NGINX auf dem Proxy-Server.

---

## 🔧 Voraussetzungen

- GitHub-Repository: `aidX-AG/mentalhealth-GPT`
- Proxy-Server mit NGINX (Docker), Zielverzeichnis: `/opt/frontend/`
- SSH-Zugang vom Mac auf den Proxy
- Auf dem Proxy: `git`, `node`, `npm` installiert (on metal, **nicht im Container**)
- Frontend liegt auf dem Proxy unter `~/git/frontend-git/`

---

## ⚙️ Manueller Deploy-Prozess

### 1. Lokale Entwicklung auf dem Mac

```bash
git checkout dev     # oder ein Feature-Branch
# Änderungen machen
git commit -am "Neue Funktion XY"
git push origin dev

2. Merge und Push in den Produktions-Branch main

git checkout main
git merge dev
git push origin main


⸻

3. Proxy-Server verbinden

ssh ubuntu@proxy-server


⸻

4. Deployment starten

cd ~/git/frontend-git
./deploy-frontend.sh


⸻

🛠️ deploy-frontend.sh

#!/bin/bash
cd ~/git/frontend-git || exit
git pull origin main
npm install
npm run build
sudo rm -rf /opt/frontend/*
sudo cp -r ./out/* /opt/frontend/

🔁 Es wird nur der Inhalt des out/-Ordners nach /opt/frontend/ kopiert, nicht der Ordner selbst.

⸻

📂 Dateistruktur

proxy-server/
└── /opt/frontend/         # NGINX Root (statische HTML-Dateien)
└── ~/git/frontend-git/    # Git-Klon von GitHub (nur main!)


⸻

❌ Wichtig: Was du NICHT tun solltest
	•	Niemals auf dem Proxy Änderungen am Code machen oder git push verwenden
	•	Niemals mit einem anderen Branch als main arbeiten

⸻

✅ Optional: Sicherheit & Cleanup
	•	NPM aktualisieren: npm install -g npm@latest
	•	Audit prüfen: npm audit fix --force
	•	Deploy-Skript nur über SSH ausführen – nicht automatisch triggern

⸻

🧩 Nächste Schritte (später automatisieren)
	•	GitHub → Webhook oder Actions → Proxy triggern
	•	Auto-Sync nach Push auf main
	•	Lokalisierung → regelmäßig neu bauen

⸻

Stand: August 2025 – Maintainer: Peter Wildhaber

---

### 🔧 So fügst du es ein

1. Öffne auf dem Proxy oder Mac dein Projektverzeichnis:
```bash
cd ~/git/frontend-git/docs
nano deploy-frontend.md

	2.	Inhalt einkopieren → CTRL+O, Enter, dann CTRL+X zum Beenden

⸻

