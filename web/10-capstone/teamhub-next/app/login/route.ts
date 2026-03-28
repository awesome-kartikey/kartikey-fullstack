import { NextResponse } from 'next/server'
import { SESSION_COOKIE_NAME, validateCredentials } from '@/lib/auth'

export async function POST(request: Request) {
    const body = await request.json()
    const username = String(body.username ?? '')
    const password = String(body.password ?? '')

    const match = validateCredentials(username, password)

    if (!match) {
        return NextResponse.json(
            { error: 'Invalid credentials' },
            { status: 401 }
        )
    }

    const response = NextResponse.json({ ok: true })

    response.cookies.set(SESSION_COOKIE_NAME, match.userId, {
        httpOnly: true,
        path: '/',
        sameSite: 'strict',
    })

    return response
}
