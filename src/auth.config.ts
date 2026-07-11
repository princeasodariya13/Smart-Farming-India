import type { NextAuthConfig } from "next-auth"
import Google from "next-auth/providers/google"
import Facebook from "next-auth/providers/facebook"
import Credentials from "next-auth/providers/credentials"
import bcrypt from "bcryptjs"

export default {
  providers: [
    Google({
      allowDangerousEmailAccountLinking: true,
    }),
    Facebook({
      allowDangerousEmailAccountLinking: true,
    }),
    Credentials({
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
        rememberMe: { label: "Remember", type: "text" }
      },
      async authorize(credentials) {
        // We will pass the user directly from auth.ts, because authorize runs in Node
        // But NextAuth expects the config here. We'll define the shape.
        return null // Will be overridden in auth.ts
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account, profile }) {
      if (user) {
        if ((user as any).rememberMe === false) {
          token.strictExpiry = Math.floor(Date.now() / 1000) + (24 * 60 * 60)
        }
      }
      // Ensure Google profile picture makes it into the token
      if (profile && profile.picture) {
        token.picture = profile.picture as string;
      }
      return token
    },
    async session({ session, token }) {
      if (token.strictExpiry && Math.floor(Date.now() / 1000) > (token.strictExpiry as number)) {
        session.expires = new Date(0).toISOString() as any
      }
      // Explicitly map token picture to session user image
      if (session.user && token.picture) {
        session.user.image = token.picture as string;
      }
      return session
    }
  },
  session: {
    strategy: "jwt",
    maxAge: 30 * 24 * 60 * 60,
  },
  pages: {
    signIn: '/login',
  }
} satisfies NextAuthConfig
