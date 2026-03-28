// app/api/auth/logout/route.ts
import { NextResponse } from "next/server";
import { cookies } from "next/headers";

export async function DELETE() {
  const cookieStore = await cookies();
  cookieStore.delete("auth-token");
  cookieStore.delete("user");

  return NextResponse.json({ success: true });
}
