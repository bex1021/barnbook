import { NextRequest, NextResponse } from "next/server";
import { v4 as uuidv4 } from "uuid";
import { getReviewsByBarn, createReview } from "@/lib/data";
import { auth } from "@/lib/auth";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const barnId = searchParams.get("barnId");
  if (!barnId) {
    return NextResponse.json({ error: "barnId is required" }, { status: 400 });
  }
  const reviews = getReviewsByBarn(barnId);
  return NextResponse.json(reviews);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id || !session?.user?.name) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const { barnId, rating, text } = body;

  if (!barnId || !rating || !text) {
    return NextResponse.json({ error: "barnId, rating, and text are required" }, { status: 400 });
  }

  if (rating < 1 || rating > 5) {
    return NextResponse.json({ error: "Rating must be between 1 and 5" }, { status: 400 });
  }

  const review = createReview({
    id: uuidv4(),
    barnId,
    userId: session.user.id,
    userName: session.user.name,
    rating,
    text,
    createdAt: new Date().toISOString(),
  });

  return NextResponse.json(review, { status: 201 });
}
