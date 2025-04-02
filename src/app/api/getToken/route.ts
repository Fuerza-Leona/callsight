import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = cookies()
    const sessionCookie = (await cookieStore).get('session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'Not authenticated' }, { status: 401 })
    }

    const sessionData = decrypt(sessionCookie.value)

    return NextResponse.json({ user: sessionData.access_token })
  } catch (error) {
    console.error('Failed to parse session cookie:', error)
    return NextResponse.json({ error: 'Invalid session' }, { status: 400 })
  }
}