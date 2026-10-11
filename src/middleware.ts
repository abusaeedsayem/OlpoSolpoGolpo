import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const path = request.nextUrl.pathname;

  // Protect admin and moderator routes
  if (path.startsWith('/admin') || path.startsWith('/moderator')) {
    // Redirect to home if no session cookie found
    const cookies = request.headers.get('cookie') || '';
    const hasSession = cookies.includes('next-auth.session-token');

    if (!hasSession) {
      const url = request.nextUrl.clone();
      url.pathname = '/login';
      return NextResponse.redirect(url);
    }
  }

  return NextResponse.next();
}