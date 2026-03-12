import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/is-admin";

export async function GET(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const query = req.nextUrl.searchParams.get("q");
  if (!query) {
    return NextResponse.json({ error: "Missing query" }, { status: 400 });
  }

  const accessKey = process.env.UNSPLASH_ACCESS_KEY;
  if (!accessKey) {
    return NextResponse.json(
      { error: "Unsplash not configured" },
      { status: 500 }
    );
  }

  const url = `https://api.unsplash.com/search/photos?query=${encodeURIComponent(
    query
  )}&per_page=6&orientation=landscape`;

  const res = await fetch(url, {
    headers: { Authorization: `Client-ID ${accessKey}` },
    next: { revalidate: 3600 },
  });

  if (!res.ok) {
    return NextResponse.json({ error: "Unsplash error" }, { status: 502 });
  }

  const data = await res.json();
  const photos = (data.results as Array<{
    id: string;
    urls: { regular: string; small: string };
    alt_description: string | null;
    user: { name: string };
  }>).map((p) => ({
    id: p.id,
    url: p.urls.regular,
    thumb: p.urls.small,
    alt: p.alt_description ?? query,
    credit: p.user.name,
  }));

  return NextResponse.json(photos);
}
