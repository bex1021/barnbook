"use client";

import { useState } from "react";
import { signIn } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function RegisterPage() {
  const router = useRouter();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"rider" | "owner">("rider");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setLoading(true);

    const res = await fetch("/api/auth/register", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ name, email, password, role }),
    });

    if (!res.ok) {
      const data = await res.json();
      setError(data.error || "Registration failed");
      setLoading(false);
      return;
    }

    const result = await signIn("credentials", {
      email,
      password,
      redirect: false,
    });

    setLoading(false);

    if (result?.error) {
      setError("Account created but sign-in failed. Please try logging in.");
    } else {
      // Barn owners go straight to claim a barn
      router.push(role === "owner" ? "/dashboard/new" : "/dashboard");
      router.refresh();
    }
  }

  return (
    <div className="min-h-[70vh] flex items-center justify-center px-4">
      <div className="w-full max-w-md">
        <h1
          className="text-3xl font-bold text-center text-[#2c1810] mb-2"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          Create Account
        </h1>
        <p className="text-center text-[#6b5c4e] mb-8 text-sm">
          Join Barnbook to find your perfect barn
        </p>

        <form
          onSubmit={handleSubmit}
          className="bg-white rounded-2xl border border-[#e8dcc8] p-8 space-y-5 shadow-sm"
        >
          {error && (
            <div className="bg-red-50 text-red-600 text-sm px-4 py-3 rounded-lg">
              {error}
            </div>
          )}

          {/* Role selection */}
          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#6b5c4e] mb-3">
              I am a...
            </label>
            <div className="grid grid-cols-2 gap-3">
              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  role === "rider"
                    ? "border-[#4a6741] bg-[#f0f5ee]"
                    : "border-[#e8dcc8] hover:border-[#c8b89a]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="rider"
                  checked={role === "rider"}
                  onChange={() => setRole("rider")}
                  className="sr-only"
                />
                <span className="text-2xl">🐴</span>
                <span className="text-sm font-semibold text-[#2c1810]">
                  Rider
                </span>
                <span className="text-xs text-[#9b8575] text-center">
                  Find barns, write reviews
                </span>
              </label>

              <label
                className={`flex flex-col items-center gap-2 p-4 rounded-xl border-2 cursor-pointer transition-colors ${
                  role === "owner"
                    ? "border-[#4a6741] bg-[#f0f5ee]"
                    : "border-[#e8dcc8] hover:border-[#c8b89a]"
                }`}
              >
                <input
                  type="radio"
                  name="role"
                  value="owner"
                  checked={role === "owner"}
                  onChange={() => setRole("owner")}
                  className="sr-only"
                />
                <span className="text-2xl">🏡</span>
                <span className="text-sm font-semibold text-[#2c1810]">
                  Barn Owner
                </span>
                <span className="text-xs text-[#9b8575] text-center">
                  Manage your listing
                </span>
              </label>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#6b5c4e] mb-1.5">
              Name
            </label>
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              className="w-full border border-[#e8dcc8] rounded-lg px-4 py-2.5 text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#6b5c4e] mb-1.5">
              Email
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full border border-[#e8dcc8] rounded-lg px-4 py-2.5 text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
            />
          </div>

          <div>
            <label className="block text-xs font-bold uppercase tracking-wide text-[#6b5c4e] mb-1.5">
              Password
            </label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength={8}
              className="w-full border border-[#e8dcc8] rounded-lg px-4 py-2.5 text-[#2c1810] focus:outline-none focus:ring-2 focus:ring-[#4a6741]"
            />
          </div>

          {role === "owner" && (
            <div className="bg-[#faf7f2] border border-[#e8dcc8] rounded-lg px-4 py-3 text-sm text-[#6b5c4e]">
              After registering you&apos;ll be taken to claim or create your barn listing.
            </div>
          )}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-[#4a6741] text-white py-3 rounded-xl font-semibold hover:bg-[#3a5535] transition disabled:opacity-50"
          >
            {loading ? "Creating account…" : "Create Account"}
          </button>

          <p className="text-center text-sm text-[#9b8575]">
            Already have an account?{" "}
            <Link
              href="/auth/login"
              className="text-[#4a6741] font-medium hover:underline"
            >
              Sign in
            </Link>
          </p>
        </form>
      </div>
    </div>
  );
}
