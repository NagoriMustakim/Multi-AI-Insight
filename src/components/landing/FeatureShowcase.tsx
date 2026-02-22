'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Globe, Brain, Radar, Zap, DollarSign, Cpu } from 'lucide-react'

const features = [
    {
        icon: Globe,
        title: 'Real-Time Competitor Research',
        description: 'Perplexity AI scans 50+ live sources — G2, Capterra, Reddit, news, and pricing pages — to build a real-time competitive picture.',
        visual: '🔍 Scanning → G2 Reviews → Pricing Pages → Reddit → News → Product Hunt',
    },
    {
        icon: Brain,
        title: 'Deep AI Gap Analysis',
        description: 'Claude Opus identifies what competitors are missing — the gaps in their product, positioning, and customer experience that you can exploit.',
        visual: '🧠 Analyzing → Feature Gaps → Positioning Blind Spots → Customer Pain',
    },
    {
        icon: Radar,
        title: 'Positioning Radar',
        description: 'Visual scores across 6 dimensions — see exactly where you lead, where you lag, and where the white space exists.',
        visual: '📊 AI/Automation → Ease of Use → Value → Depth → Support → Reach',
    },
    {
        icon: Zap,
        title: 'Quick Wins Engine',
        description: 'Actionable competitive moves you can execute THIS week — prioritized by effort and expected impact.',
        visual: '⚡ Day 1: Fix pricing page → Day 3: Launch comparison → Day 5: Address gap',
    },
    {
        icon: DollarSign,
        title: 'Pricing Intelligence',
        description: 'Understand where you\'re overpriced, underpriced, or missing a pricing model competitors use.',
        visual: '💰 Market Range → Your Position → Models Used → Pricing Opportunity',
    },
    {
        icon: Cpu,
        title: 'AI Adoption Scores',
        description: 'Know which competitors are AI-powered, which are catching up, and where AI gives you an unfair advantage.',
        visual: '🤖 Competitor AI Maturity → Your Edge → Gaps → Top Opportunity',
    },
]

export function FeatureShowcase() {
    const [activeIndex, setActiveIndex] = useState(0)

    return (
        <section className="py-24 overflow-hidden">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">
                        <span className="text-gradient-gold">12 Intelligence Signals</span> in Every Report
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        Not just data — actionable competitive intelligence you can use today.
                    </p>
                </motion.div>

                <div className="grid lg:grid-cols-2 gap-12 items-start">
                    {/* Left: Feature list */}
                    <div className="space-y-2">
                        {features.map((feature, i) => (
                            <motion.button
                                key={feature.title}
                                initial={{ opacity: 0, x: -20 }}
                                whileInView={{ opacity: 1, x: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.05 }}
                                onClick={() => setActiveIndex(i)}
                                className={`
                  w-full text-left p-4 rounded-xl transition-all duration-300
                  ${activeIndex === i
                                        ? 'bg-ink-800 border border-gold/20 shadow-lg shadow-gold/5'
                                        : 'hover:bg-ink-800/40 border border-transparent'
                                    }
                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className={`
                    p-2 rounded-lg transition-colors
                    ${activeIndex === i ? 'bg-gold-muted text-gold' : 'bg-ink-800 text-[var(--text-muted)]'}
                  `}>
                                        <feature.icon className="h-5 w-5" />
                                    </div>
                                    <div>
                                        <h3 className={`font-semibold transition-colors ${activeIndex === i ? 'text-gold' : 'text-[var(--text-primary)]'}`}>
                                            {feature.title}
                                        </h3>
                                        {activeIndex === i && (
                                            <motion.p
                                                initial={{ opacity: 0, height: 0 }}
                                                animate={{ opacity: 1, height: 'auto' }}
                                                className="text-sm text-[var(--text-secondary)] mt-1.5 leading-relaxed"
                                            >
                                                {feature.description}
                                            </motion.p>
                                        )}
                                    </div>
                                </div>
                            </motion.button>
                        ))}
                    </div>

                    {/* Right: Animated Visual */}
                    <div className="lg:sticky lg:top-24">
                        <AnimatePresence mode="wait">
                            <motion.div
                                key={activeIndex}
                                initial={{ opacity: 0, y: 10 }}
                                animate={{ opacity: 1, y: 0 }}
                                exit={{ opacity: 0, y: -10 }}
                                transition={{ duration: 0.2 }}
                                className="rounded-2xl bg-ink-800/60 border border-ink-700/50 p-8 min-h-[300px] flex items-center justify-center"
                            >
                                <div className="text-center">
                                    <div className="inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-gold-muted border border-gold/20 mb-6">
                                        {React.createElement(features[activeIndex].icon, { className: 'h-10 w-10 text-gold' })}
                                    </div>
                                    <h3 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-4">
                                        {features[activeIndex].title}
                                    </h3>

                                    {/* Simulated data flow */}
                                    <div className="bg-ink-900/80 rounded-xl p-4 font-mono text-sm text-left">
                                        {features[activeIndex].visual.split(' → ').map((part, j) => (
                                            <motion.div
                                                key={j}
                                                initial={{ opacity: 0, x: -10 }}
                                                animate={{ opacity: 1, x: 0 }}
                                                transition={{ delay: j * 0.1 }}
                                                className={`py-1 ${j === 0 ? 'text-gold' : 'text-[var(--text-secondary)]'}`}
                                            >
                                                {j > 0 && <span className="text-gold/40 mr-2">→</span>}
                                                {part}
                                            </motion.div>
                                        ))}
                                    </div>
                                </div>
                            </motion.div>
                        </AnimatePresence>
                    </div>
                </div>
            </div>
        </section>
    )
}
