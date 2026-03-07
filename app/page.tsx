import Link from "next/link";
import SearchBar from "@/components/SearchBar";

const METROS = [
  { city: "Lexington", state: "KY" },
  { city: "Wellington", state: "FL" },
  { city: "Ocala", state: "FL" },
  { city: "Austin", state: "TX" },
  { city: "Dallas", state: "TX" },
  { city: "Denver", state: "CO" },
  { city: "Atlanta", state: "GA" },
  { city: "Seattle", state: "WA" },
  { city: "Los Angeles", state: "CA" },
  { city: "Charlotte", state: "NC" },
  { city: "Scottsdale", state: "AZ" },
  { city: "Portland", state: "OR" },
];

export default function HomePage() {
  return (
    <div>
      {/* Hero */}
      <section className="bg-gradient-to-br from-[#2d5016] to-[#1a3009] text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20 md:py-28">
          <div className="max-w-2xl">
            <h1 className="text-4xl md:text-5xl font-bold leading-tight">
              Find the Right Barn, Wherever You Land
            </h1>
            <p className="mt-4 text-lg text-green-100">
              Moving somewhere new? Barnbook helps you find riding lessons and horse boarding in any city — read reviews, compare amenities, and connect with the right facility.
            </p>
            <div className="mt-8 flex flex-col sm:flex-row gap-3">
              <Link
                href="/barns?lessons=true"
                className="inline-flex items-center justify-center px-6 py-3 bg-white text-[#2d5016] rounded-lg font-semibold hover:bg-green-50 transition"
              >
                Find Lessons
              </Link>
              <Link
                href="/barns?boarding=full,partial,pasture,self-care"
                className="inline-flex items-center justify-center px-6 py-3 border-2 border-white text-white rounded-lg font-semibold hover:bg-white/10 transition"
              >
                Find Boarding
              </Link>
            </div>
            <div className="mt-6">
              <p className="text-green-200 text-sm mb-2">Or search by city, barn name, or discipline</p>
              <SearchBar />
            </div>
          </div>
        </div>
      </section>

      {/* Browse by Metro */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">Browse by Metro Area</h2>
        <p className="text-gray-600 mb-8">Explore equestrian facilities across major riding destinations.</p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
          {METROS.map((metro) => (
            <Link
              key={`${metro.city}-${metro.state}`}
              href={`/barns?q=${encodeURIComponent(metro.city.toLowerCase())}&state=${metro.state}`}
              className="flex items-center gap-3 p-4 bg-white border border-gray-200 rounded-xl hover:border-[#2d5016] hover:shadow-sm transition group"
            >
              <div className="w-8 h-8 bg-green-50 rounded-full flex items-center justify-center flex-shrink-0 group-hover:bg-green-100 transition">
                <svg className="w-4 h-4 text-[#2d5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
              </div>
              <div>
                <p className="font-medium text-gray-900 text-sm">{metro.city}</p>
                <p className="text-xs text-gray-500">{metro.state}</p>
              </div>
            </Link>
          ))}
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
              <h3 className="text-lg font-semibold mb-2">Search Any City</h3>
              <p className="text-gray-600 text-sm">
                Type in your new city or region and instantly browse nearby barns. Filter by discipline, amenities, boarding type, and more.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#2d5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">Real Rider Reviews</h3>
              <p className="text-gray-600 text-sm">
                See what current boarders and lesson students say before you visit. Honest reviews from the equestrian community.
              </p>
            </div>
            <div className="text-center p-6">
              <div className="w-14 h-14 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-7 h-7 text-[#2d5016]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold mb-2">All the Details</h3>
              <p className="text-gray-600 text-sm">
                Compare pricing, trainer bios, facility photos, and contact info all in one place — everything you need to make the right call.
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
