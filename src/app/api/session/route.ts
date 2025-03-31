import { NextResponse } from 'next/server'
import { serialize } from 'cookie'
import { encrypt } from '../../../lib/session'


export async function POST(req: Request) {
  try {
    const sessionData = await req.json()

    const encrypted = encrypt(sessionData)

    const cookie = serialize('session', encrypted, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: 60 * 60 * 24 * 7, // 1 week
      path: '/',
    })

    const response = NextResponse.json({ message: 'Session cookie set' })
    response.headers.set('Set-Cookie', cookie)

    return response
  } catch (err) {
    console.error('Failed to create session cookie:', err)
    return NextResponse.json({ error: 'Failed to set session' }, { status: 500 })
  }
}