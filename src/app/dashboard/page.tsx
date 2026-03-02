'use client'

import React, { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { Crosshair, LogOut, Clock, ChevronRight, BarChart3, ShieldAlert, Linkedin, Mail, Phone } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Spinner } from '@/components/ui/Spinner'
import { AnalysisForm } from '@/components/analysis/AnalysisForm'
import { LoadingAnalysis } from '@/components/analysis/LoadingAnalysis'
import { CompanyInput, CompetitorReport, UsageRecord } from '@/types'


export default function DashboardPage() {
    const router = useRouter()
    const { user, token, isAuthenticated, isLoading: authLoading, logout } = useAuth()
    const { toast } = useToast()

    const [history, setHistory] = useState<UsageRecord[]>([])
    const [usageLoading, setUsageLoading] = useState(true)
    const [analyzing, setAnalyzing] = useState(false)
    const [currentStep, setCurrentStep] = useState('')
    const [currentMessage, setCurrentMessage] = useState('')
    const [accountInactive, setAccountInactive] = useState(false)

    // Check auth
    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/')
        }
    }, [authLoading, isAuthenticated, router])

    // Fetch usage data
    const fetchUsage = useCallback(async () => {
        if (!token) return
        try {
            const res = await fetch('/api/usage', {
                headers: { Authorization: `Bearer ${token}` },
            })
            const data = await res.json()
            if (data.success) {
                setHistory(data.data.history || [])
                // ── Show contact card immediately if account is not yet activated ──
                if (!data.data.isActive) {
                    setAccountInactive(true)
                }
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
                if (errorData.code === 'ACCOUNT_INACTIVE') {
                    setAccountInactive(true)
                    setAnalyzing(false)
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
                                toast('success', 'Analysis complete!', 'Your competitive intelligence report is ready.')
                                // Refresh usage
                                await fetchUsage()
                                // Navigate to report view — use the latest history entry  
                                router.push('/dashboard')
                                // Store report in sessionStorage for immediate viewing
                                sessionStorage.setItem('latest_report', JSON.stringify(event.report))
                                sessionStorage.setItem('latest_company', JSON.stringify(company))
                                window.location.reload()
                            } else if (event.type === 'error') {
                                throw new Error(event.error)
                            }
                        } catch (parseError) {
                            // Ignore parse errors from partial data
                            if (parseError instanceof Error && parseError.message !== 'Analysis failed') {
                                // Only throw actual analysis errors
                                if (!parseError.message.includes('JSON')) {
                                    throw parseError
                                }
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
                            <div className="p-1.5 rounded-lg bg-gold-muted">
                                <Crosshair className="h-4 w-4 text-gold" />
                            </div>
                            <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                                CompetitorGap AI
                            </span>
                        </a>

                        <div className="flex items-center gap-4">
                            <span className="text-sm text-[var(--text-secondary)] hidden sm:block">
                                {user?.email}
                            </span>
                            <Button variant="ghost" size="sm" onClick={logout}>
                                <LogOut className="h-4 w-4" />
                                Sign out
                            </Button>
                        </div>
                    </div>
                </header>

                {/* Main Content */}
                <main className="max-w-7xl mx-auto px-6 py-8">
                    <div className="grid lg:grid-cols-5 gap-8">
                        {/* Left: Form */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="lg:col-span-3"
                        >
                            {usageLoading ? (
                                <Card className="p-8 flex items-center justify-center min-h-[400px]">
                                    <Spinner size="lg" />
                                </Card>
                            ) : accountInactive ? (
                                <motion.div
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                >
                                    <Card className="p-8">
                                        <div className="text-center mb-8">
                                            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-warning/10 border border-warning/20 mb-4">
                                                <ShieldAlert className="h-8 w-8 text-warning" />
                                            </div>
                                            <h2 className="text-xl font-bold text-[var(--text-primary)] mb-3">
                                                Account Pending Activation
                                            </h2>
                                            <p className="text-[var(--text-secondary)] text-sm leading-relaxed max-w-sm mx-auto">
                                                To prevent spam and ensure quality, new accounts need manual activation.
                                                Contact the founder to get your account activated — it only takes a minute.
                                            </p>
                                        </div>

                                        <div className="space-y-3">
                                            <a
                                                href="https://www.linkedin.com/in/mustakimnagori"
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="flex items-center gap-3 p-4 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/20 hover:bg-[#0A66C2]/20 transition-colors group w-full"
                                            >
                                                <div className="p-2.5 rounded-xl bg-[#0A66C2]/20">
                                                    <Linkedin className="h-5 w-5 text-[#0A66C2]" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-[#4fa3e0] transition-colors">
                                                        Message on LinkedIn
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]">linkedin.com/in/mustakimnagori</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#4fa3e0]" />
                                            </a>

                                            <a
                                                href={`mailto:mustakimnagori076@gmail.com?subject=Account Activation Request&body=Hi, please activate my CompetitorGap AI account. My email: ${user?.email}`}
                                                className="flex items-center gap-3 p-4 rounded-xl bg-gold-muted border border-gold/20 hover:border-gold/40 transition-colors group w-full"
                                            >
                                                <div className="p-2.5 rounded-xl bg-gold/10">
                                                    <Mail className="h-5 w-5 text-gold" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-gold transition-colors">
                                                        Send Activation Email
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]">mustakimnagori076@gmail.com</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-gold" />
                                            </a>

                                            <a
                                                href="tel:+919313067765"
                                                className="flex items-center gap-3 p-4 rounded-xl bg-ink-800 border border-ink-700/30 hover:border-gold/20 transition-colors group w-full"
                                            >
                                                <div className="p-2.5 rounded-xl bg-ink-700/50">
                                                    <Phone className="h-5 w-5 text-[var(--text-muted)] group-hover:text-gold transition-colors" />
                                                </div>
                                                <div className="flex-1 text-left">
                                                    <p className="text-sm font-semibold text-[var(--text-primary)] group-hover:text-gold transition-colors">
                                                        Direct Call / WhatsApp
                                                    </p>
                                                    <p className="text-xs text-[var(--text-muted)]">+91 9313067765</p>
                                                </div>
                                                <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-gold" />
                                            </a>
                                        </div>

                                        <p className="text-xs text-center text-[var(--text-muted)] mt-6">
                                            Mention your email: <span className="text-gold font-mono">{user?.email}</span>
                                        </p>
                                    </Card>
                                </motion.div>
                            ) : latestReport ? (
                                <Card className="p-6">
                                    <div className="flex items-center gap-3 mb-6">
                                        <BarChart3 className="h-5 w-5 text-gold" />
                                        <h2 className="text-xl font-semibold text-[var(--text-primary)]">
                                            Your Latest Report
                                        </h2>
                                    </div>
                                    <div className="bg-ink-800/60 rounded-xl p-4 mb-4">
                                        <h3 className="font-semibold text-[var(--text-primary)] mb-2">
                                            {latestReport.company.name} — Competitive Intelligence
                                        </h3>
                                        <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                            {latestReport.executive_summary}
                                        </p>
                                    </div>

                                    <Button
                                        variant="primary"
                                        onClick={() => {
                                            const historyId = history.length > 0 ? history[0].id : null
                                            if (historyId) {
                                                router.push(`/report/${historyId}`)
                                            }
                                        }}
                                    >
                                        View Full Report
                                        <ChevronRight className="h-4 w-4" />
                                    </Button>
                                </Card>
                            ) : (
                                <AnalysisForm
                                    onSubmit={handleAnalyze}
                                    isLoading={analyzing}
                                />
                            )}
                        </motion.div>

                        {/* Right: History */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="lg:col-span-2"
                        >
                            <Card className="p-6">
                                <h2 className="text-lg font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                    <Clock className="h-5 w-5 text-steel" />
                                    Analysis History
                                </h2>

                                {usageLoading ? (
                                    <div className="flex justify-center py-8">
                                        <Spinner />
                                    </div>
                                ) : history.length === 0 ? (
                                    <p className="text-[var(--text-muted)] text-sm py-8 text-center">
                                        No analyses yet. Run your first one!
                                    </p>
                                ) : (
                                    <div className="space-y-3">
                                        {history.map(record => (
                                            <button
                                                key={record.id}
                                                onClick={() => router.push(`/report/${record.id}`)}
                                                className="w-full text-left p-4 rounded-xl bg-ink-800/40 border border-ink-700/30 hover:border-gold/20 hover:bg-ink-800/60 transition-all group"
                                            >
                                                <div className="flex items-center justify-between">
                                                    <div>
                                                        <h3 className="font-medium text-[var(--text-primary)] group-hover:text-gold transition-colors">
                                                            {record.company_name}
                                                        </h3>
                                                        <p className="text-xs text-[var(--text-muted)] mt-0.5">
                                                            {record.domain} · {record.market}
                                                        </p>
                                                    </div>
                                                    <div className="flex items-center gap-2">
                                                        <span className="text-xs text-[var(--text-muted)]">
                                                            {new Date(record.created_at).toLocaleDateString()}
                                                        </span>
                                                        <ChevronRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-gold transition-colors" />
                                                    </div>
                                                </div>
                                            </button>
                                        ))}
                                    </div>
                                )}
                            </Card>
                        </motion.div>
                    </div>
                </main >
            </div >
        </>
    )
}
