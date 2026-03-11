"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import Link from "next/link";

const CATEGORIES = [
  { key: "facilities", label: "Facilities" },
  { key: "trainer", label: "Trainer / Instruction" },
  { key: "communication", label: "Communication" },
  { key: "value", label: "Value" },
] as const;

export default function ReviewForm({ barnId }: { barnId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [categoryRatings, setCategoryRatings] = useState<Record<string, number>>({});
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="bg-[#f0e8d8] border border-[#e8dcc8] rounded-2xl p-6 text-center">
        <p className="text-[#5a4a3a] mb-3">Sign in to leave a review</p>
        <Link
          href="/auth/login"
          className="inline-block bg-[#4a6741] text-white px-5 py-2 rounded-full text-sm font-medium hover:bg-[#3a5535] transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select an overall rating");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        barnId,
        rating,
        text,
        categoryRatings: Object.keys(categoryRatings).length > 0 ? categoryRatings : undefined,
      }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to submit review");
      return;
    }

    setRating(0);
    setCategoryRatings({});
    setText("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-[#e8dcc8] rounded-2xl p-6 space-y-5">
      <h3 className="font-semibold text-lg text-[#2c1810]" style={{ fontFamily: "var(--font-playfair)" }}>
        Write a Review
      </h3>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-xl">{error}</div>
      )}

      {/* Overall rating */}
      <div>
        <label className="block text-sm font-medium text-[#5a4a3a] mb-2">Overall Rating</label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>

      {/* Category ratings */}
      <div className="border-t border-[#f0e8d8] pt-4">
        <p className="text-xs text-[#7a6a5a] uppercase tracking-[0.15em] mb-3">Rate by Category <span className="normal-case">(optional)</span></p>
        <div className="grid grid-cols-2 gap-3">
          {CATEGORIES.map(({ key, label }) => (
            <div key={key}>
              <label className="block text-xs font-medium text-[#5a4a3a] mb-1">{label}</label>
              <StarRating
                rating={categoryRatings[key] || 0}
                size="sm"
                interactive
                onChange={(val) => setCategoryRatings((prev) => ({ ...prev, [key]: val }))}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Text */}
      <div>
        <label className="block text-sm font-medium text-[#5a4a3a] mb-1">Your Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          placeholder="Share your experience — what do you love? What should riders know before choosing this barn?"
          className="w-full border border-[#e0d0b8] rounded-xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-sm bg-[#faf7f2] text-[#2c1810] placeholder:text-[#b0a090]"
        />
      </div>

      <button
        type="submit"
        disabled={loading}
        className="bg-[#4a6741] text-white px-6 py-2.5 rounded-full font-medium hover:bg-[#3a5535] transition disabled:opacity-50 text-sm"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
