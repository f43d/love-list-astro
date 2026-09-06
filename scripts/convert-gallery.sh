#!/usr/bin/env bash
# scripts/convert-gallery.sh
#
# Batch resize + convert photos to the site's gallery spec:
#   - WebP
#   - long edge 1600 px (landscape OR portrait; aspect preserved)
#   - quality 82 (range 80-85)
#
# Output files are named slistNN.webp ("s" = script-made), sequential in
# the order the input folder was scanned. When you later assign one to a
# bucket-list item in /settings/ (e.g. slist01 -> item 22), rename the
# file to list22.webp and record the mapping in data/gallery.env.
#
# Run on macOS (needs sips, built in) + cwebp (brew install webp).
#
# Usage:
#   ./scripts/convert-gallery.sh <input-folder> [output-folder] [quality]
#
# Examples:
#   ./scripts/convert-gallery.sh ~/Desktop/photos
#   ./scripts/convert-gallery.sh ~/Desktop/photos ~/Desktop/webp 85
#
# Notes:
#   - sips reads JPEG/PNG/TIFF/HEIC natively. iPhone DNG (raw) is NOT
#     readable by sips — export DNGs to JPEG in Photos/Lightroom first,
#     then run this script over the exported JPEGs.
#   - Long edge 1600 preserves each photo's own aspect ratio. The grid
#     crops to 4:3 via object-fit: cover; the lightbox shows the full
#     frame — so don't pre-crop.
#   - Quality: 82 is the default sweet spot. Raise to 85 only if a photo
#     shows banding; lower toward 80 for big repo savings.

set -euo pipefail

INPUT_DIR="${1:?Usage: $0 <input-folder> [output-folder] [quality]}"
OUTPUT_DIR="${2:-$(pwd)/slist-out}"
QUALITY="${3:-82}"

# Sanity checks
if ! command -v sips >/dev/null 2>&1; then
  echo "error: sips not found — this script is for macOS." >&2
  exit 1
fi
if ! command -v cwebp >/dev/null 2>&1; then
  echo "error: cwebp not found. Install with: brew install webp" >&2
  exit 1
fi

# Validate quality stays in the sensible band.
if [ "$QUALITY" -lt 80 ] || [ "$QUALITY" -gt 85 ]; then
  echo "warning: quality $QUALITY is outside the recommended 80-85 band." >&2
fi

mkdir -p "$OUTPUT_DIR"

# Collect input images (sips-readable formats). DNG excluded on purpose.
exts='jpg jpeg png tif tiff heic HEIC gif bmp'
mapfile -t files < <(
  for ext in $exts; do
    find "$INPUT_DIR" -maxdepth 1 -type f -iname "*.$ext" 2>/dev/null
  done | sort -u
)

if [ "${#files[@]}" -eq 0 ]; then
  echo "error: no JPEG/PNG/TIFF/HEIC images found in $INPUT_DIR" >&2
  exit 1
fi

echo "Converting ${#files[@]} image(s) → WebP @ $QUALITY, long edge 1600px, into: $OUTPUT_DIR"
echo ""

count=0
for src in "${files[@]}"; do
  count=$((count + 1))
  out="$OUTPUT_DIR/slist$(printf '%02d' "$count").webp"

  # Resize: -Z scales so the LONGEST side becomes 1600, keeping aspect.
  # Then pipe through sips to a temp PNG, then encode to WebP.
  tmp="$OUTPUT_DIR/.tmp-$count.png"
  if sips -Z 1600 -s format png "$src" --out "$tmp" >/dev/null 2>&1; then
    cwebp -quiet -q "$QUALITY" "$tmp" -o "$out"
    rm -f "$tmp"
    echo "  slist$(printf '%02d' "$count").webp  <-  $(basename "$src")"
  else
    rm -f "$tmp"
    echo "  !! skip $(basename "$src") (unreadable by sips — DNG? already exported?)" >&2
  fi
done

echo ""
echo "Done. Files are in: $OUTPUT_DIR"
echo "Next: rename slistNN.webp -> list<item-number>.webp when you assign a photo"
echo "in /settings/, and add/update the row in data/gallery.env."
