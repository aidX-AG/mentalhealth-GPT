#!/usr/bin/env bash
set -euo pipefail

# Root des Frontend-Repos (dort, wo locales/ liegt)
REPO_ROOT="$(cd "$(dirname "${BASH_SOURCE[0]}")/.." && pwd)"
cd "$REPO_ROOT"

# Voraussetzung: jq
if ! command -v jq >/dev/null 2>&1; then
  echo "❌ jq fehlt. macOS: brew install jq | Ubuntu: sudo apt-get install -y jq"
  exit 1
fi

# Sprachen
LANGS=("en" "de" "fr")

# Modul-Liste aus bestehenden EN-Modul-Dateien ableiten (ohne readarray)
MODULES=()
# Wir sammeln die Basenamen (ohne .json), sortiert und unik
for f in $(find locales/en -maxdepth 1 -type f -name '*.json' -print | sort); do
  base="$(basename "$f")"
  mod="${base%.json}"
  # nur einmal hinzufügen
  already=0
  for m in "${MODULES[@]:-}"; do
    [ "$m" = "$mod" ] && already=1 && break
  done
  [ $already -eq 0 ] && MODULES+=("$mod")
done

# Zielstruktur
mkdir -p public/locales/en public/locales/de public/locales/fr

# Hilfsfunktion: Keys per Präfix aus großem JSON ziehen und {"string": "..."} → "..." normalisieren
extract_module () {
  local big_json="$1"  # z. B. locales/de.json
  local module="$2"    # z. B. pricing
  jq --arg p "${module}." '
    to_entries
    | map(
        select(.key | startswith($p))
        | { (.key):
              ( .value
                | if type=="object" and has("string") then .string else . end
              )
          }
      )
    | add // {}
  ' "$big_json"
}

# Hilfsfunktion: alles, was NICHT mit irgendeinem Modulpräfix beginnt → common.json
extract_common () {
  local big_json="$1"; shift
  local modules=( "$@" )
  # Regex: ^(mod1|mod2|...)\.
  # (Module-Namen sind Dateinamen-Basen, i.d.R. ohne Regex-Sonderzeichen)
  local joined=""
  for m in "${modules[@]}"; do
    if [ -z "$joined" ]; then joined="$m"; else joined="$joined|$m"; fi
  done
  local pattern="^(${joined})\\."
  jq --arg re "$pattern" '
    to_entries
    | map(
        select( (.key | test($re)) | not )
        | { (.key):
              ( .value
                | if type=="object" and has("string") then .string else . end
              )
          }
      )
    | add // {}
  ' "$big_json"
}

echo "➡️  EN-Basisdateien kopieren…"
rsync -a locales/en/ public/locales/en/

# EN: aus großem en.json modulare Keys mergen, Rest nach common.json
if [ -f locales/en.json ]; then
  echo "➡️  EN: Merge aus locales/en.json in Module & common.json…"
  for m in "${MODULES[@]}"; do
    dst="public/locales/en/${m}.json"
    tmp="$(mktemp)"
    extract_module "locales/en.json" "$m" > "$tmp"
    if [ -s "$tmp" ]; then
      if [ -f "$dst" ]; then
        # zusammenführen (Moduldatei + Extrakt)
        jq -s 'add' "$dst" "$tmp" > "${dst}.merged"
        mv "${dst}.merged" "$dst"
      else
        mv "$tmp" "$dst"
      fi
    else
      rm -f "$tmp"
    fi
  done
  # EN: common.json (alles ohne Modulpräfix)
  extract_common "locales/en.json" "${MODULES[@]}" > "public/locales/en/common.json"
fi

echo "➡️  DE/FR aus großen JSONs erzeugen…"
for lang in de fr; do
  big="locales/${lang}.json"
  if [ ! -f "$big" ]; then
    echo "ℹ️  Überspringe ${lang}: $big fehlt"
    continue
  fi
  mkdir -p "public/locales/${lang}"
  for m in "${MODULES[@]}"; do
    extract_module "$big" "$m" > "public/locales/${lang}/${m}.json"
  done
  extract_common "$big" "${MODULES[@]}" > "public/locales/${lang}/common.json"
done

echo "✅ Fertig: public/locales/{en,de,fr}/* (+ common.json je Sprache)"
