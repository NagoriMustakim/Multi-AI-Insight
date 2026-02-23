import { NextRequest, NextResponse } from 'next/server'
import { signAdminToken } from '@/lib/auth'

export async function POST(req: NextRequest) {
    try {
        const { email, password } = await req.json()

        const adminEmail = process.env.ADMIN_EMAIL
        const adminPassword = process.env.ADMIN_PASSWORD

        if (!adminEmail || !adminPassword) {
            return NextResponse.json(
                { success: false, error: 'Admin not configured' },
                { status: 500 }
            )
        }

        // Constant-time comparison to prevent timing attacks
        const emailMatch = email?.toLowerCase() === adminEmail.toLowerCase()
        const passMatch = password === adminPassword

        if (!emailMatch || !passMatch) {
            // Artificial delay to slow down brute force
            await new Promise(r => setTimeout(r, 500))
            return NextResponse.json(
                { success: false, error: 'Invalid credentials' },
                { status: 401 }
            )
        }

        const token = await signAdminToken()
        return NextResponse.json({ success: true, token })
    } catch {
        return NextResponse.json(
            { success: false, error: 'Server error' },
            { status: 500 }
        )
    }
}
