'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { LogOut, Clock, ChevronRight, BarChart3, Zap, Plus, CreditCard, Sparkles, Building2, Package } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { BrandLogo } from '@/components/ui/Logo'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { Spinner } from '@/components/ui/Spinner'
import { AnalysisForm } from '@/components/analysis/AnalysisForm'
import { LoadingAnalysis } from '@/components/analysis/LoadingAnalysis'
import { CompanyInput, CompetitorReport, UsageRecord, SubscriptionTier, SubscriptionStatus } from '@/types'


export default function DashboardPage() {
    const router = useRouter()
    const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth()
    const { toast } = useToast()

    const [history, setHistory] = useState<UsageRecord[]>([])
    const [usageLoading, setUsageLoading] = useState(true)
    const [analyzing, setAnalyzing] = useState(false)
    const [currentStep, setCurrentStep] = useState('')
    const [currentMessage, setCurrentMessage] = useState('')

    // Subscription & Credits state
    const [credits, setCredits] = useState<number>(0)
    const [tier, setTier] = useState<SubscriptionTier>('free')
    const [status, setStatus] = useState<SubscriptionStatus>('inactive')

    // Check auth
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [authLoading, isAuthenticated, router])

    // Fetch usage and subscription data
    const fetchUsage = useCallback(async () => {
        if (!token) return
        try {
            const res = await fetch('/api/usage', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (data.success) {
                setHistory(data.data.history || [])
                setCredits(data.data.availableCredits ?? 0)
                setTier(data.data.subscriptionTier ?? 'free')
                setStatus(data.data.subscriptionStatus ?? 'inactive')
            }
        } catch {
            toast('error', 'Failed to load usage data')
        } finally {
            setUsageLoading(false)
        }
    }, [token, toast])


    useEffect(() => {
        if (token) fetchUsage()
    }, [token, fetchUsage])

    // Handle analysis submission
    const handleAnalyze = async (company: CompanyInput) => {
        setAnalyzing(true)
        setCurrentStep('researching')
        setCurrentMessage('Starting analysis...')

        try {
            const response = await fetch('/api/analyze', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ company }),
            })

            if (!response.ok) {
                const errorData = await response.json()
                if (errorData.code === 'INSUFFICIENT_CREDITS') {
                    setAnalyzing(false)
                    toast('error', 'Insufficient Credits', errorData.error || 'You need 10 credits to run an analysis.')
                    return
                }
                throw new Error(errorData.error || 'Analysis failed')
            }

            // Read SSE stream
            const reader = response.body?.getReader()
            if (!reader) throw new Error('No response stream')

            const decoder = new TextDecoder()
            let buffer = ''

            while (true) {
                const { done, value } = await reader.read()
                if (done) break

                buffer += decoder.decode(value, { stream: true })
                const lines = buffer.split('\n\n')
                buffer = lines.pop() || ''

                for (const line of lines) {
                    if (line.startsWith('data: ')) {
                        try {
                            const event = JSON.parse(line.slice(6))

                            if (event.type === 'progress') {
                                setCurrentStep(event.step)
                                setCurrentMessage(event.message)
                            } else if (event.type === 'complete') {
                                setAnalyzing(false)
                                toast('success', 'Analysis complete!', '10 credits deducted. Your report is ready.')
                                // Refresh usage to update credits
                                await fetchUsage()
                                // Store report for immediate viewing
                                sessionStorage.setItem('latest_report', JSON.stringify(event.report))
                                sessionStorage.setItem('latest_company', JSON.stringify(company))
                                // Scroll to top to see latest report card
                                window.scrollTo({ top: 0, behavior: 'smooth' })
                            } else if (event.type === 'error') {
                                throw new Error(event.error)
                            }
                        } catch (parseError) {
                            if (parseError instanceof Error && parseError.message !== 'Analysis failed') {
                                if (!parseError.message.includes('JSON')) throw parseError
                            }
                        }
                    }
                }
            }
        } catch (error) {
            setAnalyzing(false)
            const msg = error instanceof Error ? error.message : 'Analysis failed'
            toast('error', 'Analysis failed', msg)
        }
    }

    if (authLoading || (!isAuthenticated && !authLoading)) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    // Check for a stored report to display
    const storedReport = typeof window !== 'undefined'
        ? sessionStorage.getItem('latest_report')
        : null

    let latestReport: CompetitorReport | null = null
    if (storedReport) {
        try {
            latestReport = JSON.parse(storedReport)
        } catch { /* ignore */ }
    }

    return (
        <>
            {analyzing && (
                <LoadingAnalysis currentStep={currentStep} currentMessage={currentMessage} />
            )}

            <div className="min-h-screen bg-ink-950">
                {/* Header */}
                <header className="border-b border-ink-700/50 bg-ink-900/60 backdrop-blur-sm sticky top-0 z-40">
                    <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                        <a href="/" className="flex items-center gap-3">
                            <BrandLogo size="sm" />
                        </a>

                        <div className="flex items-center gap-6">
                            {/* Desktop Credits */}
                            <div className="hidden md:flex items-center gap-3 bg-ink-800/60 border border-ink-700/50 rounded-full px-4 py-1.5">
                                <div className="flex flex-col items-end">
                                    <span className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Credits Available</span>
                                    <span className="text-sm font-bold text-gold">{credits}</span>
                                </div>
                                <div className="w-px h-8 bg-ink-700/50" />
                                <Button variant="ghost" size="sm" className="h-8 w-8 p-0 rounded-full hover:bg-gold/10 hover:text-gold" onClick={() => router.push('/pricing')}>
                                    <Plus className="h-4 w-4" />
                                </Button>
                            </div>

                            <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={logout} className="text-[var(--text-muted)] hover:text-error">
                                    <LogOut className="h-4 w-4" />
                                    <span className="hidden sm:inline">Sign out</span>
                                </Button>
                            </div>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-8">
                    {/* Mobile Credits Bar */}
                    <div className="md:hidden flex items-center justify-between bg-ink-900 border border-ink-800 rounded-2xl p-4 mb-8">
                        <div>
                            <p className="text-[10px] text-[var(--text-muted)] uppercase tracking-wider font-bold">Credits</p>
                            <p className="text-xl font-bold text-gold">{credits}</p>
                        </div>
                        <Button variant="primary" size="sm" onClick={() => router.push('/pricing')}>
                            Buy More
                        </Button>
                    </div>

                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Left Column: Form & Latest Report */}
                        <div className="lg:col-span-3 space-y-8">
                            {latestReport && (
                                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
                                    <Card className="p-6 border-gold/30 bg-gold/5 relative overflow-hidden group">
                                        <div className="absolute top-0 right-0 p-4 opacity-5 group-hover:opacity-10 transition-opacity">
                                            <Sparkles className="h-24 w-24 text-gold" />
                                        </div>
                                        <div className="flex items-center justify-between mb-6">
                                            <div className="flex items-center gap-3">
                                                <div className="p-2 rounded-lg bg-gold/10 border border-gold/20">
                                                    <BarChart3 className="h-5 w-5 text-gold" />
                                                </div>
                                                <h2 className="text-xl font-bold text-[var(--text-primary)]">
                                                    Latest Intelligence
                                                </h2>
                                            </div>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => {
                                                    sessionStorage.removeItem('latest_report')
                                                    window.location.reload()
                                                }}
                                                className="text-xs text-[var(--text-muted)] hover:text-[var(--text-primary)]"
                                            >
                                                Dismiss
                                            </Button>
                                        </div>
                                        <div className="space-y-4 mb-6 relative z-10">
                                            <div className="flex flex-wrap gap-4">
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <Building2 className="h-4 w-4" />
                                                    {latestReport.company.name}
                                                </div>
                                                <div className="flex items-center gap-2 text-sm text-[var(--text-secondary)]">
                                                    <Package className="h-4 w-4" />
                                                    {latestReport.company.product}
                                                </div>
                                            </div>
                                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed line-clamp-3">
                                                {latestReport.executive_summary}
                                            </p>
                                        </div>

                                        <Button
                                            variant="primary"
                                            className="w-full sm:w-auto"
                                            onClick={() => {
                                                const historyId = history.find(h => h.company_name === latestReport?.company.name)?.id
                                                if (historyId) router.push(`/report/${historyId}`)
                                                else router.push('/dashboard')
                                            }}
                                        >
                                            View Full Analysis
                                            <ChevronRight className="h-4 w-4 ml-1" />
                                        </Button>
                                    </Card>
                                </motion.div>
                            )}

                            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
                                <AnalysisForm
                                    onSubmit={handleAnalyze}
                                    isLoading={analyzing}
                                    credits={credits}
                                />
                            </motion.div>
                        </div>

                        {/* Right Column: Subscription & History */}
                        <div className="lg:col-span-2 space-y-8">
                            {/* Subscription Status Card */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.2 }}>
                                <Card className="p-6 overflow-hidden relative">
                                    <div className="flex items-center justify-between mb-6">
                                        <h2 className="text-lg font-bold text-[var(--text-primary)]">Plan & Billing</h2>
                                        <Badge variant={(status === 'active' || status === 'trialing') ? 'success' : 'neutral'} className="capitalize">
                                            {status}
                                        </Badge>
                                    </div>

                                    <div className="space-y-4 mb-6">
                                        <div className="flex justify-between items-center bg-ink-800/40 p-3 rounded-xl border border-ink-700/30">
                                            <span className="text-sm text-[var(--text-muted)]">Current Tier</span>
                                            <span className="text-sm font-bold text-gold uppercase tracking-wider">
                                                {tier.replace('_', ' ')}
                                            </span>
                                        </div>
                                        <div className="flex justify-between items-center bg-ink-800/40 p-3 rounded-xl border border-ink-700/30">
                                            <span className="text-sm text-[var(--text-muted)]">Available Credits</span>
                                            <div className="flex items-center gap-2">
                                                <Zap className="h-3 w-3 text-gold" />
                                                <span className="text-sm font-bold text-[var(--text-primary)]">{credits}</span>
                                            </div>
                                        </div>
                                    </div>

                                    {credits < 20 && (
                                        <div className="bg-warning/5 border border-warning/20 rounded-xl p-4 mb-6">
                                            <p className="text-xs text-warning leading-relaxed">
                                                <b>Low Credit Balance.</b> Each analysis costs 10 credits. Top up now to keep generating reports.
                                            </p>
                                        </div>
                                    )}

                                    <Button
                                        variant="ghost"
                                        className="w-full flex items-center justify-center gap-2 border-gold/30 text-gold hover:bg-gold/10"
                                        onClick={() => router.push('/pricing')}
                                    >
                                        <CreditCard className="h-4 w-4" />
                                        Manage Subscription
                                    </Button>
                                </Card>
                            </motion.div>

                            {/* Analysis History */}
                            <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.3 }}>
                                <Card className="p-6">
                                    <h2 className="text-lg font-bold text-[var(--text-primary)] mb-6 flex items-center gap-2">
                                        <Clock className="h-4 w-4 text-[var(--text-muted)]" />
                                        Recent Reports
                                    </h2>

                                    {usageLoading ? (
                                        <div className="flex justify-center py-8">
                                            <Spinner />
                                        </div>
                                    ) : history.length === 0 ? (
                                        <div className="text-center py-10 opacity-50">
                                            <p className="text-sm">No analysis history found.</p>
                                        </div>
                                    ) : (
                                        <div className="space-y-3">
                                            {history.map((record) => (
                                                <button
                                                    key={record.id}
                                                    onClick={() => router.push(`/report/${record.id}`)}
                                                    className="w-full text-left p-4 rounded-xl bg-ink-800/30 border border-ink-700/30 hover:border-gold/30 hover:bg-ink-800/50 transition-all group"
                                                >
                                                    <div className="flex items-center justify-between">
                                                        <div className="min-w-0 pr-4">
                                                            <h3 className="font-bold text-sm text-[var(--text-primary)] truncate group-hover:text-gold transition-colors">
                                                                {record.company_name}
                                                            </h3>
                                                            <p className="text-[10px] text-[var(--text-muted)] mt-1 uppercase tracking-tighter">
                                                                {record.domain}
                                                            </p>
                                                        </div>
                                                        <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-gold shrink-0 transition-transform group-hover:translate-x-1" />
                                                    </div>
                                                </button>
                                            ))}
                                        </div>
                                    )}
                                </Card>
                            </motion.div>
                        </div>
                    </div>
                </main>
            </div>
        </>
    )
}
