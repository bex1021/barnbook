"use client";

import { useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { Barn } from "@/lib/types";
import BarnCard from "./BarnCard";
import ViewToggle from "./ViewToggle";
import MapView from "./MapView";

interface BarnResultsProps {
  barns: Barn[];
  ratings: Record<string, { avg: number; count: number }>;
  distanceMap?: Record<string, number>;
  total?: number;
  page?: number;
  pageSize?: number;
}

export default function BarnResults({ barns, ratings, distanceMap = {}, total, page = 1, pageSize = 24 }: BarnResultsProps) {
  const [view, setView] = useState<"list" | "map">("list");
  const router = useRouter();
  const searchParams = useSearchParams();

  const totalPages = total != null ? Math.ceil(total / pageSize) : 1;

  function goToPage(p: number) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("page", String(p));
    router.push(`/barns?${params.toString()}`);
  }

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">
          {total != null ? `${total} barn${total !== 1 ? "s" : ""}` : `${barns.length} barn${barns.length !== 1 ? "s" : ""}`}
          {totalPages > 1 && ` · Page ${page} of ${totalPages}`}
        </p>
        <ViewToggle view={view} onChange={setView} />
      </div>

      {view === "map" ? (
        <MapView barns={barns} />
      ) : barns.length === 0 ? (
        <div className="text-center py-16">
          <p className="text-gray-500 text-lg">No barns found. Try adjusting your filters.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {barns.map((barn) => (
            <BarnCard
              key={barn.id}
              barn={barn}
              averageRating={ratings[barn.id]?.avg || 0}
              reviewCount={ratings[barn.id]?.count || 0}
              distance={distanceMap[barn.id]}
            />
          ))}
        </div>
      )}

      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-2 mt-8">
          <button
            onClick={() => goToPage(page - 1)}
            disabled={page <= 1}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
          >
            ← Prev
          </button>
          {Array.from({ length: Math.min(totalPages, 7) }, (_, i) => {
            let p: number;
            if (totalPages <= 7) {
              p = i + 1;
            } else if (page <= 4) {
              p = i + 1;
            } else if (page >= totalPages - 3) {
              p = totalPages - 6 + i;
            } else {
              p = page - 3 + i;
            }
            return (
              <button
                key={p}
                onClick={() => goToPage(p)}
                className={`px-3 py-2 text-sm rounded-lg border ${
                  p === page
                    ? "bg-[#4a6741] text-white border-[#4a6741]"
                    : "border-gray-300 hover:bg-gray-50"
                }`}
              >
                {p}
              </button>
            );
          })}
          <button
            onClick={() => goToPage(page + 1)}
            disabled={page >= totalPages}
            className="px-3 py-2 text-sm rounded-lg border border-gray-300 disabled:opacity-40 hover:bg-gray-50"
          >
            Next →
          </button>
        </div>
      )}
    </div>
  );
}
