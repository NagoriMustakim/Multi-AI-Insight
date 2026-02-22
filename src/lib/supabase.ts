import { createClient, SupabaseClient } from '@supabase/supabase-js'
import { CompetitorReport } from '@/types'

let _supabase: SupabaseClient | null = null

function getSupabase(): SupabaseClient {
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
