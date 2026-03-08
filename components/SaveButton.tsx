"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";

export default function SaveButton({
  barnId,
  initialSaved = false,
  variant = "icon",
}: {
  barnId: string;
  initialSaved?: boolean;
  variant?: "icon" | "detail";
}) {
  const { data: session } = useSession();
  const router = useRouter();
  const [saved, setSaved] = useState(initialSaved);
  const [loading, setLoading] = useState(false);

  async function handleClick(e: React.MouseEvent) {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      router.push("/auth/login");
      return;
    }

    setLoading(true);
    try {
      if (saved) {
        await fetch(`/api/saved?barnId=${barnId}`, { method: "DELETE" });
        setSaved(false);
      } else {
        await fetch("/api/saved", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ barnId }),
        });
        setSaved(true);
      }
    } finally {
      setLoading(false);
    }
  }

  const heartIcon = (
    <svg
      className={`w-4 h-4 transition-colors ${saved ? "text-red-500" : variant === "detail" ? "text-[#7a6a5a]" : "text-gray-400"}`}
      fill={saved ? "currentColor" : "none"}
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        strokeLinecap="round"
        strokeLinejoin="round"
        strokeWidth={2}
        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
      />
    </svg>
  );

  if (variant === "detail") {
    return (
      <button
        onClick={handleClick}
        disabled={loading}
        className={`flex items-center gap-2 px-4 py-2 rounded-full border transition disabled:opacity-60 text-sm font-medium ${
          saved
            ? "border-red-200 bg-red-50 text-red-500 hover:bg-red-100"
            : "border-[#e8dcc8] bg-white text-[#5a4a3a] hover:bg-[#f0e8d8]"
        }`}
        aria-label={saved ? "Unsave barn" : "Save barn"}
      >
        {heartIcon}
        {saved ? "Saved" : "Save"}
      </button>
    );
  }

  return (
    <button
      onClick={handleClick}
      disabled={loading}
      className="absolute top-3 right-3 z-10 w-8 h-8 bg-white/90 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm hover:bg-white transition disabled:opacity-60"
      aria-label={saved ? "Unsave barn" : "Save barn"}
    >
      {heartIcon}
    </button>
  );
}
