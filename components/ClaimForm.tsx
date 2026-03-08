"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

export default function ClaimForm({ barnId, barnName }: { barnId: string; barnName: string }) {
  const router = useRouter();
  const [contactPhone, setContactPhone] = useState("");
  const [contactEmail, setContactEmail] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!message.trim()) {
      setError("Please provide a message explaining your ownership.");
      return;
    }

    setLoading(true);
    setError("");

    try {
      const res = await fetch("/api/claims", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ barnId, contactPhone, contactEmail, message }),
      });

      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Something went wrong. Please try again.");
        return;
      }

      router.refresh();
    } finally {
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
          Your Phone Number
        </label>
        <input
          type="tel"
          value={contactPhone}
          onChange={(e) => setContactPhone(e.target.value)}
          placeholder="Your phone number"
          className="w-full px-4 py-3 rounded-lg border border-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-[#2c1810] bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
          Your Email Address
        </label>
        <input
          type="email"
          value={contactEmail}
          onChange={(e) => setContactEmail(e.target.value)}
          placeholder="Your email address"
          className="w-full px-4 py-3 rounded-lg border border-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-[#2c1810] bg-white"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-[#2c1810] mb-1.5">
          Message <span className="text-red-500">*</span>
        </label>
        <textarea
          value={message}
          onChange={(e) => setMessage(e.target.value)}
          placeholder={`Verify that you're the owner of ${barnName} — include any details that help us confirm ownership.`}
          rows={4}
          required
          className="w-full px-4 py-3 rounded-lg border border-[#e8dcc8] focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-[#2c1810] bg-white resize-none"
        />
      </div>

      {error && (
        <p className="text-sm text-red-600 bg-red-50 border border-red-200 rounded-lg px-4 py-3">
          {error}
        </p>
      )}

      <button
        type="submit"
        disabled={loading}
        className="w-full py-3.5 bg-[#4a6741] text-white rounded-lg font-medium hover:bg-[#3a5535] transition disabled:opacity-60"
      >
        {loading ? "Submitting..." : "Submit Claim Request"}
      </button>

      <p className="text-xs text-[#a89a8a] text-center">
        By submitting, you confirm that you are the authorized owner or representative of this facility.
      </p>
    </form>
  );
}
