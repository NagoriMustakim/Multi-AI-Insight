'use client'

import React from 'react'
import { Calendar, Globe, MapPin, Share2, Printer, Shield } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { Button } from '@/components/ui/Button'
import { CompetitorReport } from '@/types'
import { useToast } from '@/components/ui/Toast'

interface ReportHeaderProps {
    report: CompetitorReport
}

export function ReportHeader({ report }: ReportHeaderProps) {
    const { toast } = useToast()

    const confidenceVariant = report.confidence_score > 80 ? 'success'
        : report.confidence_score >= 65 ? 'warning' : 'danger'

    const handleShare = async () => {
        try {
            await navigator.clipboard.writeText(window.location.href)
            toast('success', 'Link copied!', 'Share this URL to give access to this report.')
        } catch {
            toast('error', 'Failed to copy link')
        }
    }

    return (
        <div className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-6 mb-8">
            <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
                <div>
                    <h1 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-2">
                        {report.company.name}
                    </h1>
                    <p className="text-lg text-gold mb-3">{report.company.product}</p>
                    <div className="flex flex-wrap items-center gap-4 text-sm text-[var(--text-secondary)]">
                        <span className="flex items-center gap-1.5">
                            <Globe className="h-4 w-4" />
                            {report.company.domain}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <MapPin className="h-4 w-4" />
                            {report.company.market}
                        </span>
                        <span className="flex items-center gap-1.5">
                            <Calendar className="h-4 w-4" />
                            {new Date(report.generated_at).toLocaleDateString('en-US', {
                                year: 'numeric', month: 'long', day: 'numeric'
                            })}
                        </span>
                    </div>
                </div>

                <div className="flex items-center gap-3">
                    <Badge variant={confidenceVariant} size="md">
                        <Shield className="h-3.5 w-3.5 mr-1" />
                        {report.confidence_score}% confidence
                    </Badge>
                    <Button variant="ghost" size="sm" onClick={handleShare} className="no-print">
                        <Share2 className="h-4 w-4" />
                    </Button>
                    <Button variant="ghost" size="sm" onClick={() => window.print()} className="no-print">
                        <Printer className="h-4 w-4" />
                    </Button>
                </div>
            </div>
        </div>
    )
}
