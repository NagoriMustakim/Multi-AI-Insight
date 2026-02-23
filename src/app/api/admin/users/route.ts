import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getAllUsers } from '@/lib/supabase'

export const GET = requireAdmin(async (_req: NextRequest) => {
    try {
        const users = await getAllUsers()
        return NextResponse.json({ success: true, users })
    } catch (error) {
        console.error('Failed to list users:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to fetch users' },
            { status: 500 }
        )
    }
})
