// ========================
// SUBSCRIPTION & CREDIT TYPES
// ========================

export type SubscriptionTier = 'free' | 'indie_monthly' | 'indie_yearly' | 'growth_monthly' | 'growth_yearly' | 'scale_monthly' | 'scale_yearly'
export type SubscriptionStatus = 'inactive' | 'trialing' | 'active' | 'cancelled' | 'past_due'

export interface CreditLedgerEntry {
    id: string
    user_id: string
    amount: number
    transaction_type: 'subscription_grant' | 'add_on_purchase' | 'report_usage' | 'trial_grant' | 'admin_grant'
    description: string | null
    razorpay_payment_id: string | null
    created_at: string
    expires_at: string | null
}

// ========================
// AUTH TYPES
// ========================

export interface User {
    id: string
    email: string
    full_name?: string | null
    subscription_tier: SubscriptionTier
    subscription_status: SubscriptionStatus
    available_credits: number
    trial_used: boolean
    created_at: string
    updated_at: string
}

export interface AuthTokenPayload {
    userId: string
    email: string
}

export interface RegisterRequest {
    email: string
    password: string
    fullName?: string
}

export interface LoginRequest {
    email: string
    password: string
}

export interface AuthResponse {
    token: string
    user: Omit<User, 'updated_at'>
}

// ========================
// COMPANY / INPUT TYPES
// ========================

export interface CompanyInput {
    name: string
    product: string
    description: string
    domain: string
    market: string
    website?: string
}

// ========================
// REPORT TYPES
// ========================

export interface Competitor {
    name: string
    website: string
    description: string
    market_share_estimate: string
    strengths: string[]
    features: string[]
    pricing: string
    customer_reviews_summary: string
    growth_signals: string[]
    ai_intelligence_score: number
}

export interface FeatureGaps {
    their_gaps: string[]
    our_gaps: string[]
}

export interface MarketOpportunity {
    title: string
    description: string
    effort: 'low' | 'medium' | 'high'
    impact: 'low' | 'medium' | 'high'
    timeframe: 'immediate' | '3-6 months' | '6-12 months'
    priority_score: number
}

export interface GrowthSignal {
    competitor: string
    signal: string
    source: string
    impact: 'high' | 'medium' | 'low'
}

export interface QuickWin {
    action: string
    rationale: string
    effort_days: number
    expected_impact: string
}

export interface PricingIntel {
    market_average_low: string
    market_average_high: string
    pricing_models_used: string[]
    your_positioning: string
    pricing_opportunity: string
}

export interface RadarDimension {
    name: string
    your_score: number
    competitor_avg: number
    leader_score: number
}

export interface PositioningRadar {
    dimensions: RadarDimension[]
    white_space: string
}

export interface AIAdoptionAnalysis {
    overall_market_ai_maturity: 'early' | 'growing' | 'mature'
    your_ai_advantage: string[]
    competitors_ai_gaps: string[]
    ai_opportunity: string
}

export interface RecommendedAction {
    priority: number
    category: 'product' | 'marketing' | 'pricing' | 'technical' | 'positioning'
    action: string
    rationale: string
    kpi: string
    timeline: string
}

export interface CompetitorReport {
    generated_at: string
    company: CompanyInput
    executive_summary: string
    market_landscape: string
    competitors: Competitor[]
    feature_gaps: FeatureGaps
    pain_points: string[]
    market_opportunities: MarketOpportunity[]
    growth_signals: GrowthSignal[]
    quick_wins: QuickWin[]
    pricing_intelligence: PricingIntel
    positioning_radar: PositioningRadar
    ai_adoption_analysis: AIAdoptionAnalysis
    recommended_actions: RecommendedAction[]
    data_sources: string[]
    confidence_score: number
}

// ========================
// API RESPONSE TYPES
// ========================

export interface ApiSuccess<T> {
    success: true
    data: T
}

export interface ApiError {
    success: false
    error: string
    code?: string
}

export type ApiResponse<T> = ApiSuccess<T> | ApiError

// ========================
// USAGE TYPES
// ========================

export interface UsageInfo {
    analysisCount: number
    availableCredits: number
    subscriptionTier: SubscriptionTier
    subscriptionStatus: SubscriptionStatus
    trialUsed: boolean
}

export interface UsageRecord {
    id: string
    user_id: string
    company_name: string
    domain: string
    market: string
    created_at: string
    report_data?: CompetitorReport
}

// ========================
// SUBSCRIPTION API TYPES
// ========================

export interface SubscriptionInfo {
    tier: SubscriptionTier
    status: SubscriptionStatus
    availableCredits: number
    trialUsed: boolean
    currentPeriodEnd: string | null
    razorpaySubscriptionId: string | null
}

// ========================
// ANALYSIS REQUEST
// ========================

export interface AnalyzeRequest {
    company: CompanyInput
}

// ========================
// STREAMING TYPES
// ========================

export interface StreamProgressEvent {
    type: 'progress'
    step: string
    message: string
}

export interface StreamCompleteEvent {
    type: 'complete'
    report: CompetitorReport
}

export interface StreamErrorEvent {
    type: 'error'
    error: string
}

export type StreamEvent = StreamProgressEvent | StreamCompleteEvent | StreamErrorEvent
