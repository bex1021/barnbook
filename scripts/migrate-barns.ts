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

  for (const barn of barns) {
    const { error } = await supabase.from("barns").upsert(
      {
        id: barn.id,
        owner_id: null, // existing barns have no owner until claimed
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
        created_at: barn.createdAt,
        updated_at: barn.updatedAt,
      },
      { onConflict: "id" }
    );

    if (error) {
      console.error(`Failed to migrate "${barn.name}":`, error.message);
    } else {
      console.log(`  ✓ ${barn.name}`);
    }
  }

  console.log("Migration complete.");
}

migrate().catch(console.error);
