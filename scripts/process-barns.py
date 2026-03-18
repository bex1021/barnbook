#!/usr/bin/env python3
"""
Process search results: deduplicate, filter, and build barn listings.
Uses local results (with GPS/addresses) as primary source, organic results to find websites.
"""
import json
import re
import uuid
import os
from datetime import datetime, timezone

# Aggregator/directory domains to skip
SKIP_DOMAINS = [
    'yelp.com', 'yelp.ca', 'facebook.com', 'google.com', 'instagram.com',
    'youtube.com', 'pinterest.com', 'nextdoor.com', 'bbb.org', 'yellowpages.com',
    'mapquest.com', 'tripadvisor.com', 'thumbtack.com', 'madbarn.com',
    'barnmanager.com', 'horseclicks.com', 'allpony.com', 'horseforum.com',
    'chronofhorse.com', 'tiktok.com', 'equine.com', 'equinenow.com',
    'newhorse.com', 'farmzenda.com', 'lessons.com', 'horseproperties.net',
    'alltrails.com', 'landsearch.com', 'socalfenceandbarn.com',
    'enjoyorangecounty.com', 'stablemanagement.com', 'macaronikid.com',
    'leaguecity.macaronikid.com', 'lahomes.com', 'activeolderadults.com',
    'palosverdespulse.com', 'palosverdesmagazine.com', 'lindasansone.com',
    'integrated-realty.net', 'visittemeculavalley.com', 'murrietaca.gov',
    'ramonajournal.com', 'locationshub.com', 'ramiroanderica.com',
    'petworks.com', 'atascocita.com', 'ntecdfw.com', 'chamber.fulshearregional.com',
    'woodlandsriding.com', 'fillmoregazette.com', 'rollinghillsestates.gov',
    'chinohills.org', 'rsfassociation.org', 'sanjuancapistrano.net',
    'olivewoodacres.com'
]

def make_slug(name):
    slug = name.lower()
    slug = re.sub(r'[^a-z0-9\s-]', '', slug)
    slug = re.sub(r'\s+', '-', slug.strip())
    slug = re.sub(r'-+', '-', slug)
    return slug

def is_skip_domain(url):
    for d in SKIP_DOMAINS:
        if d in url.lower():
            return True
    return False

def clean_name(name):
    """Clean up barn name from search results"""
    # Remove common suffixes from organic results
    for sep in [' | ', ' - ', ' – ', ' — ', ' · ']:
        if sep in name:
            name = name.split(sep)[0]
    # Remove generic prefixes/titles
    name = re.sub(r'^(HOME|About|Boarding|Lessons|Facility|Welcome to|Contact|Website|Properties|Rate Information|Horseback riding)\s*[-–—:]?\s*', '', name, flags=re.IGNORECASE)
    name = re.sub(r'\s*(- Home| Home Page|: Home|: HOME)$', '', name, flags=re.IGNORECASE)
    return name.strip()

def guess_state_city(address_str, query):
    """Try to extract state and city from address or query"""
    state = ''
    city = ''
    
    # Try address first
    if address_str:
        # Pattern: "City, ST" or "City, ST ZIP"
        m = re.search(r'([A-Za-z\s]+),\s*([A-Z]{2})', address_str)
        if m:
            city = m.group(1).strip()
            state = m.group(2)
    
    # Fall back to query
    if not state:
        if 'CA' in query or 'California' in query:
            state = 'CA'
        elif 'TX' in query or 'Texas' in query:
            state = 'TX'
    
    return city, state

# Load search results
barns_map = {}  # key = normalized name -> barn data

with open('scripts/search-results.jsonl') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        
        if r['source'] == 'local':
            name = r['name'].strip()
            key = name.lower()
            website = r.get('website', '')
            
            if website and is_skip_domain(website):
                continue
                
            city, state = guess_state_city(r.get('address', ''), r.get('query', ''))
            gps = r.get('gps', {})
            
            if key not in barns_map:
                barns_map[key] = {
                    'name': name,
                    'city': city,
                    'state': state,
                    'address_raw': r.get('address', ''),
                    'phone': r.get('phone', ''),
                    'website': website,
                    'lat': gps.get('latitude', 0),
                    'lng': gps.get('longitude', 0),
                    'rating': r.get('rating', 0)
                }
            else:
                # Merge: prefer data with more info
                existing = barns_map[key]
                if not existing['website'] and website:
                    existing['website'] = website
                if not existing['phone'] and r.get('phone'):
                    existing['phone'] = r['phone']
                if not existing['lat'] and gps.get('latitude'):
                    existing['lat'] = gps['latitude']
                    existing['lng'] = gps['longitude']
                    
        elif r['source'] == 'organic':
            url = r.get('url', '')
            if not url or is_skip_domain(url):
                continue
            
            name = clean_name(r.get('name', ''))
            if len(name) < 3:
                continue
                
            key = name.lower()
            city, state = guess_state_city('', r.get('query', ''))
            
            if key not in barns_map:
                barns_map[key] = {
                    'name': name,
                    'city': city,
                    'state': state,
                    'address_raw': '',
                    'phone': '',
                    'website': url,
                    'lat': 0,
                    'lng': 0,
                    'rating': 0
                }
            else:
                if not barns_map[key]['website'] and url:
                    barns_map[key]['website'] = url

# Load existing barns for dedup
with open('data/barns.json') as f:
    existing_barns = json.load(f)

existing_slugs = set()
existing_names = set()
existing_websites = set()
for b in existing_barns:
    existing_slugs.add(b.get('slug', ''))
    existing_names.add(b.get('name', '').lower().strip())
    w = b.get('website', '').lower().rstrip('/')
    if w:
        existing_websites.add(w)

# Filter to new barns only, with websites
new_barns = []
for key, b in barns_map.items():
    slug = make_slug(b['name'])
    website_clean = b.get('website', '').lower().rstrip('/')
    
    if slug in existing_slugs:
        continue
    if b['name'].lower().strip() in existing_names:
        continue
    if website_clean and website_clean in existing_websites:
        continue
    if not b.get('website'):
        continue
    # Skip if no state identified
    if not b.get('state'):
        continue
        
    new_barns.append(b)

print(f"Total unique barns from search: {len(barns_map)}")
print(f"New barns (not in database, with website): {len(new_barns)}")
print(f"CA: {len([b for b in new_barns if b['state'] == 'CA'])}")
print(f"TX: {len([b for b in new_barns if b['state'] == 'TX'])}")

# Build barn JSON objects (without scraping - we'll add what we have)
now = datetime.now(timezone.utc).isoformat()
barn_listings = []

for b in new_barns:
    barn_id = str(uuid.uuid4())
    slug = make_slug(b['name'])
    
    # Parse street from address_raw if possible
    street = ''
    addr_raw = b.get('address_raw', '')
    if addr_raw and ',' in addr_raw:
        parts = addr_raw.split(',')
        if len(parts) >= 2:
            # If first part looks like a street address (has numbers)
            if re.search(r'\d', parts[0]):
                street = parts[0].strip()
    
    listing = {
        "id": barn_id,
        "ownerId": "system",
        "name": b['name'],
        "slug": slug,
        "description": "",
        "address": {
            "street": street,
            "city": b.get('city', ''),
            "state": b.get('state', ''),
            "zip": "",
            "lat": b.get('lat', 0),
            "lng": b.get('lng', 0)
        },
        "phone": b.get('phone', ''),
        "website": b.get('website', ''),
        "email": "",
        "disciplines": [],
        "amenities": {
            "indoorArena": False,
            "outdoorArena": False,
            "trails": False,
            "roundPen": False,
            "hotWalker": False,
            "washRack": False
        },
        "boarding": {
            "types": [],
            "stallCount": 0,
            "turnout": ""
        },
        "pricing": {
            "boardingFrom": 0,
            "lessonsFrom": 0,
            "currency": "USD"
        },
        "trainers": [],
        "lessonAvailability": False,
        "horseBreeds": [],
        "photos": [],
        "createdAt": now,
        "updatedAt": now
    }
    barn_listings.append(listing)

# Write to a staging file first
with open('scripts/new-barns-staging.json', 'w') as f:
    json.dump(barn_listings, f, indent=2)

print(f"\nWrote {len(barn_listings)} new barn listings to scripts/new-barns-staging.json")
print("\nBarns by region:")
regions = {}
for b in barn_listings:
    key = f"{b['address']['city']}, {b['address']['state']}" if b['address']['city'] else b['address']['state']
    regions[key] = regions.get(key, 0) + 1
for k, v in sorted(regions.items(), key=lambda x: -x[1]):
    print(f"  {k}: {v}")

# Also write a URL list for scraping
with open('scripts/scrape-urls.txt', 'w') as f:
    for b in barn_listings:
        f.write(f"{b['slug']}\t{b['website']}\n")

print(f"\nURL list written to scripts/scrape-urls.txt")
