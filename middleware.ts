import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  // Check if the request is to a protected route
  const isProtectedRoute =
    request.nextUrl.pathname.startsWith("/dashboard") ||
    request.nextUrl.pathname.startsWith("/profile");

  // Get the token from cookies (or any other method you use to store tokens)
  const token = request.cookies.get("token");

  // Redirect to login if trying to access a protected route without a token
  if (isProtectedRoute && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  return NextResponse.next();
}

// Specify paths where the middleware should be applied
export const config = {
  matcher: ["/dashboard/:path*", "/profile/:path*"],
};
