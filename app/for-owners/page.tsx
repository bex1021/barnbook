import Link from "next/link";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "For Barn Owners | Barnbook",
  description: "List your equestrian facility on Barnbook for free. Reach riders moving to your area, fill boarding spots and lesson openings, and manage your listing.",
};

const BENEFITS = [
  {
    icon: (
      <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
      </svg>
    ),
    title: "Free to List",
    body: "Creating and managing your listing on Barnbook is completely free — no subscription, no commission, no hidden fees. Ever.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
      </svg>
    ),
    title: "Reach Riders Moving to Your Area",
    body: "Barnbook is built for riders relocating to a new city. These are motivated, committed horse owners actively searching for their next barn — exactly the kind of clients you want.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
      </svg>
    ),
    title: "Fill Boarding Spots & Lesson Openings",
    body: "Showcase your available boarding types, lesson programs, disciplines, and amenities. Give riders everything they need to choose you before they even call.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
      </svg>
    ),
    title: "Manage Your Own Listing",
    body: "Claim your existing listing or create a new one. Add photos, update pricing, highlight your trainers, and keep your details current — all from your own dashboard.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
      </svg>
    ),
    title: "Verified Owner Badge",
    body: "Once your ownership is confirmed, your listing gets a Verified Owner badge — a trust signal that sets you apart and shows riders your facility is actively managed.",
  },
  {
    icon: (
      <svg className="w-6 h-6 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
    ),
    title: "Build Trust Through Reviews",
    body: "Rider reviews on Barnbook are honest and community-driven. Great reviews are your best marketing — they show up on your listing and help riders feel confident choosing you.",
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
    quote: "We had two boarding spots open for months. Within weeks of claiming our Barnbook listing and updating our photos, we had three new inquiries — one from a family that had just relocated from out of state.",
    name: "Sarah M.",
    barn: "Whispering Pines Equestrian, Lexington KY",
    type: "Boarding & Training",
  },
  {
    quote: "I teach dressage and was struggling to fill my beginner lesson slots. Barnbook helped me reach riders who are new to the area and don't know where to start. It's been a game changer for my program.",
    name: "Claire D.",
    barn: "Centerline Dressage, Wellington FL",
    type: "Lesson Program",
  },
  {
    quote: "The verified badge really matters. Riders tell me it made them feel confident reaching out before they'd even visited. It's the kind of credibility you can't buy — you just have to earn it.",
    name: "Tom R.",
    barn: "Iron Gate Farm, Ocala FL",
    type: "Full-Service Facility",
  },
];

export default function ForOwnersPage() {
  return (
    <div className="bg-[#faf7f2]">

      {/* ── Hero ── */}
      <section className="bg-[#2c1810] text-white py-24 px-4">
        <div className="max-w-4xl mx-auto text-center">
          <p className="text-xs tracking-[0.3em] uppercase text-[#d4a853] mb-5 font-medium">
            For Barn Owners
          </p>
          <h1
            className="text-4xl md:text-6xl font-bold leading-tight mb-6"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Join the Barnbook Community
          </h1>
          <p className="text-lg text-white/70 max-w-xl mx-auto mb-10 leading-relaxed">
            Grow your outreach, find new riders, and market your facility — all in one place, completely free.
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

      {/* ── Benefits ── */}
      <section className="py-20 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-14">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">Why Barnbook</p>
            <h2
              className="text-3xl md:text-4xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Everything you need to grow
            </h2>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {BENEFITS.map(({ icon, title, body }) => (
              <div key={title} className="bg-white border border-[#e8dcc8] rounded-2xl p-6">
                <div className="w-11 h-11 bg-[#f0e8d8] rounded-full flex items-center justify-center mb-4">
                  {icon}
                </div>
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

      {/* ── How it works ── */}
      <section className="bg-[#f0e8d8] py-20 px-4">
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
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {STEPS.map(({ number, title, body }) => (
              <div key={number} className="text-center">
                <p
                  className="text-5xl font-bold text-[#e8dcc8] mb-4"
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
      <section className="py-20 px-4">
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
            {TESTIMONIALS.map(({ quote, name, barn, type }) => (
              <div key={name} className="bg-white border border-[#e8dcc8] rounded-2xl p-6 flex flex-col">
                <svg className="w-8 h-8 text-[#e8dcc8] mb-4 flex-shrink-0" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
                </svg>
                <p className="text-[#5a4a3a] text-sm leading-relaxed flex-1 mb-6">{quote}</p>
                <div>
                  <p className="font-semibold text-[#2c1810] text-sm">{name}</p>
                  <p className="text-xs text-[#7a6a5a] mt-0.5">{barn}</p>
                  <span className="inline-block mt-2 text-xs px-2.5 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full">
                    {type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Bottom CTA ── */}
      <section className="bg-[#2c1810] py-20 px-4">
        <div className="max-w-2xl mx-auto text-center text-white">
          <p className="text-xs tracking-[0.2em] uppercase text-[#d4a853] mb-4">Get Started Free</p>
          <h2
            className="text-3xl md:text-4xl font-bold mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Ready to reach more riders?
          </h2>
          <p className="text-white/60 mb-10 leading-relaxed">
            Your barn is already being searched for. Make sure riders can find you — and choose you.
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
