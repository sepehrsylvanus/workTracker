// middleware.ts
import { NextRequest, NextResponse } from "next/server";

export const config = {
  matcher: ["/", "/signin", "/signup"], // Only run for these paths
};

export default function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  const { pathname } = req.nextUrl;

  // If user is logged in, prevent access to /signin and /signup
  if (token && (pathname === "/login" || pathname === "/register")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  // If user is not logged in, prevent access to /
  if (!token && pathname === "/") {
    return NextResponse.redirect(new URL("/login", req.url));
  }

  // Allow everything else
  return NextResponse.next();
}
