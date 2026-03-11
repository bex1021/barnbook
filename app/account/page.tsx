import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { getSavedBarns, getBarnsByOwner } from "@/lib/data";
import { getAllPosts } from "@/lib/blog";
import Link from "next/link";
import Image from "next/image";

export const metadata = { title: "My Account | Barnbook" };

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/auth/login");

  const role = (session.user as { role?: string }).role;
  const name = session.user.name ?? "there";

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        {/* Header */}
        <div className="mb-8">
          <p className="text-xs tracking-[0.2em] uppercase text-[#c4956a] mb-2">
            {role === "admin" ? "Administrator" : role === "owner" ? "Barn Owner" : "Rider"}
          </p>
          <h1
            className="text-3xl font-bold text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Welcome back, {name.split(" ")[0]}.
          </h1>
          <p className="text-[#6b5c4e] mt-1 text-sm">{session.user.email}</p>
        </div>

        {role === "admin" && <AdminView userId={session.user.id} />}
        {role === "owner" && <OwnerView userId={session.user.id} />}
        {(role === "rider" || role === "user") && <RiderView userId={session.user.id} />}
      </div>
    </div>
  );
}

/* ── Admin View ── */
async function AdminView({ userId: _ }: { userId: string }) {
  let postCount = 0;
  try {
    const posts = await getAllPosts();
    postCount = posts.length;
  } catch {}

  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      <AccountCard
        href="/admin"
        icon="⚙️"
        title="Admin Dashboard"
        description="Users, barns, claims, and site overview"
      />
      <AccountCard
        href="/admin/blog"
        icon="✍️"
        title="Blog Posts"
        description={`${postCount} post${postCount !== 1 ? "s" : ""} — manage and publish`}
      />
      <AccountCard
        href="/admin/blog/new"
        icon="➕"
        title="New Post"
        description="Write and publish a new journal article"
      />
      <AccountCard
        href="/dashboard"
        icon="🏡"
        title="Barn Dashboard"
        description="Manage barn listings"
      />
      <AccountCard
        href="/barns"
        icon="🔍"
        title="Browse Barns"
        description="View all listings as a rider would"
      />
    </div>
  );
}

/* ── Owner View ── */
async function OwnerView({ userId }: { userId: string }) {
  const barns = await getBarnsByOwner(userId);

  return (
    <div className="space-y-6">
      <div className="grid sm:grid-cols-2 gap-4">
        <AccountCard
          href="/dashboard"
          icon="🏡"
          title="My Barn Listing"
          description={barns.length > 0 ? barns[0].name : "Set up your listing"}
        />
        <AccountCard
          href="/dashboard/new"
          icon="➕"
          title="Add a Listing"
          description="List another barn or facility"
        />
      </div>

      {barns.length > 0 && (
        <div>
          <h2
            className="text-lg font-bold text-[#2c1810] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Your Listings
          </h2>
          <div className="grid sm:grid-cols-2 gap-4">
            {barns.map((barn) => (
              <Link
                key={barn.id}
                href={`/dashboard/edit/${barn.id}`}
                className="flex items-center gap-4 bg-white rounded-xl border border-[#e8dcc8] p-4 hover:shadow-md transition-shadow"
              >
                <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-[#f0e8d8] flex-shrink-0">
                  {barn.photos[0] && (
                    <Image
                      src={`/images/barns/${barn.photos[0]}`}
                      alt={barn.name}
                      fill
                      className="object-cover"
                      sizes="64px"
                    />
                  )}
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-[#2c1810] truncate">{barn.name}</p>
                  <p className="text-xs text-[#9b8575] mt-0.5">
                    {barn.address.city}, {barn.address.state}
                  </p>
                  <p className="text-xs text-[#4a6741] mt-1">Edit listing →</p>
                </div>
              </Link>
            ))}
          </div>
        </div>
      )}

      <div className="bg-[#faf7f2] border border-[#e8dcc8] rounded-xl p-5">
        <p className="text-sm font-semibold text-[#2c1810] mb-1">Messages</p>
        <p className="text-xs text-[#9b8575]">Messaging is coming soon — riders will be able to contact you directly from your listing.</p>
      </div>
    </div>
  );
}

/* ── Rider View ── */
async function RiderView({ userId }: { userId: string }) {
  const savedBarns = await getSavedBarns(userId);

  return (
    <div className="space-y-8">
      {/* Saved barns */}
      <div>
        <div className="flex items-center justify-between mb-4">
          <h2
            className="text-lg font-bold text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Saved Barns
          </h2>
          <Link href="/barns" className="text-xs text-[#4a6741] hover:underline">
            Browse more →
          </Link>
        </div>

        {savedBarns.length === 0 ? (
          <div className="bg-white rounded-xl border border-[#e8dcc8] p-8 text-center">
            <p className="text-[#9b8575] text-sm mb-3">No saved barns yet.</p>
            <Link href="/barns" className="text-sm text-[#4a6741] font-medium hover:underline">
              Browse barns →
            </Link>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
            {savedBarns.map((barn) => (
              <Link
                key={barn.id}
                href={`/barns/${barn.slug}`}
                className="group bg-white rounded-xl border border-[#e8dcc8] overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="relative aspect-video bg-[#f0e8d8]">
                  {barn.photos[0] && (
                    <Image
                      src={`/images/barns/${barn.photos[0]}`}
                      alt={barn.name}
                      fill
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    />
                  )}
                </div>
                <div className="p-4">
                  <p className="font-semibold text-[#2c1810] text-sm">{barn.name}</p>
                  <p className="text-xs text-[#9b8575] mt-0.5">
                    {barn.address.city}, {barn.address.state}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Profile settings */}
      <div>
        <h2
          className="text-lg font-bold text-[#2c1810] mb-4"
          style={{ fontFamily: "var(--font-playfair)" }}
        >
          My Profile
        </h2>
        <div className="bg-white rounded-xl border border-[#e8dcc8] p-5">
          <p className="text-sm text-[#9b8575]">
            Profile editing — bio, disciplines, and what you&apos;re looking for in a barn — is coming soon.
          </p>
        </div>
      </div>
    </div>
  );
}

/* ── Shared card component ── */
function AccountCard({
  href,
  icon,
  title,
  description,
}: {
  href: string;
  icon: string;
  title: string;
  description: string;
}) {
  return (
    <Link
      href={href}
      className="bg-white rounded-xl border border-[#e8dcc8] p-5 hover:shadow-md transition-shadow flex items-start gap-4"
    >
      <span className="text-2xl flex-shrink-0">{icon}</span>
      <div>
        <p className="font-semibold text-[#2c1810] text-sm">{title}</p>
        <p className="text-xs text-[#9b8575] mt-0.5 leading-relaxed">{description}</p>
      </div>
    </Link>
  );
}
