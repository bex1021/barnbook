import Image from "next/image";
import Link from "next/link";
import { Barn } from "@/lib/types";
import StarRating from "./StarRating";
import PhotoCarousel from "./PhotoCarousel";
import SaveButton from "./SaveButton";

interface CategoryAverages {
  facilities: number | null;
  trainer: number | null;
  communication: number | null;
  value: number | null;
}

interface BarnDetailProps {
  barn: Barn;
  averageRating: number;
  reviewCount: number;
  categoryAverages?: CategoryAverages;
  initialSaved?: boolean;
  claimStatus?: "none" | "pending" | "owner";
  nearbyBarns?: Barn[];
}

const amenityLabels: Record<string, string> = {
  indoorArena: "Indoor Arena",
  outdoorArena: "Outdoor Arena",
  trails: "Trails",
  roundPen: "Round Pen",
  hotWalker: "Hot Walker",
  washRack: "Wash Rack",
};

const CATEGORY_LABELS: Record<string, string> = {
  facilities: "Facilities",
  trainer: "Trainer",
  communication: "Communication",
  value: "Value",
};

function getYouTubeEmbedUrl(url: string): string | null {
  const match = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&?/]+)/);
  return match ? `https://www.youtube.com/embed/${match[1]}` : null;
}

export default function BarnDetail({
  barn,
  averageRating,
  reviewCount,
  categoryAverages,
  initialSaved = false,
  claimStatus = "none",
  nearbyBarns = [],
}: BarnDetailProps) {
  const activeAmenities = Object.entries(barn.amenities)
    .filter(([, v]) => v)
    .map(([k]) => amenityLabels[k] || k);

  const embedUrl = barn.videoUrl ? getYouTubeEmbedUrl(barn.videoUrl) : null;

  const hasMap = barn.address.lat && barn.address.lng;
  const mapBbox = hasMap
    ? `${barn.address.lng - 0.025},${barn.address.lat - 0.015},${barn.address.lng + 0.025},${barn.address.lat + 0.015}`
    : null;
  const osmUrl = mapBbox
    ? `https://www.openstreetmap.org/export/embed.html?bbox=${mapBbox}&layer=mapnik&marker=${barn.address.lat},${barn.address.lng}`
    : null;
  const googleMapsUrl = hasMap
    ? `https://www.google.com/maps/search/?api=1&query=${barn.address.lat},${barn.address.lng}`
    : null;

  const hasSocial = barn.socialMedia && Object.values(barn.socialMedia).some(Boolean);
  const hasCategoryAverages =
    categoryAverages &&
    Object.values(categoryAverages).some((v) => v !== null);

  return (
    <div className="bg-[#faf7f2]">

      {/* Photo carousel */}
      <PhotoCarousel photos={barn.photos} barnName={barn.name} />

      {/* Header */}
      <div className="flex items-start justify-between gap-4 mt-6 mb-3">
        <div>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#2c1810] leading-tight"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {barn.name}
          </h1>
          <div className="flex flex-wrap items-center gap-x-4 gap-y-2 mt-2">
            <p className="text-[#7a6a5a] flex items-center gap-1 text-sm">
              <svg className="w-3.5 h-3.5 text-[#c4956a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
              {barn.address.city}, {barn.address.state}
            </p>
            {averageRating > 0 && (
              <div className="flex items-center gap-1.5">
                <StarRating rating={Math.round(averageRating)} size="sm" />
                <span className="text-[#2c1810] font-medium text-sm">{averageRating}</span>
                <span className="text-[#7a6a5a] text-sm">({reviewCount} review{reviewCount !== 1 ? "s" : ""})</span>
              </div>
            )}
            {barn.verified && (
              <span className="flex items-center gap-1 text-xs text-[#4a6741] bg-[#e8f0e4] px-2.5 py-1 rounded-full font-medium border border-[#c8dcc4]">
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
                Verified Owner
              </span>
            )}
          </div>
        </div>
        <div className="flex-shrink-0 mt-1">
          <SaveButton barnId={barn.id} initialSaved={initialSaved} variant="detail" />
        </div>
      </div>

      {/* Quick-fit strip */}
      <div className="bg-[#f0e8d8] border border-[#e0d0b8] rounded-2xl p-4 mb-8 flex flex-wrap gap-2">
        {barn.disciplines.slice(0, 4).map((d) => (
          <span
            key={d}
            className="text-xs px-3 py-1.5 bg-white text-[#8b5e3c] rounded-full capitalize font-medium border border-[#e8dcc8]"
          >
            {d}
          </span>
        ))}
        {barn.boarding.types.length > 0 && (
          <span className="text-xs px-3 py-1.5 bg-white text-[#5a4a3a] rounded-full font-medium border border-[#e8dcc8]">
            {barn.boarding.types.map((t) => t.charAt(0).toUpperCase() + t.slice(1)).join(" · ")} Board
          </span>
        )}
        {barn.lessonAvailability && (
          <span className="text-xs px-3 py-1.5 bg-white text-[#5a4a3a] rounded-full font-medium border border-[#e8dcc8]">
            Lessons Available
          </span>
        )}
        {barn.verified && barn.acceptingBoarders === true && (
          <span className="text-xs px-3 py-1.5 bg-[#e8f0e4] text-[#4a6741] rounded-full font-medium border border-[#c8dcc4]">
            ✓ Accepting Boarders
          </span>
        )}
        {barn.verified && barn.acceptingBoarders === false && (
          <span className="text-xs px-3 py-1.5 bg-[#f4ece8] text-[#8b4a2c] rounded-full font-medium border border-[#e0c8b8]">
            Full — Not Accepting
          </span>
        )}
        {barn.pricing.boardingFrom > 0 && (
          <span className="text-xs px-3 py-1.5 bg-white text-[#5a4a3a] rounded-full font-medium border border-[#e8dcc8]">
            From ${barn.pricing.boardingFrom}/mo
          </span>
        )}
      </div>

      {/* Main grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">

        {/* ── Main content ── */}
        <div className="lg:col-span-2 space-y-10">

          {/* About */}
          <section>
            <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
              About
            </h2>
            <p className="text-[#5a4a3a] leading-relaxed">{barn.description}</p>
          </section>

          {/* Disciplines */}
          {barn.disciplines.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Disciplines
              </h2>
              <div className="flex flex-wrap gap-2">
                {barn.disciplines.map((d) => (
                  <span
                    key={d}
                    className="px-3 py-1.5 bg-[#f0e8d8] text-[#8b5e3c] rounded-full text-sm capitalize font-medium border border-[#e0d0b8]"
                  >
                    {d}
                  </span>
                ))}
              </div>
            </section>
          )}

          {/* Amenities */}
          {activeAmenities.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Amenities
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                {activeAmenities.map((a) => (
                  <div key={a} className="flex items-center gap-2.5 bg-[#f0e8d8] rounded-xl px-3 py-2.5">
                    <div className="w-5 h-5 bg-[#4a6741] rounded-full flex items-center justify-center flex-shrink-0">
                      <svg className="w-3 h-3 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                    </div>
                    <span className="text-[#2c1810] text-sm font-medium">{a}</span>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Trainers */}
          {barn.trainers.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Trainers
              </h2>
              <div className="space-y-4">
                {barn.trainers.map((t, i) => (
                  <div key={i} className="bg-white border border-[#e8dcc8] rounded-2xl p-5">
                    <div className="flex items-center gap-3 mb-2">
                      <div className="w-10 h-10 rounded-full bg-[#f0e8d8] flex items-center justify-center text-[#8b5e3c] font-semibold">
                        {t.name.charAt(0)}
                      </div>
                      <h3 className="font-semibold text-[#2c1810]">{t.name}</h3>
                    </div>
                    <p className="text-[#5a4a3a] text-sm leading-relaxed">{t.bio}</p>
                    {(t.specialties || []).length > 0 && (
                      <div className="flex flex-wrap gap-1.5 mt-3">
                        {(t.specialties || []).map((s) => (
                          <span key={s} className="text-xs px-2.5 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full capitalize">
                            {s}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Competition & Shows */}
          {((barn.competitionAffiliations?.length ?? 0) > 0 || (barn.showLevels?.length ?? 0) > 0) && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Competition &amp; Shows
              </h2>
              <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5 space-y-4">
                {(barn.competitionAffiliations?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-[#7a6a5a] mb-2">Affiliations</p>
                    <div className="flex flex-wrap gap-2">
                      {barn.competitionAffiliations!.map((a) => (
                        <span key={a} className="text-sm px-3 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full font-medium border border-[#e0d0b8]">
                          {a}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {(barn.showLevels?.length ?? 0) > 0 && (
                  <div>
                    <p className="text-xs uppercase tracking-[0.15em] text-[#7a6a5a] mb-2">Show Levels</p>
                    <div className="flex flex-wrap gap-2">
                      {barn.showLevels!.map((l) => (
                        <span key={l} className="text-sm px-3 py-1 bg-[#f0e8d8] text-[#8b5e3c] rounded-full font-medium border border-[#e0d0b8]">
                          {l}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            </section>
          )}

          {/* Ratings breakdown (if we have category averages) */}
          {hasCategoryAverages && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Ratings Breakdown
              </h2>
              <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5 grid grid-cols-2 gap-x-8 gap-y-4">
                {Object.entries(categoryAverages!).map(([key, val]) => {
                  if (val === null) return null;
                  const pct = (val / 5) * 100;
                  return (
                    <div key={key}>
                      <div className="flex justify-between items-center mb-1">
                        <span className="text-sm text-[#5a4a3a]">{CATEGORY_LABELS[key] ?? key}</span>
                        <span className="text-sm font-semibold text-[#2c1810]">{val}</span>
                      </div>
                      <div className="h-1.5 bg-[#f0e8d8] rounded-full overflow-hidden">
                        <div
                          className="h-full bg-[#d4a853] rounded-full"
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}

          {/* Video */}
          {embedUrl && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Video Tour
              </h2>
              <div className="aspect-video rounded-2xl overflow-hidden bg-[#f0e8d8]">
                <iframe
                  src={embedUrl}
                  title="Barn video tour"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  className="w-full h-full"
                />
              </div>
            </section>
          )}

          {/* Map */}
          {osmUrl && (
            <section>
              <h2 className="text-xl font-semibold text-[#2c1810] mb-3" style={{ fontFamily: "var(--font-playfair)" }}>
                Location
              </h2>
              <div className="rounded-2xl overflow-hidden border border-[#e8dcc8]" style={{ height: "280px" }}>
                <iframe
                  src={osmUrl}
                  title="Map location"
                  className="w-full h-full"
                  loading="lazy"
                />
              </div>
              <p className="text-xs text-[#7a6a5a] mt-1.5">
                {barn.address.street}, {barn.address.city}, {barn.address.state} {barn.address.zip}
                {googleMapsUrl && (
                  <>
                    {" · "}
                    <a
                      href={googleMapsUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[#4a6741] hover:underline"
                    >
                      Open in Google Maps
                    </a>
                  </>
                )}
              </p>
            </section>
          )}
        </div>

        {/* ── Sidebar ── */}
        <aside className="space-y-5">

          {/* Accepting Boarders — only for verified barns */}
          {barn.verified && barn.acceptingBoarders !== undefined && (
            <div className={`rounded-2xl p-5 text-center ${
              barn.acceptingBoarders
                ? "bg-[#e8f0e4] border border-[#c8dcc4]"
                : "bg-[#f4ece8] border border-[#e0c8b8]"
            }`}>
              <div className={`w-10 h-10 rounded-full flex items-center justify-center mx-auto mb-3 ${
                barn.acceptingBoarders ? "bg-[#4a6741]" : "bg-[#8b4a2c]"
              }`}>
                {barn.acceptingBoarders ? (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                ) : (
                  <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </div>
              <p className={`font-semibold text-sm ${barn.acceptingBoarders ? "text-[#2c4a24]" : "text-[#5a2010]"}`}>
                {barn.acceptingBoarders ? "Accepting Boarders" : "Currently Full"}
              </p>
              <p className={`text-xs mt-1 ${barn.acceptingBoarders ? "text-[#4a6741]" : "text-[#8b4a2c]"}`}>
                {barn.acceptingBoarders
                  ? "Stalls available — reach out to inquire"
                  : "No stalls available at this time"}
              </p>
            </div>
          )}

          {/* Pricing */}
          {(barn.pricing.boardingFrom > 0 || barn.pricing.lessonsFrom > 0) && (
            <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#2c1810] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Pricing
              </h3>
              {barn.pricing.boardingFrom > 0 && (
                <div className="flex justify-between py-2 border-b border-[#f0e8d8]">
                  <span className="text-[#7a6a5a] text-sm">Boarding from</span>
                  <span className="font-semibold text-[#2c1810] text-sm">${barn.pricing.boardingFrom}/mo</span>
                </div>
              )}
              {barn.pricing.lessonsFrom > 0 && (
                <div className="flex justify-between py-2">
                  <span className="text-[#7a6a5a] text-sm">Lessons from</span>
                  <span className="font-semibold text-[#2c1810] text-sm">${barn.pricing.lessonsFrom}/lesson</span>
                </div>
              )}
            </div>
          )}

          {/* Boarding */}
          {(barn.boarding.types.length > 0 || barn.boarding.stallCount > 0) && (
            <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5">
              <h3 className="font-semibold text-[#2c1810] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
                Boarding
              </h3>
              <div className="space-y-2 text-sm">
                {barn.boarding.types.length > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#7a6a5a]">Types</span>
                    <span className="capitalize text-[#2c1810] text-right ml-4">{barn.boarding.types.join(", ")}</span>
                  </div>
                )}
                {barn.boarding.stallCount > 0 && (
                  <div className="flex justify-between">
                    <span className="text-[#7a6a5a]">Stalls</span>
                    <span className="text-[#2c1810]">{barn.boarding.stallCount}</span>
                  </div>
                )}
                {barn.boarding.turnout && (
                  <div className="flex justify-between">
                    <span className="text-[#7a6a5a]">Turnout</span>
                    <span className="capitalize text-[#2c1810]">{barn.boarding.turnout}</span>
                  </div>
                )}
              </div>
            </div>
          )}

          {/* Contact */}
          <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5">
            <h3 className="font-semibold text-[#2c1810] mb-4" style={{ fontFamily: "var(--font-playfair)" }}>
              Contact
            </h3>
            <div className="space-y-3 text-sm">
              {barn.phone && (
                <a href={`tel:${barn.phone}`} className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 bg-[#f0e8d8] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                    </svg>
                  </span>
                  <span className="text-[#5a4a3a] group-hover:text-[#2c1810] transition">{barn.phone}</span>
                </a>
              )}
              {barn.email && (
                <a href={`mailto:${barn.email}`} className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 bg-[#f0e8d8] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                    </svg>
                  </span>
                  <span className="text-[#5a4a3a] group-hover:text-[#2c1810] transition break-all">{barn.email}</span>
                </a>
              )}
              {barn.website && (
                <a href={barn.website} target="_blank" rel="noopener noreferrer" className="flex items-center gap-2.5 group">
                  <span className="w-7 h-7 bg-[#f0e8d8] rounded-full flex items-center justify-center flex-shrink-0">
                    <svg className="w-3.5 h-3.5 text-[#8b5e3c]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                    </svg>
                  </span>
                  <span className="text-[#4a6741] group-hover:text-[#2d5016] transition break-all underline underline-offset-2">
                    {barn.website.replace(/^https?:\/\//, "")}
                  </span>
                </a>
              )}
            </div>

            {/* Social Media */}
            {hasSocial && (
              <div className="mt-4 pt-4 border-t border-[#f0e8d8] flex gap-2">
                {barn.socialMedia?.instagram && (
                  <a
                    href={barn.socialMedia.instagram}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Instagram"
                    className="w-8 h-8 bg-[#f0e8d8] hover:bg-[#e8dcc8] rounded-full flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 text-[#8b5e3c]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zM12 0C8.741 0 8.333.014 7.053.072 2.695.272.273 2.69.073 7.052.014 8.333 0 8.741 0 12c0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98C8.333 23.986 8.741 24 12 24c3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98C15.668.014 15.259 0 12 0zm0 5.838a6.162 6.162 0 100 12.324 6.162 6.162 0 000-12.324zM12 16a4 4 0 110-8 4 4 0 010 8zm6.406-11.845a1.44 1.44 0 100 2.881 1.44 1.44 0 000-2.881z" />
                    </svg>
                  </a>
                )}
                {barn.socialMedia?.facebook && (
                  <a
                    href={barn.socialMedia.facebook}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Facebook"
                    className="w-8 h-8 bg-[#f0e8d8] hover:bg-[#e8dcc8] rounded-full flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 text-[#8b5e3c]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M24 12.073c0-6.627-5.373-12-12-12s-12 5.373-12 12c0 5.99 4.388 10.954 10.125 11.854v-8.385H7.078v-3.47h3.047V9.43c0-3.007 1.792-4.669 4.533-4.669 1.312 0 2.686.235 2.686.235v2.953H15.83c-1.491 0-1.956.925-1.956 1.874v2.25h3.328l-.532 3.47h-2.796v8.385C19.612 23.027 24 18.062 24 12.073z" />
                    </svg>
                  </a>
                )}
                {barn.socialMedia?.youtube && (
                  <a
                    href={barn.socialMedia.youtube}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="YouTube"
                    className="w-8 h-8 bg-[#f0e8d8] hover:bg-[#e8dcc8] rounded-full flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 text-[#8b5e3c]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M23.498 6.186a3.016 3.016 0 00-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 00.502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 002.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 002.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                    </svg>
                  </a>
                )}
                {barn.socialMedia?.tiktok && (
                  <a
                    href={barn.socialMedia.tiktok}
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="TikTok"
                    className="w-8 h-8 bg-[#f0e8d8] hover:bg-[#e8dcc8] rounded-full flex items-center justify-center transition"
                  >
                    <svg className="w-4 h-4 text-[#8b5e3c]" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M19.59 6.69a4.83 4.83 0 01-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 01-2.88 2.5 2.89 2.89 0 01-2.89-2.89 2.89 2.89 0 012.89-2.89c.28 0 .54.04.79.1V9.01a6.27 6.27 0 00-.79-.05 6.34 6.34 0 00-6.34 6.34 6.34 6.34 0 006.34 6.34 6.34 6.34 0 006.33-6.34V8.69a8.18 8.18 0 004.79 1.53V6.79a4.85 4.85 0 01-1.02-.1z" />
                    </svg>
                  </a>
                )}
              </div>
            )}
          </div>

          {/* Lesson availability */}
          {barn.lessonAvailability && (
            <div className="bg-[#f0e8d8] border border-[#e0d0b8] rounded-2xl p-4 text-center">
              <p className="text-[#8b5e3c] font-semibold text-sm">Lessons Available</p>
              <p className="text-[#7a6a5a] text-xs mt-1">Contact the barn to schedule</p>
            </div>
          )}

          {/* Verified owner badge */}
          {barn.verified && (
            <div className="bg-[#f0e8d8] border border-[#e8dcc8] rounded-2xl p-4 flex items-center gap-3">
              <div className="w-9 h-9 bg-[#4a6741] rounded-full flex items-center justify-center flex-shrink-0">
                <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                </svg>
              </div>
              <div>
                <p className="text-sm font-semibold text-[#2c1810]">Verified Owner</p>
                <p className="text-xs text-[#7a6a5a] mt-0.5">Listing managed by the owner</p>
              </div>
            </div>
          )}

          {/* Claim this listing */}
          {!barn.verified && !barn.ownerId && claimStatus === "none" && (
            <div className="border border-[#e8dcc8] rounded-2xl p-4 text-center bg-white">
              <p className="text-sm text-[#7a6a5a] mb-3">Are you the owner of this barn?</p>
              <Link
                href={`/claim/${barn.id}`}
                className="text-sm text-[#4a6741] font-medium hover:text-[#2d5016] underline underline-offset-4 transition"
              >
                Claim this listing →
              </Link>
            </div>
          )}

          {!barn.verified && claimStatus === "pending" && (
            <div className="border border-[#e8dcc8] rounded-2xl p-4 text-center bg-[#f0e8d8]">
              <p className="text-sm text-[#7a6a5a]">Your claim request is pending review.</p>
            </div>
          )}
        </aside>
      </div>

      {/* ── Nearby Barns ── */}
      {nearbyBarns.length > 0 && (
        <section className="mt-16 pt-10 border-t border-[#e8dcc8]">
          <div className="mb-6">
            <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-1">Explore More</p>
            <h2 className="text-2xl font-bold text-[#2c1810]" style={{ fontFamily: "var(--font-playfair)" }}>
              Barns Nearby
            </h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-5">
            {nearbyBarns.map((nb) => (
              <Link
                key={nb.slug}
                href={`/barns/${nb.slug}`}
                className="block group rounded-2xl overflow-hidden bg-white border border-[#e8dcc8] hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-[4/3] overflow-hidden">
                  {nb.photos.length > 0 ? (
                    <Image
                      src={`/images/barns/${nb.photos[0]}`}
                      alt={nb.name}
                      fill
                      sizes="(max-width: 640px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  ) : (
                    <div className="w-full h-full bg-[#f0e8d8]" />
                  )}
                </div>
                <div className="p-4">
                  <h3
                    className="font-semibold text-[#2c1810] text-sm leading-snug"
                    style={{ fontFamily: "var(--font-playfair)" }}
                  >
                    {nb.name}
                  </h3>
                  <p className="text-xs text-[#7a6a5a] mt-1">
                    {nb.address.city}, {nb.address.state}
                  </p>
                  {nb.disciplines.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-2">
                      {nb.disciplines.slice(0, 2).map((d) => (
                        <span key={d} className="text-xs px-2 py-0.5 bg-[#f0e8d8] text-[#8b5e3c] rounded-full capitalize">
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
      )}
    </div>
  );
}
