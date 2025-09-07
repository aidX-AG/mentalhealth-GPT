#!/bin/bash
# scripts/optimize-images.sh
# Erzeugt responsive Varianten (JPG/PNG + WebP) in public/images.
# Optional: Übergib einen Dateinamen, um NUR dieses Bild zu verarbeiten.

set -euo pipefail

IMG_DIR="public/images"
WIDTHS=(480 960 1440)
QUALITY=85

echo "📦 Starte Bildoptimierung in: $IMG_DIR"

# convert / cwebp entdecken
if command -v magick >/dev/null 2>&1; then
  CONVERT_BIN="magick convert"
elif command -v convert >/dev/null 2>&1; then
  CONVERT_BIN="convert"
else
  echo "❌ ImageMagick 'convert' nicht gefunden. Installiere: sudo apt-get install -y imagemagick"
  exit 1
fi

if ! command -v cwebp >/dev/null 2>&1; then
  echo "❌ 'cwebp' nicht gefunden. Installiere: sudo apt-get install -y webp"
  exit 1
fi

cd "$(dirname "$0")/.."
cd "$IMG_DIR" || { echo "❌ Ordner $IMG_DIR fehlt"; exit 1; }

process_image() {
  local img="$1"
  local base="${img%.*}"
  local ext="${img##*.}"

  # bereits generierte Varianten überspringen
  if [[ "$img" == *-*w.* ]]; then
    echo "⚠ Überspringe bereits verarbeitete Datei: $img"
    return
  fi

  for width in "${WIDTHS[@]}"; do
    # Zielpfade
    local out_img="${base}-${width}w.${ext}"
    local out_webp="${base}-${width}w.webp"

    if [ ! -f "$out_img" ]; then
      echo "➤ Erzeuge ${width}px: $img → $out_img"
      $CONVERT_BIN "$img" -resize "${width}x" -quality $QUALITY "$out_img"
    fi

    if [ ! -f "$out_webp" ]; then
      echo "➤ Erzeuge WebP ${width}px: $img → $out_webp"
      cwebp -q $QUALITY "$img" -resize $width 0 -o "$out_webp" >/dev/null
    fi
  done
}

# Optionaler Dateiname?
if [ $# -ge 1 ]; then
  FILE="$1"
  if [ ! -f "$FILE" ]; then
    echo "❌ Datei nicht gefunden: $FILE (erwarte Pfad relativ zu $IMG_DIR)"
    exit 1
  fi
  process_image "$FILE"
else
  # kompletter Ordner
  shopt -s nullglob
  for img in *.jpg *.jpeg *.png; do
    process_image "$img"
  done
fi

echo "✅ Fertig. Varianten erzeugt: ${WIDTHS[*]}px (Original + WebP)"
