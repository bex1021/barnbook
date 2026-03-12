import { NextRequest, NextResponse } from "next/server";
import { getBarnById, updateBarn, deleteBarn } from "@/lib/data";
import { auth } from "@/lib/auth";
import { isAdmin } from "@/lib/is-admin";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const barn = await getBarnById(id);
  if (!barn) {
    return NextResponse.json({ error: "Barn not found" }, { status: 404 });
  }
  // Don't expose pending/rejected barns to the public
  if (barn.status !== "active") {
    const session = await auth();
    const canView =
      isAdmin(session?.user?.email) ||
      (session?.user?.id && barn.ownerId === session.user.id);
    if (!canView) {
      return NextResponse.json({ error: "Barn not found" }, { status: 404 });
    }
  }
  return NextResponse.json(barn);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const barn = await getBarnById(id);
  if (!barn) {
    return NextResponse.json({ error: "Barn not found" }, { status: 404 });
  }
  if (barn.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updated = await updateBarn(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const barn = await getBarnById(id);
  if (!barn) {
    return NextResponse.json({ error: "Barn not found" }, { status: 404 });
  }
  if (barn.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  await deleteBarn(id);
  return NextResponse.json({ success: true });
}
