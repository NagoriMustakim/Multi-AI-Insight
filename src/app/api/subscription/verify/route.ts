import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserSubscription, updateSubscription, grantCredits, setTrialUsed } from '@/lib/supabase'
import { verifySubscriptionPaymentSignature, getPlanByKey, fetchSubscription } from '@/lib/razorpay'

export const POST = requireAuth(
    async (req: NextRequest, { userId }: { userId: string; email: string }) => {
        try {
            const body = await req.json()
            const {
                razorpay_payment_id,
                razorpay_subscription_id,
                razorpay_signature,
            } = body as {
                razorpay_payment_id: string
                razorpay_subscription_id: string
                razorpay_signature: string
            }

            // Validate required fields
            if (!razorpay_payment_id || !razorpay_subscription_id || !razorpay_signature) {
                return NextResponse.json(
                    { success: false, error: 'Missing payment verification data', code: 'MISSING_FIELDS' },
                    { status: 400 }
                )
            }

            // Verify the payment signature FIRST (cryptographic proof of payment)
            // We do this before the subscription ID check because on re-subscription
            // the user gets a NEW subscription ID that isn't stored yet.
            const isValid = verifySubscriptionPaymentSignature(
                razorpay_subscription_id,
                razorpay_payment_id,
                razorpay_signature
            )

            if (!isValid) {
                console.error('Payment signature verification failed for user:', userId)
                return NextResponse.json(
                    { success: false, error: 'Payment verification failed. Possible tampering detected.', code: 'SIGNATURE_INVALID' },
                    { status: 400 }
                )
            }

            // Fetch subscription details from Razorpay to get plan info
            const subscriptionDetails = await fetchSubscription(razorpay_subscription_id)
            const planKey = subscriptionDetails.notes?.plan_key as string

            const plan = getPlanByKey(planKey)
            if (!plan) {
                // Fallback: still mark as active even if we can't identify the plan
                console.error('Could not identify plan for subscription:', razorpay_subscription_id)
                return NextResponse.json(
                    { success: false, error: 'Could not identify subscription plan', code: 'PLAN_NOT_FOUND' },
                    { status: 500 }
                )
            }

            // Determine if this is a trial or active subscription
            const userSub = await getUserSubscription(userId)
            const isTrial = !userSub.trial_used && plan.tier === 'growth'
            const status = isTrial ? 'trialing' : 'active'
            const credits = isTrial ? 20 : plan.creditsPerMonth
            const creditType = isTrial ? 'trial_grant' : 'subscription_grant'
            const creditDescription = isTrial
                ? 'Free trial: 20 credits (2 reports)'
                : `${plan.name} plan: ${plan.creditsPerMonth} monthly credits`

            // Calculate period end
            const periodEnd = new Date()
            if (isTrial) {
                periodEnd.setDate(periodEnd.getDate() + 7)
            } else {
                periodEnd.setMonth(periodEnd.getMonth() + (plan.interval === 'yearly' ? 12 : 1))
            }

            // Update subscription status — always store the latest subscription ID
            // This handles both first-time subscribers and re-subscribers
            await updateSubscription(userId, {
                subscription_tier: plan.key,
                subscription_status: status,
                razorpay_subscription_id: razorpay_subscription_id,
                subscription_current_period_end: periodEnd.toISOString(),
            })

            // Grant credits
            await grantCredits(
                userId,
                credits,
                creditType,
                creditDescription,
                razorpay_payment_id
            )

            // Mark trial as used if applicable
            if (isTrial) {
                await setTrialUsed(userId)
            }

            return NextResponse.json({
                success: true,
                data: {
                    status,
                    tier: plan.key,
                    creditsGranted: credits,
                    isTrial,
                },
            })
        } catch (error) {
            console.error('Subscription verification error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to verify subscription', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
