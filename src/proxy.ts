import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

// Added 2026-05-05:

// This forwards the current pathname in a request header for route-aware layout logic.
export function proxy(request: NextRequest) {
  const requestHeaders = new Headers(request.headers);
  // Added 2026-05-05:
  // Make pathname available to downstream server-side logic if needed.
  requestHeaders.set("x-pathname", request.nextUrl.pathname);

  return NextResponse.next({
    request: {
      headers: requestHeaders,
    },
  });
}

export const config = {
  // Added 2026-05-05:
  // Run for app routes, but skip API/static/image/favicon paths.
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico).*)"],
};
