'use client'

import React from 'react'
import { ArrowUpRight, AlertTriangle } from 'lucide-react'
import { FeatureGaps } from '@/types'

interface FeatureGapTableProps {
    gaps: FeatureGaps
}

export function FeatureGapTable({ gaps }: FeatureGapTableProps) {
    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
                Feature Gap Analysis
            </h2>
            <div className="grid md:grid-cols-2 gap-4">
                {/* Their Gaps */}
                <div className="bg-ink-900/60 border border-success/20 rounded-2xl p-5">
                    <h3 className="font-semibold text-success mb-4 flex items-center gap-2">
                        <ArrowUpRight className="h-5 w-5" />
                        Their Gaps — Your Opportunities
                    </h3>
                    <ul className="space-y-3">
                        {gaps.their_gaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-success mt-2 shrink-0" />
                                <span className="text-sm text-[var(--text-secondary)]">{gap}</span>
                            </li>
                        ))}
                    </ul>
                </div>

                {/* Our Gaps */}
                <div className="bg-ink-900/60 border border-warning/20 rounded-2xl p-5">
                    <h3 className="font-semibold text-warning mb-4 flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5" />
                        Your Gaps — Be Aware
                    </h3>
                    <ul className="space-y-3">
                        {gaps.our_gaps.map((gap, i) => (
                            <li key={i} className="flex items-start gap-3">
                                <span className="w-1.5 h-1.5 rounded-full bg-warning mt-2 shrink-0" />
                                <span className="text-sm text-[var(--text-secondary)]">{gap}</span>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        </section>
    )
}
