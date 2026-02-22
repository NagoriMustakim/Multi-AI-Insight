'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { Users, Lightbulb, Shield } from 'lucide-react'
import { CompetitorReport } from '@/types'

interface ExecutiveSummaryProps {
    report: CompetitorReport
}

export function ExecutiveSummary({ report }: ExecutiveSummaryProps) {
    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4">
                Executive Summary
            </h2>
            <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-6">
                <p className="text-lg text-[var(--text-secondary)] leading-relaxed mb-6">
                    {report.executive_summary}
                </p>
                <p className="text-[var(--text-secondary)] leading-relaxed mb-6 text-sm italic border-l-2 border-gold/30 pl-4">
                    {report.market_landscape}
                </p>
                <div className="flex flex-wrap gap-4">
                    <Badge variant="info" size="md">
                        <Users className="h-3.5 w-3.5 mr-1" />
                        {report.competitors.length} Competitors Analyzed
                    </Badge>
                    <Badge variant="gold" size="md">
                        <Lightbulb className="h-3.5 w-3.5 mr-1" />
                        {report.market_opportunities.length} Opportunities Found
                    </Badge>
                    <Badge variant={report.confidence_score > 80 ? 'success' : 'warning'} size="md">
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        {report.confidence_score}% Confidence
                    </Badge>
                </div>
            </div>
        </section>
    )
}
