import { auth } from "@/lib/auth";
import { redirect } from "next/navigation";
import { supabase } from "@/lib/supabase";
import Link from "next/link";

const ADMIN_EMAIL = "rebecca.leung671@gmail.com";

async function getStats() {
  const [users, barns, pendingBarns, claims, posts] = await Promise.all([
    supabase.from("users").select("id, name, email, role, created_at").order("created_at", { ascending: false }),
    supabase.from("barns").select("id", { count: "exact" }).eq("status", "active"),
    supabase.from("barns").select("id", { count: "exact" }).eq("status", "pending"),
    supabase.from("barn_claims").select("id, status").eq("status", "pending"),
    supabase.from("blog_posts").select("id, title, status, created_at").order("created_at", { ascending: false }).limit(5),
  ]);
  return {
    users: users.data ?? [],
    barnCount: barns.count ?? 0,
    pendingBarnCount: pendingBarns.count ?? 0,
    pendingClaims: claims.data?.length ?? 0,
    recentPosts: posts.data ?? [],
  };
}

export default async function AdminPage() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/auth/login");

  const { users, barnCount, pendingBarnCount, pendingClaims, recentPosts } = await getStats();

  const riderCount = users.filter((u) => u.role === "rider").length;
  const ownerCount = users.filter((u) => u.role === "owner").length;

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="mb-8">
          <h1
            className="text-3xl font-bold text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Admin Dashboard
          </h1>
          <p className="text-[#6b5c4e] mt-1">Welcome back, Rebecca.</p>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-10">
          {[
            { label: "Active Barns", value: barnCount, href: "/barns" },
            { label: "Pending Review", value: pendingBarnCount, href: "/admin/pending-barns", alert: pendingBarnCount > 0 },
            { label: "Pending Claims", value: pendingClaims, href: "/admin/claims", alert: pendingClaims > 0 },
            { label: "Riders", value: riderCount, href: "/admin/users" },
          ].map((stat) => (
            <Link
              key={stat.label}
              href={stat.href}
              className={`bg-white rounded-2xl border p-6 shadow-sm hover:shadow-md transition-shadow ${
                stat.alert ? "border-amber-300" : "border-[#e8dcc8]"
              }`}
            >
              <p className="text-3xl font-bold text-[#2c1810]">{stat.value}</p>
              <p className={`text-sm mt-1 ${stat.alert ? "text-amber-600 font-medium" : "text-[#6b5c4e]"}`}>
                {stat.label}
                {stat.alert ? " ⚠" : ""}
              </p>
            </Link>
          ))}
        </div>

        <div className="grid lg:grid-cols-2 gap-6">
          {/* Users */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dcc8]">
              <h2 className="font-bold text-[#2c1810]">All Users</h2>
              <span className="text-xs text-[#9b8575]">{users.length} total</span>
            </div>
            <div className="divide-y divide-[#f0e8db]">
              {users.map((user) => (
                <div key={user.id} className="flex items-center justify-between px-6 py-3">
                  <div>
                    <p className="text-sm font-medium text-[#2c1810]">{user.name}</p>
                    <p className="text-xs text-[#9b8575]">{user.email}</p>
                  </div>
                  <div className="flex items-center gap-3">
                    <RoleBadge role={user.role} />
                    <ChangeRoleButton userId={user.id} currentRole={user.role} />
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Blog posts */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] shadow-sm overflow-hidden">
            <div className="flex items-center justify-between px-6 py-4 border-b border-[#e8dcc8]">
              <h2 className="font-bold text-[#2c1810]">Recent Blog Posts</h2>
              <Link href="/admin/blog" className="text-xs text-[#4a6741] hover:underline">
                View all →
              </Link>
            </div>
            <div className="divide-y divide-[#f0e8db]">
              {recentPosts.length === 0 ? (
                <div className="px-6 py-8 text-center text-[#9b8575] text-sm">
                  No posts yet.{" "}
                  <Link href="/admin/blog/new" className="text-[#4a6741] hover:underline">
                    Write one →
                  </Link>
                </div>
              ) : (
                recentPosts.map((post) => (
                  <Link
                    key={post.id}
                    href={`/admin/blog/${post.id}`}
                    className="flex items-center justify-between px-6 py-3 hover:bg-[#faf7f2] transition-colors"
                  >
                    <p className="text-sm text-[#2c1810] font-medium truncate pr-4">
                      {post.title}
                    </p>
                    <span
                      className={`text-xs px-2 py-0.5 rounded-full flex-shrink-0 ${
                        post.status === "published"
                          ? "bg-green-100 text-green-700"
                          : "bg-amber-100 text-amber-700"
                      }`}
                    >
                      {post.status}
                    </span>
                  </Link>
                ))
              )}
            </div>
            <div className="px-6 py-3 border-t border-[#e8dcc8]">
              <Link
                href="/admin/blog/new"
                className="text-sm text-[#4a6741] font-medium hover:underline"
              >
                + New Post
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

function RoleBadge({ role }: { role: string }) {
  const styles: Record<string, string> = {
    admin: "bg-purple-100 text-purple-700",
    owner: "bg-blue-100 text-blue-700",
    rider: "bg-green-100 text-green-700",
    user: "bg-gray-100 text-gray-600",
  };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${styles[role] ?? styles.user}`}>
      {role}
    </span>
  );
}

function ChangeRoleButton({ userId, currentRole }: { userId: string; currentRole: string }) {
  if (currentRole === "admin") return null;
  const next = currentRole === "rider" ? "owner" : "rider";
  return (
    <form action={`/api/admin/users/${userId}/role`} method="POST">
      <input type="hidden" name="role" value={next} />
      <button
        type="submit"
        className="text-xs text-[#9b8575] hover:text-[#2c1810] hover:underline"
      >
        → {next}
      </button>
    </form>
  );
}
