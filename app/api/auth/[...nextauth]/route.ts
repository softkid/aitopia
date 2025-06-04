import NextAuth from 'next-auth'
import GoogleProvider from 'next-auth/providers/google'
import type { NextAuthOptions } from 'next-auth'

const authOptions: NextAuthOptions = {
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID || 'demo_client_id',
      clientSecret: process.env.GOOGLE_CLIENT_SECRET || 'demo_client_secret',
    })
  ],
  callbacks: {
    async jwt({ token, account, user }) {
      if (account) {
        token.accessToken = account.access_token
        token.user = user
      }
      return token
    },
    async session({ session, token }) {
      if (token.accessToken) {
        session.accessToken = token.accessToken as string
      }
      if (token.user) {
        session.user = token.user as any
      }
      return session
    },
    async signIn({ user, account, profile }) {
      if (process.env.NODE_ENV === 'development') {
        return true
      }
      return true
    },
  },
  pages: {
    signIn: '/auth/signin',
    error: '/auth/error',
  },
  secret: process.env.NEXTAUTH_SECRET || 'fallback-secret-for-development-only-must-be-32-chars',
  debug: process.env.NODE_ENV === 'development',
  logger: {
    error(code, metadata) {
      console.log('NextAuth 에러 (무시됨):', code)
    },
    warn(code) {
      console.log('NextAuth 경고 (무시됨):', code)
    },
    debug(code, metadata) {
    }
  }
}

const handler = NextAuth(authOptions)

export { handler as GET, handler as POST } 