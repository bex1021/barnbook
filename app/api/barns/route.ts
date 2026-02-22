import { NextRequest, NextResponse } from "next/server";
import { getBarns, createBarn } from "@/lib/data";
import { auth } from "@/lib/auth";
import { Barn } from "@/lib/types";

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const q = searchParams.get("q")?.toLowerCase();
  const discipline = searchParams.get("discipline");
  const state = searchParams.get("state");
  const amenities = searchParams.get("amenities");
  const boarding = searchParams.get("boarding");
  const sort = searchParams.get("sort");

  let barns = await getBarns();

  if (q) {
    barns = barns.filter(
      (b) =>
        b.name.toLowerCase().includes(q) ||
        b.address.city.toLowerCase().includes(q) ||
        b.address.state.toLowerCase().includes(q) ||
        b.description.toLowerCase().includes(q) ||
        b.disciplines.some((d) => d.toLowerCase().includes(q))
    );
  }

  if (discipline) {
    const disciplines = discipline.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      disciplines.some((d) => b.disciplines.includes(d))
    );
  }

  if (state) {
    barns = barns.filter(
      (b) => b.address.state.toLowerCase() === state.toLowerCase()
    );
  }

  if (amenities) {
    const amenityList = amenities.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      amenityList.every((a) => b.amenities[a as keyof typeof b.amenities])
    );
  }

  if (boarding) {
    const boardingTypes = boarding.split(",").filter(Boolean);
    barns = barns.filter((b) =>
      boardingTypes.some((bt) => b.boarding.types.includes(bt))
    );
  }

  if (sort) {
    const sortFns: Record<string, (a: Barn, b: Barn) => number> = {
      name: (a, b) => a.name.localeCompare(b.name),
      "price-low": (a, b) => a.pricing.boardingFrom - b.pricing.boardingFrom,
      "price-high": (a, b) => b.pricing.boardingFrom - a.pricing.boardingFrom,
      newest: (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    };
    const fn = sortFns[sort];
    if (fn) barns.sort(fn);
  }

  return NextResponse.json(barns);
}

export async function POST(request: NextRequest) {
  const session = await auth();
  if (!session?.user?.id) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  const body = await request.json();
  const slug = body.name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");

  const barn = await createBarn({
    ownerId: session.user.id,
    slug,
    ...body,
  });

  return NextResponse.json(barn, { status: 201 });
}
