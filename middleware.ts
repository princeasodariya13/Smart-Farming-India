import NextAuth from "next-auth";
import authConfig from "./src/auth.config";
import { NextResponse } from "next/server";

const { auth } = NextAuth(authConfig);

const protectedRoutes = ["/dashboard", "/community", "/schemes", "/weather", "/marketplace", "/equipment", "/profile", "/mandi", "/disease-scan", "/soil-health"];

export default auth((request) => {
  const session = request.auth;
  const { pathname } = request.nextUrl;

  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");
  
  // If accessing the root landing page (/)
  if (pathname === "/") {
    if (session) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Allow unauthenticated users to see the landing page
    return NextResponse.next();
  }

  // If trying to access a protected route without a session
  if (isProtected && !session) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access login/register pages
  if (isAuthRoute && session) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
});

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
