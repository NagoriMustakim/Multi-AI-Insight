'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { ExternalLink, ChevronDown, ChevronUp, Star, TrendingUp } from 'lucide-react'
import { Competitor } from '@/types'

interface CompetitorCardsProps {
    competitors: Competitor[]
}

function AIScoreCircle({ score }: { score: number }) {
    const circumference = 2 * Math.PI * 18
    const strokeDashoffset = circumference - (score / 10) * circumference

    return (
        <div className="relative w-12 h-12">
            <svg className="w-12 h-12 -rotate-90" viewBox="0 0 40 40">
                <circle cx="20" cy="20" r="18" fill="none" stroke="var(--ink-700)" strokeWidth="3" />
                <circle
                    cx="20" cy="20" r="18" fill="none"
                    stroke="var(--gold)"
                    strokeWidth="3"
                    strokeDasharray={circumference}
                    strokeDashoffset={strokeDashoffset}
                    strokeLinecap="round"
                    className="transition-all duration-1000"
                />
            </svg>
            <span className="absolute inset-0 flex items-center justify-center text-sm font-bold text-gold">
                {score}
            </span>
        </div>
    )
}

export function CompetitorCards({ competitors }: CompetitorCardsProps) {
    const [expanded, setExpanded] = useState<string | null>(null)

    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
                Competitor Deep Dive
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                {competitors.map((comp) => (
                    <Card key={comp.name} className="p-5" hover>
                        <div className="flex items-start justify-between mb-3">
                            <div>
                                <h3 className="font-semibold text-[var(--text-primary)] text-lg">{comp.name}</h3>
                                <a
                                    href={comp.website}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="text-sm text-steel hover:text-gold transition-colors flex items-center gap-1"
                                >
                                    {comp.website.replace(/https?:\/\//, '')}
                                    <ExternalLink className="h-3 w-3" />
                                </a>
                            </div>
                            <AIScoreCircle score={comp.ai_intelligence_score} />
                        </div>

                        <p className="text-sm text-[var(--text-secondary)] mb-3">{comp.description}</p>

                        <div className="flex flex-wrap gap-2 mb-3">
                            <Badge variant="neutral" size="sm">
                                {comp.market_share_estimate}
                            </Badge>
                            <Badge variant="info" size="sm">
                                <Star className="h-3 w-3 mr-1" />
                                AI Score: {comp.ai_intelligence_score}/10
                            </Badge>
                        </div>

                        <button
                            onClick={() => setExpanded(expanded === comp.name ? null : comp.name)}
                            className="flex items-center gap-1 text-sm text-gold hover:text-gold/80 transition-colors"
                        >
                            {expanded === comp.name ? 'Show less' : 'Show details'}
                            {expanded === comp.name ? <ChevronUp className="h-3 w-3" /> : <ChevronDown className="h-3 w-3" />}
                        </button>

                        <AnimatePresence>
                            {expanded === comp.name && (
                                <motion.div
                                    initial={{ height: 0, opacity: 0 }}
                                    animate={{ height: 'auto', opacity: 1 }}
                                    exit={{ height: 0, opacity: 0 }}
                                    transition={{ duration: 0.2 }}
                                    className="overflow-hidden"
                                >
                                    <div className="mt-4 space-y-4 pt-4 border-t border-ink-700/30">
                                        {/* Strengths */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gold mb-2">Key Strengths</h4>
                                            <ul className="space-y-1">
                                                {comp.strengths.map((s, i) => (
                                                    <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                                        <span className="text-gold mt-1">•</span>{s}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>

                                        {/* Features */}
                                        <div>
                                            <h4 className="text-sm font-medium text-steel mb-2">Features</h4>
                                            <div className="flex flex-wrap gap-1.5">
                                                {comp.features.map((f, i) => (
                                                    <Badge key={i} variant="neutral" size="sm">{f}</Badge>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Pricing */}
                                        <div>
                                            <h4 className="text-sm font-medium text-gold mb-1">Pricing</h4>
                                            <p className="text-sm text-[var(--text-secondary)]">{comp.pricing}</p>
                                        </div>

                                        {/* Reviews */}
                                        <div>
                                            <h4 className="text-sm font-medium text-steel mb-1">Customer Reviews</h4>
                                            <p className="text-sm text-[var(--text-secondary)] italic">{comp.customer_reviews_summary}</p>
                                        </div>

                                        {/* Growth Signals */}
                                        {comp.growth_signals.length > 0 && (
                                            <div>
                                                <h4 className="text-sm font-medium text-gold mb-2 flex items-center gap-1">
                                                    <TrendingUp className="h-3.5 w-3.5" /> Growth Signals
                                                </h4>
                                                <ul className="space-y-1">
                                                    {comp.growth_signals.map((g, i) => (
                                                        <li key={i} className="text-sm text-[var(--text-secondary)] flex items-start gap-2">
                                                            <span className="text-success mt-1">↗</span>{g}
                                                        </li>
                                                    ))}
                                                </ul>
                                            </div>
                                        )}
                                    </div>
                                </motion.div>
                            )}
                        </AnimatePresence>
                    </Card>
                ))}
            </div>
        </section>
    )
}
