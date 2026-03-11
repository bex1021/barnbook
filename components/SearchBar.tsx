"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({
  initialQuery = "",
  variant = "default",
}: {
  initialQuery?: string;
  variant?: "default" | "hero";
}) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);
  const [type, setType] = useState("any");

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    if (type === "boarding") params.set("boarding", "full,partial,pasture,self-care");
    if (type === "lessons") params.set("lessons", "true");
    router.push(`/barns?${params.toString()}`);
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="w-full">
        <div className="bg-white rounded-2xl shadow-2xl overflow-hidden">
          <div className="flex flex-col md:flex-row">
            {/* Location */}
            <div className="flex-1 px-7 py-5 md:border-r border-[#e8dcc8] border-b md:border-b-0 cursor-text">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2c1810] mb-1.5">Location</p>
              <input
                type="text"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="City, state, or zip code..."
                className="w-full text-[#2c1810] text-base placeholder-[#b8a898] focus:outline-none bg-transparent"
              />
            </div>

            {/* Looking For */}
            <div className="px-7 py-5 md:border-r border-[#e8dcc8] border-b md:border-b-0 min-w-[200px]">
              <p className="text-[10px] font-bold uppercase tracking-[0.18em] text-[#2c1810] mb-1.5">Looking For</p>
              <select
                value={type}
                onChange={(e) => setType(e.target.value)}
                className="w-full text-[#2c1810] text-base focus:outline-none bg-transparent cursor-pointer appearance-none"
              >
                <option value="any">Boarding &amp; Lessons</option>
                <option value="boarding">Boarding</option>
                <option value="lessons">Lessons</option>
              </select>
            </div>

            {/* Button */}
            <div className="p-3 flex items-center justify-center">
              <button
                type="submit"
                className="w-full md:w-auto bg-[#4a6741] text-white font-semibold px-8 py-4 rounded-xl hover:bg-[#3a5535] transition-colors flex items-center justify-center gap-2 whitespace-nowrap text-sm tracking-wide"
              >
                <svg className="w-4 h-4 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
                Search Barns
              </button>
            </div>
          </div>
        </div>
      </form>
    );
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, city, or state..."
        className="flex-1 px-4 py-3 rounded-l-lg border border-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#4a6741] focus:border-transparent text-[#2c1810]"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#4a6741] text-white rounded-r-lg font-medium hover:bg-[#3a5535] transition"
      >
        Search
      </button>
    </form>
  );
}
