import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserSubscription } from '@/lib/supabase'

export const GET = requireAuth(
    async (_req: NextRequest, { userId }: { userId: string; email: string }) => {
        try {
            const sub = await getUserSubscription(userId)

            return NextResponse.json({
                success: true,
                data: {
                    tier: sub.subscription_tier,
                    status: sub.subscription_status,
                    availableCredits: sub.available_credits,
                    trialUsed: sub.trial_used,
                    currentPeriodEnd: sub.subscription_current_period_end,
                    hasActiveSubscription: sub.subscription_status === 'active' || sub.subscription_status === 'trialing',
                },
            })
        } catch (error) {
            console.error('Subscription status error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to fetch subscription status', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
