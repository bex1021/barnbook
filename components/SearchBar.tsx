"use client";

import { useRouter } from "next/navigation";
import { useState } from "react";

export default function SearchBar({ initialQuery = "" }: { initialQuery?: string }) {
  const router = useRouter();
  const [query, setQuery] = useState(initialQuery);

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const params = new URLSearchParams();
    if (query.trim()) params.set("q", query.trim());
    router.push(`/barns?${params.toString()}`);
  }

  return (
    <form onSubmit={handleSubmit} className="flex w-full max-w-xl">
      <input
        type="text"
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        placeholder="Search by name, city, or state..."
        className="flex-1 px-4 py-3 rounded-l-lg border border-gray-300 focus:outline-none focus:ring-2 focus:ring-[#2d5016] focus:border-transparent text-gray-900"
      />
      <button
        type="submit"
        className="px-6 py-3 bg-[#2d5016] text-white rounded-r-lg font-medium hover:bg-[#4a7c28] transition"
      >
        Search
      </button>
    </form>
  );
}
