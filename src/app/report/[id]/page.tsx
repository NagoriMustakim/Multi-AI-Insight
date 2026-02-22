'use client'

import React, { useEffect, useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { ArrowLeft, Crosshair } from 'lucide-react'
import { useAuth } from '@/hooks/useAuth'
import { Button } from '@/components/ui/Button'
import { Spinner } from '@/components/ui/Spinner'
import { useToast } from '@/components/ui/Toast'
import { CompetitorReport } from '@/types'

import { ReportHeader } from '@/components/report/ReportHeader'
import { ExecutiveSummary } from '@/components/report/ExecutiveSummary'
import { CompetitorCards } from '@/components/report/CompetitorCards'
import { FeatureGapTable } from '@/components/report/FeatureGapTable'
import { OpportunityMatrix } from '@/components/report/OpportunityMatrix'
import { PositioningRadar } from '@/components/report/PositioningRadar'
import { QuickWins } from '@/components/report/QuickWins'
import { RecommendedActions } from '@/components/report/RecommendedActions'
import { PricingIntelligence } from '@/components/report/PricingIntelligence'
import { AIAdoptionAnalysis } from '@/components/report/AIAdoptionAnalysis'

export default function ReportPage() {
    const params = useParams()
    const router = useRouter()
    const { token, isAuthenticated, isLoading: authLoading } = useAuth()
    const { toast } = useToast()
    const [report, setReport] = useState<CompetitorReport | null>(null)
    const [loading, setLoading] = useState(true)

    const id = params.id as string

    useEffect(() => {
        if (!authLoading && !isAuthenticated) {
            router.push('/')
            return
        }

        if (!token) return

        // Try sessionStorage first (immediate viewing after analysis)
        const stored = sessionStorage.getItem('latest_report')
        if (stored) {
            try {
                setReport(JSON.parse(stored))
                setLoading(false)
                sessionStorage.removeItem('latest_report')
                return
            } catch { /* ignore */ }
        }

        // Fetch from API
        async function fetchReport() {
            try {
                const res = await fetch(`/api/usage`, {
                    headers: { Authorization: `Bearer ${token}` },
                })
                const data = await res.json()
                if (data.success && data.data.history) {
                    const record = data.data.history.find(
                        (h: { id: string }) => h.id === id
                    )
                    if (record) {
                        // Need to fetch with report_data — for now, use the usage endpoint
                        // The history endpoint doesn't include report_data; we need a separate fetch
                        const detailRes = await fetch(`/api/usage?reportId=${id}`, {
                            headers: { Authorization: `Bearer ${token}` },
                        })
                        const detailData = await detailRes.json()
                        if (detailData.success && detailData.data.report) {
                            setReport(detailData.data.report)
                        }
                    }
                }
            } catch {
                toast('error', 'Failed to load report')
            } finally {
                setLoading(false)
            }
        }

        fetchReport()
    }, [id, token, authLoading, isAuthenticated, router, toast])

    if (authLoading || loading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Spinner size="lg" />
            </div>
        )
    }

    if (!report) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        Report Not Found
                    </h2>
                    <p className="text-[var(--text-secondary)] mb-4">
                        This report may have been deleted or you don&apos;t have access.
                    </p>
                    <Button variant="primary" onClick={() => router.push('/dashboard')}>
                        Back to Dashboard
                    </Button>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-ink-950">
            {/* Header */}
            <header className="border-b border-ink-700/50 bg-ink-900/60 backdrop-blur-sm sticky top-0 z-40 no-print">
                <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
                    <a href="/" className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-gold-muted">
                            <Crosshair className="h-4 w-4 text-gold" />
                        </div>
                        <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                            CompetitorGap AI
                        </span>
                    </a>
                    <Button variant="ghost" size="sm" onClick={() => router.push('/dashboard')}>
                        <ArrowLeft className="h-4 w-4" />
                        Dashboard
                    </Button>
                </div>
            </header>

            {/* Report Content */}
            <main className="max-w-5xl mx-auto px-6 py-8">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                >
                    <ReportHeader report={report} />
                    <ExecutiveSummary report={report} />
                    <CompetitorCards competitors={report.competitors} />
                    <FeatureGapTable gaps={report.feature_gaps} />
                    <OpportunityMatrix opportunities={report.market_opportunities} />
                    <PositioningRadar radar={report.positioning_radar} />
                    <QuickWins quickWins={report.quick_wins} />
                    <RecommendedActions actions={report.recommended_actions} />
                    <PricingIntelligence pricing={report.pricing_intelligence} />
                    <AIAdoptionAnalysis analysis={report.ai_adoption_analysis} />

                    {/* Data Sources */}
                    {report.data_sources && report.data_sources.length > 0 && (
                        <section className="mb-8">
                            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
                                Data Sources
                            </h2>
                            <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-4">
                                <ul className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                                    {report.data_sources.map((source, i) => (
                                        <li key={i} className="text-sm text-[var(--text-secondary)] flex items-center gap-2">
                                            <span className="w-1 h-1 rounded-full bg-gold" />
                                            {source}
                                        </li>
                                    ))}
                                </ul>
                            </div>
                        </section>
                    )}
                </motion.div>
            </main>
        </div>
    )
}
