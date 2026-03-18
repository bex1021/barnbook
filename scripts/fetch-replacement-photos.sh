#!/bin/bash
# Fetch replacement photos for barns that lost their images
# Usage: ./scripts/fetch-replacement-photos.sh [start_index] [count]

START=${1:-0}
COUNT=${2:-50}
BARN_DIR="public/images/barns"
CANDIDATES_DIR="public/images/barns/candidates"
mkdir -p "$CANDIDATES_DIR"

# Get barns needing photos
BARNS=$(node -e "
const barns = JSON.parse(require('fs').readFileSync('data/barns.json','utf8'));
const need = barns.filter(b => (!b.photos || b.photos.length === 0) && b.website);
need.slice($START, $START + $COUNT).forEach(b => console.log(b.slug + '|' + b.website));
")

echo "Fetching photos for barns $START to $(($START + $COUNT))..."
echo ""

while IFS='|' read -r slug website; do
  [ -z "$slug" ] && continue
  
  # Skip if we already have a photo
  if ls "$BARN_DIR/$slug".* 2>/dev/null | head -1 | grep -q .; then
    echo "SKIP $slug (already has photo)"
    continue
  fi
  
  echo "FETCH $slug ($website)"
  
  # Get image URLs from the site
  IMGS=$(curl -sL --max-time 10 "$website" 2>/dev/null | grep -oE '(src|data-src)="[^"]*\.(jpg|jpeg|png|webp)[^"]*"' | sed 's/^[^"]*"//;s/"$//' | sort -u)
  
  if [ -z "$IMGS" ]; then
    # Try /about page
    IMGS=$(curl -sL --max-time 10 "${website}/about" 2>/dev/null | grep -oE '(src|data-src)="[^"]*\.(jpg|jpeg|png|webp)[^"]*"' | sed 's/^[^"]*"//;s/"$//' | sort -u)
  fi
  
  if [ -z "$IMGS" ]; then
    echo "  NO IMAGES FOUND"
    continue
  fi
  
  # Filter out obvious logos, icons, tiny images
  # Pick the first large-ish image that's not obviously a logo
  PICKED=""
  CANDIDATE=0
  while IFS= read -r img_url; do
    [ -z "$img_url" ] && continue
    CANDIDATE=$((CANDIDATE + 1))
    [ $CANDIDATE -gt 5 ] && break
    
    # Skip obvious logos/icons
    echo "$img_url" | grep -qi "logo\|icon\|favicon\|sprite\|badge\|button\|arrow\|nav-\|menu-\|banner-ad\|widget" && continue
    
    # Skip tiny dimension hints in URL
    echo "$img_url" | grep -qE '[/-](50|60|80|100|120|150)x' && continue
    
    # Make absolute URL if relative
    if echo "$img_url" | grep -q '^/'; then
      # Extract base from website
      BASE=$(echo "$website" | grep -oE 'https?://[^/]+')
      img_url="${BASE}${img_url}"
    elif ! echo "$img_url" | grep -q '^http'; then
      img_url="${website%/}/${img_url}"
    fi
    
    # Get file extension
    EXT=$(echo "$img_url" | grep -oE '\.(jpg|jpeg|png|webp)' | head -1)
    [ -z "$EXT" ] && EXT=".jpg"
    
    OUTFILE="$CANDIDATES_DIR/${slug}${EXT}"
    
    # Download
    curl -sL --max-time 15 -o "$OUTFILE" "$img_url" 2>/dev/null
    
    # Check file size
    SIZE=$(wc -c < "$OUTFILE" 2>/dev/null | tr -d ' ')
    if [ "$SIZE" -lt 20000 ] 2>/dev/null; then
      rm -f "$OUTFILE"
      continue
    fi
    
    # Check it's a real image
    FILETYPE=$(file "$OUTFILE")
    if echo "$FILETYPE" | grep -qi "HTML\|ASCII\|UTF-8 text"; then
      rm -f "$OUTFILE"
      continue
    fi
    
    # Check dimensions using sips
    W=$(sips -g pixelWidth "$OUTFILE" 2>/dev/null | grep pixelWidth | awk '{print $2}')
    H=$(sips -g pixelHeight "$OUTFILE" 2>/dev/null | grep pixelHeight | awk '{print $2}')
    
    if [ -n "$W" ] && [ -n "$H" ] && [ "$W" -ge 400 ] && [ "$H" -ge 200 ]; then
      PICKED="$OUTFILE"
      echo "  ✓ Downloaded ${slug}${EXT} (${W}x${H}, ${SIZE}B)"
      break
    else
      rm -f "$OUTFILE"
    fi
  done <<< "$IMGS"
  
  if [ -z "$PICKED" ]; then
    echo "  ✗ No suitable photo found"
  fi
  
done <<< "$BARNS"

echo ""
echo "Done! Candidates saved to $CANDIDATES_DIR"
echo "Count: $(ls "$CANDIDATES_DIR" 2>/dev/null | wc -l | tr -d ' ')"
