#!/usr/bin/env python3
"""
Enrich staged barns: better city extraction from queries, then scrape websites for details.
"""
import json
import re
import subprocess
import time
import sys

# Query -> city/region mapping
QUERY_CITY_MAP = {
    'Orange County': ('', 'CA'),
    'San Juan Capistrano': ('San Juan Capistrano', 'CA'),
    'Trabuco Canyon': ('Trabuco Canyon', 'CA'),
    'Coto de Caza': ('Coto de Caza', 'CA'),
    'Yorba Linda': ('Yorba Linda', 'CA'),
    'Anaheim Hills': ('Anaheim Hills', 'CA'),
    'Dana Point': ('Dana Point', 'CA'),
    'San Clemente': ('San Clemente', 'CA'),
    'Irvine': ('Irvine', 'CA'),
    'Lake Forest': ('Lake Forest', 'CA'),
    'Mission Viejo': ('Mission Viejo', 'CA'),
    'Laguna Hills': ('Laguna Hills', 'CA'),
    'Laguna Niguel': ('Laguna Niguel', 'CA'),
    'Huntington Beach': ('Huntington Beach', 'CA'),
    'Fountain Valley': ('Fountain Valley', 'CA'),
    'Norco': ('Norco', 'CA'),
    'Temecula': ('Temecula', 'CA'),
    'Murrieta': ('Murrieta', 'CA'),
    'Riverside': ('Riverside', 'CA'),
    'Corona': ('Corona', 'CA'),
    'Perris': ('Perris', 'CA'),
    'Menifee': ('Menifee', 'CA'),
    'Hemet': ('Hemet', 'CA'),
    'Chino Hills': ('Chino Hills', 'CA'),
    'Chino': ('Chino', 'CA'),
    'Fallbrook': ('Fallbrook', 'CA'),
    'Valley Center': ('Valley Center', 'CA'),
    'Redlands': ('Redlands', 'CA'),
    'Yucaipa': ('Yucaipa', 'CA'),
    'Moorpark': ('Moorpark', 'CA'),
    'Simi Valley': ('Simi Valley', 'CA'),
    'Thousand Oaks': ('Thousand Oaks', 'CA'),
    'Agoura Hills': ('Agoura Hills', 'CA'),
    'Camarillo': ('Camarillo', 'CA'),
    'Somis': ('Somis', 'CA'),
    'Hidden Hills': ('Hidden Hills', 'CA'),
    'Calabasas': ('Calabasas', 'CA'),
    'Malibu': ('Malibu', 'CA'),
    'Topanga': ('Topanga', 'CA'),
    'Santa Paula': ('Santa Paula', 'CA'),
    'Fillmore': ('Fillmore', 'CA'),
    'Ventura': ('Ventura', 'CA'),
    'Pasadena': ('Pasadena', 'CA'),
    'Altadena': ('Altadena', 'CA'),
    'La Canada': ('La Cañada Flintridge', 'CA'),
    'Sunland': ('Sunland', 'CA'),
    'Tujunga': ('Tujunga', 'CA'),
    'Shadow Hills': ('Shadow Hills', 'CA'),
    'Palos Verdes': ('Palos Verdes', 'CA'),
    'Rolling Hills': ('Rolling Hills Estates', 'CA'),
    'Santa Clarita': ('Santa Clarita', 'CA'),
    'Agua Dulce': ('Agua Dulce', 'CA'),
    'Acton': ('Acton', 'CA'),
    'Palmdale': ('Palmdale', 'CA'),
    'Ramona': ('Ramona', 'CA'),
    'Julian': ('Julian', 'CA'),
    'Rancho Santa Fe': ('Rancho Santa Fe', 'CA'),
    'Encinitas': ('Encinitas', 'CA'),
    'Escondido': ('Escondido', 'CA'),
    'San Marcos': ('San Marcos', 'CA'),
    'El Cajon': ('El Cajon', 'CA'),
    'Jamul': ('Jamul', 'CA'),
    'Oceanside': ('Oceanside', 'CA'),
    'Vista': ('Vista', 'CA'),
    'Carlsbad': ('Carlsbad', 'CA'),
    'Houston': ('Houston', 'TX'),
    'Katy': ('Katy', 'TX'),
    'Fulshear': ('Fulshear', 'TX'),
    'Conroe': ('Conroe', 'TX'),
    'Willis': ('Willis', 'TX'),
    'Spring': ('Spring', 'TX'),
    'Tomball': ('Tomball', 'TX'),
    'Magnolia': ('Magnolia', 'TX'),
    'Cypress': ('Cypress', 'TX'),
    'Hockley': ('Hockley', 'TX'),
    'Richmond': ('Richmond', 'TX'),
    'Rosenberg': ('Rosenberg', 'TX'),
    'Pearland': ('Pearland', 'TX'),
    'Alvin': ('Alvin', 'TX'),
    'Friendswood': ('Friendswood', 'TX'),
    'Huntsville': ('Huntsville', 'TX'),
    'New Waverly': ('New Waverly', 'TX'),
    'Kingwood': ('Kingwood', 'TX'),
    'Humble': ('Humble', 'TX'),
    'Atascocita': ('Atascocita', 'TX'),
    'League City': ('League City', 'TX'),
    'Dickinson': ('Dickinson', 'TX'),
    'Denton': ('Denton', 'TX'),
    'Pilot Point': ('Pilot Point', 'TX'),
    'Aubrey': ('Aubrey', 'TX'),
    'Rockwall': ('Rockwall', 'TX'),
    'Heath': ('Heath', 'TX'),
    'Grapevine': ('Grapevine', 'TX'),
    'Colleyville': ('Colleyville', 'TX'),
    'Keller': ('Keller', 'TX'),
    'Roanoke': ('Roanoke', 'TX'),
    'Trophy Club': ('Trophy Club', 'TX'),
    'Cleburne': ('Cleburne', 'TX'),
    'Granbury': ('Granbury', 'TX'),
    'Azle': ('Azle', 'TX'),
    'Springtown': ('Springtown', 'TX'),
    'Forney': ('Forney', 'TX'),
    'Terrell': ('Terrell', 'TX'),
    'Ennis': ('Ennis', 'TX'),
    'Midlothian': ('Midlothian', 'TX'),
    'Justin': ('Justin', 'TX'),
    'Haslet': ('Haslet', 'TX'),
    'Temple': ('Temple', 'TX'),
    'Waco': ('Waco', 'TX'),
    'New Braunfels': ('New Braunfels', 'TX'),
    'Seguin': ('Seguin', 'TX'),
    'Gonzales': ('Gonzales', 'TX'),
    'Bastrop': ('Bastrop', 'TX'),
    'Elgin': ('Elgin', 'TX'),
    'Marble Falls': ('Marble Falls', 'TX'),
    'Burnet': ('Burnet', 'TX'),
    'Helotes': ('Helotes', 'TX'),
    'Fair Oaks Ranch': ('Fair Oaks Ranch', 'TX'),
    'Spring Branch': ('Spring Branch', 'TX'),
    'Blanco': ('Blanco', 'TX'),
    'Castroville': ('Castroville', 'TX'),
    'Hondo': ('Hondo', 'TX'),
    'Leander': ('Leander', 'TX'),
    'Liberty Hill': ('Liberty Hill', 'TX'),
    'Pflugerville': ('Pflugerville', 'TX'),
    'Hutto': ('Hutto', 'TX'),
    'Lockhart': ('Lockhart', 'TX'),
    'Luling': ('Luling', 'TX'),
    'Shady Shores': ('Shady Shores', 'TX'),
    'Needville': ('Needville', 'TX'),
    'Porter': ('Porter', 'TX'),
}

# Load search results to map barn names to queries
name_to_query = {}
with open('scripts/search-results.jsonl') as f:
    for line in f:
        line = line.strip()
        if not line:
            continue
        r = json.loads(line)
        name_key = r.get('name', '').lower().strip()
        if r['source'] == 'organic':
            # Clean the name same way as process-barns.py
            name = r.get('name', '')
            for sep in [' | ', ' - ', ' – ', ' — ', ' · ']:
                if sep in name:
                    name = name.split(sep)[0]
            name = re.sub(r'^(HOME|About|Boarding|Lessons|Facility|Welcome to|Contact|Website|Properties|Rate Information|Horseback riding)\s*[-–—:]?\s*', '', name, flags=re.IGNORECASE)
            name = re.sub(r'\s*(- Home| Home Page|: Home|: HOME)$', '', name, flags=re.IGNORECASE)
            name_key = name.strip().lower()
        
        query = r.get('query', '')
        if name_key and query:
            name_to_query[name_key] = query

# Load staged barns
with open('scripts/new-barns-staging.json') as f:
    barns = json.load(f)

# Fix cities based on query mapping
fixed = 0
for barn in barns:
    if barn['address']['city']:
        continue
    
    # Find which query this barn came from
    name_key = barn['name'].lower().strip()
    query = name_to_query.get(name_key, '')
    
    if not query:
        continue
    
    # Try to match query to a city
    best_match = None
    best_len = 0
    for city_key, (city, state) in QUERY_CITY_MAP.items():
        if city_key.lower() in query.lower() and len(city_key) > best_len:
            best_match = (city, state)
            best_len = len(city_key)
    
    if best_match:
        city, state = best_match
        if city:
            barn['address']['city'] = city
        if state and not barn['address']['state']:
            barn['address']['state'] = state
        fixed += 1

print(f"Fixed {fixed} barn cities from query mapping")

# Count by region
regions = {}
for b in barns:
    city = b['address']['city'] or 'Unknown'
    state = b['address']['state'] or '??'
    key = f"{city}, {state}"
    regions[key] = regions.get(key, 0) + 1

print(f"\nBarns by city ({len(barns)} total):")
for k, v in sorted(regions.items(), key=lambda x: (-x[1], x[0])):
    print(f"  {k}: {v}")

# Still unknown?
unknown = [b for b in barns if not b['address']['city']]
print(f"\nStill missing city: {len(unknown)}")
for b in unknown:
    print(f"  {b['name']} | {b['website']}")

# Save updated staging
with open('scripts/new-barns-staging.json', 'w') as f:
    json.dump(barns, f, indent=2)

print(f"\nUpdated scripts/new-barns-staging.json")
