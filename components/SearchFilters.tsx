"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback } from "react";

const DISCIPLINES = ["dressage", "hunter jumper", "western", "eventing", "trail", "polo"];
const STATES = ["AZ", "CA", "CO", "CT", "FL", "GA", "IL", "KS", "KY", "MO", "NC", "NJ", "NY", "OH", "OR", "SC", "TX", "VA", "WA"];
const AMENITIES = [
  { key: "indoorArena", label: "Indoor Arena" },
  { key: "outdoorArena", label: "Outdoor Arena" },
  { key: "trails", label: "Trails" },
  { key: "roundPen", label: "Round Pen" },
  { key: "hotWalker", label: "Hot Walker" },
  { key: "washRack", label: "Wash Rack" },
];
const BOARDING_TYPES = ["full", "partial", "pasture", "self-care"];
const SORT_OPTIONS = [
  { value: "name", label: "Name (A-Z)" },
  { value: "price-low", label: "Price (Low to High)" },
  { value: "price-high", label: "Price (High to Low)" },
  { value: "newest", label: "Newest" },
];

export default function SearchFilters() {
  const router = useRouter();
  const searchParams = useSearchParams();

  const updateParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        params.set(key, value);
      } else {
        params.delete(key);
      }
      router.push(`/barns?${params.toString()}`);
    },
    [router, searchParams]
  );

  const toggleArrayParam = useCallback(
    (key: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      const current = params.get(key)?.split(",").filter(Boolean) || [];
      const updated = current.includes(value)
        ? current.filter((v) => v !== value)
        : [...current, value];
      if (updated.length > 0) {
        params.set(key, updated.join(","));
      } else {
        params.delete(key);
      }
      router.push(`/barns?${params.toString()}`);
    },
    [router, searchParams]
  );

  const getArrayParam = (key: string) =>
    searchParams.get(key)?.split(",").filter(Boolean) || [];

  const clearAll = () => {
    router.push("/barns");
  };

  const activeDisciplines = getArrayParam("discipline");
  const activeAmenities = getArrayParam("amenities");
  const activeBoardingTypes = getArrayParam("boarding");
  const lessonsOnly = searchParams.get("lessons") === "true";
  const hasFilters =
    activeDisciplines.length > 0 ||
    activeAmenities.length > 0 ||
    activeBoardingTypes.length > 0 ||
    lessonsOnly ||
    searchParams.get("state") ||
    searchParams.get("sort");

  return (
    <div className="bg-white border border-gray-200 rounded-xl p-5 space-y-6">
      <div className="flex items-center justify-between">
        <h3 className="font-semibold text-gray-900">Filters</h3>
        {hasFilters && (
          <button onClick={clearAll} className="text-sm text-red-500 hover:text-red-700">
            Clear all
          </button>
        )}
      </div>

      {/* Lessons */}
      <div>
        <label className="flex items-center gap-2 cursor-pointer">
          <input
            type="checkbox"
            checked={lessonsOnly}
            onChange={() => updateParam("lessons", lessonsOnly ? "" : "true")}
            className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
          />
          <span className="text-sm font-medium text-gray-700">Lessons Available</span>
        </label>
      </div>

      {/* Sort */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">Sort by</label>
        <select
          value={searchParams.get("sort") || ""}
          onChange={(e) => updateParam("sort", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]"
        >
          <option value="">Default</option>
          {SORT_OPTIONS.map((opt) => (
            <option key={opt.value} value={opt.value}>
              {opt.label}
            </option>
          ))}
        </select>
      </div>

      {/* State */}
      <div>
        <label className="text-sm font-medium text-gray-700 mb-2 block">State</label>
        <select
          value={searchParams.get("state") || ""}
          onChange={(e) => updateParam("state", e.target.value)}
          className="w-full border border-gray-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#2d5016]"
        >
          <option value="">All States</option>
          {STATES.map((s) => (
            <option key={s} value={s}>
              {s}
            </option>
          ))}
        </select>
      </div>

      {/* Discipline */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Discipline</p>
        <div className="space-y-2">
          {DISCIPLINES.map((d) => (
            <label key={d} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeDisciplines.includes(d)}
                onChange={() => toggleArrayParam("discipline", d)}
                className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
              />
              <span className="text-sm text-gray-700 capitalize">{d}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Amenities */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Amenities</p>
        <div className="space-y-2">
          {AMENITIES.map((a) => (
            <label key={a.key} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeAmenities.includes(a.key)}
                onChange={() => toggleArrayParam("amenities", a.key)}
                className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
              />
              <span className="text-sm text-gray-700">{a.label}</span>
            </label>
          ))}
        </div>
      </div>

      {/* Boarding type */}
      <div>
        <p className="text-sm font-medium text-gray-700 mb-2">Boarding Type</p>
        <div className="space-y-2">
          {BOARDING_TYPES.map((bt) => (
            <label key={bt} className="flex items-center gap-2 cursor-pointer">
              <input
                type="checkbox"
                checked={activeBoardingTypes.includes(bt)}
                onChange={() => toggleArrayParam("boarding", bt)}
                className="rounded border-gray-300 text-[#2d5016] focus:ring-[#2d5016]"
              />
              <span className="text-sm text-gray-700 capitalize">{bt}</span>
            </label>
          ))}
        </div>
      </div>
    </div>
  );
}
