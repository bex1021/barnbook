"""
Tag barns with 'horse therapy' and 'natural horsemanship' disciplines
based on their name/description text. Updates both barns.json and Supabase.
"""
import json
import os
from supabase import create_client

# Load env
from dotenv import load_dotenv
load_dotenv('.env.local')

supabase = create_client(os.environ['SUPABASE_URL'], os.environ['SUPABASE_SERVICE_ROLE_KEY'])

THERAPY_KEYWORDS = ['therap', 'therapeutic', 'hippotherapy', 'equine assisted', 'equine-assisted',
                     'adaptive riding', 'special needs', 'sire ', 'path intl', 'eagala']
NATURAL_KEYWORDS = ['natural horsemanship', 'parelli', 'clinton anderson', 'monty roberts',
                    'join-up', 'groundwork', 'liberty work', 'round pen', 'gentle breaking',
                    'colt starting', 'horsemanship clinic', 'vaquero', 'ray hunt',
                    'tom dorrance', 'buck brannaman']

# Update barns.json
with open('data/barns.json') as f:
    barns = json.load(f)

json_updated = 0
for barn in barns:
    text = (barn.get('name', '') + ' ' + barn.get('description', '')).lower()
    disciplines = barn.get('disciplines', [])
    changed = False

    if any(k in text for k in THERAPY_KEYWORDS) and 'horse therapy' not in disciplines:
        disciplines.append('horse therapy')
        changed = True
    if any(k in text for k in NATURAL_KEYWORDS) and 'natural horsemanship' not in disciplines:
        disciplines.append('natural horsemanship')
        changed = True

    if changed:
        barn['disciplines'] = disciplines
        json_updated += 1

with open('data/barns.json', 'w') as f:
    json.dump(barns, f, indent=2)

print(f"Updated {json_updated} barns in barns.json")

# Update Supabase
# Fetch all barns from Supabase
all_barns = []
offset = 0
while True:
    resp = supabase.table('barns').select('id, name, description, disciplines').range(offset, offset + 999).execute()
    all_barns.extend(resp.data)
    if len(resp.data) < 1000:
        break
    offset += 1000

print(f"Fetched {len(all_barns)} barns from Supabase")

db_updated = 0
for barn in all_barns:
    text = ((barn.get('name') or '') + ' ' + (barn.get('description') or '')).lower()
    disciplines = list(barn.get('disciplines') or [])
    changed = False

    if any(k in text for k in THERAPY_KEYWORDS) and 'horse therapy' not in disciplines:
        disciplines.append('horse therapy')
        changed = True
    if any(k in text for k in NATURAL_KEYWORDS) and 'natural horsemanship' not in disciplines:
        disciplines.append('natural horsemanship')
        changed = True

    if changed:
        supabase.table('barns').update({'disciplines': disciplines}).eq('id', barn['id']).execute()
        db_updated += 1
        print(f"  ✓ {barn['name']}")

print(f"\nDone! Updated {db_updated} barns in Supabase")
