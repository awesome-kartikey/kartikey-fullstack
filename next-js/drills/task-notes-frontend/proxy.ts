import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

const JWT_SECRET = new TextEncoder().encode(
  process.env.JWT_SECRET ?? "your-secret-key",
);

const protectedRoutes = ["/tasks", "/profile", "/settings"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("auth-token")?.value;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route),
  );
  const isAuthRoute = authRoutes.includes(pathname);

  let isValidToken = false;

  if (token) {
    try {
      await jwtVerify(token, JWT_SECRET);
      isValidToken = true;
    } catch {
      isValidToken = false;
    }
  }

  if (isProtectedRoute && !isValidToken) {
    const loginUrl = new URL("/login", request.url);
    loginUrl.searchParams.set("callbackUrl", pathname);
    const response = NextResponse.redirect(loginUrl);
    response.cookies.delete("auth-token");
    response.cookies.delete("user");
    return response;
  }

  if (isAuthRoute && isValidToken) {
    return NextResponse.redirect(new URL("/tasks", request.url));
  }
  const response = NextResponse.next();

  if (token && !isValidToken) {
    response.cookies.delete("auth-token");
    response.cookies.delete("user");
  }

  return response;
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
