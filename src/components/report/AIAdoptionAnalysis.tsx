'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Cpu, Check, X, Sparkles } from 'lucide-react'
import { AIAdoptionAnalysis as AIAdoptionType } from '@/types'

interface AIAdoptionAnalysisProps {
    analysis: AIAdoptionType
}

const maturityColors: Record<string, 'warning' | 'gold' | 'success'> = {
    early: 'warning',
    growing: 'gold',
    mature: 'success',
}

export function AIAdoptionAnalysis({ analysis }: AIAdoptionAnalysisProps) {
    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Cpu className="h-6 w-6 text-gold" />
                AI Adoption Analysis
            </h2>
            <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-6">
                {/* Market Maturity */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">
                        Market AI Maturity
                    </h4>
                    <Badge
                        variant={maturityColors[analysis.overall_market_ai_maturity] || 'neutral'}
                        size="md"
                    >
                        {analysis.overall_market_ai_maturity.charAt(0).toUpperCase() +
                            analysis.overall_market_ai_maturity.slice(1)}
                    </Badge>
                </div>

                <div className="grid md:grid-cols-2 gap-6 mb-6">
                    {/* Your AI Advantages */}
                    <div>
                        <h4 className="text-sm font-medium text-success mb-3">Your AI Advantages</h4>
                        <ul className="space-y-2">
                            {analysis.your_ai_advantage.map((adv, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <Check className="h-4 w-4 text-success shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">{adv}</span>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Competitor AI Gaps */}
                    <div>
                        <h4 className="text-sm font-medium text-danger mb-3">Competitor AI Gaps</h4>
                        <ul className="space-y-2">
                            {analysis.competitors_ai_gaps.map((gap, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm">
                                    <X className="h-4 w-4 text-danger shrink-0 mt-0.5" />
                                    <span className="text-[var(--text-secondary)]">{gap}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* The Big AI Opportunity */}
                <div className="p-4 bg-gold-muted border border-gold/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-gold mb-1 flex items-center gap-1.5">
                        <Sparkles className="h-4 w-4" />
                        The Big AI Opportunity
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)]">{analysis.ai_opportunity}</p>
                </div>
            </div>
        </section>
    )
}
