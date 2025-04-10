import { NextRequest, NextResponse } from 'next/server';

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user_info');
  const { pathname } = request.nextUrl;

  // Define protected routes
  const protectedRoutes = [
    '/perfil',
    '/calls/dashboard',
    '/calls/upload',
    '/calls/detail',
  ];

  // If trying to access a protected route without user_info cookie, redirect to login
  if (protectedRoutes.includes(pathname) && !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url));
  }

  // If user is logged in and tries to access login, redirect to profile
  if (pathname === '/login' && userCookie) {
    return NextResponse.redirect(new URL('/perfil', request.url));
  }

  return NextResponse.next();
}

/* //limit to specific paths
export const config = {
  matcher: ['/perfil'],
} */
