import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { jwtVerify } from "jose";

const SESSION_COOKIE = "esale-session";
const secret = new TextEncoder().encode(
  process.env.AUTH_SECRET ?? "change-this-to-a-long-secret-key-32-chars"
);

const protectedRoutes = ["/dashboard", "/admin"];
const authRoutes = ["/login", "/register"];

export async function proxy(request: NextRequest) {
  const path = request.nextUrl.pathname;
  const isProtected = protectedRoutes.some((route) => path.startsWith(route));
  const isAuthRoute = authRoutes.some((route) => path.startsWith(route));

  const cookie = request.cookies.get(SESSION_COOKIE)?.value;
  let isAuthenticated = false;

  if (cookie) {
    try {
      await jwtVerify(cookie, secret, { algorithms: ["HS256"] });
      isAuthenticated = true;
    } catch {
      // expired or invalid session
    }
  }

  if (isProtected && !isAuthenticated) {
    return NextResponse.redirect(new URL("/login", request.nextUrl));
  }

  if (isAuthRoute && isAuthenticated) {
    return NextResponse.redirect(new URL("/dashboard", request.nextUrl));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|.*\\.png$).*)"],
};
