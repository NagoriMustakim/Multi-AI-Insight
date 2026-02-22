'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Zap, Clock } from 'lucide-react'
import { QuickWin } from '@/types'

interface QuickWinsProps {
    quickWins: QuickWin[]
}

export function QuickWins({ quickWins }: QuickWinsProps) {
    const sorted = [...quickWins].sort((a, b) => a.effort_days - b.effort_days)

    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <Zap className="h-6 w-6 text-gold" />
                Quick Wins
            </h2>
            <div className="space-y-3">
                {sorted.map((win, i) => (
                    <div
                        key={i}
                        className="bg-ink-900/60 border border-ink-700/50 rounded-xl p-5 hover:border-gold/20 transition-colors"
                    >
                        <div className="flex items-start gap-4">
                            <span className="flex items-center justify-center w-8 h-8 rounded-full bg-gold-muted text-gold font-bold text-sm shrink-0">
                                {i + 1}
                            </span>
                            <div className="flex-1">
                                <h3 className="font-semibold text-[var(--text-primary)] mb-1">{win.action}</h3>
                                <p className="text-sm text-[var(--text-secondary)] mb-3">{win.rationale}</p>
                                <div className="flex flex-wrap items-center gap-3">
                                    <Badge variant="info" size="sm">
                                        <Clock className="h-3 w-3 mr-1" />
                                        {win.effort_days} day{win.effort_days !== 1 ? 's' : ''}
                                    </Badge>
                                    <span className="text-xs text-[var(--text-muted)]">Expected: {win.expected_impact}</span>
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </section>
    )
}
