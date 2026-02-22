'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, CheckCircle, Lock } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/auth/AuthModal'

const reportSections = [
    'Executive Summary & Market Position',
    'Competitor Deep Dive (3-4 competitors)',
    'Feature Gap Analysis (Theirs vs Yours)',
    'Market Opportunity Matrix (Impact × Effort)',
    'Positioning Radar (6 dimensions)',
    'Quick Wins — Actions for This Week',
    'Pricing Intelligence & Strategy',
    'AI Adoption Scores & Opportunities',
]

export function SampleReport() {
    const { isAuthenticated } = useAuth()
    const [showAuth, setShowAuth] = useState(false)

    return (
        <>
            <section id="sample-report" className="py-24">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">
                            See What You&apos;ll <span className="text-gradient-gold">Unlock</span>
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Every report delivers 12+ competitive intelligence signals, formatted for immediate action.
                        </p>
                    </motion.div>

                    <div className="grid lg:grid-cols-5 gap-8 items-center">
                        {/* Report Preview (blurred) */}
                        <motion.div
                            initial={{ opacity: 0, x: -30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-3 relative rounded-2xl overflow-hidden"
                        >
                            <div className="bg-ink-800/60 border border-ink-700/50 rounded-2xl p-6 space-y-4">
                                {/* Simulated report sections - blurred */}
                                <div className="blur-[2px]">
                                    <div className="bg-ink-900/80 rounded-xl p-4 mb-4">
                                        <div className="h-4 bg-gold/20 rounded w-3/4 mb-3" />
                                        <div className="h-3 bg-ink-700 rounded w-full mb-2" />
                                        <div className="h-3 bg-ink-700 rounded w-5/6 mb-2" />
                                        <div className="h-3 bg-ink-700 rounded w-2/3" />
                                    </div>

                                    <div className="grid grid-cols-2 gap-3 mb-4">
                                        {[1, 2, 3, 4].map(i => (
                                            <div key={i} className="bg-ink-900/80 rounded-xl p-4">
                                                <div className="h-3 bg-gold/15 rounded w-2/3 mb-2" />
                                                <div className="h-2 bg-ink-700 rounded w-full mb-1" />
                                                <div className="h-2 bg-ink-700 rounded w-4/5" />
                                            </div>
                                        ))}
                                    </div>

                                    <div className="bg-ink-900/80 rounded-xl p-4">
                                        <div className="h-4 bg-steel/15 rounded w-1/2 mb-3" />
                                        <div className="flex gap-8 px-4">
                                            {[1, 2, 3, 4, 5, 6].map(i => (
                                                <div key={i} className="flex-1 flex flex-col items-center gap-1">
                                                    <div className="h-16 w-2 bg-gold/15 rounded" />
                                                    <div className="h-2 bg-ink-700 rounded w-full" />
                                                </div>
                                            ))}
                                        </div>
                                    </div>
                                </div>

                                {/* Overlay */}
                                <div className="absolute inset-0 bg-gradient-to-t from-ink-950 via-ink-950/60 to-transparent flex items-end justify-center pb-8">
                                    <div className="flex items-center gap-2 text-[var(--text-muted)]">
                                        <Lock className="h-4 w-4" />
                                        <span className="text-sm">Full report unlocked after analysis</span>
                                    </div>
                                </div>
                            </div>
                        </motion.div>

                        {/* Report Contents */}
                        <motion.div
                            initial={{ opacity: 0, x: 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-2"
                        >
                            <h3 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-6">
                                Your full report includes:
                            </h3>
                            <ul className="space-y-3 mb-8">
                                {reportSections.map((section, i) => (
                                    <motion.li
                                        key={section}
                                        initial={{ opacity: 0, x: 10 }}
                                        whileInView={{ opacity: 1, x: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="flex items-start gap-3"
                                    >
                                        <CheckCircle className="h-5 w-5 text-gold shrink-0 mt-0.5" />
                                        <span className="text-[var(--text-secondary)]">{section}</span>
                                    </motion.li>
                                ))}
                            </ul>
                            <Button
                                variant="primary"
                                size="lg"
                                onClick={() => {
                                    if (isAuthenticated) {
                                        window.location.href = '/dashboard'
                                    } else {
                                        setShowAuth(true)
                                    }
                                }}
                            >
                                Get Your Free Analysis
                                <ArrowRight className="h-4 w-4" />
                            </Button>
                        </motion.div>
                    </div>
                </div>
            </section>
            <AuthModal open={showAuth} onOpenChange={setShowAuth} defaultTab="register" />
        </>
    )
}
