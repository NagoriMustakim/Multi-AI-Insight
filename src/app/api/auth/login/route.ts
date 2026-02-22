import { NextRequest, NextResponse } from 'next/server'
import { verifyPassword, signToken, validateEmail } from '@/lib/auth'
import { getUserByEmail } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password } = body

        // Basic validation
        if (!email || !validateEmail(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address', code: 'INVALID_EMAIL' },
                { status: 400 }
            )
        }

        if (!password) {
            return NextResponse.json(
                { success: false, error: 'Password is required', code: 'MISSING_PASSWORD' },
                { status: 400 }
            )
        }

        // Find user — use same error message for wrong email OR password
        const user = await getUserByEmail(email)
        if (!user) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
                { status: 401 }
            )
        }

        // Verify password
        const isValid = await verifyPassword(password, user.password_hash)
        if (!isValid) {
            return NextResponse.json(
                { success: false, error: 'Invalid email or password', code: 'INVALID_CREDENTIALS' },
                { status: 401 }
            )
        }

        // Sign JWT
        const token = await signToken({ userId: user.id, email: user.email })

        return NextResponse.json({
            success: true,
            data: {
                token,
                user: {
                    id: user.id,
                    email: user.email,
                    full_name: user.full_name,
                    created_at: user.created_at,
                },
            },
        })
    } catch (error) {
        console.error('Login error:', error)
        return NextResponse.json(
            { success: false, error: 'Login failed. Please try again.', code: 'SERVER_ERROR' },
            { status: 500 }
        )
    }
}
