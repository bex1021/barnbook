# Search & Import Barns

Search Google for barns matching a query, scrape their websites, download photos, and auto-add them to the Barnbook database.

## Input

The user provides a search query as the argument, e.g.:
`/search-barns hunter jumper barns in dripping springs tx`

The argument is: $ARGUMENTS

## Workflow

### Step 1: Search Google via SerpAPI

Run a SerpAPI Google search using the query. The API key is stored in `.env.local` as `SERPAPI_KEY`. Read that file to get the key.

```
curl -s "https://serpapi.com/search.json?q=<url-encoded-query>&api_key=<SERPAPI_KEY>"
```

Collect results from both `local_results.places` and `organic_results` (up to 10 unique barn websites total).

### Step 2: Filter Out Directory & Aggregator Sites

Remove any results from these domains (and similar aggregator/directory sites):
- yelp.com / yelp.ca
- madbarn.com
- facebook.com
- google.com (maps, reviews)
- barnmanager.com
- equiratings.com
- horseclicks.com
- equine.com
- stablemanagement.com
- allpony.com
- horseforum.com
- chronicleforums.com (forum.chronofhorse.com)
- instagram.com
- tiktok.com
- youtube.com
- pinterest.com
- nextdoor.com
- bbb.org
- yellowpages.com
- mapquest.com
- tripadvisor.com
- thumbtack.com

If a result URL contains any of these domains, skip it. Only keep direct barn/farm websites.

### Step 3: Scrape Each Barn Website

For each remaining barn website (up to 10):

1. **Fetch the main page** using WebFetch. Extract:
   - Barn name
   - Full address (street, city, state, zip)
   - Phone, email, website
   - Description / about text
   - Disciplines offered (map to: "dressage", "hunter jumper", "western", "eventing", "trail")
   - Amenities (indoorArena, outdoorArena, trails, roundPen, hotWalker, washRack)
   - Boarding types (full, partial, pasture, self-care), stall count, turnout
   - Pricing (boarding monthly rate, lesson rates)
   - Trainer names, bios, specialties
   - Lesson availability
   - Image URLs on the page

2. **If the main page has minimal content** (Wix, Squarespace JS-rendered, etc.), try:
   - Fetching subpages like `/about`, `/trainers`, `/facility`, `/lessons`, `/boarding`
   - Falling back to SerpAPI Knowledge Graph: search for `"<barn name> <city> <state>"` and extract data from the `knowledge_graph` field

3. **Use data from SerpAPI local_results** to fill in gaps (address, phone, rating, GPS coordinates, hours).

4. **For missing fields**, use zeros/defaults (0 for pricing, empty arrays for unknown lists). Do NOT guess values.

### Step 4: Download Photos

For each barn:

1. From the scraped page, find a hero/facility photo URL (prefer actual facility photos over logos).
2. Download it to `public/images/barns/<slug>.<ext>` using curl.
3. If no photo URL is found on the website, search Google Images via SerpAPI:
   ```
   curl -s "https://serpapi.com/search.json?q=<barn+name+city+state>&tbm=isch&api_key=<key>"
   ```
   Download the first relevant result.
4. Verify the downloaded file is >10KB (skip if it's too small — likely a broken image or icon).

### Step 5: Create Listings

For each barn, create a JSON object matching this schema:

```json
{
  "id": "<generate uuid>",
  "ownerId": "system",
  "name": "<barn name>",
  "slug": "<kebab-case-name>",
  "description": "<scraped description>",
  "address": {
    "street": "<street>",
    "city": "<city>",
    "state": "<2-letter state code>",
    "zip": "<zip>",
    "lat": <latitude>,
    "lng": <longitude>
  },
  "phone": "<phone>",
  "website": "<website url>",
  "email": "<email>",
  "disciplines": ["<discipline1>", "<discipline2>"],
  "amenities": {
    "indoorArena": false,
    "outdoorArena": false,
    "trails": false,
    "roundPen": false,
    "hotWalker": false,
    "washRack": false
  },
  "boarding": {
    "types": ["full"],
    "stallCount": 0,
    "turnout": "individual"
  },
  "pricing": {
    "boardingFrom": 0,
    "lessonsFrom": 0,
    "currency": "USD"
  },
  "trainers": [
    {
      "name": "<name>",
      "bio": "<bio>",
      "specialties": ["<specialty>"]
    }
  ],
  "lessonAvailability": true,
  "horseBreeds": [],
  "photos": ["<filename>"],
  "createdAt": "<current ISO date>",
  "updatedAt": "<current ISO date>"
}
```

### Step 6: Add to Database

1. Read the existing `data/barns.json`.
2. Check for duplicates by comparing slug or name — skip any barn that already exists.
3. Append the new barns to the array.
4. Write the updated array back to `data/barns.json`.
5. Check if the state filter in `components/SearchFilters.tsx` (the `STATES` array) includes any new states. If not, add them.

### Step 7: Report Results

Print a summary table showing:
- Barn name
- Address
- Photo filename (or "no photo")
- Number of trainers found
- Disciplines
- Whether it was a new addition or skipped (duplicate)

## Important Notes

- The valid discipline values are: `"dressage"`, `"hunter jumper"`, `"western"`, `"eventing"`, `"trail"`. Map any variations (e.g., "jumping", "hunters", "show jumping", "H/J") to `"hunter jumper"`. Do NOT use `"jumping"` as a standalone discipline.
- Generate slugs by lowercasing the barn name, replacing spaces with hyphens, and removing special characters.
- Generate UUIDs using the `uuid` npm package or Node.js crypto: `node -e "console.log(require('crypto').randomUUID())"`.
- GPS coordinates: use values from SerpAPI local_results when available, otherwise approximate from the city/state.
- Always verify the build still passes after adding barns: `npx next build`.
