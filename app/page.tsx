import Image from "next/image";
import Link from "next/link";
import SearchBar from "@/components/SearchBar";
import { getStats, getBarnsBySlugs } from "@/lib/data";

// Revalidate stats and featured barns every 24 hours
export const revalidate = 86400;

const FEATURED_SLUGS = [
  "eden-farm",
  "five-phases-farm",
  "stone-columns-stables",
  "three-crowns-farm",
  "north-texas-equestrian-center",
  "whispering-farms-equestrian-center",
];

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

// Alternate aspect ratios for masonry variety
const CARD_ASPECTS = ["aspect-[4/5]", "aspect-[4/3]", "aspect-square", "aspect-[3/4]", "aspect-[4/3]", "aspect-[4/5]"];

export default async function HomePage() {
  const [stats, featuredBarns] = await Promise.all([
    getStats(),
    getBarnsBySlugs(FEATURED_SLUGS),
  ]);

  // Sort featured barns to match the preferred order
  const orderedFeatured = FEATURED_SLUGS
    .map((slug) => featuredBarns.find((b) => b.slug === slug))
    .filter(Boolean) as typeof featuredBarns;

  return (
    <div className="bg-[#faf7f2]">

      {/* ── Hero ── */}
      <section className="relative min-h-[92vh] flex items-center justify-center overflow-hidden">
        <Image
          src="/images/horses/hero-horse.jpg"
          alt="Rider on white horse"
          fill
          priority
          sizes="100vw"
          className="object-cover object-center"
        />
        {/* Warm gradient overlay — darker at bottom for search legibility */}
        <div className="absolute inset-0 bg-gradient-to-b from-[#1a0d07]/50 via-[#1a0d07]/55 to-[#1a0d07]/75" />

        <div className="relative z-10 text-center text-white px-4 w-full max-w-4xl mx-auto">
          <p className="text-[11px] tracking-[0.35em] uppercase text-[#d4a853] mb-6 font-medium">
            The Equestrian Directory
          </p>
          <h1
            className="text-5xl md:text-7xl font-bold leading-tight mb-5"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Find Riding Lessons<br />&amp; Boarding Near You
          </h1>
          <p className="text-base md:text-lg text-white/65 mb-10 max-w-lg mx-auto leading-relaxed">
            The trusted directory for boarding and lessons. Browse real reviews from equestrians who know.
          </p>

          {/* Hero search bar — Airbnb-style card */}
          <div className="w-full max-w-3xl mx-auto">
            <SearchBar variant="hero" />
          </div>

          <div className="mt-6 flex items-center justify-center gap-6 text-sm text-white/50">
            <span>Dressage</span>
            <span className="text-white/20">·</span>
            <span>Hunter/Jumper</span>
            <span className="text-white/20">·</span>
            <span>Western</span>
            <span className="text-white/20">·</span>
            <span>Eventing</span>
            <span className="text-white/20">·</span>
            <span>Trail Riding</span>
          </div>
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-[#f0e8d8] border-y border-[#e0d4c0]">
        <div className="max-w-3xl mx-auto px-4 py-10 grid grid-cols-3 gap-8 text-center">
          <div>
            <p
              className="text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {stats.barnCount}+
            </p>
            <p className="text-xs text-[#7a6a5a] mt-2 tracking-[0.15em] uppercase">Barns Listed</p>
          </div>
          <div>
            <p
              className="text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {stats.cityCount}+
            </p>
            <p className="text-xs text-[#7a6a5a] mt-2 tracking-[0.15em] uppercase">Cities</p>
          </div>
          <div>
            <p
              className="text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              {stats.stateCount}
            </p>
            <p className="text-xs text-[#7a6a5a] mt-2 tracking-[0.15em] uppercase">States</p>
          </div>
        </div>
      </section>

      {/* ── Editorial Photo Strip ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {/* Column 1 — Boarding */}
          <Link href="/barns?boarding=full,partial,pasture,self-care" className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
            <Image
              src="/images/horses/editorial-boarding.jpg"
              alt="Barn with horses grazing"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d07]/80 via-[#1a0d07]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4a853] mb-2 font-medium">Find a Home</p>
              <h3 className="text-2xl font-bold text-white leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                Boarding
              </h3>
              <p className="text-sm text-white/65 mt-2 leading-relaxed">Full care, partial, pasture & more</p>
            </div>
          </Link>

          {/* Column 2 — Lessons */}
          <Link href="/barns?lessons=true" className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
            <Image
              src="/images/horses/editorial-lessons.jpg"
              alt="Child riding horse in front of barn"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover object-top group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d07]/80 via-[#1a0d07]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4a853] mb-2 font-medium">Learn to Ride</p>
              <h3 className="text-2xl font-bold text-white leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                Lessons
              </h3>
              <p className="text-sm text-white/65 mt-2 leading-relaxed">Beginner to advanced instruction</p>
            </div>
          </Link>

          {/* Column 3 — Explore */}
          <Link href="/barns" className="group relative rounded-2xl overflow-hidden aspect-[3/4] block">
            <Image
              src="/images/horses/editorial-facilities.jpg"
              alt="Horses in stable"
              fill
              sizes="(max-width: 768px) 100vw, 33vw"
              className="object-cover group-hover:scale-105 transition-transform duration-700"
            />
            <div className="absolute inset-0 bg-gradient-to-t from-[#1a0d07]/80 via-[#1a0d07]/20 to-transparent" />
            <div className="absolute bottom-0 left-0 p-7">
              <p className="text-[10px] tracking-[0.25em] uppercase text-[#d4a853] mb-2 font-medium">Browse All</p>
              <h3 className="text-2xl font-bold text-white leading-snug" style={{ fontFamily: "var(--font-playfair)" }}>
                Explore Barns
              </h3>
              <p className="text-sm text-white/65 mt-2 leading-relaxed">Arenas, trails, and top facilities</p>
            </div>
          </Link>
        </div>
      </section>

      {/* ── Featured Barns – Masonry ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
        <div className="flex items-end justify-between mb-10">
          <div>
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Highly Searched</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Featured Barns
            </h2>
          </div>
          <Link
            href="/barns"
            className="text-sm text-[#4a6741] hover:text-[#2d5016] underline underline-offset-4 transition"
          >
            Browse all barns →
          </Link>
        </div>

        {/* Masonry grid via CSS columns */}
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5">
          {orderedFeatured.map((barn, i) => (
            <Link
              key={barn.slug}
              href={`/barns/${barn.slug}`}
              className="break-inside-avoid mb-5 block group rounded-2xl overflow-hidden bg-white shadow-sm hover:shadow-md transition-shadow duration-300"
            >
              <div className={`relative overflow-hidden ${CARD_ASPECTS[i] ?? "aspect-[4/3]"}`}>
                {barn.photos.length > 0 ? (
                  <Image
                    src={`/images/barns/${barn.photos[0]}`}
                    alt={barn.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                ) : (
                  <div className="w-full h-full flex items-center justify-center bg-gradient-to-br from-[#f0e8d8] to-[#e8d8c0]">
                    <svg className="w-16 h-16 text-[#c4956a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                        d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
                    </svg>
                  </div>
                )}
              </div>
              <div className="p-4">
                <h3
                  className="text-base font-semibold text-[#2c1810] leading-snug"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {barn.name}
                </h3>
                <p className="text-xs text-[#7a6a5a] mt-1">
                  {barn.address.city}, {barn.address.state}
                </p>
                {barn.disciplines.length > 0 && (
                  <div className="flex flex-wrap gap-1.5 mt-3">
                    {barn.disciplines.slice(0, 2).map((d) => (
                      <span
                        key={d}
                        className="text-xs px-2.5 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full capitalize"
                      >
                        {d}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* ── Browse by Metro ── */}
      <section className="bg-[#f0e8d8] py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="mb-10">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Explore</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Browse by Metro
            </h2>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-3">
            {METROS.map((metro) => (
              <Link
                key={`${metro.city}-${metro.state}`}
                href={`/barns?q=${encodeURIComponent(metro.city.toLowerCase())}&state=${metro.state}`}
                className="flex items-center gap-3 p-4 bg-white rounded-xl hover:bg-[#faf7f2] hover:shadow-sm transition group border border-[#e8dcc8]"
              >
                <div className="w-7 h-7 bg-[#f0e8d8] rounded-full flex items-center justify-center flex-shrink-0">
                  <svg className="w-3.5 h-3.5 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>
                <div>
                  <p className="font-medium text-[#2c1810] text-sm">{metro.city}</p>
                  <p className="text-xs text-[#7a6a5a]">{metro.state}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      </section>

      {/* ── Community – Built for Riders ── */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Community</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Built for Equestrians, by Equestrians
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              {
                icon: (
                  <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                  </svg>
                ),
                title: "Search Any City",
                body: "Moving somewhere new? Search by zip code, city, or metro area and instantly browse nearby barns — filter by discipline, boarding type, and amenities.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                  </svg>
                ),
                title: "Save Your Favorites",
                body: "Heart barns you love and come back to them later. Build your shortlist as you explore, then reach out when you're ready to make a move.",
              },
              {
                icon: (
                  <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                  </svg>
                ),
                title: "Real Equestrian Reviews",
                body: "Read honest reviews from current boarders and lesson students. Detailed ratings on facilities, trainers, communication, and value.",
              },
            ].map(({ icon, title, body }) => (
              <div key={title} className="text-center">
                <div className="w-12 h-12 bg-[#f0e8d8] rounded-full flex items-center justify-center mx-auto mb-5">
                  {icon}
                </div>
                <h3
                  className="text-xl font-semibold text-[#2c1810] mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {title}
                </h3>
                <p className="text-[#7a6a5a] text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA – Own a Barn ── */}
      <section className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20">
        <div className="bg-[#2c1810] rounded-3xl p-10 md:p-16 text-center text-white">
          <p className="text-xs tracking-[0.2em] uppercase text-[#d4a853] mb-4">List Your Facility</p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Own a Barn?
          </h2>
          <p className="text-white/60 mb-8 max-w-md mx-auto">
            Join the Barnbook community and reach thousands of equestrians looking for their next barn.
          </p>
          <Link
            href="/for-owners"
            className="inline-block bg-[#d4a853] text-[#2c1810] px-8 py-3.5 rounded-full font-semibold hover:bg-[#c49843] transition tracking-wide"
          >
            Learn More
          </Link>
        </div>
      </section>

    </div>
  );
}
