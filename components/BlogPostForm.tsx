"use client";

import { useState, useCallback, useRef } from "react";
import { useRouter } from "next/navigation";
import dynamic from "next/dynamic";
import Image from "next/image";
import type { BlogPost } from "@/lib/blog-types";
import slugify from "slugify";

const BlogEditor = dynamic(() => import("./BlogEditor"), { ssr: false });

interface UnsplashPhoto {
  id: string;
  url: string;
  thumb: string;
  alt: string;
  credit: string;
}

interface BlogPostFormProps {
  post?: BlogPost;
}

function generateSlug(title: string) {
  return slugify(title, { lower: true, strict: true, trim: true });
}

export default function BlogPostForm({ post }: BlogPostFormProps) {
  const router = useRouter();
  const [title, setTitle] = useState(post?.title ?? "");
  const [slug, setSlug] = useState(post?.slug ?? "");
  const [excerpt, setExcerpt] = useState(post?.excerpt ?? "");
  const [content, setContent] = useState(post?.content ?? "");
  const [featuredImageUrl, setFeaturedImageUrl] = useState(
    post?.featured_image_url ?? ""
  );
  const [featuredImageAlt, setFeaturedImageAlt] = useState(
    post?.featured_image_alt ?? ""
  );
  const [metaTitle, setMetaTitle] = useState(post?.meta_title ?? "");
  const [metaDescription, setMetaDescription] = useState(
    post?.meta_description ?? ""
  );
  const [authorName, setAuthorName] = useState(
    post?.author_name ?? "Barnbook Team"
  );
  const [status, setStatus] = useState<"draft" | "published">(
    post?.status ?? "draft"
  );

  const [saving, setSaving] = useState(false);
  const [deleting, setDeleting] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadingImages, setLoadingImages] = useState(false);
  const [unsplashPhotos, setUnsplashPhotos] = useState<UnsplashPhoto[]>([]);
  const [showUnsplash, setShowUnsplash] = useState(false);
  const [error, setError] = useState("");

  const slugEdited = useRef(!!post); // don't auto-generate slug when editing

  function handleTitleChange(val: string) {
    setTitle(val);
    if (!slugEdited.current) {
      setSlug(generateSlug(val));
    }
  }

  // AI draft generation (streaming)
  const handleGenerate = useCallback(async () => {
    if (!title.trim()) {
      setError("Enter a title first to generate a draft.");
      return;
    }
    setGenerating(true);
    setError("");
    try {
      const res = await fetch("/api/blog/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ title }),
      });
      if (!res.ok || !res.body) throw new Error("Generation failed");
      const reader = res.body.getReader();
      const decoder = new TextDecoder();
      let html = "";
      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        html += decoder.decode(value, { stream: true });
        setContent(html);
      }
    } catch {
      setError("AI generation failed. Check your ANTHROPIC_API_KEY.");
    } finally {
      setGenerating(false);
    }
  }, [title]);

  // Unsplash image search
  const handleFetchImages = useCallback(async () => {
    const query = title.trim() || "horses equestrian";
    setLoadingImages(true);
    setShowUnsplash(true);
    try {
      const res = await fetch(
        `/api/blog/unsplash?q=${encodeURIComponent(query)}`
      );
      if (!res.ok) throw new Error("Unsplash error");
      const photos: UnsplashPhoto[] = await res.json();
      setUnsplashPhotos(photos);
    } catch {
      setError("Could not fetch Unsplash images. Check UNSPLASH_ACCESS_KEY.");
    } finally {
      setLoadingImages(false);
    }
  }, [title]);

  const handleSelectPhoto = useCallback((photo: UnsplashPhoto) => {
    setFeaturedImageUrl(photo.url);
    setFeaturedImageAlt(photo.alt);
    setShowUnsplash(false);
  }, []);

  async function handleSave(publishNow?: boolean) {
    setSaving(true);
    setError("");
    try {
      const body = {
        title,
        slug,
        excerpt: excerpt || null,
        content,
        featured_image_url: featuredImageUrl || null,
        featured_image_alt: featuredImageAlt || null,
        meta_title: metaTitle || null,
        meta_description: metaDescription || null,
        author_name: authorName,
        status: publishNow ? "published" : status,
        published_at: publishNow
          ? new Date().toISOString()
          : status === "published"
          ? post?.published_at ?? new Date().toISOString()
          : null,
      };

      if (post) {
        const res = await fetch(`/api/blog/posts/${post.id}`, {
          method: "PATCH",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
      } else {
        const res = await fetch("/api/blog/posts", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) throw new Error(await res.text());
      }

      router.push("/admin/blog");
      router.refresh();
    } catch (err) {
      setError(String(err));
    } finally {
      setSaving(false);
    }
  }

  async function handleDelete() {
    if (!post) return;
    if (!confirm("Delete this post permanently?")) return;
    setDeleting(true);
    try {
      await fetch(`/api/blog/posts/${post.id}`, { method: "DELETE" });
      router.push("/admin/blog");
      router.refresh();
    } catch {
      setError("Delete failed.");
    } finally {
      setDeleting(false);
    }
  }

  const field =
    "block w-full px-4 py-2.5 rounded-lg border border-[#e8dcc8] bg-white text-[#2c1810] placeholder-[#b8a898] focus:outline-none focus:ring-2 focus:ring-[#4a6741] text-sm";
  const label = "block text-xs font-semibold uppercase tracking-wide text-[#6b5c4e] mb-1.5";

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      <div className="flex items-center justify-between mb-8">
        <div>
          <button
            onClick={() => router.push("/admin/blog")}
            className="text-sm text-[#4a6741] hover:underline mb-2 block"
          >
            ← Blog Posts
          </button>
          <h1
            className="text-3xl font-bold text-[#2c1810]"
            style={{ fontFamily: "var(--font-playfair)" }}
          >
            {post ? "Edit Post" : "New Post"}
          </h1>
        </div>
        <div className="flex items-center gap-3">
          {post && (
            <button
              onClick={handleDelete}
              disabled={deleting}
              className="px-4 py-2 text-sm text-red-600 border border-red-200 rounded-lg hover:bg-red-50 transition-colors disabled:opacity-50"
            >
              {deleting ? "Deleting…" : "Delete"}
            </button>
          )}
          <button
            onClick={() => handleSave()}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold border border-[#4a6741] text-[#4a6741] rounded-xl hover:bg-[#f5ede0] transition-colors disabled:opacity-50"
          >
            {saving ? "Saving…" : "Save Draft"}
          </button>
          <button
            onClick={() => handleSave(true)}
            disabled={saving}
            className="px-5 py-2.5 text-sm font-semibold bg-[#4a6741] text-white rounded-xl hover:bg-[#3a5535] transition-colors disabled:opacity-50"
          >
            {status === "published" ? "Update" : "Publish"}
          </button>
        </div>
      </div>

      {error && (
        <div className="mb-6 px-4 py-3 bg-red-50 border border-red-200 text-red-700 text-sm rounded-lg">
          {error}
        </div>
      )}

      <div className="grid lg:grid-cols-[1fr_320px] gap-6">
        {/* Main */}
        <div className="space-y-6">
          {/* Title */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-6 shadow-sm">
            <label className={label}>Title</label>
            <input
              type="text"
              value={title}
              onChange={(e) => handleTitleChange(e.target.value)}
              placeholder="Best Horse Boarding Barns in Austin, TX"
              className={`${field} text-lg`}
            />
            <div className="mt-3 flex items-center gap-2">
              <label className="text-xs text-[#9b8575]">Slug:</label>
              <input
                type="text"
                value={slug}
                onChange={(e) => {
                  slugEdited.current = true;
                  setSlug(e.target.value);
                }}
                className="flex-1 px-3 py-1.5 rounded-lg border border-[#e8dcc8] text-xs text-[#6b5c4e] focus:outline-none focus:ring-1 focus:ring-[#4a6741]"
              />
            </div>
          </div>

          {/* Content */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-6 shadow-sm">
            <div className="flex items-center justify-between mb-3">
              <label className={label}>Content</label>
              <button
                type="button"
                onClick={handleGenerate}
                disabled={generating}
                className="flex items-center gap-2 px-4 py-2 text-xs font-semibold bg-[#2c1810] text-white rounded-lg hover:bg-[#4a3020] transition-colors disabled:opacity-60"
              >
                {generating ? (
                  <>
                    <span className="animate-spin inline-block w-3 h-3 border-2 border-white border-t-transparent rounded-full" />
                    Generating…
                  </>
                ) : (
                  <>✨ Generate AI Draft</>
                )}
              </button>
            </div>
            <BlogEditor content={content} onChange={setContent} />
          </div>

          {/* Excerpt */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-6 shadow-sm">
            <label className={label}>Excerpt</label>
            <textarea
              value={excerpt}
              onChange={(e) => setExcerpt(e.target.value)}
              rows={3}
              placeholder="A short description shown in blog listings…"
              className={field}
            />
          </div>
        </div>

        {/* Sidebar */}
        <div className="space-y-5">
          {/* Status */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-5 shadow-sm">
            <label className={label}>Status</label>
            <select
              value={status}
              onChange={(e) =>
                setStatus(e.target.value as "draft" | "published")
              }
              className={field}
            >
              <option value="draft">Draft</option>
              <option value="published">Published</option>
            </select>
          </div>

          {/* Featured image */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-5 shadow-sm">
            <label className={label}>Featured Image</label>

            {featuredImageUrl && (
              <div className="relative aspect-video rounded-lg overflow-hidden mb-3 border border-[#e8dcc8]">
                <Image
                  src={featuredImageUrl}
                  alt={featuredImageAlt || "Featured image"}
                  fill
                  className="object-cover"
                  sizes="320px"
                />
              </div>
            )}

            <button
              type="button"
              onClick={handleFetchImages}
              disabled={loadingImages}
              className="w-full py-2 text-sm font-medium border border-[#4a6741] text-[#4a6741] rounded-lg hover:bg-[#f5ede0] transition-colors disabled:opacity-50 mb-3"
            >
              {loadingImages ? "Searching…" : "🖼 Fetch from Unsplash"}
            </button>

            {showUnsplash && unsplashPhotos.length > 0 && (
              <div className="grid grid-cols-2 gap-2 mb-3">
                {unsplashPhotos.map((p) => (
                  <button
                    key={p.id}
                    type="button"
                    onClick={() => handleSelectPhoto(p)}
                    className="relative aspect-video rounded-lg overflow-hidden border-2 border-transparent hover:border-[#4a6741] transition-colors"
                  >
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={p.thumb}
                      alt={p.alt}
                      className="w-full h-full object-cover"
                    />
                  </button>
                ))}
              </div>
            )}

            <input
              type="url"
              value={featuredImageUrl}
              onChange={(e) => setFeaturedImageUrl(e.target.value)}
              placeholder="Or paste image URL"
              className={field}
            />
            <input
              type="text"
              value={featuredImageAlt}
              onChange={(e) => setFeaturedImageAlt(e.target.value)}
              placeholder="Alt text"
              className={`${field} mt-2`}
            />
          </div>

          {/* Author */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-5 shadow-sm">
            <label className={label}>Author</label>
            <input
              type="text"
              value={authorName}
              onChange={(e) => setAuthorName(e.target.value)}
              className={field}
            />
          </div>

          {/* SEO */}
          <div className="bg-white rounded-2xl border border-[#e8dcc8] p-5 shadow-sm">
            <p className="text-xs font-bold uppercase tracking-wide text-[#4a6741] mb-4">
              SEO
            </p>
            <label className={label}>Meta Title</label>
            <input
              type="text"
              value={metaTitle}
              onChange={(e) => setMetaTitle(e.target.value)}
              placeholder="Defaults to post title"
              className={`${field} mb-3`}
            />
            <div className="text-xs text-right text-[#9b8575] -mt-2 mb-3">
              {metaTitle.length}/60
            </div>
            <label className={label}>Meta Description</label>
            <textarea
              value={metaDescription}
              onChange={(e) => setMetaDescription(e.target.value)}
              rows={3}
              placeholder="Shown in Google search results…"
              className={field}
            />
            <div className="text-xs text-right text-[#9b8575] mt-1">
              {metaDescription.length}/160
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
