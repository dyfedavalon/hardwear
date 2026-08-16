#!/usr/bin/env bash
# ---------------------------------------------------------------
# HARDWEAR — localise site imagery
#
# The pages currently hot-link their images to the CDNs they were
# generated on. Run this once, from the site folder, to download
# every image into assets/img/ and rewrite the HTML to point at
# the local copies.
#
#   chmod +x fetch-assets.sh && ./fetch-assets.sh
#
# Requires: curl, sed. Safe to re-run.
# ---------------------------------------------------------------
set -euo pipefail
cd "$(dirname "$0")"
mkdir -p assets/img

CDN="https://galaxy-prod.tlcdn.com/gen"

# filename|remote-url
MAP=(
  "hero-cap-three-quarter.jpg|$CDN/74e05934f26046cc8a9870d31926a064.jpeg"
  "cap-side-profile.jpg|$CDN/2dee852231ee42b8a367af9437c11900.jpeg"
  "cap-rear-closure.jpg|$CDN/515afcce8a9d4953bc5e7bb64463a14c.jpeg"
  "colour-hamilton-brown.jpg|$CDN/64601f0a96804138ae2f953454245d97.jpeg"
  "colour-moss.jpg|$CDN/5b79b5119ec244ecb987b8aa7d0b2901.jpeg"
  "colour-black.jpg|$CDN/911d46447d1c439591585476057b8a29.jpeg"
  "colour-bone.jpg|$CDN/ba9fcd5c50d54aaab413f16b3256656f.jpeg"
  "colour-hi-vis-amber.jpg|$CDN/dd50ca57487d440fa23907e0ea75c221.jpeg"
  "fabric-macro.jpg|$CDN/ed653d7b227943b48abc9621dc7118db.jpeg"
  "detail-ventilation.jpg|$CDN/7a2e8466d11a4830adf0041e3f4a268f.jpeg"
  "detail-sweatband.jpg|$CDN/2226800bd91a4e99b8dde8b2799cb6b2.jpeg"
  "lifestyle-teen.jpg|$CDN/25978c977bd74ba598c577e787a0577e.jpeg"
  "lifestyle-tradesman.jpg|$CDN/703804fd0f9b447ba0e352e9a1e56de1.jpeg"
  "workshop-bench.jpg|$CDN/415662c1c9e241cf8245c2876ddf77d2.jpeg"
  "town.jpg|$CDN/9291ef31a2ba409092ab286f92fc9d4a.jpeg"
  "trade-boxed-caps.jpg|$CDN/7e8c2a6aadf44776a005c589f6778e6c.jpeg"
  "trade-crew.jpg|$CDN/36e36db4819548dc9b38458d964224b0.jpeg"
  "ashley-roberts.jpg|$CDN/e84ad736bf7e4665bf11b572ddc36546.jpeg"
)

echo "Downloading ${#MAP[@]} images into assets/img/ …"
FAILED=0
for entry in "${MAP[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  if curl -fsSL --connect-timeout 20 --max-time 180 -o "assets/img/$name" "$url"; then
    printf '  ok   %s\n' "$name"
  else
    printf '  FAIL %s  (%s)\n' "$name" "$url"
    FAILED=$((FAILED+1))
  fi
done

if [ "$FAILED" -gt 0 ]; then
  echo
  echo "$FAILED download(s) failed — HTML left untouched so nothing breaks."
  echo "Re-run, or save the missing file into assets/img/ by hand and run again."
  exit 1
fi

echo
echo "Rewriting image paths in the HTML …"
for entry in "${MAP[@]}"; do
  name="${entry%%|*}"
  url="${entry#*|}"
  esc_url=$(printf '%s' "$url" | sed -e 's/[&/\]/\\&/g')
  esc_new=$(printf '%s' "assets/img/$name" | sed -e 's/[&/\]/\\&/g')
  for page in index.html cap.html founder.html reviews.html trade.html; do
    [ -f "$page" ] && sed -i.bak "s|$esc_url|$esc_new|g" "$page"
  done
done
rm -f ./*.html.bak

echo "Done. All imagery is now local — the site works fully offline."
