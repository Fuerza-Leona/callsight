import { NextRequest, NextResponse } from 'next/server';
import { serialize } from 'cookie';

export async function GET(request: NextRequest) {
  const url = request.nextUrl.clone();
  url.pathname = '/login';
  const response = NextResponse.redirect(url);

  // Clear the plain user_info cookie
  response.headers.append(
    'Set-Cookie',
    serialize('user_info', '', {
      path: '/',
      maxAge: 0,
    })
  );

  // Clear the encrypted session cookie
  response.headers.append(
    'Set-Cookie',
    serialize('session', '', {
      path: '/',
      maxAge: 0,
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
    })
  );

  return response;
}
