'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/auth/AuthModal'

type SignalType = 'funding' | 'pricing' | 'product' | 'warning' | 'gap'

interface Signal {
    id: number
    icon: string
    type: SignalType
    company: string
    message: string
    time: string
}

const SIGNALS: Omit<Signal, 'id' | 'time'>[] = [
    { icon: '🚀', type: 'funding', company: 'Acme Corp', message: 'Raised Series B ($15M) — headcount expanding' },
    { icon: '💰', type: 'pricing', company: 'BetaSoft', message: 'Changed pricing: Enterprise now $199/mo (was $299)' },
    { icon: '📱', type: 'product', company: 'Gamma Labs', message: 'Launched mobile app — extracted 47 new features' },
    { icon: '⚠️', type: 'warning', company: 'DeltaTech', message: 'Churn spike detected: 15% negative reviews this week' },
    { icon: '🎯', type: 'gap', company: 'Market Intel', message: 'Gap identified: No competitor offers real-time Slack alerts' },
    { icon: '📣', type: 'product', company: 'NovaSuite', message: 'New landing page copy: now targeting mid-market' },
    { icon: '🔥', type: 'warning', company: 'OmegaHQ', message: "G2 reviews trending: users frustrated with 'slow support'" },
    { icon: '💡', type: 'gap', company: 'Market Intel', message: 'Gap: No competitor has AI-generated onboarding flows' },
    { icon: '📊', type: 'pricing', company: 'AlphaFlow', message: 'Dropped free tier — high-intent users seeking alternatives' },
    { icon: '🏆', type: 'funding', company: 'ZetaAI', message: "Won 'Product of the Day' — traffic spike expected" },
]

const typeColors: Record<SignalType, string> = {
    funding: 'text-success',
    pricing: 'text-gold',
    product: 'text-steel',
    warning: 'text-danger',
    gap: 'text-gold',
}

function getTimeAgo(index: number) {
    const times = ['2 hours ago', '4 hours ago', '6 hours ago', '8 hours ago', '12 hours ago',
        '15 hours ago', '18 hours ago', '21 hours ago', '1 day ago', '25 hours ago']
    return times[index % times.length]
}

export function LiveFeedSection() {
    const { isAuthenticated } = useAuth()
    const [showAuth, setShowAuth] = useState(false)
    const [signals, setSignals] = useState<Signal[]>([])
    const [nextId, setNextId] = useState(0)

    // Start empty or with 1
    useEffect(() => {
        setSignals([])
        setNextId(0)
    }, [])

    // Add a new signal every 2.5s. If it reaches 10, clear it back to 0.
    useEffect(() => {
        const timer = setInterval(() => {
            setNextId(prev => {
                const signalData = SIGNALS[prev % SIGNALS.length]
                const newSignal: Signal = {
                    ...signalData,
                    id: Date.now(),
                    time: 'Just now',
                }

                setSignals(curr => {
                    // If we reached 10 signals, reset it back to 1 (acting as the 0 -> 1 loop reset)
                    if (curr.length >= 10) {
                        return [newSignal]
                    }
                    return [newSignal, ...curr]
                })

                return prev + 1
            })
        }, 2500)
        return () => clearInterval(timer)
    }, [])

    return (
        <>
            <section className="py-24 border-t border-ink-700/30" id="live-feed">
                <div className="max-w-7xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-success/10 border border-success/20 text-success text-sm font-medium mb-6">
                            <span className="w-2 h-2 rounded-full bg-success animate-pulse" />
                            Live Intelligence Feed
                        </div>
                        <h2 className="font-display text-3xl sm:text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
                            See What We&apos;re <span className="text-gradient-gold">Tracking Right Now</span>
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Our AI agents monitor competitor activity 24/7 across the web — pricing changes, product launches, funding rounds, and market gaps.
                        </p>
                    </motion.div>

                    <div className="max-w-3xl mx-auto mb-12">
                        <div className="bg-ink-900/80 border border-ink-700/50 rounded-2xl overflow-hidden">
                            {/* Terminal header */}
                            <div className="flex items-center gap-3 px-5 py-3 bg-ink-800/60 border-b border-ink-700/30">
                                <div className="flex gap-1.5 shrink-0">
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-danger/60" />
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-warning/60" />
                                    <div className="w-2 h-2 sm:w-3 sm:h-3 rounded-full bg-success/60" />
                                </div>
                                <span className="text-xs text-[var(--text-muted)] font-mono">competitive-intelligence-stream.live</span>
                                <div className="ml-auto flex items-center gap-1.5">
                                    <span className="w-1.5 h-1.5 rounded-full bg-success animate-pulse" />
                                    <span className="text-xs text-success font-mono">LIVE</span>
                                </div>
                            </div>

                            {/* Signal feed */}
                            <div className="p-4 space-y-2 min-h-[320px]">
                                <AnimatePresence>
                                    {signals.map((signal) => (
                                        <motion.div
                                            key={signal.id}
                                            initial={{ opacity: 0, y: -20, height: 0 }}
                                            animate={{ opacity: 1, y: 0, height: 'auto' }}
                                            exit={{ opacity: 0, height: 0 }}
                                            transition={{ duration: 0.3 }}
                                            className="flex items-start gap-3 p-3 rounded-xl bg-ink-800/40 border border-ink-700/20 hover:border-ink-700/50 transition-colors"
                                        >
                                            <span className="text-xl shrink-0">{signal.icon}</span>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex items-center gap-2 flex-wrap">
                                                    <span className="text-sm font-semibold text-gradient-gold shrink-0">
                                                        {signal.company}
                                                    </span>
                                                    <span className="hidden xs:inline text-sm text-[var(--text-secondary)]">—</span>
                                                    <span className="text-sm text-[var(--text-secondary)] truncate flex-1 min-w-0">{signal.message}</span>
                                                </div>
                                            </div>
                                            <span className="text-xs text-[var(--text-muted)] shrink-0 font-mono">{signal.time}</span>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                        </div>
                    </div>

                    <div className="text-center">
                        <Button
                            variant="primary"
                            size="lg"
                            onClick={() => isAuthenticated ? window.location.href = '/dashboard' : setShowAuth(true)}
                        >
                            Start Your Analysis
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                        <p className="text-sm text-[var(--text-muted)] mt-3">Advanced Multi-Agent Intelligence</p>
                    </div>
                </div>
            </section>
            <AuthModal open={showAuth} onOpenChange={setShowAuth} defaultTab="register" />
        </>
    )
}
