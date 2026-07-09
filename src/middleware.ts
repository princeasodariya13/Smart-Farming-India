import NextAuth from "next-auth"
import authConfig from "./auth.config"

const { auth } = NextAuth(authConfig)

export default auth((req) => {
  const isLoggedIn = !!req.auth
  const { pathname } = req.nextUrl

  // Define route types
  const isAuthRoute = 
    pathname === '/login' || 
    pathname === '/signup' || 
    pathname === '/forgot-password' || 
    pathname === '/reset-password'
    
  const isDashboardRoute = pathname.startsWith('/dashboard')
  
  // If the user is logged in and tries to access login/signup pages, redirect to dashboard
  if (isAuthRoute && isLoggedIn) {
    return Response.redirect(new URL('/dashboard', req.nextUrl))
  }

  // If the user is NOT logged in and tries to access the dashboard, redirect to login
  if (isDashboardRoute && !isLoggedIn) {
    return Response.redirect(new URL('/login', req.nextUrl))
  }
})

// Specify which routes middleware should run on
export const config = {
  matcher: ['/((?!api|_next/static|_next/image|favicon.ico).*)'],
}
