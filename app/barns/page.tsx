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

interface PageProps {
  searchParams: Promise<{
    q?: string;
    discipline?: string;
    state?: string;
    amenities?: string;
    boarding?: string;
    lessons?: string;
    services?: string;
    sort?: string;
  }>;
}

export default async function BrowseBarnsPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase() || "";
  let barns = await getBarns();

  // Text search
  if (query) {
    barns = barns.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.address.city.toLowerCase().includes(query) ||
        b.address.state.toLowerCase().includes(query) ||
        b.description.toLowerCase().includes(query) ||
        b.disciplines.some((d) => d.toLowerCase().includes(query))
    );
  }

  // Discipline filter
  if (params.discipline) {
    const disciplines = params.discipline.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      disciplines.some((d) => b.disciplines.includes(d))
    );
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

  // Lessons filter
  if (params.lessons === "true") {
    barns = barns.filter((b) => b.lessonAvailability);
  }

  // Boarding type filter
  if (params.boarding) {
    const boardingTypes = params.boarding.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      boardingTypes.some((bt) => b.boarding.types.includes(bt))
    );
  }

  // Services filter
  if (params.services) {
    const services = params.services.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      services.every((s) => (b.services || []).includes(s))
    );
  }

  // Sorting
  if (params.sort) {
    const sortFns: Record<string, (a: Barn, b: Barn) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      "price-low": (a, b) => a.pricing.boardingFrom - b.pricing.boardingFrom,
      "price-high": (a, b) => b.pricing.boardingFrom - a.pricing.boardingFrom,
      newest: (a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    };
    const fn = sortFns[params.sort];
    if (fn) barns.sort(fn);
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900 mb-4">Browse Barns</h1>
        <SearchBar initialQuery={params.q || ""} />
      </div>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar filters */}
        <div className="w-full lg:w-64 flex-shrink-0">
          <Suspense fallback={<div className="bg-white border border-gray-200 rounded-xl p-5 animate-pulse h-96" />}>
            <SearchFilters />
          </Suspense>
        </div>

        {/* Results */}
        <div className="flex-1">
          <BarnResults barns={barns} ratings={{}} />
        </div>
      </div>
    </div>
  );
}
