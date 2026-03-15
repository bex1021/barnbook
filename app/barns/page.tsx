import type { Metadata } from "next";
import { Suspense } from "react";
import { getBarns } from "@/lib/data";
import SearchBar from "@/components/SearchBar";
import SearchFilters from "@/components/SearchFilters";
import BarnResults from "@/components/BarnResults";
import { Barn } from "@/lib/types";

export const metadata: Metadata = {
  title: "Browse Barns | Barnbook",
  description: "Search and filter horse barns and farms by discipline, amenities, location, and more.",
};

const ZIP_REGEX = /^\d{5}$/;
const CITY_STATE_REGEX = /^([^,]+),\s*([A-Za-z]{2})$/;
const PAGE_SIZE = 24;

interface GeoCoords {
  lat: number;
  lng: number;
}

async function geocodeQuery(query: string): Promise<GeoCoords | null> {
  try {
    let url: string;
    if (ZIP_REGEX.test(query)) {
      url = `https://nominatim.openstreetmap.org/search?postalcode=${encodeURIComponent(query)}&country=US&format=json&limit=1`;
    } else {
      const match = query.match(CITY_STATE_REGEX);
      if (!match) return null;
      url = `https://nominatim.openstreetmap.org/search?city=${encodeURIComponent(match[1].trim())}&state=${encodeURIComponent(match[2].trim())}&country=US&format=json&limit=1`;
    }
    const res = await fetch(url, {
      headers: { "User-Agent": "Barnbook/1.0" },
      next: { revalidate: 86400 },
    });
    const data = await res.json();
    if (!data[0]) return null;
    return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
  } catch {
    return null;
  }
}

function haversine(lat1: number, lng1: number, lat2: number, lng2: number): number {
  const R = 3958.8;
  const dLat = ((lat2 - lat1) * Math.PI) / 180;
  const dLng = ((lng2 - lng1) * Math.PI) / 180;
  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos((lat1 * Math.PI) / 180) *
      Math.cos((lat2 * Math.PI) / 180) *
      Math.sin(dLng / 2) ** 2;
  return R * 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
}

interface PageProps {
  searchParams: Promise<{
    q?: string;
    discipline?: string;
    state?: string;
    amenities?: string;
    boarding?: string;
    services?: string;
    sort?: string;
    radius?: string;
    page?: string;
  }>;
}

export default async function BrowseBarnsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.trim() || "";
  const radius = parseInt(params.radius || "25", 10);
  const page = Math.max(1, parseInt(params.page || "1", 10));
  let barns = await getBarns();

  // Derive states from actual barn data
  const allStates = [...new Set(barns.map((b) => b.address.state).filter(Boolean))].sort();

  // Geo search detection
  const isGeoSearch = ZIP_REGEX.test(query) || CITY_STATE_REGEX.test(query);
  let distanceMap: Record<string, number> = {};

  if (isGeoSearch) {
    const geo = await geocodeQuery(query);
    if (geo) {
      const withDist = barns
        .map((b) => {
          if (!b.address.lat || !b.address.lng) return null;
          const dist = Math.round(haversine(geo.lat, geo.lng, b.address.lat, b.address.lng));
          return dist <= radius ? { barn: b, dist } : null;
        })
        .filter((x): x is { barn: Barn; dist: number } => x !== null);
      withDist.sort((a, b) => a.dist - b.dist);
      barns = withDist.map((x) => x.barn);
      for (const { barn, dist } of withDist) distanceMap[barn.id] = dist;
    } else {
      barns = [];
    }
  } else if (query) {
    const q = query.toLowerCase();
    barns = barns.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.city.toLowerCase().includes(q) ||
        b.address.state.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.disciplines.some((d) => d.toLowerCase().includes(q))
    );
  }

  // Discipline filter
  if (params.discipline) {
    const disciplines = params.discipline.split(",").filter(Boolean);
    barns = barns.filter((b) => disciplines.some((d) => b.disciplines.includes(d)));
  }

  // State filter
  if (params.state) {
    barns = barns.filter(
      (b) => b.address.state.toLowerCase() === params.state!.toLowerCase()
    );
  }

  // Amenities filter
  if (params.amenities) {
    const amenities = params.amenities.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      amenities.every((a) => b.amenities[a as keyof typeof b.amenities])
    );
  }

  // Boarding type filter
  if (params.boarding) {
    const boardingTypes = params.boarding.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      boardingTypes.some((bt) => b.boarding.types.includes(bt))
    );
  }

  // Services filter — 'lessons' checks both lessonAvailability and services array
  if (params.services) {
    const services = params.services.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      services.every((s) => {
        if (s === "lessons") {
          return b.lessonAvailability || (b.services || []).includes("lessons");
        }
        return (b.services || []).includes(s);
      })
    );
  }

  // Sorting (skipped for geo search — results are already sorted by distance)
  if (params.sort && !isGeoSearch) {
    const sortFns: Record<string, (a: Barn, b: Barn) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      "price-low": (a, b) => a.pricing.boardingFrom - b.pricing.boardingFrom,
      "price-high": (a, b) => b.pricing.boardingFrom - a.pricing.boardingFrom,
      newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    };
    const fn = sortFns[params.sort];
    if (fn) barns.sort(fn);
  }

  // Pagination
  const total = barns.length;
  const pagedBarns = barns.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Barns</h1>
        <SearchBar
          initialQuery={params.q || ""}
          initialRadius={params.radius || "25"}
        />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        <div className="w-full lg:w-64 flex-shrink-0">
          <Suspense fallback={<div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse h-96" />}>
            <SearchFilters states={allStates} />
          </Suspense>
        </div>

        <div className="flex-1">
          <BarnResults
            barns={pagedBarns}
            ratings={{}}
            distanceMap={distanceMap}
            total={total}
            page={page}
            pageSize={PAGE_SIZE}
          />
        </div>
      </div>
    </div>
  );
}
