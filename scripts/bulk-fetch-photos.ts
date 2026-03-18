/**
 * Bulk Photo Fetcher for Barnbook
 * Fetches photos for barns with empty photos arrays from their websites.
 * Run with: npx tsx --env-file=.env.local scripts/bulk-fetch-photos.ts
 */

import { createClient } from "@supabase/supabase-js";
import * as fs from "fs";
import * as path from "path";
import { exec } from "child_process";
import { promisify } from "util";

const execAsync = promisify(exec);

const BARNS_JSON = path.join(process.cwd(), "data/barns.json");
const IMAGES_DIR = path.join(process.cwd(), "public/images/barns");
const USER_AGENT = "Barnbook/1.0";
const MIN_FILE_SIZE = 20 * 1024; // 20KB
const FETCH_TIMEOUT = 15_000; // 15s
const RATE_LIMIT_MS = 1_000; // 1s between requests

const SKIP_PATTERNS = [
  "logo",
  "icon",
  "favicon",
  "social",
  "facebook",
  "instagram",
  "twitter",
  "badge",
  "seal",
  "award",
  "banner",
  "sprite",
  "button",
  "arrow",
  "nav-",
  "menu-",
  "widget",
  "thumbnail",
  "thumb-",
  "-150x",
  "-100x",
  "-50x",
  "-75x",
  "-48x",
  "-32x",
  "watermark",
  "stock",
  "maps.googleapis",
  "maps.gstatic",
  "google.com/maps",
  "pixel.gif",
  "tracking",
  "spacer",
  "blank",
  "placeholder",
];

// Priority patterns: higher score = better candidate
const PRIORITY_PATTERNS: Array<{ pattern: RegExp; score: number }> = [
  { pattern: /aerial|drone|overhead|birds.eye/i, score: 100 },
  { pattern: /facility|property|farm|ranch|barn|estate/i, score: 80 },
  { pattern: /arena|ring|paddock|pasture|field/i, score: 70 },
  { pattern: /horse|equine|equestrian/i, score: 60 },
  { pattern: /exterior|outside|grounds|landscape/i, score: 50 },
  { pattern: /gallery|photo|image/i, score: 20 },
];

interface Barn {
  id: string;
  name: string;
  slug: string;
  website?: string;
  photos: string[];
  [key: string]: unknown;
}

interface ImageCandidate {
  url: string;
  score: number;
}

// ─── Supabase ────────────────────────────────────────────────────────────────

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseKey) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in env");
  process.exit(1);
}

const supabase = createClient(supabaseUrl, supabaseKey);

// ─── Helpers ─────────────────────────────────────────────────────────────────

function shouldSkipUrl(url: string): boolean {
  const lower = url.toLowerCase();
  return SKIP_PATTERNS.some((p) => lower.includes(p));
}

function scoreImageUrl(url: string, alt: string = ""): number {
  if (shouldSkipUrl(url)) return -1;
  const combined = (url + " " + alt).toLowerCase();
  let score = 0;
  for (const { pattern, score: s } of PRIORITY_PATTERNS) {
    if (pattern.test(combined)) score += s;
  }
  return score;
}

function resolveUrl(imgUrl: string, baseUrl: string): string | null {
  try {
    if (imgUrl.startsWith("//")) return "https:" + imgUrl;
    if (imgUrl.startsWith("/")) {
      const base = new URL(baseUrl);
      return `${base.protocol}//${base.host}${imgUrl}`;
    }
    if (imgUrl.startsWith("http")) return imgUrl;
    // Relative URL
    const base = new URL(baseUrl);
    return new URL(imgUrl, base).toString();
  } catch {
    return null;
  }
}

function extractImageCandidates(html: string, pageUrl: string): ImageCandidate[] {
  const candidates: ImageCandidate[] = [];

  // Match <img src="..." alt="..."> tags
  const imgTagRegex = /<img[^>]+>/gi;
  let match;
  while ((match = imgTagRegex.exec(html)) !== null) {
    const tag = match[0];

    // Extract src or data-src or data-lazy-src
    const srcMatch = tag.match(/(?:data-lazy-src|data-src|src)=["']([^"']+)["']/i);
    if (!srcMatch) continue;
    const rawSrc = srcMatch[1];

    // Skip data URIs
    if (rawSrc.startsWith("data:")) continue;

    // Only accept image extensions or ambiguous URLs
    if (
      rawSrc.match(/\.(svg|gif)(\?|$)/i) ||
      rawSrc.match(/\.(css|js|html|php)(\?|$)/i)
    )
      continue;

    const resolved = resolveUrl(rawSrc, pageUrl);
    if (!resolved) continue;

    const altMatch = tag.match(/alt=["']([^"']*)["']/i);
    const alt = altMatch ? altMatch[1] : "";

    const score = scoreImageUrl(resolved, alt);
    if (score < 0) continue;

    candidates.push({ url: resolved, score });
  }

  // Also match background-image CSS patterns and og:image meta
  const bgRegex = /background-image:\s*url\(['"]?([^'")\s]+)['"]?\)/gi;
  while ((match = bgRegex.exec(html)) !== null) {
    const resolved = resolveUrl(match[1], pageUrl);
    if (!resolved) continue;
    const score = scoreImageUrl(resolved);
    if (score < 0) continue;
    candidates.push({ url: resolved, score: score + 10 }); // slight boost for hero bg
  }

  // og:image (often highest quality)
  const ogMatch = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  if (ogMatch) {
    const resolved = resolveUrl(ogMatch[1], pageUrl);
    if (resolved && !shouldSkipUrl(resolved)) {
      candidates.push({ url: resolved, score: 90 }); // og:image gets high score
    }
  }

  // twitter:image
  const twMatch = html.match(/<meta[^>]+name=["']twitter:image["'][^>]+content=["']([^"']+)["']/i)
    || html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+name=["']twitter:image["']/i);
  if (twMatch) {
    const resolved = resolveUrl(twMatch[1], pageUrl);
    if (resolved && !shouldSkipUrl(resolved)) {
      candidates.push({ url: resolved, score: 85 });
    }
  }

  return candidates;
}

async function fetchHtml(url: string): Promise<string | null> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(url, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return null;
    const ct = res.headers.get("content-type") || "";
    if (!ct.includes("html")) return null;
    return await res.text();
  } catch {
    return null;
  }
}

async function downloadImage(imgUrl: string, destPath: string): Promise<boolean> {
  try {
    const controller = new AbortController();
    const timer = setTimeout(() => controller.abort(), FETCH_TIMEOUT);
    const res = await fetch(imgUrl, {
      headers: { "User-Agent": USER_AGENT },
      signal: controller.signal,
      redirect: "follow",
    });
    clearTimeout(timer);
    if (!res.ok) return false;

    const buf = Buffer.from(await res.arrayBuffer());
    fs.writeFileSync(destPath, buf);
    return true;
  } catch {
    return false;
  }
}

async function validateImage(filePath: string): Promise<{ valid: boolean; size: number }> {
  const size = fs.existsSync(filePath) ? fs.statSync(filePath).size : 0;

  if (size < MIN_FILE_SIZE) {
    return { valid: false, size };
  }

  try {
    const { stdout } = await execAsync(`file "${filePath}"`);
    const lower = stdout.toLowerCase();
    // Reject HTML, text files, XML etc.
    if (
      lower.includes("html") ||
      lower.includes("ascii text") ||
      lower.includes("utf-8 text") ||
      lower.includes("xml") ||
      lower.includes("json")
    ) {
      return { valid: false, size };
    }
    // Must be an image type
    const isImage =
      lower.includes("jpeg") ||
      lower.includes("png") ||
      lower.includes("gif") ||
      lower.includes("webp") ||
      lower.includes("bitmap") ||
      lower.includes("image data");
    return { valid: isImage, size };
  } catch {
    return { valid: false, size };
  }
}

function guessExtension(imgUrl: string, contentType?: string): string {
  if (contentType?.includes("png")) return ".png";
  if (contentType?.includes("webp")) return ".webp";
  if (contentType?.includes("gif")) return ".gif";
  const urlExt = imgUrl.match(/\.(jpg|jpeg|png|webp|gif)(\?|$)/i);
  if (urlExt) return "." + urlExt[1].toLowerCase().replace("jpeg", "jpg");
  return ".jpg";
}

async function findBestPhoto(
  website: string
): Promise<string | null> {
  const pagesToTry = [
    website,
    website.replace(/\/$/, "") + "/about",
    website.replace(/\/$/, "") + "/facility",
    website.replace(/\/$/, "") + "/our-facility",
    website.replace(/\/$/, "") + "/the-farm",
    website.replace(/\/$/, "") + "/gallery",
    website.replace(/\/$/, "") + "/photos",
  ];

  const allCandidates: ImageCandidate[] = [];

  for (const pageUrl of pagesToTry) {
    const html = await fetchHtml(pageUrl);
    if (html) {
      const found = extractImageCandidates(html, pageUrl);
      allCandidates.push(...found);
    }
    // Only rate-limit between website fetches (not subpages - they're same domain)
    if (pageUrl !== website) await sleep(300);
    // Stop early if we already have high-confidence candidates
    if (allCandidates.some((c) => c.score >= 80)) break;
  }

  if (allCandidates.length === 0) return null;

  // Deduplicate by URL
  const seen = new Set<string>();
  const unique = allCandidates.filter((c) => {
    if (seen.has(c.url)) return false;
    seen.add(c.url);
    return true;
  });

  // Sort by score descending
  unique.sort((a, b) => b.score - a.score);

  return unique[0].url;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

async function updateSupabase(barnId: string, photos: string[]): Promise<void> {
  const { error } = await supabase
    .from("barns")
    .update({ photos })
    .eq("id", barnId);
  if (error) {
    console.error(`    Supabase error for ${barnId}:`, error.message);
  }
}

// ─── Main ─────────────────────────────────────────────────────────────────────

async function main() {
  fs.mkdirSync(IMAGES_DIR, { recursive: true });

  const barns: Barn[] = JSON.parse(fs.readFileSync(BARNS_JSON, "utf8"));

  // Barns to process:
  // 1. Empty photos + have website
  // 2. Broken photos (files pointing to missing images)
  const toProcess: Barn[] = [];

  for (const barn of barns) {
    if (!barn.website) continue;

    if (!barn.photos || barn.photos.length === 0) {
      toProcess.push(barn);
      continue;
    }

    // Check for broken photo references
    const allMissing = barn.photos.every((photo) => {
      const fullPath = path.join(IMAGES_DIR, photo);
      return !fs.existsSync(fullPath);
    });
    if (allMissing && barn.photos.length > 0) {
      console.log(`  [broken] ${barn.name} — photo file(s) missing: ${barn.photos.join(", ")}`);
      toProcess.push(barn);
    }
  }

  console.log(`\nBarns to process: ${toProcess.length}`);
  console.log("─".repeat(60));

  let successCount = 0;
  let skipCount = 0;
  let failCount = 0;

  for (let i = 0; i < toProcess.length; i++) {
    const barn = toProcess[i];
    const prefix = `[${i + 1}/${toProcess.length}] ${barn.name}`;
    console.log(`\n${prefix}`);
    console.log(`  website: ${barn.website}`);

    // Find best photo URL from website
    let bestUrl: string | null = null;
    try {
      bestUrl = await findBestPhoto(barn.website!);
    } catch (err) {
      console.log(`  ✗ Error fetching website: ${err}`);
      failCount++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    if (!bestUrl) {
      console.log(`  ✗ No suitable image found`);
      skipCount++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    console.log(`  → Trying: ${bestUrl.substring(0, 100)}`);

    // Determine output extension and path
    const ext = guessExtension(bestUrl);
    const filename = `${barn.slug}${ext}`;
    const destPath = path.join(IMAGES_DIR, filename);

    // Download
    const downloaded = await downloadImage(bestUrl, destPath);
    if (!downloaded) {
      console.log(`  ✗ Download failed`);
      failCount++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    // Validate
    const { valid, size } = await validateImage(destPath);
    if (!valid) {
      fs.unlinkSync(destPath);
      console.log(`  ✗ Invalid image (size: ${size} bytes)`);
      failCount++;
      await sleep(RATE_LIMIT_MS);
      continue;
    }

    console.log(`  ✓ Saved ${filename} (${(size / 1024).toFixed(1)} KB)`);

    // Update barns.json in memory
    const barnInArray = barns.find((b) => b.id === barn.id);
    if (barnInArray) {
      barnInArray.photos = [filename];
      barnInArray.updatedAt = new Date().toISOString();
    }

    // Update Supabase
    await updateSupabase(barn.id, [filename]);

    successCount++;

    // Rate limit between barn websites
    await sleep(RATE_LIMIT_MS);
  }

  // Write updated barns.json
  console.log("\n─".repeat(60));
  console.log("Writing updated barns.json...");
  fs.writeFileSync(BARNS_JSON, JSON.stringify(barns, null, 2));

  console.log(`\nDone!`);
  console.log(`  ✓ Success: ${successCount}`);
  console.log(`  ✗ No image found: ${skipCount}`);
  console.log(`  ✗ Failed: ${failCount}`);
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
