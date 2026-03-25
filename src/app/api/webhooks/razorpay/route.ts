import { NextRequest, NextResponse } from 'next/server'
import { verifyWebhookSignature, getPlanByRazorpayId } from '@/lib/razorpay'
import { getUserByRazorpaySubscriptionId, updateSubscription, grantCredits } from '@/lib/supabase'

/**
 * Razorpay Webhook Handler
 *
 * This endpoint receives events from Razorpay for:
 * - subscription.activated   → Mark subscription as active
 * - subscription.charged     → Monthly credit grant on renewal
 * - subscription.cancelled   → Mark as cancelled
 * - subscription.completed   → Subscription term ended
 * - payment.captured         → Payment successfully captured
 *
 * Security: All webhooks are verified via HMAC-SHA256 signature.
 * This endpoint does NOT use auth middleware — it is called by Razorpay servers.
 */
export async function POST(req: NextRequest) {
    try {
        // Read raw body for signature verification
        const rawBody = await req.text()
        const signature = req.headers.get('x-razorpay-signature')

        if (!signature) {
            console.error('Webhook: Missing signature header')
            return NextResponse.json({ error: 'Missing signature' }, { status: 401 })
        }

        // Verify webhook signature
        const isValid = verifyWebhookSignature(rawBody, signature)
        if (!isValid) {
            console.error('Webhook: Invalid signature')
            return NextResponse.json({ error: 'Invalid signature' }, { status: 401 })
        }

        // Parse the event
        const event = JSON.parse(rawBody)
        const eventType = event.event as string

        console.log(`Webhook received: ${eventType}`)

        switch (eventType) {
            case 'subscription.activated': {
                await handleSubscriptionActivated(event)
                break
            }
            case 'subscription.charged': {
                await handleSubscriptionCharged(event)
                break
            }
            case 'subscription.cancelled': {
                await handleSubscriptionCancelled(event)
                break
            }
            case 'subscription.completed': {
                await handleSubscriptionCompleted(event)
                break
            }
            default: {
                console.log(`Webhook: Unhandled event type: ${eventType}`)
            }
        }

        // Always return 200 to acknowledge receipt
        return NextResponse.json({ received: true })
    } catch (error) {
        console.error('Webhook processing error:', error)
        // Return 200 even on error to prevent Razorpay retries for parsing issues
        // Real errors are logged for manual investigation
        return NextResponse.json({ received: true, error: 'Processing error' })
    }
}

// ========================
// EVENT HANDLERS
// ========================

async function handleSubscriptionActivated(event: Record<string, unknown>) {
    const payload = event.payload as Record<string, unknown>
    const subscription = (payload.subscription as Record<string, unknown>)?.entity as Record<string, unknown>

    if (!subscription) return

    const subscriptionId = subscription.id as string
    const user = await getUserByRazorpaySubscriptionId(subscriptionId)
    if (!user) {
        console.error('Webhook: User not found for subscription:', subscriptionId)
        return
    }

    // Determine the plan from Razorpay plan ID
    const razorpayPlanId = subscription.plan_id as string
    const plan = getPlanByRazorpayId(razorpayPlanId)

    if (plan) {
        await updateSubscription(user.id, {
            subscription_tier: plan.key,
            subscription_status: 'active',
        })
    } else {
        // Fallback: just mark as active
        await updateSubscription(user.id, {
            subscription_status: 'active',
        })
    }
}

async function handleSubscriptionCharged(event: Record<string, unknown>) {
    const payload = event.payload as Record<string, unknown>
    const subscription = (payload.subscription as Record<string, unknown>)?.entity as Record<string, unknown>
    const payment = (payload.payment as Record<string, unknown>)?.entity as Record<string, unknown>

    if (!subscription) return

    const subscriptionId = subscription.id as string
    const paymentId = payment?.id as string | undefined
    const user = await getUserByRazorpaySubscriptionId(subscriptionId)

    if (!user) {
        console.error('Webhook: User not found for charged subscription:', subscriptionId)
        return
    }

    // Get plan info
    const razorpayPlanId = subscription.plan_id as string
    const plan = getPlanByRazorpayId(razorpayPlanId)

    if (!plan) {
        console.error('Webhook: Plan not found for Razorpay plan:', razorpayPlanId)
        return
    }

    // Calculate period end
    const periodEnd = new Date()
    periodEnd.setMonth(periodEnd.getMonth() + (plan.interval === 'yearly' ? 12 : 1))

    // Check max balance cap before granting
    const currentCredits = user.available_credits as number || 0
    const creditsToGrant = Math.min(plan.creditsPerMonth, plan.maxBalance - currentCredits)

    if (creditsToGrant > 0) {
        // Calculate expiry based on rollover policy
        const expiresAt = new Date()
        expiresAt.setMonth(expiresAt.getMonth() + plan.rolloverMonths)

        await grantCredits(
            user.id,
            creditsToGrant,
            'subscription_grant',
            `${plan.name} plan: ${creditsToGrant} monthly credits`,
            paymentId,
            expiresAt.toISOString()
        )
    }

    // Update subscription status + period end
    await updateSubscription(user.id, {
        subscription_status: 'active',
        subscription_current_period_end: periodEnd.toISOString(),
    })
}

async function handleSubscriptionCancelled(event: Record<string, unknown>) {
    const payload = event.payload as Record<string, unknown>
    const subscription = (payload.subscription as Record<string, unknown>)?.entity as Record<string, unknown>

    if (!subscription) return

    const subscriptionId = subscription.id as string
    const user = await getUserByRazorpaySubscriptionId(subscriptionId)

    if (!user) {
        console.error('Webhook: User not found for cancelled subscription:', subscriptionId)
        return
    }

    await updateSubscription(user.id, {
        subscription_status: 'cancelled',
    })
}

async function handleSubscriptionCompleted(event: Record<string, unknown>) {
    const payload = event.payload as Record<string, unknown>
    const subscription = (payload.subscription as Record<string, unknown>)?.entity as Record<string, unknown>

    if (!subscription) return

    const subscriptionId = subscription.id as string
    const user = await getUserByRazorpaySubscriptionId(subscriptionId)

    if (!user) {
        console.error('Webhook: User not found for completed subscription:', subscriptionId)
        return
    }

    // Subscription term ended — mark as inactive
    await updateSubscription(user.id, {
        subscription_status: 'inactive',
        subscription_tier: 'free',
    })
}
