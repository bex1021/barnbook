"use client";

import { useState } from "react";
import { Barn } from "@/lib/types";
import BarnCard from "./BarnCard";
import ViewToggle from "./ViewToggle";
import MapView from "./MapView";

interface BarnResultsProps {
  barns: Barn[];
  ratings: Record<string, { avg: number; count: number }>;
}

export default function BarnResults({ barns, ratings }: BarnResultsProps) {
  const [view, setView] = useState<"list" | "map">("list");

  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-sm text-gray-500">{barns.length} barn{barns.length !== 1 ? "s" : ""}</p>
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
            />
          ))}
        </div>
      )}
    </div>
  );
}
