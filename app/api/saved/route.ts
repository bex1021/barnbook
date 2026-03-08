import { NextRequest, NextResponse } from "next/server";
import { auth } from "@/lib/auth";
import { supabase } from "@/lib/supabase";

export async function GET() {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { data } = await supabase
    .from("saved_barns")
    .select("barn_id")
    .eq("user_id", session.user.id);

  return NextResponse.json((data || []).map((r: Record<string, unknown>) => r.barn_id));
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { barnId } = await request.json();
  if (!barnId) return NextResponse.json({ error: "Missing barnId" }, { status: 400 });

  await supabase.from("saved_barns").upsert(
    { user_id: session.user.id, barn_id: barnId },
    { onConflict: "user_id,barn_id" }
  );

  return NextResponse.json({ success: true });
}

export async function DELETE(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const barnId = new URL(request.url).searchParams.get("barnId");
  if (!barnId) return NextResponse.json({ error: "Missing barnId" }, { status: 400 });

  await supabase
    .from("saved_barns")
    .delete()
    .eq("user_id", session.user.id)
    .eq("barn_id", barnId);

  return NextResponse.json({ success: true });
}
