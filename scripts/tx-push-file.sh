#!/usr/bin/env bash
# scripts/tx-push-file.sh
# Zweck: GENAU EINE Datei verarbeiten:
#  1) t("…")-Keys extrahieren
#  2) in locales/en.json mergen (neue Keys als "key": "key")
#  3) locales/en.json per Transifex REST API pushen (KEYVALUEJSON)
#
# Benötigt Umgebungsvariablen (werden aus .env/local ODER .env.local geladen):
#   TX_TOKEN oder TRANSIFEX_TOKEN   → dein API Token
#   TX_ORG                          → z.B. aidX-AG
#   TX_PROJECT                      → z.B. mentalhealth-gpt
#   TX_RESOURCE                     → z.B. frontend

set -euo pipefail

FILE="${1:-}"
if [ -z "${FILE}" ]; then
  echo "Usage: scripts/tx-push-file.sh <path/to/file.tsx>"
  exit 1
fi
if [ ! -f "${FILE}" ]; then
  echo "❌ File not found: ${FILE}"
  exit 1
fi

# 0) Env laden
if [ -f ".env/local" ]; then
  set -a; . ./.env/local; set +a
elif [ -f ".env.local" ]; then
  set -a; . ./.env.local; set +a
fi

# Token normalisieren
: "${TX_TOKEN:=${TRANSIFEX_TOKEN:-}}"
: "${TX_ORG:?❌ TX_ORG missing (e.g. aidX-AG)}"
: "${TX_PROJECT:?❌ TX_PROJECT missing (e.g. mentalhealth-gpt)}"
: "${TX_RESOURCE:?❌ TX_RESOURCE missing (e.g. frontend)}"

if [ -z "${TX_TOKEN}" ]; then
  echo "❌ Missing TX_TOKEN (or TRANSIFEX_TOKEN) in env"
  exit 1
fi

EN_JSON="locales/en.json"
if [ ! -f "${EN_JSON}" ]; then
  echo "{}" > "${EN_JSON}"
fi

TMP_KEYS="$(mktemp -t txkeys.XXXXXX.json)"

echo "🔎 Extracting t(\"…\") keys from ${FILE}"
# Mini-Extractor (JS-RegEx) ➜ schreibt ein String-Array nach ${TMP_KEYS}
node - <<'NODE' "${FILE}" "${TMP_KEYS}"
const fs=require('fs');
const srcFile=process.argv[2];
const outFile=process.argv[3];
const src=fs.readFileSync(srcFile,'utf8');
// findet t("…") / t('…') / t(`…`)
const re=/t\(\s*["'`]([^"'`]+)["'`]\s*\)/g;
const keys=[];
let m;
while((m=re.exec(src))!==null){ keys.push(m[1]); }
fs.writeFileSync(outFile, JSON.stringify(keys,null,2));
console.log(`→ Found ${keys.length} key(s)`);
NODE

echo "🧩 Merging keys into ${EN_JSON}"
node - <<'NODE' "${EN_JSON}" "${TMP_KEYS}"
const fs=require('fs');
const dstFile=process.argv[2];
const keysFile=process.argv[3];
const en=JSON.parse(fs.readFileSync(dstFile,'utf8'));
const keys=JSON.parse(fs.readFileSync(keysFile,'utf8'));
let added=0;
for(const k of keys){ if(!(k in en)){ en[k]=k; added++; } }
fs.writeFileSync(dstFile, JSON.stringify(en,null,2)+'\n');
console.log(`→ Added ${added} new key(s)`);
NODE

RESOURCE_ID="o:${TX_ORG}:p:${TX_PROJECT}:r:${TX_RESOURCE}"
API="https://rest.api.transifex.com/resource_strings_async_uploads"

echo "⬆️  Pushing ${EN_JSON} to Transifex: ${TX_ORG}/${TX_PROJECT}/${TX_RESOURCE}"
RESP=$(curl -sS -X POST "${API}" \
  -H "Authorization: Bearer ${TX_TOKEN}" \
  -H "Content-Type: application/vnd.api+json" \
  -d @- <<EOF
{
  "data": {
    "type": "resource_strings_async_uploads",
    "attributes": {
      "content": $(cat "${EN_JSON}"),
      "content_encoding": "text",
      "content_format": "KEYVALUEJSON",
      "replace_edited_strings": false,
      "detect_icu": false
    },
    "relationships": {
      "resource": {
        "data": {
          "type": "resources",
          "id": "${RESOURCE_ID}"
        }
      }
    }
  }
}
EOF
)

if echo "${RESP}" | grep -q '"type":"resource_strings_async_uploads"'; then
  echo "✅ Push accepted by Transifex (async)."
else
  echo "❌ Push failed. Response:"
  echo "${RESP}"
  exit 1
fi
