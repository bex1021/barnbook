#!/bin/bash
# Bulk barn search script - outputs search results for processing
# Usage: ./scripts/bulk-search.sh

cd "$(dirname "$0")/.."
source .env.local

QUERIES=(
  # Orange County CA
  "horse+boarding+barns+Orange+County+California"
  "equestrian+center+San+Juan+Capistrano+CA"
  "horse+stables+Trabuco+Canyon+Coto+de+Caza+CA"
  "horse+boarding+Yorba+Linda+Anaheim+Hills+CA"
  "riding+lessons+stables+Dana+Point+San+Clemente+CA"
  "horse+boarding+Irvine+Lake+Forest+Mission+Viejo+CA"
  "equestrian+center+Laguna+Hills+Laguna+Niguel+CA"
  "horse+boarding+Huntington+Beach+Fountain+Valley+CA"
  # Inland Empire CA
  "horse+boarding+barns+Norco+California"
  "equestrian+center+Temecula+Murrieta+CA"
  "horse+stables+Riverside+Corona+CA"
  "horse+boarding+Perris+Menifee+Hemet+CA"
  "riding+lessons+Chino+Hills+Chino+CA"
  "horse+boarding+Fallbrook+Valley+Center+CA"
  "equestrian+center+Redlands+Yucaipa+CA"
  # Ventura County + West LA
  "horse+boarding+Moorpark+Simi+Valley+CA"
  "equestrian+center+Thousand+Oaks+Agoura+Hills+CA"
  "horse+stables+Camarillo+Somis+CA"
  "horse+boarding+Hidden+Hills+Calabasas+CA"
  "riding+lessons+Malibu+Topanga+CA"
  "equestrian+center+Santa+Paula+Fillmore+Ventura+CA"
  # Deeper LA
  "horse+boarding+Pasadena+Altadena+La+Canada+CA"
  "equestrian+center+Sunland+Tujunga+Shadow+Hills+CA"
  "horse+stables+Palos+Verdes+Rolling+Hills+CA"
  "horse+boarding+Santa+Clarita+Agua+Dulce+CA"
  "equestrian+center+Acton+Agua+Dulce+Palmdale+CA"
  # Deeper San Diego
  "horse+boarding+Ramona+Julian+CA"
  "equestrian+center+Rancho+Santa+Fe+Encinitas+CA"
  "horse+stables+Escondido+San+Marcos+CA"
  "horse+boarding+El+Cajon+Jamul+CA"
  "riding+lessons+Oceanside+Vista+Carlsbad+CA"
  # Houston TX
  "horse+boarding+barns+Houston+Texas"
  "equestrian+center+Katy+Fulshear+TX"
  "horse+stables+Conroe+Willis+TX"
  "horse+boarding+Spring+Tomball+Magnolia+TX"
  "riding+lessons+Cypress+Hockley+TX"
  "equestrian+center+Richmond+Rosenberg+TX"
  "horse+boarding+Pearland+Alvin+Friendswood+TX"
  "horse+stables+Huntsville+New+Waverly+TX"
  "horse+boarding+Kingwood+Humble+Atascocita+TX"
  "equestrian+center+League+City+Dickinson+TX"
  # DFW TX
  "horse+boarding+barns+Denton+Texas"
  "equestrian+center+Pilot+Point+Aubrey+TX"
  "horse+stables+Rockwall+Heath+TX"
  "horse+boarding+Grapevine+Colleyville+TX"
  "riding+lessons+Keller+Roanoke+Trophy+Club+TX"
  "equestrian+center+Cleburne+Granbury+TX"
  "horse+boarding+Azle+Springtown+TX"
  "horse+stables+Forney+Terrell+TX"
  "horse+boarding+Ennis+Midlothian+TX"
  "equestrian+center+Justin+Haslet+TX"
  # Central TX gaps
  "horse+boarding+Temple+Waco+Texas"
  "equestrian+center+New+Braunfels+TX"
  "horse+stables+Seguin+Gonzales+TX"
  "horse+boarding+Bastrop+Elgin+TX"
  "riding+lessons+Marble+Falls+Burnet+TX"
  # San Antonio area deeper
  "horse+boarding+Helotes+Fair+Oaks+Ranch+TX"
  "equestrian+center+Spring+Branch+Blanco+TX"
  "horse+stables+Castroville+Hondo+TX"
  # Austin deeper
  "horse+boarding+Leander+Liberty+Hill+TX"
  "equestrian+center+Pflugerville+Hutto+TX"
  "horse+stables+Lockhart+Luling+TX"
)

OUTPUT_FILE="scripts/search-results.jsonl"
> "$OUTPUT_FILE"

for q in "${QUERIES[@]}"; do
  echo "Searching: $q"
  RESULT=$(curl -s "https://serpapi.com/search.json?q=${q}&num=20&api_key=$SERPAPI_KEY" 2>/dev/null)
  
  echo "$RESULT" | python3 -c "
import sys, json
try:
    data = json.load(sys.stdin)
    query = '$q'.replace('+', ' ')
    
    # Local results
    for p in data.get('local_results', {}).get('places', []):
        rec = {
            'source': 'local',
            'query': query,
            'name': p.get('title',''),
            'address': p.get('address',''),
            'phone': p.get('phone',''),
            'rating': p.get('rating', 0),
            'gps': p.get('gps_coordinates', {}),
            'website': p.get('links', {}).get('website', '') if isinstance(p.get('links'), dict) else ''
        }
        print(json.dumps(rec))
    
    # Organic results
    skip_domains = ['yelp.com','facebook.com','google.com','instagram.com','youtube.com','pinterest.com','nextdoor.com','bbb.org','yellowpages.com','mapquest.com','tripadvisor.com','thumbtack.com','madbarn.com','barnmanager.com','horseclicks.com','allpony.com','horseforum.com','chronofhorse.com','tiktok.com','equine.com']
    for r in data.get('organic_results', [])[:15]:
        url = r.get('link','')
        if any(d in url for d in skip_domains):
            continue
        rec = {
            'source': 'organic',
            'query': query,
            'name': r.get('title',''),
            'url': url,
            'snippet': r.get('snippet','')
        }
        print(json.dumps(rec))
except:
    pass
" >> "$OUTPUT_FILE"
  
  # Rate limit - be nice to SerpAPI
  sleep 1
done

echo "Done! Results in $OUTPUT_FILE"
echo "Total lines: $(wc -l < $OUTPUT_FILE)"
