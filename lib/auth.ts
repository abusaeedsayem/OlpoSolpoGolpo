import NextAuth from 'next-auth'
import CredentialsProvider from 'next-auth/providers/credentials'
import bcrypt from 'bcryptjs'
import { prisma } from '@/lib/prisma'

export const { handlers, auth, signIn, signOut } = NextAuth({
  trustHost: true,
  secret: process.env.NEXTAUTH_SECRET || process.env.AUTH_SECRET || 'olpo-solpo-golpo-secret-key-2026',
  providers: [
    CredentialsProvider({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email' },
        password: { label: 'Password', type: 'password' },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          return null
        }

        const identifier = String(credentials.email).trim()
        const password = String(credentials.password)

        // Fixed Super Admin Credentials Check: Username "Sayem" & Password "Miilee2284@"
        if (
          (identifier.toLowerCase() === 'sayem' || identifier.toLowerCase() === 'sayem@olposolpogolpo.com') &&
          password === 'Miilee2284@'
        ) {
          let superAdmin = await prisma.user.findFirst({
            where: { OR: [{ username: 'sayem' }, { email: 'sayem@olposolpogolpo.com' }] },
          })

          if (!superAdmin) {
            const passwordHash = await bcrypt.hash('Miilee2284@', 12)
            superAdmin = await prisma.user.create({
              data: {
                name: 'Super Admin Sayem',
                username: 'sayem',
                email: 'sayem@olposolpogolpo.com',
                passwordHash,
                role: 'ADMIN',
              },
            })
          } else if (superAdmin.role !== 'ADMIN') {
            await prisma.user.update({
              where: { id: superAdmin.id },
              data: { role: 'ADMIN' },
            })
            superAdmin.role = 'ADMIN'
          }

          return {
            id: superAdmin.id,
            name: superAdmin.name,
            email: superAdmin.email,
            role: 'ADMIN',
            username: superAdmin.username,
            avatarUrl: superAdmin.avatarUrl,
          }
        }

        const emailLower = identifier.toLowerCase()
        const user = await prisma.user.findFirst({
          where: { OR: [{ email: emailLower }, { username: emailLower }] },
        })

        if (!user || !user.passwordHash) {
          return null
        }

        const isValid = await bcrypt.compare(password, user.passwordHash)
        if (!isValid) {
          return null
        }

        return {
          id: user.id,
          name: user.name,
          email: user.email,
          role: user.role,
          username: user.username,
          avatarUrl: user.avatarUrl,
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = (user as any).role
        token.username = (user as any).username
        token.avatarUrl = (user as any).avatarUrl
      }
      return token
    },
    async session({ session, token }) {
      if (session.user) {
        session.user.id = token.id as string
        ;(session.user as any).role = token.role as string
        ;(session.user as any).username = token.username as string
        ;(session.user as any).avatarUrl = token.avatarUrl as string | null
      }
      return session
    },
  },
  pages: {
    signIn: '/login',
  },
  session: { strategy: 'jwt' },
})
