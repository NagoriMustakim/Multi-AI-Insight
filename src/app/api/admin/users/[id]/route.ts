import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { setUserActive } from '@/lib/supabase'

export const PATCH = requireAdmin(async (req: NextRequest) => {
    try {
        // Extract [id] from URL: /api/admin/users/[id]
        const id = req.nextUrl.pathname.split('/').pop()
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Missing user ID' },
                { status: 400 }
            )
        }

        const { isActive } = await req.json()
        if (typeof isActive !== 'boolean') {
            return NextResponse.json(
                { success: false, error: 'isActive must be a boolean' },
                { status: 400 }
            )
        }

        await setUserActive(id, isActive)
        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to update user status:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        )
    }
})
