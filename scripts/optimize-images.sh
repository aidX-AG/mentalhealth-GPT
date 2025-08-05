#!/bin/bash

set -e

IMG_DIR="public/images"
WIDTHS=(480 960 1440)  # Standard-Größen für responsive Bilder
QUALITY=85             # Qualität für WebP und JPEG

echo "📦 Starte Bildoptimierung in: $IMG_DIR"

cd "$IMG_DIR" || exit 1

process_image() {
  local img=$1
  local base="${img%.*}"
  local ext="${img##*.}"
  
  # Erzeuge responsive Varianten für jede definierte Größe
  for width in "${WIDTHS[@]}"; do
    # JPEG/PNG Varianten
    if [ ! -f "${base}-${width}w.${ext}" ]; then
      echo "➤ Erzeuge ${width}px Variante: $img → ${base}-${width}w.${ext}"
      convert "$img" -resize "${width}x" -quality $QUALITY "${base}-${width}w.${ext}"
    fi
    
    # WebP Varianten
    if [ ! -f "${base}-${width}w.webp" ]; then
      echo "➤ Erzeuge WebP ${width}px: $img → ${base}-${width}w.webp"
      cwebp -q $QUALITY "$img" -resize $width 0 -o "${base}-${width}w.webp"
    fi
  done
}

# Hauptverarbeitung
for img in *.jpg *.jpeg *.png; do
  [ -e "$img" ] || continue  # Skip wenn keine Dateien
  
  # Überspringe bereits verarbeitete Bilder (mit Suffix -*w)
  if [[ $img == *-*w.* ]]; then
    echo "⚠ Überspringe bereits verarbeitetes Bild: $img"
    continue
  fi
  
  process_image "$img"
done

echo "✅ Responsive Bildvarianten wurden erfolgreich erzeugt:"
echo "   - Für jede Größe: ${WIDTHS[*]}px"
echo "   - Formate: Original + WebP"
