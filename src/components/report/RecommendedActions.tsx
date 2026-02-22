'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Target, BarChart3, Clock } from 'lucide-react'
import { RecommendedAction } from '@/types'

interface RecommendedActionsProps {
    actions: RecommendedAction[]
}

const categoryColors: Record<string, { variant: 'info' | 'success' | 'gold' | 'warning' | 'neutral'; label: string }> = {
    product: { variant: 'info', label: 'Product' },
    marketing: { variant: 'success', label: 'Marketing' },
    pricing: { variant: 'gold', label: 'Pricing' },
    technical: { variant: 'neutral', label: 'Technical' },
    positioning: { variant: 'warning', label: 'Positioning' },
}

export function RecommendedActions({ actions }: RecommendedActionsProps) {
    const sorted = [...actions].sort((a, b) => a.priority - b.priority)

    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Target className="h-6 w-6 text-gold" />
                Recommended Actions
            </h2>
            <div className="space-y-4">
                {sorted.map((action, i) => {
                    const catConfig = categoryColors[action.category] || { variant: 'neutral' as const, label: action.category }
                    const isTopPriority = action.priority === 1

                    return (
                        <div
                            key={i}
                            className={`
                bg-ink-900/60 border rounded-xl p-5
                ${isTopPriority ? 'border-gold/30 gold-glow' : 'border-ink-700/50'}
              `}
                        >
                            <div className="flex items-start gap-4">
                                <span className={`
                  flex items-center justify-center w-10 h-10 rounded-xl shrink-0 font-bold
                  ${isTopPriority
                                        ? 'bg-gold text-ink-950 text-lg'
                                        : 'bg-ink-800 text-[var(--text-secondary)]'}
                `}>
                                    #{action.priority}
                                </span>
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <Badge variant={catConfig.variant} size="sm">{catConfig.label}</Badge>
                                        {isTopPriority && <Badge variant="gold" size="sm">Top Priority</Badge>}
                                    </div>
                                    <h3 className="font-semibold text-[var(--text-primary)] mb-1.5">{action.action}</h3>
                                    <p className="text-sm text-[var(--text-secondary)] mb-3">{action.rationale}</p>
                                    <div className="flex flex-wrap items-center gap-4 text-xs text-[var(--text-muted)]">
                                        <span className="flex items-center gap-1">
                                            <BarChart3 className="h-3.5 w-3.5" />
                                            KPI: {action.kpi}
                                        </span>
                                        <span className="flex items-center gap-1">
                                            <Clock className="h-3.5 w-3.5" />
                                            {action.timeline}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    )
                })}
            </div>
        </section>
    )
}
