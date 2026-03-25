import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/auth'
import { getSupabase, adminGrantCredits } from '@/lib/supabase'

export const PATCH = requireAdmin(async (req: NextRequest) => {
    try {
        const id = req.nextUrl.pathname.split('/').pop()
        if (!id) {
            return NextResponse.json(
                { success: false, error: 'Missing user ID' },
                { status: 400 }
            )
        }

        const body = await req.json()
        const { availableCredits, subscriptionTier, subscriptionStatus, grantAmount, grantReason } = body

        // Handle direct field updates
        const updates: any = {}
        if (typeof availableCredits === 'number') updates.available_credits = availableCredits
        if (subscriptionTier) updates.subscription_tier = subscriptionTier
        if (subscriptionStatus) updates.subscription_status = subscriptionStatus

        if (Object.keys(updates).length > 0) {
            const { error } = await getSupabase()
                .from('users')
                .update(updates)
                .eq('id', id)

            if (error) throw error
        }

        // Handle atomic credit grant if specified
        if (typeof grantAmount === 'number' && grantAmount !== 0) {
            await adminGrantCredits(id, grantAmount, grantReason || 'Admin manual adjustment')
        }

        return NextResponse.json({ success: true })
    } catch (error) {
        console.error('Failed to update user:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to update user' },
            { status: 500 }
        )
    }
})
