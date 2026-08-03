import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import { getToken } from "next-auth/jwt";

const protectedRoutes = [
  "/dashboard",
  "/community",
  "/schemes",
  "/weather",
  "/marketplace",
  "/equipment",
  "/profile",
  "/mandi",
  "/disease-scan",
  "/soil-health",
];

export async function middleware(request: NextRequest) {
  const token = await getToken({
    req: request,
    secret: process.env.AUTH_SECRET,
  });

  const { pathname } = request.nextUrl;
  const isProtected = protectedRoutes.some((route) => pathname.startsWith(route));
  const isAuthRoute = pathname.startsWith("/login") || pathname.startsWith("/register");

  // If accessing the root landing page (/)
  if (pathname === "/") {
    if (token) {
      return NextResponse.redirect(new URL("/dashboard", request.url));
    }
    // Allow unauthenticated users to see the landing page
    return NextResponse.next();
  }

  // If trying to access a protected route without a valid session token
  if (isProtected && !token) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // If logged in and trying to access login/register pages
  if (isAuthRoute && token) {
    return NextResponse.redirect(new URL("/dashboard", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)"],
};
