/**
 * Re-sync barns from data/barns.json into Supabase.
 *
 * Finds barns that exist in barns.json but are missing from Supabase,
 * then re-inserts them with status 'pending'.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/resync-barns.ts
 */

import { createClient } from "@supabase/supabase-js";
import barns from "../data/barns.json";

const supabase = createClient(
  process.env.SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

async function resync() {
  console.log(`Checking ${barns.length} barns from barns.json against Supabase...`);

  // Fetch all barn IDs currently in Supabase (any status)
  const { data: existing, error: fetchError } = await supabase
    .from("barns")
    .select("id");

  if (fetchError) {
    console.error("Failed to fetch existing barns:", fetchError.message);
    process.exit(1);
  }

  const existingIds = new Set((existing || []).map((b: { id: string }) => b.id));
  console.log(`Found ${existingIds.size} barns currently in Supabase.\n`);

  // Find barns in barns.json that are missing from Supabase
  const missing = barns.filter((b) => !existingIds.has(b.id));
  console.log(`Found ${missing.length} barn(s) missing from Supabase.`);

  if (missing.length === 0) {
    console.log("Nothing to recover. All barns are already in Supabase.");
    return;
  }

  let recovered = 0;
  const failed: string[] = [];

  for (const barn of missing) {
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
      console.error(`  ✗ "${barn.name}" — ${error.message}`);
      failed.push(barn.name);
    } else {
      console.log(`  ✓ Recovered: ${barn.name} (${barn.address?.city}, ${barn.address?.state})`);
      recovered++;
    }
  }

  console.log(`\nDone!`);
  console.log(`  Recovered: ${recovered}`);
  if (failed.length > 0) {
    console.log(`  Failed:    ${failed.length}`);
    failed.forEach((name) => console.log(`    - ${name}`));
  }
}

resync().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
