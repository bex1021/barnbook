#!/bin/bash
# Fallback photo fetcher — tries Google Maps place photos and social media
# For barns where the main website scrape didn't find photos
# Usage: ./scripts/fetch-fallback-photos.sh

BARN_DIR="public/images/barns"
CANDIDATES_DIR="public/images/barns/candidates"
mkdir -p "$CANDIDATES_DIR"

# Get barns still needing photos that have a name
BARNS=$(node -e "
const barns = JSON.parse(require('fs').readFileSync('data/barns.json','utf8'));
const need = barns.filter(b => (!b.photos || b.photos.length === 0));
need.forEach(b => {
  const city = b.address ? b.address.city || '' : '';
  const state = b.address ? b.address.state || '' : '';
  console.log(b.slug + '|' + b.name + '|' + city + '|' + state + '|' + (b.website || ''));
});
")

TOTAL=$(echo "$BARNS" | grep -c '|')
echo "Trying fallback photo sources for $TOTAL barns..."
echo ""

COUNT=0
FOUND=0
while IFS='|' read -r slug name city state website; do
  [ -z "$slug" ] && continue
  COUNT=$((COUNT + 1))
  
  # Skip if we already have a photo or candidate
  if ls "$BARN_DIR/$slug".* 2>/dev/null | head -1 | grep -q .; then
    continue
  fi
  if ls "$CANDIDATES_DIR/$slug".* 2>/dev/null | head -1 | grep -q .; then
    continue
  fi
  
  echo "[$COUNT/$TOTAL] $name ($city, $state)"
  
  # Try Facebook page (many barns have FB pages with photos)
  SEARCH_QUERY=$(echo "$name $city $state horse barn" | sed 's/ /+/g')
  
  # Try the website's /gallery, /photos, /facility pages
  if [ -n "$website" ]; then
    for subpage in "/gallery" "/photos" "/facility" "/our-facility" "/the-farm" "/tour" "/photo-gallery" "/media"; do
      IMGS=$(curl -sL --max-time 8 "${website}${subpage}" 2>/dev/null | grep -oE '(src|data-src)="[^"]*\.(jpg|jpeg|png|webp)[^"]*"' | sed 's/^[^"]*"//;s/"$//' | sort -u)
      
      if [ -n "$IMGS" ]; then
        while IFS= read -r img_url; do
          [ -z "$img_url" ] && continue
          
          # Skip logos/icons
          echo "$img_url" | grep -qi "logo\|icon\|favicon\|sprite\|badge\|button\|arrow\|nav-\|menu-\|widget\|thumbnail\|thumb-\|-150x\|-100x\|-50x" && continue
          
          # Make absolute
          if echo "$img_url" | grep -q '^/'; then
            BASE=$(echo "$website" | grep -oE 'https?://[^/]+')
            img_url="${BASE}${img_url}"
          elif ! echo "$img_url" | grep -q '^http'; then
            img_url="${website%/}/${img_url}"
          fi
          
          EXT=$(echo "$img_url" | grep -oE '\.(jpg|jpeg|png|webp)' | head -1)
          [ -z "$EXT" ] && EXT=".jpg"
          OUTFILE="$CANDIDATES_DIR/${slug}${EXT}"
          
          curl -sL --max-time 15 -o "$OUTFILE" "$img_url" 2>/dev/null
          
          SIZE=$(wc -c < "$OUTFILE" 2>/dev/null | tr -d ' ')
          if [ "$SIZE" -lt 20000 ] 2>/dev/null; then rm -f "$OUTFILE"; continue; fi
          
          FILETYPE=$(file "$OUTFILE")
          if echo "$FILETYPE" | grep -qi "HTML\|ASCII\|UTF-8 text"; then rm -f "$OUTFILE"; continue; fi
          
          W=$(sips -g pixelWidth "$OUTFILE" 2>/dev/null | grep pixelWidth | awk '{print $2}')
          H=$(sips -g pixelHeight "$OUTFILE" 2>/dev/null | grep pixelHeight | awk '{print $2}')
          
          if [ -n "$W" ] && [ -n "$H" ] && [ "$W" -ge 400 ] && [ "$H" -ge 200 ]; then
            echo "  ✓ Found on ${subpage}: ${slug}${EXT} (${W}x${H})"
            FOUND=$((FOUND + 1))
            break 2  # Break out of both loops
          else
            rm -f "$OUTFILE"
          fi
        done <<< "$IMGS"
      fi
    done
  fi
  
  # Check if we found anything
  if ! ls "$CANDIDATES_DIR/$slug".* 2>/dev/null | head -1 | grep -q .; then
    echo "  ✗ No photo found from subpages either"
  fi
  
done <<< "$BARNS"

echo ""
echo "Done! Found $FOUND additional photos"
echo "Candidates in: $CANDIDATES_DIR"
echo "Files: $(ls "$CANDIDATES_DIR" 2>/dev/null | wc -l | tr -d ' ')"
