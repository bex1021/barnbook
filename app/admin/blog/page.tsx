import { auth } from "@/lib/auth";
import { getAllPosts } from "@/lib/blog";
import { redirect } from "next/navigation";
import Link from "next/link";

const ADMIN_EMAIL = "rebecca.leung671@gmail.com";

export default async function AdminBlogPage() {
  const session = await auth();
  if (session?.user?.email !== ADMIN_EMAIL) redirect("/auth/login");

  const posts = await getAllPosts();

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      <div className="max-w-5xl mx-auto px-4 py-10">
        <div className="flex items-center justify-between mb-8">
          <div>
            <h1
              className="text-3xl font-bold text-[#2c1810]"
              style={{ fontFamily: "var(--font-playfair)" }}
            >
              Blog Posts
            </h1>
            <p className="text-[#6b5c4e] mt-1">{posts.length} total posts</p>
          </div>
          <Link
            href="/admin/blog/new"
            className="bg-[#4a6741] text-white font-semibold px-6 py-3 rounded-xl hover:bg-[#3a5535] transition-colors text-sm"
          >
            + New Post
          </Link>
        </div>

        <div className="bg-white rounded-2xl border border-[#e8dcc8] overflow-hidden shadow-sm">
          {posts.length === 0 ? (
            <div className="text-center py-16 text-[#9b8575]">
              No posts yet.{" "}
              <Link href="/admin/blog/new" className="text-[#4a6741] underline">
                Create your first post
              </Link>
            </div>
          ) : (
            <table className="w-full text-sm">
              <thead className="bg-[#faf7f2] border-b border-[#e8dcc8]">
                <tr>
                  <th className="text-left px-6 py-3 font-semibold text-[#2c1810]">
                    Title
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#2c1810]">
                    Status
                  </th>
                  <th className="text-left px-4 py-3 font-semibold text-[#2c1810]">
                    Date
                  </th>
                  <th className="px-4 py-3" />
                </tr>
              </thead>
              <tbody>
                {posts.map((post, i) => (
                  <tr
                    key={post.id}
                    className={`border-b border-[#f0e8db] ${
                      i % 2 === 0 ? "" : "bg-[#fdfaf6]"
                    }`}
                  >
                    <td className="px-6 py-4">
                      <p className="font-medium text-[#2c1810]">{post.title}</p>
                      <p className="text-xs text-[#9b8575] mt-0.5">
                        /blog/{post.slug}
                      </p>
                    </td>
                    <td className="px-4 py-4">
                      <span
                        className={`inline-block px-2.5 py-0.5 rounded-full text-xs font-medium ${
                          post.status === "published"
                            ? "bg-green-100 text-green-800"
                            : "bg-amber-100 text-amber-800"
                        }`}
                      >
                        {post.status}
                      </span>
                    </td>
                    <td className="px-4 py-4 text-[#6b5c4e]">
                      {new Date(post.created_at).toLocaleDateString("en-US", {
                        month: "short",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </td>
                    <td className="px-4 py-4 text-right">
                      <div className="flex items-center justify-end gap-3">
                        {post.status === "published" && (
                          <Link
                            href={`/blog/${post.slug}`}
                            className="text-xs text-[#4a6741] hover:underline"
                            target="_blank"
                          >
                            View ↗
                          </Link>
                        )}
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="text-xs text-[#2c1810] font-medium hover:underline"
                        >
                          Edit
                        </Link>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </div>
  );
}
