import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserSubscription, updateSubscription } from '@/lib/supabase'
import { createSubscription, getRazorpayPlanId, getPlanByKey, type PlanKey } from '@/lib/razorpay'

const VALID_PLANS: PlanKey[] = [
    'indie_monthly', 'indie_yearly',
    'growth_monthly', 'growth_yearly',
    'scale_monthly', 'scale_yearly',
]

export const POST = requireAuth(
    async (req: NextRequest, { userId, email }: { userId: string; email: string }) => {
        try {
            const body = await req.json()
            const { planKey } = body as { planKey: string }

            // Validate plan key
            if (!planKey || !VALID_PLANS.includes(planKey as PlanKey)) {
                return NextResponse.json(
                    { success: false, error: 'Invalid plan selected', code: 'INVALID_PLAN' },
                    { status: 400 }
                )
            }

            const plan = getPlanByKey(planKey)
            if (!plan) {
                return NextResponse.json(
                    { success: false, error: 'Plan configuration not found', code: 'PLAN_NOT_FOUND' },
                    { status: 400 }
                )
            }

            // Check if user already has an active subscription
            const sub = await getUserSubscription(userId)
            if (sub.subscription_status === 'active') {
                return NextResponse.json(
                    { success: false, error: 'You already have an active subscription. Cancel it first to switch plans.', code: 'ALREADY_SUBSCRIBED' },
                    { status: 400 }
                )
            }

            // Get Razorpay plan ID
            let razorpayPlanId: string
            try {
                razorpayPlanId = getRazorpayPlanId(planKey as PlanKey)
            } catch {
                return NextResponse.json(
                    { success: false, error: 'Plan not yet configured in payment gateway. Contact support.', code: 'PLAN_NOT_CONFIGURED' },
                    { status: 500 }
                )
            }

            // Determine trial eligibility
            const trialDays = (!sub.trial_used && plan.tier === 'growth') ? 7 : undefined

            // Create Razorpay subscription
            const totalCount = plan.interval === 'monthly' ? 12 : 1
            const subscription = await createSubscription(
                razorpayPlanId,
                totalCount,
                {
                    user_id: userId,
                    user_email: email,
                    plan_key: planKey,
                },
                trialDays
            )

            // Store the Razorpay subscription ID on the user
            await updateSubscription(userId, {
                razorpay_subscription_id: subscription.id,
                subscription_status: 'inactive', // Will become active after payment verification
            })

            return NextResponse.json({
                success: true,
                data: {
                    subscriptionId: subscription.id,
                    razorpayKeyId: process.env.RAZORPAY_KEY_ID,
                    planName: plan.name,
                    planKey: plan.key,
                    amount: plan.interval === 'monthly' ? plan.amountINR : plan.amountINR,
                    currency: 'INR',
                    hasTrial: !!trialDays,
                    trialDays: trialDays || 0,
                },
            })
        } catch (error) {
            console.error('Subscription creation error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to create subscription', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
