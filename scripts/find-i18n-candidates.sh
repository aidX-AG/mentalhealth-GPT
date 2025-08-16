#!/usr/bin/env bash
set -euo pipefail

# ins Repo-Root wechseln (vom scripts/ Ordner aus)
cd "$(dirname "$0")/.."

OUT="scripts/i18n-candidates-ui.txt"
: > "$OUT"   # Datei neu/leer

# Zielordner: nur die, die wirklich existieren
TARGETS=()
for d in components mocks constants; do
  [ -d "$d" ] && TARGETS+=("$d")
done
if [ ${#TARGETS[@]} -eq 0 ]; then
  echo "Keine Zielordner (components/mocks/constants) gefunden." >&2
  exit 1
fi

# Gemeinsame Grep-Optionen
OPTS=( -RIn --exclude-dir=node_modules --exclude-dir=out
       --include='*.ts' --include='*.tsx' --include='*.js' --include='*.jsx' )

echo "🔎 Suche 1/5: Objekt-Keys (title/label/...)" >&2
grep "${OPTS[@]}" \
  -E '(^|[[:space:]{,])((title|label|subtitle|content|placeholder|name|heading|button|btn|tooltip|alt|ariaLabel|description)\s*:\s*["`])' \
  "${TARGETS[@]}" | tee -a "$OUT" >/dev/null

echo "🔎 Suche 2/5: JSX-Textknoten (Text direkt zwischen >...<)" >&2
grep "${OPTS[@]}" \
  -E '>\s*[A-Za-zÄÖÜäöüÉÈçàâêîôûÀÂÊÎÔÛ0-9][^<{}]{2,}<\s*' \
  "${TARGETS[@]}" | tee -a "$OUT" >/dev/null

echo "🔎 Suche 3/5: Häufige Phrasen (Buttons/CTAs etc.)" >&2
grep "${OPTS[@]}" \
  -E '(Features, fixes|Learn more|Load more|Read more|Sign in|Sign out|Download|Save changes|Members|Settings|Notifications|Password|Profile|Share|Clear chat history|New chat|Invite|Edit profile|Delete account|Device|Devices|Voice|Export)' \
  "${TARGETS[@]}" | tee -a "$OUT" >/dev/null

echo "🔎 Suche 4/5: Content-Arrays (items:[...], content:\"...\", title:\"...\")" >&2
grep "${OPTS[@]}" \
  -E '(items:\s*\[|const\s+items\s*=|updates:\s*\[|content:\s*["`]|title:\s*["`])' \
  "${TARGETS[@]}" | tee -a "$OUT" >/dev/null

echo "🔎 Suche 5/5: Direkte i18next.t()-Nutzung (zur Einordnung)" >&2
grep "${OPTS[@]}" \
  -E 'i18next\.t\(' \
  "${TARGETS[@]}" | tee -a "$OUT" >/dev/null

# Deduplizieren
sort -u "$OUT" -o "$OUT"

# Kurzreport
echo "----------------------------------------------"
wc -l "$OUT"
sed -n '1,60p' "$OUT"
echo "➡ volle Liste: $OUT"
