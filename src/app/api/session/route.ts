import { NextResponse } from 'next/server';
import { serialize } from 'cookie';
import { encrypt } from '../../../lib/session';

export async function POST(req: Request) {
  try {
    const sessionData = await req.json();
    const encrypted = encrypt(sessionData);

    // httpOnly session cookie (for tokens, secure)
    const sessionCookie = serialize('session', encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1800, // half hour
      path: '/',
    });

    // plain user_info cookie (for client-side hydration)
    const user = sessionData.user;
    const userInfoCookie = serialize('user_info', JSON.stringify(user), {
      httpOnly: false, // client can read this
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 1800, // half hour
      path: '/',
    });

    const response = NextResponse.json({ message: 'Session cookie set' });
    response.headers.append('Set-Cookie', sessionCookie);
    response.headers.append('Set-Cookie', userInfoCookie);

    return response;
  } catch (err) {
    console.error('Failed to create session cookie:', err);
    return NextResponse.json(
      { error: 'Failed to set session' },
      { status: 500 }
    );
  }
}
