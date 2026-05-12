import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { auth } from "@/lib/auth";

const AUTH_ROUTES = ["/sign-in", "/sign-up", "/verify-email"];
const PROTECTED_ROUTES = ["/dashboard", "/orders", "/checkout"];

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  const session = await auth.api.getSession({
    headers: request.headers,
  });

  const isLoggedIn = !!session?.user;

  // Logged in users shouldn't see sign-in/sign-up pages
  if (isLoggedIn && AUTH_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  // Logged out users can't access protected pages
  if (!isLoggedIn && PROTECTED_ROUTES.some((r) => pathname.startsWith(r))) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/auth).*)"],
};