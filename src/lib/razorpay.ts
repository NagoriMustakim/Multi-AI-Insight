import Razorpay from 'razorpay'
import crypto from 'crypto'

// ========================
// SINGLETON INSTANCE
// ========================

let _razorpay: InstanceType<typeof Razorpay> | null = null

function getRazorpay(): InstanceType<typeof Razorpay> {
    if (!_razorpay) {
        const keyId = process.env.RAZORPAY_KEY_ID
        const keySecret = process.env.RAZORPAY_KEY_SECRET
        if (!keyId || !keySecret) {
            throw new Error('Missing Razorpay environment variables (RAZORPAY_KEY_ID, RAZORPAY_KEY_SECRET)')
        }
        _razorpay = new Razorpay({ key_id: keyId, key_secret: keySecret })
    }
    return _razorpay
}

// ========================
// PLAN CONFIGURATION
// ========================

export type PlanKey =
    | 'indie_monthly' | 'indie_yearly'
    | 'growth_monthly' | 'growth_yearly'
    | 'scale_monthly' | 'scale_yearly'

export interface PlanConfig {
    key: PlanKey
    name: string
    tier: 'indie' | 'growth' | 'scale'
    interval: 'monthly' | 'yearly'
    priceUSD: number         // Display price in USD
    amountINR: number        // Amount in paise (Razorpay uses smallest currency unit)
    creditsPerMonth: number
    rolloverMonths: number
    maxBalance: number
}

// Note: Razorpay amounts are in paise (1 INR = 100 paise)
// Using approximate USD→INR conversion for pricing
// These Razorpay plan IDs will be set after creating plans in dashboard
export const PLANS: Record<PlanKey, PlanConfig> = {
    indie_monthly: {
        key: 'indie_monthly',
        name: 'Indie',
        tier: 'indie',
        interval: 'monthly',
        priceUSD: 15,
        amountINR: 125000,    // ₹1,250 in paise
        creditsPerMonth: 20,
        rolloverMonths: 1,
        maxBalance: 40,
    },
    indie_yearly: {
        key: 'indie_yearly',
        name: 'Indie',
        tier: 'indie',
        interval: 'yearly',
        priceUSD: 144,
        amountINR: 1200000,   // ₹12,000 in paise
        creditsPerMonth: 20,
        rolloverMonths: 1,
        maxBalance: 40,
    },
    growth_monthly: {
        key: 'growth_monthly',
        name: 'Growth',
        tier: 'growth',
        interval: 'monthly',
        priceUSD: 29,
        amountINR: 240000,    // ₹2,400 in paise
        creditsPerMonth: 50,
        rolloverMonths: 3,
        maxBalance: 150,
    },
    growth_yearly: {
        key: 'growth_yearly',
        name: 'Growth',
        tier: 'growth',
        interval: 'yearly',
        priceUSD: 288,
        amountINR: 2400000,   // ₹24,000 in paise
        creditsPerMonth: 50,
        rolloverMonths: 3,
        maxBalance: 150,
    },
    scale_monthly: {
        key: 'scale_monthly',
        name: 'Scale',
        tier: 'scale',
        interval: 'monthly',
        priceUSD: 79,
        amountINR: 660000,    // ₹6,600 in paise
        creditsPerMonth: 150,
        rolloverMonths: 6,
        maxBalance: 900,
    },
    scale_yearly: {
        key: 'scale_yearly',
        name: 'Scale',
        tier: 'scale',
        interval: 'yearly',
        priceUSD: 768,
        amountINR: 6400000,   // ₹64,000 in paise
        creditsPerMonth: 150,
        rolloverMonths: 6,
        maxBalance: 900,
    },
}

// Add-on credit purchase config
export const ADDON_CREDITS = {
    amount: 50,
    priceUSD: 25,
    amountINR: 200000,  // ₹2,000 in paise
}

// ========================
// RAZORPAY SUBSCRIPTION PLANS
// Store plan IDs after creating them in Razorpay dashboard
// Format: RAZORPAY_PLAN_<TIER>_<INTERVAL>
// ========================

// These should be set in env vars after creating plans in Razorpay Dashboard
// e.g., RAZORPAY_PLAN_INDIE_MONTHLY=plan_xxxxx
export function getRazorpayPlanId(planKey: PlanKey): string {
    const envKey = `RAZORPAY_PLAN_${planKey.toUpperCase()}`
    const planId = process.env[envKey]

    // In test mode, allow fallback to a generic test plan
    if (!planId) {
        throw new Error(`Missing Razorpay plan ID for ${planKey}. Set ${envKey} in .env.local`)
    }
    return planId
}

// ========================
// ORDER CREATION (for one-time credit purchases)
// ========================

export async function createOrder(
    amountInPaise: number,
    currency: string = 'INR',
    receipt: string,
    notes: Record<string, string> = {}
) {
    const razorpay = getRazorpay()
    const order = await razorpay.orders.create({
        amount: amountInPaise,
        currency,
        receipt,
        notes,
    })
    return order
}

// ========================
// SUBSCRIPTION CREATION
// ========================

export async function createSubscription(
    planId: string,
    totalCount: number = 12,
    notes: Record<string, string> = {},
    trialDays?: number
) {
    const razorpay = getRazorpay()

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const subscriptionData: any = {
        plan_id: planId,
        total_count: totalCount,
        notes,
    }

    // Start immediately or add trial
    if (trialDays && trialDays > 0) {
        // Razorpay trial: start_at = now + trialDays
        const trialEnd = new Date()
        trialEnd.setDate(trialEnd.getDate() + trialDays)
        subscriptionData.start_at = Math.floor(trialEnd.getTime() / 1000)
    }

    const subscription = await razorpay.subscriptions.create(subscriptionData)
    return subscription
}

// ========================
// SUBSCRIPTION MANAGEMENT
// ========================

export async function cancelSubscription(subscriptionId: string, cancelAtCycleEnd: boolean = true) {
    const razorpay = getRazorpay()
    const result = await razorpay.subscriptions.cancel(subscriptionId, cancelAtCycleEnd)
    return result
}

export async function fetchSubscription(subscriptionId: string) {
    const razorpay = getRazorpay()
    const subscription = await razorpay.subscriptions.fetch(subscriptionId)
    return subscription
}

// ========================
// PAYMENT VERIFICATION
// ========================

/**
 * Verify Razorpay payment signature for orders (one-time purchases)
 * Uses HMAC-SHA256 with key_secret
 */
export function verifyOrderPaymentSignature(
    orderId: string,
    paymentId: string,
    signature: string
): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) throw new Error('Missing RAZORPAY_KEY_SECRET')

    const body = `${orderId}|${paymentId}`
    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex')

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    )
}

/**
 * Verify Razorpay payment signature for subscriptions
 * Uses HMAC-SHA256 with key_secret
 */
export function verifySubscriptionPaymentSignature(
    subscriptionId: string,
    paymentId: string,
    signature: string
): boolean {
    const keySecret = process.env.RAZORPAY_KEY_SECRET
    if (!keySecret) throw new Error('Missing RAZORPAY_KEY_SECRET')

    const body = `${paymentId}|${subscriptionId}`
    const expectedSignature = crypto
        .createHmac('sha256', keySecret)
        .update(body)
        .digest('hex')

    return crypto.timingSafeEqual(
        Buffer.from(expectedSignature),
        Buffer.from(signature)
    )
}

/**
 * Verify Razorpay webhook signature
 * Uses HMAC-SHA256 with webhook_secret
 */
export function verifyWebhookSignature(
    body: string,
    signature: string
): boolean {
    const webhookSecret = process.env.RAZORPAY_WEBHOOK_SECRET
    if (!webhookSecret) throw new Error('Missing RAZORPAY_WEBHOOK_SECRET')

    const expectedSignature = crypto
        .createHmac('sha256', webhookSecret)
        .update(body)
        .digest('hex')

    try {
        return crypto.timingSafeEqual(
            Buffer.from(expectedSignature),
            Buffer.from(signature)
        )
    } catch {
        return false
    }
}

/**
 * Get plan config by subscription tier string (e.g., 'growth_monthly')
 */
export function getPlanByKey(key: string): PlanConfig | null {
    return PLANS[key as PlanKey] ?? null
}

/**
 * Get plan config by Razorpay plan ID
 */
export function getPlanByRazorpayId(razorpayPlanId: string): PlanConfig | null {
    for (const plan of Object.values(PLANS)) {
        try {
            const envPlanId = getRazorpayPlanId(plan.key)
            if (envPlanId === razorpayPlanId) return plan
        } catch {
            continue
        }
    }
    return null
}
