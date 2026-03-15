/**
 * Backfill 'services' field in data/barns.json based on existing barn data.
 *
 * Rules:
 *   - boarding.types non-empty → 'boarding'
 *   - trainers non-empty OR description mentions "training" → 'training'
 *   - lessonAvailability truthy OR description mentions "lesson" → 'lessons'
 *   - horseLeasing true OR description mentions "leas" → 'leasing'
 *
 * Usage: npx tsx scripts/backfill-services.ts
 */

import { readFileSync, writeFileSync } from "fs";
import { resolve } from "path";

const barnsPath = resolve(__dirname, "../data/barns.json");

interface RawBarn {
  id: string;
  description?: string;
  boarding?: { types?: string[] };
  trainers?: unknown[];
  lessonAvailability?: boolean;
  horseLeasing?: boolean;
  services?: string[];
  [key: string]: unknown;
}

const barns: RawBarn[] = JSON.parse(readFileSync(barnsPath, "utf-8"));

let updated = 0;

for (const barn of barns) {
  const desc = (barn.description || "").toLowerCase();
  const services: string[] = [];

  if ((barn.boarding?.types?.length ?? 0) > 0) {
    services.push("boarding");
  }
  if ((barn.trainers?.length ?? 0) > 0 || desc.includes("training")) {
    services.push("training");
  }
  if (barn.lessonAvailability || desc.includes("lesson")) {
    services.push("lessons");
  }
  if (barn.horseLeasing === true || desc.includes("leas")) {
    services.push("leasing");
  }

  barn.services = services;
  updated++;
}

writeFileSync(barnsPath, JSON.stringify(barns, null, 2));
console.log(`Updated ${updated} barns with services field.`);
