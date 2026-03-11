"use client";

import { useState } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AccountPreferencesPage() {
  const { data: session, update } = useSession();
  const router = useRouter();

  const [name, setName] = useState(session?.user?.name ?? "");
  const [email, setEmail] = useState(session?.user?.email ?? "");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const [saving, setSaving] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");

  async function handleSave(e: React.FormEvent) {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (newPassword && newPassword !== confirmPassword) {
      setError("New passwords don't match.");
      return;
    }
    if (newPassword && newPassword.length < 6) {
      setError("New password must be at least 6 characters.");
      return;
    }

    setSaving(true);
    try {
      const res = await fetch("/api/account/update", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: name !== session?.user?.name ? name : undefined,
          email: email !== session?.user?.email ? email : undefined,
          currentPassword: currentPassword || undefined,
          newPassword: newPassword || undefined,
        }),
      });

      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Something went wrong.");
      } else {
        await update({ name, email });
        setSuccess("Changes saved.");
        setCurrentPassword("");
        setNewPassword("");
        setConfirmPassword("");
        router.refresh();
      }
    } catch {
      setError("Something went wrong. Please try again.");
    } finally {
      setSaving(false);
    }
  }

  const field =
    "w-full px-4 py-2.5 rounded-lg border border-[#e8dcc8] bg-white text-[#2c1810] placeholder-[#b8a898] focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-sm";
  const label =
    "block text-xs font-bold uppercase tracking-wide text-[#6b5c4e] mb-1.5";

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <div className="max-w-xl mx-auto px-4 py-12">
        <div className="mb-8">
          <Link href="/profile" className="text-sm text-[#4a6741] hover:underline mb-3 inline-block">
            ← Back to Profile
          </Link>
          <h1
            className="text-3xl font-bold text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Account Preferences
          </h1>
        </div>

        <form onSubmit={handleSave} className="space-y-6">
          {error && (
            <div className="px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
              {error}
            </div>
          )}
          {success && (
            <div className="px-4 py-3 bg-green-50 border border-green-200 text-green-700 text-sm rounded-lg">
              {success}
            </div>
          )}

          {/* Name & email */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#2c1810]">Personal Info</h2>
            <div>
              <label className={label}>Name</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={field}
              />
            </div>
            <div>
              <label className={label}>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className={field}
              />
            </div>
          </div>

          {/* Password */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-6 space-y-4">
            <h2 className="text-sm font-bold text-[#2c1810]">Change Password</h2>
            <p className="text-xs text-[#9b8575]">Leave blank if you don&apos;t want to change your password.</p>
            <div>
              <label className={label}>Current Password</label>
              <input
                type="password"
                value={currentPassword}
                onChange={(e) => setCurrentPassword(e.target.value)}
                placeholder="Enter current password"
                className={field}
              />
            </div>
            <div>
              <label className={label}>New Password</label>
              <input
                type="password"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
                placeholder="At least 6 characters"
                className={field}
              />
            </div>
            <div>
              <label className={label}>Confirm New Password</label>
              <input
                type="password"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="Repeat new password"
                className={field}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={saving}
            className="w-full bg-[#4a6741] text-white font-semibold py-3 rounded-xl hover:bg-[#3a5535] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Changes"}
          </button>
        </form>
      </div>
    </div>
  );
}
