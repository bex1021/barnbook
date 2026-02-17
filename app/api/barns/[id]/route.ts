import { NextRequest, NextResponse } from "next/server";
import { getBarnById, updateBarn, deleteBarn } from "@/lib/data";
import { auth } from "@/lib/auth";

type RouteContext = { params: Promise<{ id: string }> };

export async function GET(_request: NextRequest, { params }: RouteContext) {
  const { id } = await params;
  const barn = getBarnById(id);
  if (!barn) {
    return NextResponse.json({ error: "Barn not found" }, { status: 404 });
  }
  return NextResponse.json(barn);
}

export async function PUT(request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const barn = getBarnById(id);
  if (!barn) {
    return NextResponse.json({ error: "Barn not found" }, { status: 404 });
  }
  if (barn.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  const body = await request.json();
  const updated = updateBarn(id, body);
  return NextResponse.json(updated);
}

export async function DELETE(_request: NextRequest, { params }: RouteContext) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const { id } = await params;
  const barn = getBarnById(id);
  if (!barn) {
    return NextResponse.json({ error: "Barn not found" }, { status: 404 });
  }
  if (barn.ownerId !== session.user.id) {
    return NextResponse.json({ error: "Forbidden" }, { status: 403 });
  }

  deleteBarn(id);
  return NextResponse.json({ success: true });
}
