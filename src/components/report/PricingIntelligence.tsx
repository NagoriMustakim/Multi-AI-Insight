'use client'

import React from 'react'
import { Badge } from '@/components/ui/Badge'
import { DollarSign, TrendingUp } from 'lucide-react'
import { PricingIntel } from '@/types'

interface PricingIntelligenceProps {
    pricing: PricingIntel
}

export function PricingIntelligence({ pricing }: PricingIntelligenceProps) {
    return (
        <section className="mb-8">
            <h2 className="font-display text-2xl font-bold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                <DollarSign className="h-6 w-6 text-gold" />
                Pricing Intelligence
            </h2>
            <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-6">
                {/* Price Range Bar */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-3">Market Price Range</h4>
                    <div className="relative h-8 bg-ink-800 rounded-full overflow-hidden">
                        <div className="absolute inset-y-0 left-[10%] right-[10%] bg-gradient-to-r from-steel/30 via-gold/30 to-steel/30 rounded-full" />
                        <div className="absolute left-[10%] top-1/2 -translate-y-1/2 -translate-x-1/2 w-3 h-3 rounded-full bg-steel shadow-lg" />
                        <div className="absolute right-[10%] top-1/2 -translate-y-1/2 translate-x-1/2 w-3 h-3 rounded-full bg-steel shadow-lg" />
                    </div>
                    <div className="flex justify-between mt-2 text-sm">
                        <span className="text-steel font-mono">{pricing.market_average_low}</span>
                        <span className="text-steel font-mono">{pricing.market_average_high}</span>
                    </div>
                </div>

                {/* Pricing Models */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-2">Pricing Models Used</h4>
                    <div className="flex flex-wrap gap-2">
                        {pricing.pricing_models_used.map((model, i) => (
                            <Badge key={i} variant="neutral" size="md">{model}</Badge>
                        ))}
                    </div>
                </div>

                {/* Your Positioning */}
                <div className="mb-6">
                    <h4 className="text-sm font-medium text-[var(--text-secondary)] mb-1">Your Positioning</h4>
                    <p className="text-sm text-[var(--text-primary)]">{pricing.your_positioning}</p>
                </div>

                {/* Pricing Opportunity */}
                <div className="p-4 bg-gold-muted border border-gold/20 rounded-xl">
                    <h4 className="text-sm font-semibold text-gold mb-1 flex items-center gap-1.5">
                        <TrendingUp className="h-4 w-4" />
                        Pricing Opportunity
                    </h4>
                    <p className="text-sm text-[var(--text-secondary)]">{pricing.pricing_opportunity}</p>
                </div>
            </div>
        </section>
    )
}
