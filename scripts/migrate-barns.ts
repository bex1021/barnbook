/**
 * Migrate existing barns.json data into Supabase.
 *
 * Usage:
 *   1. Copy .env.local.example to .env.local and fill in your Supabase credentials
 *   2. Run: npx tsx scripts/migrate-barns.ts
 */

import { createClient } from "@supabase/supabase-js";
import barns from "../data/barns.json";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function migrate() {
  console.log(`Migrating ${barns.length} barns...`);

  // Fetch existing barn IDs so we don't overwrite active barns
  const { data: existing } = await supabase.from("barns").select("id");
  const existingIds = new Set((existing || []).map((b: { id: string }) => b.id));
  console.log(`Found ${existingIds.size} existing barns in Supabase`);

  let inserted = 0;
  let skipped = 0;

  for (const barn of barns) {
    if (existingIds.has(barn.id)) {
      skipped++;
      continue;
    }

    const { error } = await supabase.from("barns").insert({
      id: barn.id,
      owner_id: null,
      name: barn.name,
      slug: barn.slug,
      description: barn.description,
      address: barn.address,
      phone: barn.phone ?? "",
      website: barn.website ?? "",
      email: barn.email ?? "",
      disciplines: barn.disciplines ?? [],
      amenities: barn.amenities,
      boarding: barn.boarding,
      pricing: barn.pricing,
      trainers: barn.trainers ?? [],
      lesson_availability: barn.lessonAvailability,
      horse_breeds: barn.horseBreeds ?? [],
      photos: barn.photos ?? [],
      services: (barn as unknown as { services?: string[] }).services ?? [],
      status: "pending",
      created_at: barn.createdAt,
      updated_at: barn.updatedAt,
    });

    if (error) {
      console.error(`Failed to insert "${barn.name}":`, error.message);
    } else {
      inserted++;
      console.log(`  ✓ ${barn.name}`);
    }
  }

  console.log(`\nDone! Inserted ${inserted} new barns, skipped ${skipped} existing.`);
}

migrate().catch(console.error);
