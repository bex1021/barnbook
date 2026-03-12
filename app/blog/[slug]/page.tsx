import { getPostBySlug, getPublishedPosts, readingTime } from "@/lib/blog";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import DOMPurify from "isomorphic-dompurify";

export const revalidate = 60;

export async function generateStaticParams() {
  try {
    const posts = await getPublishedPosts();
    return posts.map((p) => ({ slug: p.slug }));
  } catch {
    return [];
  }
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) return {};
  return {
    title: post.meta_title || post.title,
    description: post.meta_description || post.excerpt || undefined,
    openGraph: {
      title: post.meta_title || post.title,
      description: post.meta_description || post.excerpt || undefined,
      images: post.featured_image_url ? [post.featured_image_url] : [],
    },
  };
}

export default async function BlogPostPage({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const post = await getPostBySlug(slug);
  if (!post) notFound();

  const mins = readingTime(post.content);

  return (
    <div className="min-h-screen bg-[#fdfaf6]">
      {/* Hero */}
      {post.featured_image_url && (
        <div className="relative h-[50vh] min-h-[320px] bg-[#2c1810]">
          <Image
            src={post.featured_image_url}
            alt={post.featured_image_alt ?? post.title}
            fill
            className="object-cover opacity-75"
            priority
            sizes="100vw"
          />
          <div className="absolute inset-0 bg-gradient-to-b from-black/20 to-black/60" />
        </div>
      )}

      <div className="max-w-3xl mx-auto px-4">
        {/* Title block */}
        <div
          className={`${
            post.featured_image_url
              ? "-mt-32 relative z-10"
              : "pt-12"
          } bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#e8dcc8] mb-10`}
        >
          <Link
            href="/blog"
            className="text-[10px] font-bold uppercase tracking-[0.2em] text-[#4a6741] hover:underline mb-4 inline-block"
          >
            ← Barnblog
          </Link>
          <h1
            className="text-3xl md:text-4xl font-bold text-[#2c1810] leading-tight mb-4"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {post.title}
          </h1>
          {post.excerpt && (
            <p className="text-[#6b5c4e] text-lg leading-relaxed mb-6">
              {post.excerpt}
            </p>
          )}
          <div className="flex items-center gap-3 text-sm text-[#9b8575] border-t border-[#f0e8db] pt-4">
            <span className="font-medium text-[#2c1810]">
              {post.author_name}
            </span>
            <span>·</span>
            <span>{mins} min read</span>
            {post.published_at && (
              <>
                <span>·</span>
                <span>
                  {new Date(post.published_at).toLocaleDateString("en-US", {
                    month: "long",
                    day: "numeric",
                    year: "numeric",
                  })}
                </span>
              </>
            )}
          </div>
        </div>

        {/* Content */}
        <div className="bg-white rounded-2xl p-8 md:p-12 shadow-sm border border-[#e8dcc8] mb-16">
          <div
            className="prose prose-lg max-w-none prose-headings:font-bold prose-headings:text-[#2c1810] prose-p:text-[#3d2b1f] prose-p:leading-relaxed prose-a:text-[#4a6741] prose-a:no-underline hover:prose-a:underline prose-strong:text-[#2c1810] prose-blockquote:border-l-[#4a6741] prose-blockquote:text-[#6b5c4e] prose-li:text-[#3d2b1f]"
            dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(post.content) }}
          />
        </div>

        {/* CTA */}
        <div className="bg-[#4a6741] rounded-2xl p-8 text-center text-white mb-16">
          <h2
            className="text-2xl font-bold mb-3"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            Find Your Perfect Barn
          </h2>
          <p className="text-white/80 mb-6">
            Search hundreds of boarding facilities and riding schools near you.
          </p>
          <Link
            href="/barns"
            className="inline-block bg-white text-[#4a6741] font-semibold px-8 py-3 rounded-xl hover:bg-[#f5ede0] transition-colors"
          >
            Search Barns
          </Link>
        </div>
      </div>
    </div>
  );
}
