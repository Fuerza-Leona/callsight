import { NextRequest, NextResponse } from 'next/server'

export function middleware(request: NextRequest) {
  const userCookie = request.cookies.get('user_info')
  const { pathname } = request.nextUrl

  // Redirect to login if not already logged in and trying to access perfil
  if (pathname === '/perfil' && !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to login if not already logged in and trying to access analisis de llamadas
  if (pathname === '/analisis' && !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to login if not already logged in and trying to access subir una llamada
  if (pathname === '/formsSubeLlamada' && !userCookie) {
    return NextResponse.redirect(new URL('/login', request.url))
  }

  // Redirect to profile if already logged in and trying to access login
  if (pathname === '/login' && userCookie) {
    return NextResponse.redirect(new URL('/perfil', request.url))
  }

  return NextResponse.next()
}

/* //limit to specific paths
export const config = {
  matcher: ['/perfil'],
} */

  