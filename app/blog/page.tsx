import { getPublishedPosts, readingTime } from "@/lib/blog";
import { auth } from "@/lib/auth";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Barnbook Blog — Horse Boarding & Lessons Guides",
  description:
    "Expert guides on horse boarding costs, riding lessons, and finding the best equestrian facilities in your area.",
};

export const revalidate = 60;

export default async function BlogPage() {
  const session = await auth();
  const isAdmin = (session?.user as { role?: string })?.role === "admin";

  let posts: Awaited<ReturnType<typeof getPublishedPosts>> = [];
  try {
    posts = await getPublishedPosts();
  } catch {
    // table not yet created
  }
  const [featured, ...rest] = posts;

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      {/* Header */}
      <div className="border-b border-[#e8dcc8] bg-white">
        <div className="max-w-6xl mx-auto px-4 py-12 text-center relative">
          <p className="text-[10px] font-bold uppercase tracking-[0.25em] text-[#4a6741] mb-3">
            Barnblog
          </p>
          <h1
            className="text-5xl md:text-6xl font-bold text-[#2c1810] mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Horse &amp; Barn
          </h1>
          <p className="text-[#6b5c4e] text-lg max-w-xl mx-auto">
            Guides, insights, and resources for equestrians finding their
            perfect barn.
          </p>
          {isAdmin && (
            <div className="absolute right-4 top-1/2 -translate-y-1/2 flex flex-col gap-2">
              <Link
                href="/admin/blog/new"
                className="bg-[#4a6741] text-white text-sm font-semibold px-5 py-2.5 rounded-xl hover:bg-[#3a5535] transition-colors text-center"
              >
                + New Post
              </Link>
              <Link
                href="/admin/blog"
                className="bg-white border border-[#e8dcc8] text-[#2c1810] text-sm font-semibold px-5 py-2 rounded-xl hover:bg-[#f5ede0] transition-colors text-center"
              >
                Manage Posts
              </Link>
            </div>
          )}
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-12">
        {posts.length === 0 ? (
          <div className="text-center py-24">
            <p className="text-[#6b5c4e] text-lg">
              No articles yet — check back soon.
            </p>
            {isAdmin && (
              <Link
                href="/admin/blog/new"
                className="mt-4 inline-block text-[#4a6741] font-medium hover:underline"
              >
                Write the first post →
              </Link>
            )}
          </div>
        ) : (
          <>
            {/* Featured post */}
            {featured && (
              <div className="relative group mb-16">
                <Link href={`/blog/${featured.slug}`} className="block">
                  <div className="grid md:grid-cols-2 gap-8 bg-white rounded-2xl overflow-hidden shadow-sm border border-[#e8dcc8]">
                    <div className="relative aspect-[4/3] md:aspect-auto bg-[#f5ede0]">
                      {featured.featured_image_url ? (
                        <Image
                          src={featured.featured_image_url}
                          alt={featured.featured_image_alt ?? featured.title}
                          fill
                          className="object-cover group-hover:scale-[1.02] transition-transform duration-500"
                          sizes="(max-width: 768px) 100vw, 50vw"
                        />
                      ) : (
                        <div className="w-full h-full flex items-center justify-center">
                          <span className="text-6xl">🐴</span>
                        </div>
                      )}
                    </div>
                    <div className="p-8 flex flex-col justify-center">
                      <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a6741] mb-3">
                        Featured
                      </span>
                      <h2
                        className="text-3xl font-bold text-[#2c1810] mb-4 group-hover:text-[#4a6741] transition-colors leading-tight"
                        style={{ fontFamily: "var(--font-playfair)" }}
                      >
                        {featured.title}
                      </h2>
                      {featured.excerpt && (
                        <p className="text-[#6b5c4e] text-base leading-relaxed mb-6">
                          {featured.excerpt}
                        </p>
                      )}
                      <div className="flex items-center gap-3 text-sm text-[#9b8575]">
                        <span>{featured.author_name}</span>
                        <span>·</span>
                        <span>{readingTime(featured.content)} min read</span>
                        {featured.published_at && (
                          <>
                            <span>·</span>
                            <span>
                              {new Date(featured.published_at).toLocaleDateString(
                                "en-US",
                                { month: "long", day: "numeric", year: "numeric" }
                              )}
                            </span>
                          </>
                        )}
                      </div>
                    </div>
                  </div>
                </Link>
                {isAdmin && (
                  <Link
                    href={`/admin/blog/${featured.id}`}
                    className="absolute top-3 right-3 bg-white/90 backdrop-blur-sm text-[#2c1810] text-xs font-semibold px-3 py-1.5 rounded-lg border border-[#e8dcc8] hover:bg-white transition-colors shadow-sm"
                  >
                    Edit ✏
                  </Link>
                )}
              </div>
            )}

            {/* Grid */}
            {rest.length > 0 && (
              <>
                <div className="flex items-center gap-4 mb-8">
                  <span className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#9b8575]">
                    More Articles
                  </span>
                  <div className="flex-1 h-px bg-[#e8dcc8]" />
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {rest.map((post) => (
                    <div key={post.id} className="relative group">
                      <Link
                        href={`/blog/${post.slug}`}
                        className="block bg-white rounded-xl overflow-hidden border border-[#e8dcc8] shadow-sm hover:shadow-md transition-shadow"
                      >
                        <div className="relative aspect-[16/9] bg-[#f5ede0]">
                          {post.featured_image_url ? (
                            <Image
                              src={post.featured_image_url}
                              alt={post.featured_image_alt ?? post.title}
                              fill
                              className="object-cover group-hover:scale-[1.03] transition-transform duration-500"
                              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                            />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-3xl">
                              🐴
                            </div>
                          )}
                        </div>
                        <div className="p-5">
                          <h3
                            className="text-lg font-bold text-[#2c1810] mb-2 group-hover:text-[#4a6741] transition-colors leading-snug"
                            style={{ fontFamily: "var(--font-playfair)" }}
                          >
                            {post.title}
                          </h3>
                          {post.excerpt && (
                            <p className="text-sm text-[#6b5c4e] leading-relaxed mb-4 line-clamp-2">
                              {post.excerpt}
                            </p>
                          )}
                          <div className="flex items-center gap-2 text-xs text-[#9b8575]">
                            <span>{readingTime(post.content)} min read</span>
                            {post.published_at && (
                              <>
                                <span>·</span>
                                <span>
                                  {new Date(post.published_at).toLocaleDateString(
                                    "en-US",
                                    { month: "short", day: "numeric" }
                                  )}
                                </span>
                              </>
                            )}
                          </div>
                        </div>
                      </Link>
                      {isAdmin && (
                        <Link
                          href={`/admin/blog/${post.id}`}
                          className="absolute top-2 right-2 bg-white/90 backdrop-blur-sm text-[#2c1810] text-xs font-semibold px-2.5 py-1 rounded-lg border border-[#e8dcc8] hover:bg-white transition-colors shadow-sm opacity-0 group-hover:opacity-100"
                        >
                          Edit ✏
                        </Link>
                      )}
                    </div>
                  ))}
                </div>
              </>
            )}
          </>
        )}
      </div>
    </div>
  );
}
