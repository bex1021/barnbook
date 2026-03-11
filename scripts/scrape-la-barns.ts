/**
 * Scrape equestrian facilities in the LA metro area.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/scrape-la-barns.ts
 *
 * What it does:
 *  1. Searches Google via SerpAPI for LA-area barn/lesson/equestrian queries
 *  2. Fetches each barn's website and uses Claude to extract structured data
 *  3. Checks for duplicates against existing barns in Supabase
 *  4. Inserts new barns with status = 'pending' for admin review
 */

import Anthropic from "@anthropic-ai/sdk";
import { createClient } from "@supabase/supabase-js";
import { v4 as uuidv4 } from "uuid";
import slugify from "slugify";
import { readFileSync } from "fs";
import { join } from "path";

// Load .env.local — always override to strip any quotes tsx may have left in
try {
  const lines = readFileSync(join(process.cwd(), ".env.local"), "utf8").split("\n");
  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed || trimmed.startsWith("#")) continue;
    const eqIdx = trimmed.indexOf("=");
    if (eqIdx === -1) continue;
    const key = trimmed.slice(0, eqIdx).trim();
    let value = trimmed.slice(eqIdx + 1).trim();
    if ((value.startsWith('"') && value.endsWith('"')) || (value.startsWith("'") && value.endsWith("'"))) {
      value = value.slice(1, -1);
    }
    process.env[key] = value; // always override — strips any quoted values from tsx
  }
} catch { /* rely on existing env */ }

const SERPAPI_KEY = process.env.SERPAPI_KEY!;
const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);
// Initialize lazily — no explicit apiKey so SDK reads process.env.ANTHROPIC_API_KEY itself
function getAnthropic() {
  return new Anthropic();
}

// ── Search queries ────────────────────────────────────────────────────────────
const SEARCH_QUERIES = [
  // Calabasas & Malibu (priority)
  "equestrian boarding barn Calabasas California",
  "horse boarding Calabasas California",
  "riding lessons Calabasas California",
  "horse boarding Malibu California",
  "riding lessons Malibu equestrian",
  "equestrian center Malibu California",
  // Broader LA metro
  "horse boarding Los Angeles California barn",
  "equestrian center Los Angeles California",
  "dressage barn Los Angeles California",
  "hunter jumper barn Los Angeles California",
  "western riding stable Los Angeles California",
  "horse boarding Burbank California",
  "horse boarding Pasadena California",
  "equestrian center San Fernando Valley California",
  "horse boarding Santa Clarita California",
  "horse boarding Chatsworth California",
  "horse boarding Agoura Hills California",
  "equestrian stables Simi Valley California",
  "polo club Los Angeles California",
  "California Polo Club equestrian",
];

// ── Exclusion lists ───────────────────────────────────────────────────────────
const EXCLUDED_DOMAINS = [
  "yelp.com",
  "facebook.com",
  "instagram.com",
  "twitter.com",
  "youtube.com",
  "google.com",
  "horseclicks.com",
  "equine.com",
  "horsefinder.com",
  "madbarn.com",
  "equinenow.com",
  "horsetopia.com",
  "yellowpages.com",
  "tripadvisor.com",
  "eventbrite.com",
  "nextdoor.com",
  "equisearch.com",
  "wikipedia.org",
  "wikihow.com",
  "reddit.com",
  "thumbtack.com",
  "homestars.com",
  "houzz.com",
  "mapquest.com",
  "bbb.org",
  "angieslist.com",
  "bark.com",
];

const TRAIL_RIDE_TOURIST_KEYWORDS = [
  "trail rides",
  "guided ride",
  "guided rides",
  "pony rides",
  "tourist ride",
  "hayride",
  "hay ride",
  "horseback tour",
  "cowboy experience",
  "dude ranch",
  "vacation ride",
  "scenic ride",
];

// ── Helpers ───────────────────────────────────────────────────────────────────
function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function getDomain(url: string): string {
  try {
    return new URL(url).hostname.replace(/^www\./, "").toLowerCase();
  } catch {
    return url.toLowerCase();
  }
}

function normalizeName(name: string): string {
  return name
    .toLowerCase()
    .replace(/\b(stables?|barn|farm|ranch|equestrian|center|facility|riding|horse|sport|club)\b/g, "")
    .replace(/[^a-z0-9]/g, "")
    .trim();
}

function htmlToText(html: string): string {
  return html
    .replace(/<script[^>]*>[\s\S]*?<\/script>/gi, "")
    .replace(/<style[^>]*>[\s\S]*?<\/style>/gi, "")
    .replace(/<!--[\s\S]*?-->/g, "")
    .replace(/<[^>]+>/g, " ")
    .replace(/&nbsp;/g, " ")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/\s+/g, " ")
    .trim()
    .slice(0, 10000);
}

function makeSlug(name: string): string {
  return slugify(name, { lower: true, strict: true });
}

// ── SerpAPI search ────────────────────────────────────────────────────────────
interface SerpResult {
  title: string;
  link: string;
  snippet: string;
}

async function searchSerpApi(query: string): Promise<SerpResult[]> {
  const url = new URL("https://serpapi.com/search.json");
  url.searchParams.set("engine", "google");
  url.searchParams.set("q", query);
  url.searchParams.set("location", "Los Angeles, California");
  url.searchParams.set("num", "10");
  url.searchParams.set("api_key", SERPAPI_KEY);

  const res = await fetch(url.toString());
  if (!res.ok) {
    console.warn(`  SerpAPI error for "${query}": ${res.status}`);
    return [];
  }
  const json = await res.json() as { organic_results?: SerpResult[] };
  return json.organic_results || [];
}

// ── Website fetch ─────────────────────────────────────────────────────────────
async function fetchWebsite(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timeout = setTimeout(() => controller.abort(), 10000);
    const res = await fetch(url, {
      signal: controller.signal,
      headers: {
        "User-Agent":
          "Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
        Accept: "text/html,application/xhtml+xml",
      },
    });
    clearTimeout(timeout);
    if (!res.ok) return null;
    const contentType = res.headers.get("content-type") || "";
    if (!contentType.includes("text/html")) return null;
    const html = await res.text();
    return htmlToText(html);
  } catch {
    return null;
  }
}

// ── Claude extraction ─────────────────────────────────────────────────────────
interface ExtractedBarn {
  name: string;
  description: string;
  street: string | null;
  city: string | null;
  state: string | null;
  zip: string | null;
  phone: string | null;
  email: string | null;
  disciplines: string[];
  amenities: {
    indoorArena: boolean;
    outdoorArena: boolean;
    trails: boolean;
    roundPen: boolean;
    hotWalker: boolean;
    washRack: boolean;
  };
  boardingTypes: string[];
  stallCount: number | null;
  boardingPriceFrom: number | null;
  lessonPriceFrom: number | null;
  lessonAvailability: boolean;
  horseLeasing: boolean;
  acceptingBoarders: boolean | null;
  trainers: { name: string; bio: string | null; specialties: string[] }[];
  instagram: string | null;
  facebook: string | null;
  isTrailRideTouristOperation: boolean;
}

async function extractBarnData(
  url: string,
  text: string
): Promise<ExtractedBarn | null> {
  const prompt = `You are extracting structured data about an equestrian facility from their website content.

Website URL: ${url}

Website content:
${text}

Extract the following information and return ONLY a valid JSON object (no markdown, no explanation):
{
  "name": "facility name",
  "description": "1-3 sentences describing the facility and what makes it notable",
  "street": "street address or null",
  "city": "city or null",
  "state": "2-letter state code or null",
  "zip": "5-digit zip or null",
  "phone": "phone number or null",
  "email": "email address or null",
  "disciplines": ["array from: dressage, hunter jumper, western, eventing, polo, reining, trail, general"],
  "amenities": {
    "indoorArena": boolean,
    "outdoorArena": boolean,
    "trails": boolean,
    "roundPen": boolean,
    "hotWalker": boolean,
    "washRack": boolean
  },
  "boardingTypes": ["array from: full, partial, pasture, self-care"],
  "stallCount": number or null,
  "boardingPriceFrom": monthly boarding price in USD as a number or null,
  "lessonPriceFrom": per-lesson price in USD as a number or null,
  "lessonAvailability": boolean,
  "horseLeasing": boolean (true if horse leasing or lease-to-own programs are offered),
  "acceptingBoarders": boolean or null,
  "trainers": [{"name": "string", "bio": "1 sentence or null", "specialties": ["string"]}],
  "instagram": "full instagram URL or null",
  "facebook": "full facebook URL or null",
  "isTrailRideTouristOperation": boolean (true ONLY if this is primarily a tourist trail ride, pony ride, or guided ride business, NOT a real boarding/lesson facility)
}

Rules:
- Use null for missing strings/numbers
- Use false for unknown booleans
- Use empty arrays for unknown arrays
- disciplines should only include types the facility explicitly offers
- If no trainers are listed, use an empty array
- isTrailRideTouristOperation = true only for tourist-focused operations, not legitimate barns that happen to have trails`;

  try {
    const response = await getAnthropic().messages.create({
      model: "claude-haiku-4-5",
      max_tokens: 1500,
      messages: [{ role: "user", content: prompt }],
    });

    const text = response.content[0].type === "text" ? response.content[0].text : "";
    const jsonMatch = text.match(/\{[\s\S]*\}/);
    if (!jsonMatch) return null;
    return JSON.parse(jsonMatch[0]) as ExtractedBarn;
  } catch (err) {
    console.warn(`  Claude extraction failed: ${err}`);
    return null;
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────
async function main() {
  console.log("🐴  Barnbook LA Metro Scraper\n");

  // Load existing barns for duplicate detection
  console.log("Loading existing barns from Supabase...");
  const { data: existingRows } = await supabase
    .from("barns")
    .select("name, website, slug");
  const existing = (existingRows || []) as { name: string; website: string; slug: string }[];
  const existingDomains = new Set(
    existing.map((b) => getDomain(b.website || "")).filter(Boolean)
  );
  const existingNames = new Set(existing.map((b) => normalizeName(b.name)));
  const existingSlugs = new Set(existing.map((b) => b.slug));
  console.log(`  Found ${existing.length} existing barns\n`);

  // Collect unique candidate URLs from SerpAPI
  const candidateUrls = new Map<string, { title: string; snippet: string }>();

  console.log(`Running ${SEARCH_QUERIES.length} search queries...\n`);
  for (const query of SEARCH_QUERIES) {
    console.log(`  🔍 ${query}`);
    try {
      const results = await searchSerpApi(query);
      for (const r of results) {
        const domain = getDomain(r.link);
        const isExcluded = EXCLUDED_DOMAINS.some((d) => domain.includes(d));
        if (!isExcluded && !candidateUrls.has(domain)) {
          candidateUrls.set(domain, { title: r.title, snippet: r.snippet });
        }
      }
    } catch (err) {
      console.warn(`  Error: ${err}`);
    }
    await sleep(300);
  }

  console.log(`\nFound ${candidateUrls.size} unique candidate websites\n`);
  console.log("─".repeat(60));

  let added = 0;
  let skipped = 0;
  let errors = 0;

  for (const [domain, meta] of candidateUrls) {
    const url = `https://${domain}`;
    process.stdout.write(`\n${meta.title}\n  ${url}\n  `);

    // Skip if domain already in DB
    if (existingDomains.has(domain)) {
      console.log("⟳  Already in database (duplicate domain)");
      skipped++;
      continue;
    }

    // Check snippet for trail ride keywords
    const snippetLower = (meta.snippet || "").toLowerCase();
    if (TRAIL_RIDE_TOURIST_KEYWORDS.some((kw) => snippetLower.includes(kw))) {
      console.log("⟳  Skipping (trail ride tourist operation)");
      skipped++;
      continue;
    }

    // Fetch website content
    const content = await fetchWebsite(url);
    if (!content) {
      console.log("✗  Could not fetch website");
      errors++;
      continue;
    }

    // Extract structured data with Claude
    const data = await extractBarnData(url, content);
    if (!data) {
      console.log("✗  Could not extract barn data");
      errors++;
      continue;
    }

    // Skip tourist trail ride operations
    if (data.isTrailRideTouristOperation) {
      console.log(`⟳  Skipping (trail ride tourist): ${data.name}`);
      skipped++;
      continue;
    }

    // Skip if no California address and no relevant disciplines
    if (data.state && data.state !== "CA") {
      console.log(`⟳  Skipping (not in CA): ${data.name}`);
      skipped++;
      continue;
    }

    // Check name duplicate
    const normalName = normalizeName(data.name);
    if (existingNames.has(normalName)) {
      console.log(`⟳  Skipping (duplicate name): ${data.name}`);
      skipped++;
      continue;
    }

    // Build unique slug
    let slug = makeSlug(data.name);
    let attempt = 1;
    while (existingSlugs.has(slug)) {
      slug = `${makeSlug(data.name)}-${attempt++}`;
    }

    // Build barn record
    const barnId = uuidv4();
    const now = new Date().toISOString();

    const barnRow = {
      id: barnId,
      owner_id: null,
      name: data.name,
      slug,
      description: data.description || "",
      address: {
        street: data.street || "",
        city: data.city || "",
        state: data.state || "CA",
        zip: data.zip || "",
        lat: 0,
        lng: 0,
      },
      phone: data.phone || "",
      website: url,
      email: data.email || "",
      disciplines: data.disciplines || [],
      amenities: data.amenities || {
        indoorArena: false,
        outdoorArena: false,
        trails: false,
        roundPen: false,
        hotWalker: false,
        washRack: false,
      },
      boarding: {
        types: data.boardingTypes || [],
        stallCount: data.stallCount || 0,
        turnout: "group",
      },
      pricing: {
        boardingFrom: data.boardingPriceFrom || 0,
        lessonsFrom: data.lessonPriceFrom || 0,
        currency: "USD",
      },
      trainers: data.trainers || [],
      lesson_availability: data.lessonAvailability || false,
      horse_leasing: data.horseLeasing || false,
      horse_breeds: [],
      photos: [],
      verified: false,
      accepting_boarders: data.acceptingBoarders ?? null,
      social_media: {
        instagram: data.instagram || undefined,
        facebook: data.facebook || undefined,
      },
      status: "pending",
      created_at: now,
      updated_at: now,
    };

    const { error } = await supabase.from("barns").insert(barnRow);
    if (error) {
      console.log(`✗  DB insert error: ${error.message}`);
      errors++;
    } else {
      console.log(`✓  Added as pending: ${data.name} (${data.city || "?"}, CA)`);
      added++;
      existingDomains.add(domain);
      existingNames.add(normalName);
      existingSlugs.add(slug);
    }

    await sleep(1200); // Be polite to barn websites
  }

  console.log("\n" + "─".repeat(60));
  console.log(`\n✅  Done!`);
  console.log(`   Added (pending review): ${added}`);
  console.log(`   Skipped (duplicates/trail rides): ${skipped}`);
  console.log(`   Errors: ${errors}`);
  console.log(`\nReview pending barns at: /admin/pending-barns\n`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
