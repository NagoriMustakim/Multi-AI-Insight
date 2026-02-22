'use client'

import React from 'react'
import { MarketOpportunity } from '@/types'
import { Badge } from '@/components/ui/Badge'

interface OpportunityMatrixProps {
    opportunities: MarketOpportunity[]
}

const effortMap: Record<string, number> = { low: 1, medium: 2, high: 3 }
const impactMap: Record<string, number> = { low: 1, medium: 2, high: 3 }
const timeframeColors: Record<string, string> = {
    'immediate': 'bg-success',
    '3-6 months': 'bg-gold',
    '6-12 months': 'bg-steel',
}

export function OpportunityMatrix({ opportunities }: OpportunityMatrixProps) {
    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
                Opportunity Matrix
            </h2>
            <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-6">
                {/* 2x2 Matrix */}
                <div className="relative w-full aspect-square max-w-[500px] mx-auto mb-6">
                    {/* Axes */}
                    <div className="absolute bottom-0 left-8 right-0 h-px bg-ink-700" />
                    <div className="absolute top-0 bottom-0 left-8 w-px bg-ink-700" />

                    {/* Labels */}
                    <span className="absolute -left-0 top-1/2 -translate-y-1/2 -rotate-90 text-xs text-[var(--text-muted)] font-medium">
                        IMPACT →
                    </span>
                    <span className="absolute bottom-[-20px] left-1/2 -translate-x-1/2 text-xs text-[var(--text-muted)] font-medium">
                        EFFORT →
                    </span>

                    {/* Quadrant labels */}
                    <span className="absolute top-2 left-12 text-xs text-success/60">Quick Wins</span>
                    <span className="absolute top-2 right-2 text-xs text-gold/60">Major Projects</span>
                    <span className="absolute bottom-6 left-12 text-xs text-[var(--text-muted)]/60">Low Priority</span>
                    <span className="absolute bottom-6 right-2 text-xs text-steel/60">Time Sinks</span>

                    {/* Grid lines */}
                    <div className="absolute top-0 bottom-0 left-1/2 w-px bg-ink-700/40 border-dashed" />
                    <div className="absolute left-8 right-0 top-1/2 h-px bg-ink-700/40 border-dashed" />

                    {/* Plot opportunities */}
                    {opportunities.map((opp, i) => {
                        const x = ((effortMap[opp.effort] - 0.5) / 3) * 85 + 12
                        const y = 100 - ((impactMap[opp.impact] - 0.5) / 3) * 90 - 5
                        const color = timeframeColors[opp.timeframe] || 'bg-gold'

                        return (
                            <div
                                key={i}
                                className="absolute group"
                                style={{ left: `${x}%`, top: `${y}%` }}
                            >
                                <div className={`w-4 h-4 rounded-full ${color} shadow-lg cursor-pointer transition-transform hover:scale-125 -translate-x-1/2 -translate-y-1/2`} />
                                <div className="absolute left-1/2 -translate-x-1/2 top-4 bg-ink-800 border border-ink-700 rounded-lg px-3 py-2 text-xs whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity z-10 shadow-xl">
                                    <p className="font-medium text-[var(--text-primary)]">{opp.title}</p>
                                    <p className="text-[var(--text-muted)] mt-0.5">
                                        {opp.effort} effort · {opp.impact} impact · {opp.timeframe}
                                    </p>
                                </div>
                            </div>
                        )
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap justify-center gap-4 text-xs text-[var(--text-muted)]">
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-success" /> Immediate
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-gold" /> 3-6 months
                    </span>
                    <span className="flex items-center gap-1.5">
                        <span className="w-2.5 h-2.5 rounded-full bg-steel" /> 6-12 months
                    </span>
                </div>

                {/* Opportunity List */}
                <div className="mt-6 space-y-3">
                    {opportunities
                        .sort((a, b) => b.priority_score - a.priority_score)
                        .map((opp, i) => (
                            <div key={i} className="p-3 bg-ink-800/40 rounded-xl border border-ink-700/30">
                                <div className="flex items-start justify-between gap-4">
                                    <div>
                                        <h4 className="font-medium text-[var(--text-primary)] text-sm">{opp.title}</h4>
                                        <p className="text-xs text-[var(--text-secondary)] mt-1">{opp.description}</p>
                                    </div>
                                    <Badge variant="gold" size="sm">{opp.priority_score}</Badge>
                                </div>
                                <div className="flex gap-2 mt-2">
                                    <Badge variant={opp.effort === 'low' ? 'success' : opp.effort === 'medium' ? 'warning' : 'danger'} size="sm">
                                        {opp.effort} effort
                                    </Badge>
                                    <Badge variant={opp.impact === 'high' ? 'success' : opp.impact === 'medium' ? 'warning' : 'neutral'} size="sm">
                                        {opp.impact} impact
                                    </Badge>
                                    <Badge variant="info" size="sm">{opp.timeframe}</Badge>
                                </div>
                            </div>
                        ))}
                </div>
            </div>
        </section>
    )
}
