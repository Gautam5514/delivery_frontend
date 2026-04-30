import { cookies } from "next/headers";
import { NextResponse } from "next/server";

const COOKIE_NAME = "gopo_sa_session";
const MAX_AGE = 7 * 24 * 60 * 60;

export async function POST(request) {
  try {
    let body;
    try {
      body = await request.json();
    } catch {
      return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
    }

    const token = body?.token;

    if (!token || typeof token !== "string" || token.trim().length === 0) {
      return NextResponse.json({ error: "A valid token is required" }, { status: 400 });
    }

    if (token.length > 2048 || !token.includes(".")) {
      return NextResponse.json({ error: "Invalid token format" }, { status: 400 });
    }

    const cookieStore = await cookies();
    cookieStore.set(COOKIE_NAME, token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "lax",
      maxAge: MAX_AGE,
      path: "/",
    });

    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to set superadmin session" }, { status: 500 });
  }
}

export async function DELETE() {
  try {
    const cookieStore = await cookies();
    cookieStore.delete(COOKIE_NAME);
    return NextResponse.json({ success: true });
  } catch {
    return NextResponse.json({ error: "Failed to clear superadmin session" }, { status: 500 });
  }
}
