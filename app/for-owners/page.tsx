import Image from "next/image";
import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Barn Owners | Barnbook",
  description: "List your equestrian facility on Barnbook for free. Reach riders moving to your area, fill boarding spots and lesson openings, and manage your listing.",
};

const RIDER_TYPES = [
  {
    icon: (
      <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
      </svg>
    ),
    label: "The Relocating Rider",
    body: "Moving to a new city with their horse and a real deadline to find a boarding home. They&apos;re researching weeks before they arrive — and whoever shows up first wins the stall.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
      </svg>
    ),
    label: "The Lesson Seeker",
    body: "Looking for the right trainer, the right discipline, the right environment. They're reading every review and comparing every option — and they want to choose with confidence.",
  },
  {
    icon: (
      <svg className="w-5 h-5 text-[#d4a853]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 12l2 2 4-4M7.835 4.697a3.42 3.42 0 001.946-.806 3.42 3.42 0 014.438 0 3.42 3.42 0 001.946.806 3.42 3.42 0 013.138 3.138 3.42 3.42 0 00.806 1.946 3.42 3.42 0 010 4.438 3.42 3.42 0 00-.806 1.946 3.42 3.42 0 01-3.138 3.138 3.42 3.42 0 00-1.946.806 3.42 3.42 0 01-4.438 0 3.42 3.42 0 00-1.946-.806 3.42 3.42 0 01-3.138-3.138 3.42 3.42 0 00-.806-1.946 3.42 3.42 0 010-4.438 3.42 3.42 0 00.806-1.946 3.42 3.42 0 013.138-3.138z" />
      </svg>
    ),
    label: "The Competitive Rider",
    body: "Upgrading to a facility that matches their ambition — and often bringing their horse with them. They&apos;re high-commitment boarders who stay for years when they find the right fit.",
  },
];

const ALTERNATING_BENEFITS = [
  {
    photo: "/images/barns/eden-farm.jpg",
    label: "Fill Your Stalls",
    title: "Turn empty stalls into steady monthly income",
    body: "Every new boarder is $700–$1,500 or more in recurring monthly revenue. Barnbook connects you with riders who are actively searching for a boarding home — not casually browsing, but ready to commit. Reach them before they find someone else.",
    imageLeft: true,
  },
  {
    photo: "/images/barns/silver-oak-stable.jpg",
    label: "Your Listing",
    title: "Your best marketing tool — and it's free",
    body: "A complete Barnbook listing works for you around the clock. Add photos, highlight your trainers, list your boarding options and pricing. Riders researching a move will find you, trust you, and reach out — before they&apos;ve even packed a box.",
    imageLeft: false,
  },
  {
    photo: "/images/barns/hidden-meadow-farms.jpg",
    label: "Build Trust",
    title: "Reviews and verification that work for you",
    body: "Real reviews from current boarders and students are your most powerful marketing tool. Pair that with a Verified Owner badge — a signal that you're actively managing your listing and engaged with your community — and riders choose you with confidence.",
    imageLeft: true,
  },
];

const STEPS = [
  {
    number: "01",
    title: "Find or Create Your Listing",
    body: "Search for your barn by name or location to claim an existing listing, or create a new one from scratch with all your details.",
  },
  {
    number: "02",
    title: "Get Verified",
    body: "Submit a quick ownership request. We'll verify your identity and approve your listing — usually within a few business days.",
  },
  {
    number: "03",
    title: "Start Reaching Riders",
    body: "Your verified listing goes live to riders searching in your area. Update it anytime, add photos, and respond to reviews.",
  },
];

const TESTIMONIALS = [
  {
    photo: "/images/barns/whispering-farms.jpg",
    quote: "We had two boarding spots open for months. Within weeks of claiming our Barnbook listing and updating our photos, we had three new inquiries — one from a family that had just relocated from out of state.",
    name: "Sarah M.",
    barn: "Whispering Pines Equestrian",
    location: "Lexington, KY",
    type: "Boarding & Training",
  },
  {
    photo: "/images/barns/five-phases-farm.jpg",
    quote: "I teach dressage and was struggling to fill my beginner lesson slots. Barnbook helped me reach riders who are new to the area and don't know where to start. It's been a game changer for my program.",
    name: "Claire D.",
    barn: "Centerline Dressage",
    location: "Wellington, FL",
    type: "Lesson Program",
  },
  {
    photo: "/images/barns/north-texas-equestrian-center.jpg",
    quote: "The verified badge really matters. Riders tell me it made them feel confident reaching out before they'd even visited. It's the kind of credibility you can't buy — you just have to earn it.",
    name: "Tom R.",
    barn: "Iron Gate Farm",
    location: "Ocala, FL",
    type: "Full-Service Facility",
  },
];

const SMALL_BENEFITS = [
  {
    title: "Always Free",
    body: "No subscription, no commission, no hidden fees. Listing on Barnbook is free — now and always.",
  },
  {
    title: "Verified Owner Badge",
    body: "Stand out with a badge that tells riders your listing is actively managed by the owner.",
  },
  {
    title: "Full Control",
    body: "Edit your details, update photos, and manage your listing from your dashboard anytime.",
  },
];

export default function ForOwnersPage() {
  return (
    <div className="bg-[#faf7f2]">

      {/* ── Split Editorial Hero ── */}
      <section className="grid grid-cols-1 lg:grid-cols-2 min-h-[90vh]">
        {/* Left: Story */}
        <div className="flex items-center px-8 sm:px-14 lg:px-20 py-20 order-2 lg:order-1">
          <div className="max-w-lg">
            <p className="text-xs tracking-[0.3em] uppercase text-[#c4956a] mb-6 font-medium">
              For Barn Owners
            </p>
            <h1
              className="text-4xl md:text-5xl font-bold text-[#2c1810] leading-tight mb-6"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              You&apos;ve built<br />something special.
            </h1>
            <p className="text-xl text-[#5a4a3a] mb-4 leading-relaxed" style={{ fontFamily: "var(--font-playfair)" }}>
              Now fill your stalls and grow your revenue.
            </p>
            <p className="text-[#7a6a5a] leading-relaxed mb-10">
              Every empty stall is revenue you haven&apos;t found yet. Riders are moving to your area right now, searching for a boarding home before they even arrive — and word of mouth alone isn&apos;t enough to reach them. Barnbook puts your facility in front of them, for free.
            </p>
            <div className="flex flex-col sm:flex-row gap-3">
              <Link
                href="/claim"
                className="px-7 py-3.5 border-2 border-[#2c1810] text-[#2c1810] rounded-full font-semibold hover:bg-[#f0e8d8] transition text-center"
              >
                Claim Your Listing
              </Link>
              <Link
                href="/dashboard/new"
                className="px-7 py-3.5 bg-[#2c1810] text-white rounded-full font-semibold hover:bg-[#3d2415] transition text-center"
              >
                Create New Listing
              </Link>
            </div>
          </div>
        </div>

        {/* Right: Photo */}
        <div className="relative min-h-[55vw] lg:min-h-0 order-1 lg:order-2">
          <Image
            src="/images/barns/magnolia-meadow-stables.jpg"
            alt="Equestrian facility"
            fill
            priority
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
          />
          <div className="absolute inset-0 bg-[#2c1810]/10" />
        </div>
      </section>

      {/* ── Revenue numbers strip ── */}
      <section className="bg-[#f0e8d8] border-y border-[#e0d4c0] py-14 px-4">
        <div className="max-w-5xl mx-auto">
          <p className="text-center text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-10 font-medium">The cost of an empty stall</p>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <div>
              <p className="text-5xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                $9,600
              </p>
              <p className="text-sm text-[#7a6a5a] leading-relaxed">
                lost per year from a single empty stall at $800/month
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#2c1810] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                $19,200
              </p>
              <p className="text-sm text-[#7a6a5a] leading-relaxed">
                lost per year with just two empty stalls sitting vacant
              </p>
            </div>
            <div>
              <p className="text-5xl font-bold text-[#4a6741] mb-2" style={{ fontFamily: "var(--font-playfair)" }}>
                $0
              </p>
              <p className="text-sm text-[#7a6a5a] leading-relaxed">
                cost to list on Barnbook and start reaching boarders today
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* ── The riders looking for you ── */}
      <section className="bg-[#2c1810] py-20 px-4">
        <div className="max-w-5xl mx-auto">
          <div className="mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#d4a853] mb-3">Your Audience</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-white mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Who&apos;s searching for you
            </h2>
            <p className="text-white/60 max-w-xl text-sm leading-relaxed">
              These aren&apos;t window shoppers. They&apos;re horse owners with real boarding needs, ready to commit to the right facility.
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
          {/* Photo */}
          <div className={`relative min-h-[50vw] lg:min-h-0 ${imageLeft ? "lg:order-1" : "lg:order-2"}`}>
            <Image
              src={photo}
              alt={title}
              fill
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
          </div>
          {/* Text */}
          <div
            className={`flex items-center px-8 sm:px-14 lg:px-20 py-16 bg-[#faf7f2] ${imageLeft ? "lg:order-2" : "lg:order-1"}`}
          >
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
              Up and running in minutes
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

      {/* ── Testimonials with barn photos ── */}
      <section className="bg-[#f0e8d8] py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">From the Community</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Barn owners love Barnbook
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {TESTIMONIALS.map(({ photo, quote, name, barn, location, type }) => (
              <div key={name} className="bg-white rounded-2xl overflow-hidden border border-[#e8dcc8] flex flex-col">
                {/* Barn photo */}
                <div className="relative aspect-[4/3] overflow-hidden">
                  <Image
                    src={photo}
                    alt={barn}
                    fill
                    sizes="(max-width: 768px) 100vw, 33vw"
                    className="object-cover"
                  />
                </div>
                {/* Quote */}
                <div className="p-6 flex flex-col flex-1">
                  <svg className="w-7 h-7 text-[#e8dcc8] mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                  </svg>
                  <p className="text-[#5a4a3a] text-sm leading-relaxed flex-1 mb-6">{quote}</p>
                  <div>
                    <p className="font-semibold text-[#2c1810] text-sm" style={{ fontFamily: "var(--font-playfair)" }}>
                      {name}
                    </p>
                    <p className="text-xs text-[#7a6a5a] mt-0.5">{barn} · {location}</p>
                    <span className="inline-block mt-2 text-xs px-2.5 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full">
                      {type}
                    </span>
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
          src="/images/barns/stone-columns-stables.jpg"
          alt="Equestrian facility"
          fill
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-[#1a0d07]/70" />
        <div className="relative z-10 max-w-2xl mx-auto text-center text-white">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a853] mb-5 font-medium">Get Started Free</p>
          <h2
            className="text-3xl md:text-5xl font-bold mb-6 leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Every empty stall is a stall waiting to be filled.
          </h2>
          <p className="text-white/65 mb-10 leading-relaxed text-lg">
            Riders are searching for your barn right now. List for free, get discovered, and start converting empty stalls into steady monthly revenue.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/claim"
              className="px-8 py-3.5 border-2 border-white text-white rounded-full font-semibold hover:bg-white/10 transition"
            >
              Claim Your Listing
            </Link>
            <Link
              href="/dashboard/new"
              className="px-8 py-3.5 bg-[#d4a853] text-[#2c1810] rounded-full font-semibold hover:bg-[#c49843] transition"
            >
              Create New Listing
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
