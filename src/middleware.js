// middleware.js
import { NextResponse } from 'next/server';

export async function middleware(request) {
  const { pathname } = request.nextUrl;
  console.log(`Middleware checking: ${pathname}`);

  // 1. Get token from cookies
  const token = request.cookies.get('token')?.value;
  const isAuthenticated = !!token;
  console.log('Authentication status:', isAuthenticated);

  // 2. Get user role from cookie (alternative to JWT decode)
  const userRole = request.cookies.get('userRole')?.value;
  console.log('User role:', userRole);

  // 3. Admin route protection
  if (pathname.startsWith('/admin')) {
    console.log('Admin route access attempt');
    if (!isAuthenticated || !['admin', 'super admin'].includes(userRole)) {
      console.log('Admin access denied - redirecting to login');
      const loginUrl = new URL('/auth/session', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  // 4. Vendor route protection
  if (pathname.startsWith('/vendor')) {
    console.log('Vendor route access attempt');
    if (!isAuthenticated || userRole !== 'vendor') {
      console.log('Vendor access denied - redirecting to login');
      const loginUrl = new URL('/auth/session', request.url);
      loginUrl.searchParams.set('redirect', pathname);
      return NextResponse.redirect(loginUrl);
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/admin/:path*',
    '/vendor/:path*'
  ]
};