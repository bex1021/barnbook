import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Riders | Barnbook",
  description: "Find the perfect barn for you and your horse. Search hundreds of equestrian facilities by discipline, budget, and location — all in one place.",
};

const RIDER_TYPES = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: "The Relocating Boarder",
    body: "Moving to a new city with your horse is stressful enough. The last thing you need is to spend weeks cold-calling barns and visiting facilities that don't fit your budget or discipline. Barnbook shows you everything upfront, before you even arrive.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    label: "The Lesson Seeker",
    body: "Whether you're brand new to riding or coming back after a break, finding the right trainer and the right barn is everything. Search by discipline, read real reviews from current students, and reach out directly — all without the runaround.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: "The Upgrading Rider",
    body: "You've outgrown your current barn — the trainer, the facilities, or the community. You know what you want next, but finding it takes time you don't have. Barnbook helps you filter, compare, and decide with confidence.",
  },
];

const ALTERNATING_BENEFITS = [
  {
    photo: "/images/horses/editorial-boarding.jpg",
    label: "Smart Search",
    title: "Find barns that actually fit your life",
    body: "Filter by discipline, boarding type, price range, and location. Whether you need full care for your horse or just weekend lessons, Barnbook surfaces the barns that match — not a list of everyone within 50 miles that you have to sort through yourself.",
    imageLeft: true,
  },
  {
    photo: "/images/horses/editorial-lessons.jpg",
    label: "Real Reviews",
    title: "Hear from riders who are already there",
    body: "Barn websites are written by the owners. Reviews are written by the boarders. Read honest, first-hand accounts of what daily life at a facility is really like — the care, the community, the trainers, and the value. Make your decision with eyes wide open.",
    imageLeft: false,
  },
  {
    photo: "/images/horses/editorial-facilities.jpg",
    label: "One Platform",
    title: "Save, compare, and message — all in one place",
    body: "Shortlist your favourite barns, compare them side by side, and message multiple facilities directly from Barnbook. No more tracking down phone numbers, sending emails into the void, or losing that promising barn you found three tabs ago.",
    imageLeft: true,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Search Your Area",
    body: "Enter your city, zip code, or the area you're moving to. Filter by discipline, boarding type, and budget to narrow it down fast.",
  },
  {
    number: "02",
    title: "Read & Compare",
    body: "Browse photos, read real reviews from current boarders and students, and save your favourites to compare side by side.",
  },
  {
    number: "03",
    title: "Reach Out",
    body: "Message barns directly from their listing. No cold calls, no hunting for contact info — just a simple message to get the conversation started.",
  },
];

const SMALL_BENEFITS = [
  {
    title: "Always Free",
    body: "Searching, saving, and messaging barns on Barnbook is completely free — no subscriptions, no fees.",
  },
  {
    title: "Honest Reviews",
    body: "Reviews come from verified riders and boarders, so you get a real picture of what life at a barn is actually like.",
  },
  {
    title: "Up-to-Date Listings",
    body: "Barn owners manage their own listings. Photos, pricing, and availability reflect what's actually on offer today.",
  },
];

const TESTIMONIALS = [
  {
    photo: "/images/barns/bella-cavalli-farms.jpg",
    quote: "I was relocating from Chicago with my mare and had no idea where to start. Barnbook let me narrow down barns by discipline and budget before I even visited. I found my barn before I moved — and it was exactly what I'd hoped for.",
    name: "Megan T.",
    detail: "Hunter/Jumper · Relocated to Nashville, TN",
  },
  {
    photo: "/images/barns/bel-canto-farms.jpg",
    quote: "I'd been riding for a few years and wanted to get more serious about dressage. I used Barnbook to find trainers with real programmes near me. The reviews were honest and helpful — I booked a trial lesson within a week.",
    name: "Priya S.",
    detail: "Dressage Student · Austin, TX",
  },
  {
    photo: "/images/barns/beech-hill-farm.jpg",
    quote: "After a bad experience at my last barn, I was nervous about choosing a new one. Reading through the reviews on Barnbook gave me the confidence to trust my instincts. It's been six months and I couldn't be happier.",
    name: "Jordan L.",
    detail: "Full Care Boarder · Lexington, KY",
  },
];

export default function ForRidersPage() {
  return (
    <div className="bg-[#faf7f2]">

      {/* ── Split Editorial Hero ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* Left: Story */}
        <div className="flex items-center px-8 sm:px-14 lg:px-20 py-20 order-2 lg:order-1">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4956a] mb-6 font-medium">
              For Riders
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold text-[#2c1810] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Your horse<br />deserves the<br />right home.
            </h1>
            <p className="text-xl text-[#5a4a3a] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-playfair)" }}>
              Stop sifting. Start riding.
            </p>
            <p className="text-[#7a6a5a] leading-relaxed mb-10">
              Finding the right barn shouldn&apos;t take weeks of dead-end phone calls, outdated websites, and word-of-mouth guesses. Barnbook gives you real information — photos, reviews, pricing, and disciplines — so you can find the right fit for you and your horse, and get back to what you love.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/barns"
                className="px-7 py-3.5 bg-[#2c1810] text-white rounded-full font-semibold hover:bg-[#3d2415] transition text-center"
              >
                Search Barns
              </Link>
              <Link
                href="/auth/register"
                className="px-7 py-3.5 border-2 border-[#2c1810] text-[#2c1810] rounded-full font-semibold hover:bg-[#f0e8d8] transition text-center"
              >
                Create Free Account
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Photo */}
        <div className="relative min-h-[55vw] lg:min-h-0 order-1 lg:order-2">
          <Image
            src="/images/horses/hero-horse.jpg"
            alt="Rider and horse bonding"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#2c1810]/10" />
        </div>
      </section>

      {/* ── Stats strip ── */}
      <section className="bg-[#f0e8d8] border-y border-[#e0d4c0] py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-10 font-medium">
            Barnbook by the numbers
          </p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                343+
              </p>
              <p className="text-sm text-[#7a6a5a] leading-relaxed">
                equestrian facilities listed across the United States
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                30+
              </p>
              <p className="text-sm text-[#7a6a5a] leading-relaxed">
                states covered and growing every week
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#4a6741] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                $0
              </p>
              <p className="text-sm text-[#7a6a5a] leading-relaxed">
                to search, save, and message any barn on Barnbook
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The problem ── */}
      <section className="bg-[#2c1810] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#d4a853] mb-3">Sound Familiar?</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Finding a barn is harder than it should be
            </h2>
            <p className="text-white/60 max-w-xl text-sm leading-relaxed">
              You shouldn&apos;t need to spend weeks researching just to find a safe, quality home for your horse. Barnbook was built for exactly this.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {RIDER_TYPES.map(({ icon, label, body }) => (
              <div key={label} className="border border-white/10 rounded-2xl p-6">
                <div className="w-10 h-10 bg-white/10 rounded-full flex items-center justify-center mb-5">
                  {icon}
                </div>
                <h3
                  className="text-lg font-semibold text-white mb-3"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {label}
                </h3>
                <p className="text-white/60 text-sm leading-relaxed">{body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Alternating Benefits ── */}
      {ALTERNATING_BENEFITS.map(({ photo, label, title, body, imageLeft }) => (
        <section key={title} className="grid grid-cols-1 lg:grid-cols-2 min-h-[520px]">
          <div className={`relative min-h-[50vw] lg:min-h-0 ${imageLeft ? "lg:order-1" : "lg:order-2"}`}>
            <Image
              src={photo}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          <div className={`flex items-center px-8 sm:px-14 lg:px-20 py-16 bg-[#faf7f2] ${imageLeft ? "lg:order-2" : "lg:order-1"}`}>
            <div className="max-w-lg">
              <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-3 font-medium">{label}</p>
              <h2
                className="text-2xl md:text-3xl font-bold text-[#2c1810] mb-5 leading-snug"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h2>
              <p className="text-[#7a6a5a] leading-relaxed">{body}</p>
            </div>
          </div>
        </section>
      ))}

      {/* ── Small benefits strip ── */}
      <section className="bg-[#f0e8d8] border-y border-[#e0d4c0] py-14 px-4">
        <div className="max-w-5xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
          {SMALL_BENEFITS.map(({ title, body }) => (
            <div key={title}>
              <h3
                className="text-lg font-semibold text-[#2c1810] mb-2"
                style={{ fontFamily: "var(--font-playfair)" }}
              >
                {title}
              </h3>
              <p className="text-[#7a6a5a] text-sm leading-relaxed">{body}</p>
            </div>
          ))}
        </div>
      </section>

      {/* ── How it works ── */}
      <section className="py-20 px-4">
        <div className="max-w-4xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Simple Process</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Find your barn in three steps
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
            {STEPS.map(({ number, title, body }) => (
              <div key={number} className="text-center">
                <p
                  className="text-6xl font-bold text-[#e8dcc8] mb-4 leading-none"
                  style={{ fontFamily: "var(--font-playfair)" }}
                >
                  {number}
                </p>
                <h3
                  className="text-lg font-semibold text-[#2c1810] mb-2"
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

      {/* ── Testimonials ── */}
      <section className="bg-[#f0e8d8] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">From the Community</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Riders love Barnbook
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ photo, quote, name, detail }) => (
              <div key={name} className="bg-white rounded-2xl overflow-hidden border border-[#e8dcc8] flex flex-col">
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo}
                    alt={name}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                <div className="p-6 flex flex-col flex-1">
                  <svg className="w-7 h-7 text-[#e8dcc8] mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[#5a4a3a] text-sm leading-relaxed flex-1 mb-6">{quote}</p>
                  <div>
                    <p className="font-semibold text-[#2c1810] text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                      {name}
                    </p>
                    <p className="text-xs text-[#7a6a5a] mt-0.5">{detail}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="relative py-28 px-4 overflow-hidden">
        <Image
          src="/images/horses/editorial-boarding.jpg"
          alt="Horse and rider"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1a0d07]/70" />
        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a853] mb-5 font-medium">
            Free to Use, Forever
          </p>
          <h2
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your perfect barn is out there. Let&apos;s find it.
          </h2>
          <p className="text-white/65 mb-10 leading-relaxed text-lg">
            Search hundreds of equestrian facilities, read real reviews, and message barns directly — all for free.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/barns"
              className="px-8 py-3.5 bg-[#d4a853] text-[#2c1810] rounded-full font-semibold hover:bg-[#c49843] transition"
            >
              Search Barns
            </Link>
            <Link
              href="/auth/register"
              className="px-8 py-3.5 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              Create Free Account
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
