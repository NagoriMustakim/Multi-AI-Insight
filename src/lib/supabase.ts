import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompetitorReport, SubscriptionTier, SubscriptionStatus } from '@/types'

let _supabase: SupabaseClient | null = null

export function getSupabase(): SupabaseClient {
    if (!_supabase) {
        const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
        const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
        if (!supabaseUrl || !supabaseServiceKey) {
            throw new Error('Missing Supabase environment variables')
        }
        _supabase = createClient(supabaseUrl, supabaseServiceKey, {
            auth: { persistSession: false },
        })
    }
    return _supabase
}


// ========================
// USER OPERATIONS
// ========================

export async function getUserByEmail(email: string) {
    const { data, error } = await getSupabase()
        .from('users')
        .select('*')
        .eq('email', email.toLowerCase())
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

export async function createUser(
    email: string,
    passwordHash: string,
    fullName?: string
) {
    const { data, error } = await getSupabase()
        .from('users')
        .insert({
            email: email.toLowerCase(),
            password_hash: passwordHash,
            full_name: fullName || null,
            subscription_tier: 'free',
            subscription_status: 'inactive',
            available_credits: 0,
            trial_used: false,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getUserById(id: string) {
    const { data, error } = await getSupabase()
        .from('users')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}


// ========================
// SUBSCRIPTION & CREDIT OPERATIONS
// ========================

/**
 * Get user's subscription info including credits
 */
export async function getUserSubscription(userId: string) {
    const { data, error } = await getSupabase()
        .from('users')
        .select('subscription_tier, subscription_status, available_credits, trial_used, razorpay_customer_id, razorpay_subscription_id, subscription_current_period_end')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data as {
        subscription_tier: SubscriptionTier
        subscription_status: SubscriptionStatus
        available_credits: number
        trial_used: boolean
        razorpay_customer_id: string | null
        razorpay_subscription_id: string | null
        subscription_current_period_end: string | null
    }
}

/**
 * Get user's available credits
 */
export async function getUserCredits(userId: string): Promise<number> {
    const { data, error } = await getSupabase()
        .from('users')
        .select('available_credits')
        .eq('id', userId)
        .single()

    if (error) throw error
    return data?.available_credits ?? 0
}

/**
 * Atomically deduct credits using Postgres function (prevents race conditions)
 * Returns true if deduction was successful, false if insufficient credits
 */
export async function deductCredits(userId: string, amount: number): Promise<boolean> {
    const { data, error } = await getSupabase()
        .rpc('deduct_credits', { p_user_id: userId, p_amount: amount })

    if (error) throw error
    return data === true
}

/**
 * Grant credits using Postgres function (atomic + creates ledger entry)
 * Returns new balance
 */
export async function grantCredits(
    userId: string,
    amount: number,
    type: string,
    description?: string,
    paymentId?: string,
    expiresAt?: string
): Promise<number> {
    const { data, error } = await getSupabase()
        .rpc('grant_credits', {
            p_user_id: userId,
            p_amount: amount,
            p_type: type,
            p_description: description || null,
            p_payment_id: paymentId || null,
            p_expires_at: expiresAt || null,
        })

    if (error) throw error
    return data as number
}

/**
 * Update user's subscription details
 */
export async function updateSubscription(
    userId: string,
    updates: {
        subscription_tier?: SubscriptionTier
        subscription_status?: SubscriptionStatus
        razorpay_customer_id?: string
        razorpay_subscription_id?: string
        subscription_current_period_end?: string
        trial_used?: boolean
    }
) {
    const { error } = await getSupabase()
        .from('users')
        .update(updates)
        .eq('id', userId)

    if (error) throw error
}

/**
 * Mark user's free trial as consumed
 */
export async function setTrialUsed(userId: string) {
    const { error } = await getSupabase()
        .from('users')
        .update({ trial_used: true })
        .eq('id', userId)

    if (error) throw error
}

/**
 * Find user by Razorpay customer/subscription ID
 */
export async function getUserByRazorpaySubscriptionId(subscriptionId: string) {
    const { data, error } = await getSupabase()
        .from('users')
        .select('*')
        .eq('razorpay_subscription_id', subscriptionId)
        .single()

    if (error && error.code !== 'PGRST116') throw error
    return data
}

/**
 * Get user's credit history/ledger
 */
export async function getCreditLedger(userId: string, limit: number = 20) {
    const { data, error } = await getSupabase()
        .from('credit_ledger')
        .select('*')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })
        .limit(limit)

    if (error) throw error
    return data ?? []
}


// ========================
// ADMIN OPERATIONS
// ========================

export async function getAllUsers() {
    const { data: users, error } = await getSupabase()
        .from('users')
        .select('id, email, full_name, subscription_tier, subscription_status, available_credits, trial_used, created_at')
        .order('created_at', { ascending: false })

    if (error) throw error

    // Get analysis counts for each user
    const usersWithCounts = await Promise.all(
        (users ?? []).map(async (user) => {
            const { count } = await getSupabase()
                .from('analysis_usage')
                .select('*', { count: 'exact', head: true })
                .eq('user_id', user.id)
            return { ...user, analysis_count: count ?? 0 }
        })
    )
    return usersWithCounts
}

/**
 * Admin: Grant credits to a specific user
 */
export async function adminGrantCredits(userId: string, amount: number, reason: string): Promise<number> {
    return grantCredits(userId, amount, 'admin_grant', `Admin grant: ${reason}`)
}


// ========================
// ANALYSIS USAGE OPERATIONS
// ========================

export async function getUserAnalysisCount(userId: string): Promise<number> {
    const { count, error } = await getSupabase()
        .from('analysis_usage')
        .select('*', { count: 'exact', head: true })
        .eq('user_id', userId)

    if (error) throw error
    return count ?? 0
}

export async function saveAnalysisRecord(
    userId: string,
    companyName: string,
    domain: string,
    market: string,
    reportData: CompetitorReport
) {
    const { data, error } = await getSupabase()
        .from('analysis_usage')
        .insert({
            user_id: userId,
            company_name: companyName,
            domain,
            market,
            report_data: reportData,
        })
        .select()
        .single()

    if (error) throw error
    return data
}

export async function getUserAnalysisHistory(userId: string) {
    const { data, error } = await getSupabase()
        .from('analysis_usage')
        .select('id, user_id, company_name, domain, market, created_at')
        .eq('user_id', userId)
        .order('created_at', { ascending: false })

    if (error) throw error
    return data ?? []
}

export async function getAnalysisById(id: string) {
    const { data, error } = await getSupabase()
        .from('analysis_usage')
        .select('*')
        .eq('id', id)
        .single()

    if (error) throw error
    return data
}
