import Link from "next/link";
import { getBarns, getAverageRating, getReviewsByBarn } from "@/lib/data";
import BarnCard from "@/components/BarnCard";
import SearchBar from "@/components/SearchBar";

export default function HomePage() {
  const barns = getBarns().slice(0, 3);

  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2d5016] to-[#1a3009] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find Your Perfect Barn
            </h1>
            <p className="mt-4 text-lg text-green-100">
              Browse horse farms and barns across the country. Read reviews, compare amenities, and find the ideal home for your horse.
            </p>
            <div className="mt-8">
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Barns */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="flex items-center justify-between mb-8">
          <h2 className="text-2xl md:text-3xl font-bold text-gray-900">Featured Barns</h2>
          <Link
            href="/barns"
            className="text-[#2d5016] font-medium hover:text-[#4a7c28] transition"
          >
            View all &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {barns.map((barn) => {
            const avg = getAverageRating(barn.id);
            const count = getReviewsByBarn(barn.id).length;
            return (
              <BarnCard key={barn.id} barn={barn} averageRating={avg} reviewCount={count} />
            );
          })}
        </div>
      </section>

      {/* Why Barnbook */}
      <section className="bg-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl md:text-3xl font-bold text-center mb-12">Why Barnbook?</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#2d5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Easy Search</h3>
              <p className="text-gray-600 text-sm">
                Filter by discipline, amenities, location, and more to find barns that match your needs.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#2d5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Trusted Reviews</h3>
              <p className="text-gray-600 text-sm">
                Read real reviews from riders and boarders to make informed decisions.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#2d5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Map View</h3>
              <p className="text-gray-600 text-sm">
                Explore barns on an interactive map to find facilities near you.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="bg-[#2d5016] rounded-2xl p-8 md:p-12 text-center text-white">
          <h2 className="text-2xl md:text-3xl font-bold mb-4">Own a Barn?</h2>
          <p className="text-green-100 mb-6 max-w-lg mx-auto">
            List your facility on Barnbook and reach thousands of riders looking for the perfect barn.
          </p>
          <Link
            href="/auth/register"
            className="inline-block bg-white text-[#2d5016] px-8 py-3 rounded-lg font-semibold hover:bg-green-100 transition"
          >
            Get Started Free
          </Link>
        </div>
      </section>
    </div>
  );
}
