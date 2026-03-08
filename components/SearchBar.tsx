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

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/barns?${params.toString()}`);
  }

  if (variant === "hero") {
    return (
      <form onSubmit={handleSubmit} className="flex w-full rounded-full overflow-hidden shadow-2xl">
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by zip code, city, or barn name..."
          className="flex-1 px-6 py-4 text-base text-[#2c1810] focus:outline-none bg-white placeholder-[#a89a8a]"
        />
        <button
          type="submit"
          className="px-8 py-4 bg-[#d4a853] text-[#2c1810] font-semibold hover:bg-[#c49843] transition whitespace-nowrap"
        >
          Search
        </button>
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
