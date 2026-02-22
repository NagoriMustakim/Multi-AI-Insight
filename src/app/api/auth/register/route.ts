import { NextRequest, NextResponse } from 'next/server'
import { hashPassword, signToken, validateEmail, validatePassword } from '@/lib/auth'
import { getUserByEmail, createUser } from '@/lib/supabase'

export async function POST(req: NextRequest) {
    try {
        const body = await req.json()
        const { email, password, fullName } = body

        // Validate email
        if (!email || !validateEmail(email)) {
            return NextResponse.json(
                { success: false, error: 'Invalid email address', code: 'INVALID_EMAIL' },
                { status: 400 }
            )
        }

        // Validate password
        const passwordCheck = validatePassword(password || '')
        if (!passwordCheck.valid) {
            return NextResponse.json(
                { success: false, error: passwordCheck.message, code: 'WEAK_PASSWORD' },
                { status: 400 }
            )
        }

        // Check if email already exists
        const existingUser = await getUserByEmail(email)
        if (existingUser) {
            return NextResponse.json(
                { success: false, error: 'An account with this email already exists', code: 'EMAIL_TAKEN' },
                { status: 409 }
            )
        }

        // Hash password and create user
        const passwordHash = await hashPassword(password)
        const user = await createUser(email, passwordHash, fullName)

        // Sign JWT
        const token = await signToken({ userId: user.id, email: user.email })

        return NextResponse.json(
            {
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
            },
            { status: 201 }
        )
    } catch (error) {
        console.error('Registration error:', error)
        return NextResponse.json(
            { success: false, error: 'Registration failed. Please try again.', code: 'SERVER_ERROR' },
            { status: 500 }
        )
    }
}
