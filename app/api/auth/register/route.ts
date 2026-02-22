import { NextRequest, NextResponse } from "next/server";
import { hash } from "bcryptjs";
import { getUserByEmail, createUser } from "@/lib/data";

export async function POST(request: NextRequest) {
  const body = await request.json();
  const { name, email, password, role } = body;

  if (!name || !email || !password) {
    return NextResponse.json({ error: "Name, email, and password are required" }, { status: 400 });
  }

  if (await getUserByEmail(email)) {
    return NextResponse.json({ error: "Email already registered" }, { status: 409 });
  }

  const passwordHash = await hash(password, 12);
  const user = await createUser({
    name,
    email,
    passwordHash,
    role: role === "owner" ? "owner" : "user",
  });

  return NextResponse.json({ id: user.id, name: user.name, email: user.email, role: user.role }, { status: 201 });
}
