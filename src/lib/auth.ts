import { SignJWT, jwtVerify } from 'jose'
import bcrypt from 'bcryptjs'
import { NextRequest, NextResponse } from 'next/server'
import { AuthTokenPayload } from '@/types'

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!)

// ========================
// PASSWORD UTILITIES
// ========================

export async function hashPassword(password: string): Promise<string> {
    return bcrypt.hash(password, 12)
}

export async function verifyPassword(
    password: string,
    hash: string
): Promise<boolean> {
    return bcrypt.compare(password, hash)
}

// ========================
// JWT UTILITIES
// ========================

export async function signToken(payload: AuthTokenPayload): Promise<string> {
    return new SignJWT(payload as unknown as Record<string, unknown>)
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('7d')
        .sign(JWT_SECRET)
}

export async function verifyToken(token: string): Promise<AuthTokenPayload> {
    const { payload } = await jwtVerify(token, JWT_SECRET)
    return {
        userId: payload.userId as string,
        email: payload.email as string,
    }
}

export function extractToken(req: NextRequest): string | null {
    const authHeader = req.headers.get('authorization')
    if (!authHeader?.startsWith('Bearer ')) return null
    return authHeader.slice(7)
}

// ========================
// AUTH MIDDLEWARE (HOF)
// ========================

type AuthenticatedHandler = (
    req: NextRequest,
    context: { userId: string; email: string }
) => Promise<NextResponse | Response>

export function requireAuth(handler: AuthenticatedHandler) {
    return async (req: NextRequest) => {
        const token = extractToken(req)
        if (!token) {
            return NextResponse.json(
                { success: false, error: 'Authentication required', code: 'NO_TOKEN' },
                { status: 401 }
            )
        }

        try {
            const payload = await verifyToken(token)
            return handler(req, { userId: payload.userId, email: payload.email })
        } catch {
            return NextResponse.json(
                { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
                { status: 401 }
            )
        }
    }
}

// ========================
// VALIDATION
// ========================

export function validateEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
    return emailRegex.test(email)
}

export function validatePassword(password: string): {
    valid: boolean
    message?: string
} {
    if (password.length < 8) {
        return { valid: false, message: 'Password must be at least 8 characters' }
    }
    if (!/[A-Z]/.test(password)) {
        return { valid: false, message: 'Password must contain at least 1 uppercase letter' }
    }
    if (!/[0-9]/.test(password)) {
        return { valid: false, message: 'Password must contain at least 1 number' }
    }
    return { valid: true }
}
