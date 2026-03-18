#!/usr/bin/env python3
"""
Scrape barn websites to enrich listings with descriptions, disciplines, amenities, etc.
Uses curl to fetch pages and regex/text parsing to extract info.
"""
import json
import re
import subprocess
import time
import sys
import os

DISCIPLINE_KEYWORDS = {
    'dressage': ['dressage'],
    'hunter jumper': ['hunter', 'jumper', 'jumping', 'hunter/jumper', 'h/j', 'show jumping', 'hunters'],
    'western': ['western', 'western pleasure', 'reining', 'barrel racing', 'cutting', 'roping', 'rodeo', 'western dressage'],
    'eventing': ['eventing', 'three-day', 'cross country', 'combined training', 'horse trials'],
    'trail': ['trail', 'trail riding', 'trail rides', 'pleasure riding'],
}

AMENITY_KEYWORDS = {
    'indoorArena': ['indoor arena', 'indoor riding arena', 'covered arena'],
    'outdoorArena': ['outdoor arena', 'outdoor riding arena', 'open arena', 'riding ring', 'sand arena'],
    'trails': ['trails', 'trail access', 'riding trails', 'trail system'],
    'roundPen': ['round pen', 'roundpen', 'lunge ring'],
    'hotWalker': ['hot walker', 'hotwalker', 'horse walker', 'mechanical walker'],
    'washRack': ['wash rack', 'wash stall', 'grooming area', 'bathing area'],
}

BOARDING_KEYWORDS = {
    'full': ['full board', 'full care', 'full service board'],
    'partial': ['partial board', 'partial care'],
    'pasture': ['pasture board', 'pasture boarding', 'field board'],
    'self-care': ['self care', 'self-care', 'do it yourself'],
}

def fetch_page(url, timeout=10):
    """Fetch a page using curl and return text content"""
    try:
        result = subprocess.run(
            ['curl', '-sL', '--max-time', str(timeout), '-A', 
             'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36',
             url],
            capture_output=True, text=True, timeout=timeout+5
        )
        if result.returncode == 0:
            return result.stdout
        return ''
    except:
        return ''

def html_to_text(html):
    """Basic HTML to text conversion"""
    # Remove script and style tags
    text = re.sub(r'<script[^>]*>.*?</script>', '', html, flags=re.DOTALL|re.IGNORECASE)
    text = re.sub(r'<style[^>]*>.*?</style>', '', text, flags=re.DOTALL|re.IGNORECASE)
    # Convert br and p to newlines
    text = re.sub(r'<br\s*/?>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</p>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</div>', '\n', text, flags=re.IGNORECASE)
    text = re.sub(r'</li>', '\n', text, flags=re.IGNORECASE)
    # Remove all remaining tags
    text = re.sub(r'<[^>]+>', ' ', text)
    # Decode common entities
    text = text.replace('&amp;', '&').replace('&lt;', '<').replace('&gt;', '>')
    text = text.replace('&nbsp;', ' ').replace('&#39;', "'").replace('&quot;', '"')
    # Clean whitespace
    text = re.sub(r'\s+', ' ', text)
    text = re.sub(r'\n\s*\n', '\n', text)
    return text.strip()[:5000]  # Cap at 5000 chars

def extract_email(text):
    """Find email address in text"""
    m = re.search(r'[\w.+-]+@[\w-]+\.[\w.-]+', text)
    return m.group(0) if m else ''

def extract_phone(text):
    """Find phone number in text"""
    m = re.search(r'\(?\d{3}\)?[-.\s]?\d{3}[-.\s]?\d{4}', text)
    return m.group(0) if m else ''

def extract_address(text):
    """Try to find street address"""
    # Look for patterns like "123 Street Name"
    m = re.search(r'\d+\s+[A-Z][a-zA-Z\s]+(?:Street|St|Avenue|Ave|Road|Rd|Drive|Dr|Lane|Ln|Way|Blvd|Boulevard|Circle|Ct|Court|Trail|Trl|Place|Pl)\b\.?', text)
    return m.group(0).strip() if m else ''

def extract_zip(text):
    """Find zip code near state abbreviation"""
    m = re.search(r'(?:CA|TX)\s+(\d{5})', text)
    return m.group(1) if m else ''

def extract_description(text, barn_name):
    """Extract a meaningful description"""
    # Look for about/description sections
    patterns = [
        r'(?:About\s+(?:Us|' + re.escape(barn_name) + r'))\s*[:\-]?\s*(.{50,500})',
        r'(?:Welcome to|Located in|We are|Our (?:farm|ranch|stable|facility))\s+(.{50,400})',
        r'(?:offers?|provides?|specializ(?:es?|ing))\s+(.{30,300})',
    ]
    for pattern in patterns:
        m = re.search(pattern, text, re.IGNORECASE)
        if m:
            desc = m.group(0).strip()
            # Clean up - end at sentence boundary
            sentences = re.split(r'(?<=[.!?])\s+', desc)
            if len(sentences) > 3:
                desc = ' '.join(sentences[:3])
            return desc[:500]
    
    # Fall back to meta description if present
    return ''

def extract_pricing(text):
    """Extract boarding and lesson pricing"""
    boarding_price = 0
    lesson_price = 0
    
    # Look for boarding prices
    patterns = [
        r'(?:board(?:ing)?|full board|monthly)\s*(?:from|starting|:)?\s*\$(\d{3,4})',
        r'\$(\d{3,4})\s*(?:/\s*month|per\s*month|monthly)',
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            price = int(m.group(1))
            if 200 <= price <= 5000:
                boarding_price = price
                break
    
    # Look for lesson prices
    patterns = [
        r'(?:lesson|riding lesson|private lesson)\s*(?:from|starting|:)?\s*\$(\d{2,3})',
        r'\$(\d{2,3})\s*(?:/\s*(?:lesson|hour|session)|per\s*(?:lesson|hour|session))',
    ]
    for p in patterns:
        m = re.search(p, text, re.IGNORECASE)
        if m:
            price = int(m.group(1))
            if 20 <= price <= 500:
                lesson_price = price
                break
    
    return boarding_price, lesson_price

def extract_disciplines(text):
    """Identify disciplines from text"""
    text_lower = text.lower()
    found = set()
    for discipline, keywords in DISCIPLINE_KEYWORDS.items():
        for kw in keywords:
            if kw in text_lower:
                found.add(discipline)
                break
    return list(found)

def extract_amenities(text):
    """Identify amenities from text"""
    text_lower = text.lower()
    amenities = {}
    for amenity, keywords in AMENITY_KEYWORDS.items():
        amenities[amenity] = any(kw in text_lower for kw in keywords)
    return amenities

def extract_boarding_types(text):
    """Identify boarding types from text"""
    text_lower = text.lower()
    types = []
    for btype, keywords in BOARDING_KEYWORDS.items():
        if any(kw in text_lower for kw in keywords):
            types.append(btype)
    return types

def extract_stall_count(text):
    """Try to find number of stalls"""
    m = re.search(r'(\d{1,3})\s*(?:stall|box stall)', text, re.IGNORECASE)
    if m:
        count = int(m.group(1))
        if 1 <= count <= 500:
            return count
    return 0

# Load staged barns
with open('scripts/new-barns-staging.json') as f:
    barns = json.load(f)

total = len(barns)
print(f"Scraping {total} barn websites...")

scraped = 0
failed = 0

for i, barn in enumerate(barns):
    url = barn.get('website', '')
    if not url:
        continue
    
    sys.stdout.write(f"\r[{i+1}/{total}] {barn['name'][:50]}...")
    sys.stdout.flush()
    
    html = fetch_page(url)
    if not html or len(html) < 100:
        failed += 1
        continue
    
    text = html_to_text(html)
    
    # Extract info
    desc = extract_description(text, barn['name'])
    if desc:
        barn['description'] = desc
    
    email = extract_email(text)
    if email and not barn.get('email'):
        barn['email'] = email
    
    phone = extract_phone(text)
    if phone and not barn.get('phone'):
        barn['phone'] = phone
    
    street = extract_address(text)
    if street and not barn['address'].get('street'):
        barn['address']['street'] = street
    
    zipcode = extract_zip(text)
    if zipcode and not barn['address'].get('zip'):
        barn['address']['zip'] = zipcode
    
    disciplines = extract_disciplines(text)
    if disciplines:
        barn['disciplines'] = disciplines
    
    amenities = extract_amenities(text)
    if any(amenities.values()):
        barn['amenities'] = amenities
    
    boarding_types = extract_boarding_types(text)
    if boarding_types:
        barn['boarding']['types'] = boarding_types
    
    stalls = extract_stall_count(text)
    if stalls:
        barn['boarding']['stallCount'] = stalls
    
    boarding_price, lesson_price = extract_pricing(text)
    if boarding_price:
        barn['pricing']['boardingFrom'] = boarding_price
    if lesson_price:
        barn['pricing']['lessonsFrom'] = lesson_price
    
    # Check if lessons mentioned
    if re.search(r'lesson|riding class|learn to ride|beginner|instruction', text, re.IGNORECASE):
        barn['lessonAvailability'] = True
    
    scraped += 1
    
    # Be nice - small delay
    time.sleep(0.3)

print(f"\n\nDone! Scraped: {scraped}, Failed: {failed}")

# Stats
with_desc = len([b for b in barns if b.get('description')])
with_disc = len([b for b in barns if b.get('disciplines')])
with_price = len([b for b in barns if b['pricing']['boardingFrom'] > 0 or b['pricing']['lessonsFrom'] > 0])
with_email = len([b for b in barns if b.get('email')])
with_lessons = len([b for b in barns if b.get('lessonAvailability')])

print(f"\nEnrichment stats:")
print(f"  With description: {with_desc}/{total}")
print(f"  With disciplines: {with_disc}/{total}")
print(f"  With pricing: {with_price}/{total}")
print(f"  With email: {with_email}/{total}")
print(f"  With lessons: {with_lessons}/{total}")

# Save
with open('scripts/new-barns-staging.json', 'w') as f:
    json.dump(barns, f, indent=2)

print(f"\nSaved enriched barns to scripts/new-barns-staging.json")
