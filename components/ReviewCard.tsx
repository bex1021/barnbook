import { Review } from "@/lib/types";
import StarRating from "./StarRating";

const CATEGORY_LABELS: Record<string, string> = {
  facilities: "Facilities",
  trainer: "Trainer",
  communication: "Communication",
  value: "Value",
};

export default function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  const catEntries = review.categoryRatings
    ? Object.entries(review.categoryRatings).filter(([, v]) => v != null && v > 0)
    : [];

  return (
    <div className="bg-white border border-[#e8dcc8] rounded-2xl p-5">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-[#f0e8d8] flex items-center justify-center text-[#8b5e3c] font-semibold text-sm">
            {review.userName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm text-[#2c1810]">{review.userName}</p>
            <p className="text-xs text-[#7a6a5a]">{date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>

      <p className="text-[#5a4a3a] text-sm leading-relaxed">{review.text}</p>

      {catEntries.length > 0 && (
        <div className="mt-4 pt-3 border-t border-[#f0e8d8] grid grid-cols-2 gap-x-6 gap-y-1.5">
          {catEntries.map(([key, val]) => (
            <div key={key} className="flex items-center justify-between gap-2">
              <span className="text-xs text-[#7a6a5a]">{CATEGORY_LABELS[key] ?? key}</span>
              <div className="flex items-center gap-1">
                <div className="flex gap-0.5">
                  {[1, 2, 3, 4, 5].map((s) => (
                    <div
                      key={s}
                      className={`w-2 h-2 rounded-full ${s <= (val as number) ? "bg-[#d4a853]" : "bg-[#e8dcc8]"}`}
                    />
                  ))}
                </div>
                <span className="text-xs text-[#8b5e3c] font-medium">{val}</span>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
