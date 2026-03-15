/**
 * Adds the 'services' text[] column to the Supabase 'barns' table.
 *
 * This script calls the Supabase REST API with the service role key to execute
 * the DDL statement via a raw SQL RPC call.
 *
 * Usage:
 *   npx tsx --env-file=.env.local scripts/add-services-column.ts
 *
 * If the exec_sql RPC is not available in your project, run this SQL manually
 * in the Supabase SQL editor:
 *
 *   ALTER TABLE barns
 *   ADD COLUMN IF NOT EXISTS services text[] NOT NULL DEFAULT ARRAY[]::text[];
 */

const SUPABASE_URL = process.env.SUPABASE_URL!;
const SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY!;

if (!SUPABASE_URL || !SERVICE_ROLE_KEY) {
  console.error("Missing SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in environment.");
  process.exit(1);
}

const sql = `
  ALTER TABLE barns
  ADD COLUMN IF NOT EXISTS services text[] NOT NULL DEFAULT ARRAY[]::text[];
`.trim();

async function addServicesColumn() {
  console.log("Adding 'services' column to barns table...");

  const res = await fetch(`${SUPABASE_URL}/rest/v1/rpc/exec_sql`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      apikey: SERVICE_ROLE_KEY,
      Authorization: `Bearer ${SERVICE_ROLE_KEY}`,
    },
    body: JSON.stringify({ sql_query: sql }),
  });

  if (res.ok) {
    console.log("✓ Column added (or already exists).");
    return;
  }

  const body = await res.text();

  if (res.status === 404 || body.includes("Could not find the function")) {
    console.warn("exec_sql RPC not available. Please run the following SQL in the Supabase SQL editor:");
    console.warn(`\n  ${sql}\n`);
  } else {
    console.error(`Failed (HTTP ${res.status}):`, body);
    process.exit(1);
  }
}

addServicesColumn().catch((err) => {
  console.error("Unexpected error:", err);
  process.exit(1);
});
