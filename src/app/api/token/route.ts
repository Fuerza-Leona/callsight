import { cookies } from 'next/headers'
import { decrypt } from '@/lib/session'
import { NextResponse } from 'next/server'

export async function GET() {
  try {
    const cookieStore = await cookies()
    const sessionCookie = cookieStore.get('session')

    if (!sessionCookie) {
      return NextResponse.json({ error: 'No session cookie found' }, { status: 401 })
    }

    const decrypted = decrypt(sessionCookie.value)

    if (!decrypted.access_token) {
      return NextResponse.json({ error: 'No access token in session' }, { status: 400 })
    }

    return NextResponse.json({ access_token: decrypted.access_token })
  } catch (error) {
    console.error('Error decrypting session cookie:', error)
    return NextResponse.json({ error: 'Failed to decrypt session' }, { status: 500 })
  }
}