import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl

  // Protected author routes (dashboard root & management)
  // We allow /dashboard/stories/new to load so authors/writers can access writing workspace directly
  const isAuthorRoute =
    (pathname === '/dashboard' || pathname.startsWith('/dashboard/stories/') && pathname !== '/dashboard/stories/new') ||
    pathname.startsWith('/api/author')

  if (isAuthorRoute) {
    // Check for NextAuth / Auth.js session tokens
    const sessionToken =
      request.cookies.get('authjs.session-token') ||
      request.cookies.get('__Secure-authjs.session-token') ||
      request.cookies.get('next-auth.session-token') ||
      request.cookies.get('__Secure-next-auth.session-token')

    if (!sessionToken) {
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('callbackUrl', pathname)
      return NextResponse.redirect(loginUrl)
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/api/author/:path*',
  ],
}
