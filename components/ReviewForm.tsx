"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import StarRating from "./StarRating";
import Link from "next/link";

export default function ReviewForm({ barnId }: { barnId: string }) {
  const { data: session } = useSession();
  const router = useRouter();
  const [rating, setRating] = useState(0);
  const [text, setText] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  if (!session) {
    return (
      <div className="bg-gray-50 border border-gray-200 rounded-xl p-6 text-center">
        <p className="text-gray-600 mb-3">Sign in to leave a review</p>
        <Link
          href="/auth/login"
          className="inline-block bg-[#2d5016] text-white px-5 py-2 rounded-lg text-sm font-medium hover:bg-[#4a7c28] transition"
        >
          Sign In
        </Link>
      </div>
    );
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (rating === 0) {
      setError("Please select a rating");
      return;
    }
    setError("");
    setLoading(true);

    const res = await fetch("/api/reviews", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ barnId, rating, text }),
    });

    setLoading(false);

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Failed to submit review");
      return;
    }

    setRating(0);
    setText("");
    router.refresh();
  }

  return (
    <form onSubmit={handleSubmit} className="bg-white border border-gray-200 rounded-xl p-6 space-y-4">
      <h3 className="font-semibold text-lg">Write a Review</h3>
      {error && (
        <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">{error}</div>
      )}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">Rating</label>
        <StarRating rating={rating} size="lg" interactive onChange={setRating} />
      </div>
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-1">Your Review</label>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          required
          rows={4}
          placeholder="Share your experience..."
          className="w-full border border-gray-300 rounded-lg px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-[#2d5016] text-sm"
        />
      </div>
      <button
        type="submit"
        disabled={loading}
        className="bg-[#2d5016] text-white px-6 py-2.5 rounded-lg font-medium hover:bg-[#4a7c28] transition disabled:opacity-50"
      >
        {loading ? "Submitting..." : "Submit Review"}
      </button>
    </form>
  );
}
