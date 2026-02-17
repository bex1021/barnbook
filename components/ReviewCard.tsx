import { Review } from "@/lib/types";
import StarRating from "./StarRating";

export default function ReviewCard({ review }: { review: Review }) {
  const date = new Date(review.createdAt).toLocaleDateString("en-US", {
    year: "numeric",
    month: "long",
    day: "numeric",
  });

  return (
    <div className="bg-white border border-gray-100 rounded-lg p-5">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center text-[#2d5016] font-semibold text-sm">
            {review.userName.charAt(0)}
          </div>
          <div>
            <p className="font-medium text-sm">{review.userName}</p>
            <p className="text-xs text-gray-400">{date}</p>
          </div>
        </div>
        <StarRating rating={review.rating} size="sm" />
      </div>
      <p className="text-gray-700 text-sm mt-2">{review.text}</p>
    </div>
  );
}
