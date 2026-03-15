import Image from "next/image";
import Link from "next/link";
import { Barn } from "@/lib/types";
import StarRating from "./StarRating";
import SaveButton from "./SaveButton";

interface BarnCardProps {
  barn: Barn;
  averageRating?: number;
  reviewCount?: number;
}

export default function BarnCard({ barn, averageRating = 0, reviewCount = 0 }: BarnCardProps) {
  return (
    <Link
      href={`/barns/${barn.slug}`}
      className="group block bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-lg transition-shadow"
    >
      {/* Photo */}
      <div className="h-48 bg-gradient-to-br from-[#f0e8d8] to-[#e8d8c0] relative overflow-hidden">
        {barn.photos.length > 0 ? (
          <Image
            src={`/images/barns/${barn.photos[0]}`}
            alt={barn.name}
            fill
            className="object-cover group-hover:scale-105 transition-transform duration-300"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center">
            <svg className="w-16 h-16 text-[#c4956a]" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5}
                d="M2.25 15.75l5.159-5.159a2.25 2.25 0 013.182 0l5.159 5.159m-1.5-1.5l1.409-1.409a2.25 2.25 0 013.182 0l2.909 2.909M3.75 21h16.5A2.25 2.25 0 0022.5 18.75V5.25A2.25 2.25 0 0020.25 3H3.75A2.25 2.25 0 001.5 5.25v13.5A2.25 2.25 0 003.75 21z" />
            </svg>
          </div>
        )}
        <SaveButton barnId={barn.id} />
      </div>

      <div className="p-5">
        <h3 className="text-lg font-semibold text-gray-900 group-hover:text-[#2d5016] transition-colors">
          {barn.name}
        </h3>
        <p className="text-sm text-gray-500 mt-1">
          {barn.address.city}, {barn.address.state}
        </p>

        {averageRating > 0 && (
          <div className="flex items-center gap-2 mt-2">
            <StarRating rating={Math.round(averageRating)} size="sm" />
            <span className="text-sm text-gray-600">
              {averageRating} ({reviewCount})
            </span>
          </div>
        )}

        <div className="flex flex-wrap gap-1.5 mt-3">
          {barn.disciplines.map((d) => (
            <span
              key={d}
              className="text-xs px-2 py-0.5 rounded-full bg-green-50 text-green-700 capitalize"
            >
              {d}
            </span>
          ))}
        </div>

        {(barn.services || []).length > 0 && (
          <div className="flex flex-wrap gap-1.5 mt-2">
            {(barn.services || []).map((s) => (
              <span
                key={s}
                className="text-xs px-2 py-0.5 rounded-full bg-blue-50 text-blue-700 capitalize"
              >
                {s}
              </span>
            ))}
          </div>
        )}

        <div className="mt-3 flex items-center justify-between text-sm">
          {barn.pricing.boardingFrom > 0 && (
            <span className="text-gray-600">
              From <span className="font-semibold text-gray-900">${barn.pricing.boardingFrom}</span>/mo
            </span>
          )}
          {barn.lessonAvailability && (
            <span className="text-green-600 font-medium">Lessons available</span>
          )}
        </div>
      </div>
    </Link>
  );
}
