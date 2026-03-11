import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import Link from "next/link";

export const metadata = { title: "My Profile | Barnbook" };

function getInitials(name: string) {
  const parts = name.trim().split(" ").filter(Boolean);
  if (parts.length === 1) return parts[0][0].toUpperCase();
  return (parts[0][0] + parts[parts.length - 1][0]).toUpperCase();
}

export default async function ProfilePage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const role = (session.user as { role?: string }).role ?? "rider";
  const name = session.user.name ?? "Rider";
  const initials = getInitials(name);

  const avatarColor =
    role === "admin"
      ? "bg-[#6b3fa0]"
      : role === "owner"
      ? "bg-[#8b5e3c]"
      : "bg-[#4a6741]";

  const roleLabel =
    role === "admin" ? "Administrator" : role === "owner" ? "Barn Owner" : "Rider";

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <div className="max-w-2xl mx-auto px-4 py-12">
        {/* Avatar + name */}
        <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-8 mb-6 text-center">
          <div
            className={`w-20 h-20 rounded-full ${avatarColor} flex items-center justify-center text-white text-2xl font-bold mx-auto mb-4`}
          >
            {initials}
          </div>
          <h1
            className="text-2xl font-bold text-[#2c1810] mb-1"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {name}
          </h1>
          <span className="inline-block text-xs px-3 py-1 rounded-full bg-[#f0e8d8] text-[#8b5e3c] font-medium">
            {roleLabel}
          </span>
          <div className="mt-6">
            <Link
              href="/account/preferences"
              className="text-sm text-[#4a6741] font-medium hover:underline"
            >
              Edit profile & preferences →
            </Link>
          </div>
        </div>

        {/* Profile sections — will expand as features are built */}
        {role === "rider" && (
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-6 mb-6">
            <h2
              className="text-base font-bold text-[#2c1810] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              About Me
            </h2>
            <p className="text-sm text-[#9b8575]">
              No bio yet.{" "}
              <Link href="/account/preferences" className="text-[#4a6741] hover:underline">
                Add one →
              </Link>
            </p>
          </div>
        )}

        {role === "owner" && (
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-6 mb-6">
            <h2
              className="text-base font-bold text-[#2c1810] mb-4"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              My Barn
            </h2>
            <Link href="/dashboard" className="text-sm text-[#4a6741] hover:underline">
              Manage your listing →
            </Link>
          </div>
        )}

        <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm p-6">
          <h2
            className="text-base font-bold text-[#2c1810] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Reviews
          </h2>
          <p className="text-sm text-[#9b8575]">
            Reviews you&apos;ve written will appear here.
          </p>
        </div>
      </div>
    </div>
  );
}
