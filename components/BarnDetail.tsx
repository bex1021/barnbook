import { Barn } from "@/lib/types";
import StarRating from "./StarRating";
import PhotoCarousel from "./PhotoCarousel";
import SaveButton from "./SaveButton";

interface BarnDetailProps {
  barn: Barn;
  averageRating: number;
  reviewCount: number;
  initialSaved?: boolean;
}

const amenityLabels: Record<string, string> = {
  indoorArena: "Indoor Arena",
  outdoorArena: "Outdoor Arena",
  trails: "Trails",
  roundPen: "Round Pen",
  hotWalker: "Hot Walker",
  washRack: "Wash Rack",
};

export default function BarnDetail({ barn, averageRating, reviewCount, initialSaved = false }: BarnDetailProps) {
  const activeAmenities = Object.entries(barn.amenities)
    .filter(([, v]) => v)
    .map(([k]) => amenityLabels[k] || k);

  return (
    <div>
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-3xl md:text-4xl font-bold text-gray-900">{barn.name}</h1>
          <div className="flex-shrink-0 mt-1">
            <SaveButton barnId={barn.id} initialSaved={initialSaved} variant="detail" />
          </div>
        </div>
        <p className="text-gray-500 mt-1">
          {barn.address.street}, {barn.address.city}, {barn.address.state} {barn.address.zip}
        </p>
        {averageRating > 0 && (
          <div className="flex items-center gap-2 mt-3">
            <StarRating rating={Math.round(averageRating)} />
            <span className="text-gray-700 font-medium">{averageRating}</span>
            <span className="text-gray-500">({reviewCount} review{reviewCount !== 1 ? "s" : ""})</span>
          </div>
        )}
      </div>

      {/* Photo */}
      <PhotoCarousel photos={barn.photos} barnName={barn.name} />

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Main content */}
        <div className="lg:col-span-2 space-y-8">
          {/* About */}
          <section>
            <h2 className="text-xl font-semibold mb-3">About</h2>
            <p className="text-gray-700 leading-relaxed">{barn.description}</p>
          </section>

          {/* Disciplines */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Disciplines</h2>
            <div className="flex flex-wrap gap-2">
              {barn.disciplines.map((d) => (
                <span key={d} className="px-3 py-1 bg-green-50 text-green-700 rounded-full text-sm capitalize font-medium">
                  {d}
                </span>
              ))}
            </div>
          </section>

          {/* Amenities */}
          <section>
            <h2 className="text-xl font-semibold mb-3">Amenities</h2>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              {activeAmenities.map((a) => (
                <div key={a} className="flex items-center gap-2">
                  <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                  </svg>
                  <span className="text-gray-700 text-sm">{a}</span>
                </div>
              ))}
            </div>
          </section>

          {/* Trainers */}
          {barn.trainers.length > 0 && (
            <section>
              <h2 className="text-xl font-semibold mb-3">Trainers</h2>
              <div className="space-y-4">
                {barn.trainers.map((t, i) => (
                  <div key={i} className="bg-white border border-gray-100 rounded-lg p-4">
                    <h3 className="font-semibold">{t.name}</h3>
                    <p className="text-gray-600 text-sm mt-1">{t.bio}</p>
                    <div className="flex gap-2 mt-2">
                      {t.specialties.map((s) => (
                        <span key={s} className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full capitalize">{s}</span>
                      ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* Sidebar */}
        <aside className="space-y-6">
          {/* Pricing */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Pricing</h3>
            {barn.pricing.boardingFrom > 0 && (
              <div className="flex justify-between py-2 border-b border-gray-100">
                <span className="text-gray-600">Boarding from</span>
                <span className="font-semibold">${barn.pricing.boardingFrom}/mo</span>
              </div>
            )}
            {barn.pricing.lessonsFrom > 0 && (
              <div className="flex justify-between py-2">
                <span className="text-gray-600">Lessons from</span>
                <span className="font-semibold">${barn.pricing.lessonsFrom}/lesson</span>
              </div>
            )}
          </div>

          {/* Boarding */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Boarding</h3>
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-gray-600">Types</span>
                <span className="capitalize">{barn.boarding.types.join(", ")}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Stalls</span>
                <span>{barn.boarding.stallCount}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600">Turnout</span>
                <span className="capitalize">{barn.boarding.turnout}</span>
              </div>
            </div>
          </div>

          {/* Contact */}
          <div className="bg-white border border-gray-200 rounded-xl p-6">
            <h3 className="font-semibold text-lg mb-4">Contact</h3>
            <div className="space-y-3 text-sm">
              {barn.phone && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                  </svg>
                  <span>{barn.phone}</span>
                </div>
              )}
              {barn.email && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                  </svg>
                  <span className="break-all">{barn.email}</span>
                </div>
              )}
              {barn.website && (
                <div className="flex items-center gap-2">
                  <svg className="w-4 h-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 12a9 9 0 01-9 9m9-9a9 9 0 00-9-9m9 9H3m9 9a9 9 0 01-9-9m9 9c1.657 0 3-4.03 3-9s-1.343-9-3-9m0 18c-1.657 0-3-4.03-3-9s1.343-9 3-9" />
                  </svg>
                  <a href={barn.website} target="_blank" rel="noopener noreferrer" className="text-[#2d5016] hover:underline break-all">{barn.website}</a>
                </div>
              )}
            </div>
          </div>

          {/* Lesson availability */}
          {barn.lessonAvailability && (
            <div className="bg-green-50 border border-green-200 rounded-xl p-6 text-center">
              <p className="text-green-700 font-semibold">Lessons Available</p>
              <p className="text-green-600 text-sm mt-1">Contact the barn to schedule</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
