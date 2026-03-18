/**
 * Photo audit script — classifies barn images using Claude vision.
 *
 * Usage:
 *   tsx --env-file=.env.local scripts/audit-photos.ts
 *   tsx --env-file=.env.local scripts/audit-photos.ts --dry-run
 */

import Anthropic from "@anthropic-ai/sdk";
import { readdirSync, readFileSync, writeFileSync } from "fs";
import { join, extname, basename } from "path";

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
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1);
    }
    process.env[key] = value;
  }
} catch { /* rely on existing env */ }

// ── Config ────────────────────────────────────────────────────────────────────

const IMAGES_DIR = join(process.cwd(), "public/images/barns");
const OUTPUT_FILE = join(process.cwd(), "scripts/photo-audit-results.json");
const MODEL = "claude-sonnet-4-6";
const BATCH_SIZE = 5;
const BATCH_DELAY_MS = 2000;
const SUPPORTED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

type Category =
  | "facility"
  | "horses"
  | "logo"
  | "map"
  | "screenshot"
  | "stock"
  | "unrelated"
  | "low_quality";

interface ClassificationResult {
  file: string;
  category: Category;
  confidence: number;
  reason: string;
  keep: boolean;
  error?: string;
}

interface AuditOutput {
  results: ClassificationResult[];
  summary: {
    total: number;
    keep: number;
    reject: number;
    byCategory: Record<string, number>;
  };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

function getMediaType(
  ext: string
): "image/jpeg" | "image/png" | "image/webp" | "image/gif" {
  switch (ext.toLowerCase()) {
    case ".jpg":
    case ".jpeg":
      return "image/jpeg";
    case ".png":
      return "image/png";
    case ".webp":
      return "image/webp";
    default:
      return "image/jpeg";
  }
}

function sleep(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function shouldKeep(category: Category, confidence: number): boolean {
  return (category === "facility" || category === "horses") && confidence > 0.7;
}

// ── Core classification ────────────────────────────────────────────────────────

async function classifyImage(
  client: Anthropic,
  imagePath: string
): Promise<ClassificationResult> {
  const file = basename(imagePath);
  const ext = extname(imagePath);
  const mediaType = getMediaType(ext);

  try {
    const imageData = readFileSync(imagePath).toString("base64");

    const response = await client.messages.create({
      model: MODEL,
      max_tokens: 256,
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image",
              source: {
                type: "base64",
                media_type: mediaType,
                data: imageData,
              },
            },
            {
              type: "text",
              text: `Classify this image for an equestrian barn directory website.

Respond with ONLY a JSON object (no markdown, no extra text):
{
  "category": "<one of: facility, horses, logo, map, screenshot, stock, unrelated, low_quality>",
  "confidence": <0.0 to 1.0>,
  "reason": "<brief one-sentence explanation>"
}

Category definitions:
- facility: Photos of the actual barn, arena, stables, pastures, paddocks, or grounds
- horses: Photos clearly featuring horses (at the barn or in action)
- logo: Brand logos, text-only images, or icon graphics
- map: Maps, directions, or location screenshots
- screenshot: Screenshots of websites, social media, or apps
- stock: Generic stock photos not specific to this barn
- unrelated: People, events, food, or anything not barn/horse related
- low_quality: Blurry, too dark, extremely low resolution, or otherwise unusable`,
            },
          ],
        },
      ],
    });

    const textBlock = response.content.find((b) => b.type === "text");
    if (!textBlock || textBlock.type !== "text") {
      throw new Error("No text in response");
    }

    // Strip potential markdown code fences
    const raw = textBlock.text.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "").trim();
    const parsed = JSON.parse(raw) as {
      category: Category;
      confidence: number;
      reason: string;
    };

    return {
      file,
      category: parsed.category,
      confidence: parsed.confidence,
      reason: parsed.reason,
      keep: shouldKeep(parsed.category, parsed.confidence),
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : String(err);
    console.error(`  ✗ Error processing ${file}: ${message}`);
    return {
      file,
      category: "low_quality",
      confidence: 0,
      reason: "Processing error",
      keep: false,
      error: message,
    };
  }
}

// ── Main ──────────────────────────────────────────────────────────────────────

async function main() {
  const isDryRun = process.argv.includes("--dry-run");

  const apiKey = process.env.ANTHROPIC_API_KEY;
  if (!apiKey) {
    console.error("Error: ANTHROPIC_API_KEY is not set.");
    process.exit(1);
  }

  const client = new Anthropic({ apiKey });

  // Gather image files
  let imageFiles = readdirSync(IMAGES_DIR)
    .filter((f) => SUPPORTED_EXTENSIONS.has(extname(f).toLowerCase()))
    .map((f) => join(IMAGES_DIR, f));

  if (isDryRun) {
    imageFiles = imageFiles.slice(0, 5);
    console.log(`\n🔍 DRY RUN — processing first ${imageFiles.length} images\n`);
  } else {
    console.log(`\n🐎 Photo Audit — processing ${imageFiles.length} images\n`);
  }

  // Process in batches
  const results: ClassificationResult[] = [];
  const batches: string[][] = [];
  for (let i = 0; i < imageFiles.length; i += BATCH_SIZE) {
    batches.push(imageFiles.slice(i, i + BATCH_SIZE));
  }

  for (let batchIdx = 0; batchIdx < batches.length; batchIdx++) {
    const batch = batches[batchIdx];
    console.log(
      `Batch ${batchIdx + 1}/${batches.length} (${batch.length} images):`
    );

    const batchResults = await Promise.all(
      batch.map(async (imagePath) => {
        const file = basename(imagePath);
        process.stdout.write(`  • ${file} ... `);
        const result = await classifyImage(client, imagePath);
        const keepStr = result.keep ? "✓ keep" : "✗ reject";
        console.log(
          `${keepStr} [${result.category}, ${(result.confidence * 100).toFixed(0)}%]`
        );
        return result;
      })
    );

    results.push(...batchResults);

    if (batchIdx < batches.length - 1) {
      process.stdout.write(
        `  Waiting ${BATCH_DELAY_MS / 1000}s before next batch...\n`
      );
      await sleep(BATCH_DELAY_MS);
    }
  }

  // Build summary
  const byCategory: Record<string, number> = {};
  for (const r of results) {
    byCategory[r.category] = (byCategory[r.category] ?? 0) + 1;
  }

  const keepCount = results.filter((r) => r.keep).length;
  const output: AuditOutput = {
    results,
    summary: {
      total: results.length,
      keep: keepCount,
      reject: results.length - keepCount,
      byCategory,
    },
  };

  writeFileSync(OUTPUT_FILE, JSON.stringify(output, null, 2));

  // Print summary
  console.log("\n─────────────────────────────────────");
  console.log("📊 Summary");
  console.log("─────────────────────────────────────");
  console.log(`Total images:  ${output.summary.total}`);
  console.log(`Keep:          ${output.summary.keep}`);
  console.log(`Reject:        ${output.summary.reject}`);
  console.log("\nBy category:");
  for (const [cat, count] of Object.entries(byCategory).sort(
    ([, a], [, b]) => b - a
  )) {
    const bar = "█".repeat(Math.round((count / results.length) * 20));
    console.log(`  ${cat.padEnd(12)} ${String(count).padStart(3)}  ${bar}`);
  }
  console.log(`\nResults written to: ${OUTPUT_FILE}`);

  if (isDryRun) {
    console.log("\n(Dry run complete — re-run without --dry-run to process all images)");
  }
}

main().catch((err) => {
  console.error("Fatal error:", err);
  process.exit(1);
});
