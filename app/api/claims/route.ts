import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { createClaim, getClaimByBarnAndUser } from "@/lib/data";

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { barnId, contactPhone, contactEmail, message } = await request.json();
  if (!barnId || !message) {
    return NextResponse.json({ error: "Missing required fields" }, { status: 400 });
  }

  // Check if already submitted
  const existing = await getClaimByBarnAndUser(barnId, session.user.id);
  if (existing) {
    return NextResponse.json({ error: "You have already submitted a claim for this barn" }, { status: 409 });
  }

  const claim = await createClaim({
    barnId,
    userId: session.user.id,
    contactPhone: contactPhone || "",
    contactEmail: contactEmail || "",
    message,
  });

  return NextResponse.json(claim, { status: 201 });
}
