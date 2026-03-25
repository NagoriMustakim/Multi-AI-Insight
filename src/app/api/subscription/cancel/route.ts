import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserSubscription, updateSubscription } from '@/lib/supabase'
import { cancelSubscription } from '@/lib/razorpay'

export const POST = requireAuth(
    async (_req: NextRequest, { userId }: { userId: string; email: string }) => {
        try {
            const sub = await getUserSubscription(userId)

            // Verify user has an active subscription to cancel
            if (!sub.razorpay_subscription_id) {
                return NextResponse.json(
                    { success: false, error: 'No active subscription found', code: 'NO_SUBSCRIPTION' },
                    { status: 400 }
                )
            }

            if (sub.subscription_status !== 'active' && sub.subscription_status !== 'trialing') {
                return NextResponse.json(
                    { success: false, error: 'Subscription is not active', code: 'NOT_ACTIVE' },
                    { status: 400 }
                )
            }

            // Cancel at end of billing cycle (user keeps access until period ends)
            await cancelSubscription(sub.razorpay_subscription_id, true)

            // Update local status
            await updateSubscription(userId, {
                subscription_status: 'cancelled',
            })

            return NextResponse.json({
                success: true,
                data: {
                    message: 'Subscription cancelled. You will retain access until the end of your current billing period.',
                    accessUntil: sub.subscription_current_period_end,
                },
            })
        } catch (error) {
            console.error('Subscription cancellation error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to cancel subscription', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
