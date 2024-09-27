// middleware.js
import { NextResponse } from "next/server";
import Cookies from "js-cookie";

export function middleware(req) {
  const token = req.cookies.get("token"); // Check for token in cookies
  const publicPaths = ["/login", "/signup"]; // Define public paths

  // If the user is not authenticated and is trying to access a protected route
  if (!token && !publicPaths.includes(req.nextUrl.pathname)) {
    // Redirect to the login page
    return NextResponse.redirect(new URL("/login", req.url));
  }

  return NextResponse.next(); // Allow the request to proceed
}

// Define which paths the middleware should apply to
export const config = {
  matcher: ["/dashboard/home", "/dashboard/products/list", "/"], // Adjust to match your routes
};
