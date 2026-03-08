import Link from "next/link";
import { getBarns } from "@/lib/data";
import { Barn } from "@/lib/types";

interface PageProps {
  searchParams: Promise<{ q?: string }>;
}

export const metadata = {
  title: "Claim Your Barn | Barnbook",
};

export default async function ClaimSearchPage({ searchParams }: PageProps) {
  const params = await searchParams;
  const query = params.q?.toLowerCase().trim() || "";

  let results: Barn[] = [];
  if (query) {
    const barns = await getBarns();
    results = barns.filter(
      (b) =>
        b.name.toLowerCase().includes(query) ||
        b.address.city.toLowerCase().includes(query) ||
        b.address.state.toLowerCase().includes(query)
    );
  }

  return (
    <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      <div className="mb-10">
        <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Barn Owners</p>
        <h1
          className="text-3xl md:text-4xl font-bold text-[#2c1810] mb-3"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Claim Your Listing
        </h1>
        <p className="text-[#7a6a5a]">
          Search for your barn by name or location to get started.
        </p>
      </div>

      {/* Search form */}
      <form method="GET" className="flex gap-2 mb-10">
        <input
          type="text"
          name="q"
          defaultValue={params.q || ""}
          placeholder="Search by barn name, city, or state..."
          className="flex-1 px-4 py-3 rounded-lg border border-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-[#2c1810] bg-white"
          autoFocus
        />
        <button
          type="submit"
          className="px-6 py-3 bg-[#4a6741] text-white rounded-lg font-medium hover:bg-[#3a5535] transition"
        >
          Search
        </button>
      </form>

      {/* Results */}
      {query && (
        <>
          <p className="text-sm text-[#7a6a5a] mb-5">
            {results.length} result{results.length !== 1 ? "s" : ""} for &ldquo;{params.q}&rdquo;
          </p>

          {results.length === 0 ? (
            <div className="text-center py-16 border border-[#e8dcc8] rounded-2xl bg-white">
              <p className="text-[#7a6a5a] mb-3">No barns found matching your search.</p>
              <p className="text-sm text-[#7a6a5a]">
                Can&apos;t find your barn?{" "}
                <Link href="/dashboard/new" className="text-[#4a6741] underline underline-offset-4 hover:text-[#2d5016]">
                  Create a new listing
                </Link>
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {results.map((barn) => (
                <div
                  key={barn.id}
                  className="flex items-center justify-between p-5 bg-white border border-[#e8dcc8] rounded-xl"
                >
                  <div>
                    <p className="font-semibold text-[#2c1810]" style={{ fontFamily: "var(--font-playfair)" }}>
                      {barn.name}
                    </p>
                    <p className="text-sm text-[#7a6a5a] mt-0.5">
                      {barn.address.city}, {barn.address.state}
                    </p>
                    {barn.disciplines.length > 0 && (
                      <p className="text-xs text-[#a89a8a] mt-1 capitalize">
                        {barn.disciplines.slice(0, 2).join(" · ")}
                      </p>
                    )}
                  </div>
                  <div className="flex-shrink-0 ml-4">
                    {barn.verified ? (
                      <span className="flex items-center gap-1.5 text-xs text-[#4a6741] font-medium px-3 py-1.5 bg-green-50 border border-green-200 rounded-full">
                        <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                        </svg>
                        Verified
                      </span>
                    ) : barn.ownerId ? (
                      <span className="text-xs text-[#7a6a5a] px-3 py-1.5 bg-[#f0e8d8] border border-[#e8dcc8] rounded-full">
                        Claimed
                      </span>
                    ) : (
                      <Link
                        href={`/claim/${barn.id}`}
                        className="text-sm font-medium text-white bg-[#4a6741] px-4 py-2 rounded-lg hover:bg-[#3a5535] transition"
                      >
                        Claim →
                      </Link>
                    )}
                  </div>
                </div>
              ))}
            </div>
          )}

          {results.length > 0 && (
            <p className="text-sm text-[#7a6a5a] mt-8 text-center">
              Don&apos;t see your barn?{" "}
              <Link href="/dashboard/new" className="text-[#4a6741] underline underline-offset-4 hover:text-[#2d5016]">
                Create a new listing
              </Link>
            </p>
          )}
        </>
      )}
    </div>
  );
}
