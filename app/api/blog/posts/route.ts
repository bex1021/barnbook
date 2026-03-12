import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createPost, getAllPosts } from "@/lib/blog";
import { isAdmin } from "@/lib/is-admin";

export async function GET() {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const posts = await getAllPosts();
  return NextResponse.json(posts);
}

export async function POST(req: NextRequest) {
  const session = await auth();
  if (!isAdmin(session?.user?.email)) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }
  const body = await req.json();
  const post = await createPost(body);
  return NextResponse.json(post, { status: 201 });
}
