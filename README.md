# Barnbook

A searchable directory of US equestrian barns for boarding and riding lessons.

**Live: [barnbook.io](https://barnbook.io)** — 543+ barns across 274+ cities in 19 states.

Riders search by city, zip, or metro area and filter by discipline (dressage, hunter/jumper, western, eventing, trail), boarding type, and amenities. Barn owners can claim and edit their listings; riders can save favorites and leave reviews.

## How the dataset was built

There was no clean source for this data. Barn listings live on individual websites, aggregator pages, and Google Business profiles, each with its own structure and vocabulary. The pipeline in [`scripts/`](scripts/) turns that into a normalized dataset:

1. **Search** — [`bulk-search.sh`](scripts/bulk-search.sh) runs a set of metro-area queries ("boarding stables near Ocala FL", etc.) through SerpAPI, capturing both local-pack results (addresses, GPS) and organic results (websites).
2. **Dedupe and filter** — [`process-barns.py`](scripts/process-barns.py) merges the two result types, skips aggregator domains, normalizes names, and resolves city/state from address strings.
3. **Extract** — [`scrape-barns.py`](scripts/scrape-barns.py) fetches each barn's website and pulls disciplines, amenities, and boarding options via keyword matching. [`scrape-la-barns.ts`](scripts/scrape-la-barns.ts) is the newer version of this step: it sends the page text to Claude (Haiku) to extract structured fields, since keyword matching didn't hold up against the range of ways barns describe themselves.
4. **Review** — new barns land in Supabase with `status = 'pending'` and are approved through an admin queue before they appear on the site.
5. **Photos** — [`bulk-fetch-photos.ts`](scripts/bulk-fetch-photos.ts) pulls images from barn websites; [`audit-photos.ts`](scripts/audit-photos.ts) runs them through Claude vision to reject logos, maps, and non-barn images.

The result is one schema across every listing — see [`supabase/schema.sql`](supabase/schema.sql) for the `barns` table. Per-metro snapshots from the pipeline are in [`data/`](data/).

## Stack

- **Next.js 16** (App Router) + **React 19** + **TypeScript**
- **Supabase** (Postgres) for barns, users, reviews, saved barns
- **NextAuth v5** for auth; owner/rider/admin roles
- **Tailwind CSS 4**, **Leaflet** for maps, **TipTap** for the blog editor
- **Anthropic SDK** for data extraction, photo classification, and blog drafting
- Deployed on **Vercel**

## Run locally

```bash
npm install
cp .env.local.example .env.local   # fill in Supabase URL + service role key, NextAuth secret
npm run dev
```

The pipeline scripts additionally need `SERPAPI_KEY` and `ANTHROPIC_API_KEY` in `.env.local`. To seed a fresh Supabase project from the bundled data:

```bash
npm run migrate
```
