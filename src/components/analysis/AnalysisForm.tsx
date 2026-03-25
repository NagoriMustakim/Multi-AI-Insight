'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { Send, Globe, Building2, FileText, MapPin, Package, Zap, AlertCircle } from 'lucide-react'
import { Badge } from '@/components/ui/Badge'
import { CompanyInput } from '@/types'

interface AnalysisFormProps {
    onSubmit: (company: CompanyInput) => void
    isLoading: boolean
    credits?: number
}

export function AnalysisForm({ onSubmit, isLoading, credits = 0 }: AnalysisFormProps) {
    const [form, setForm] = useState<CompanyInput>({
        name: '',
        product: '',
        description: '',
        domain: '',
        market: '',
        website: '',
    })
    const [errors, setErrors] = useState<Record<string, string>>({})
    const { toast } = useToast()

    const hasEnoughCredits = credits >= 10

    const validate = (): boolean => {
        const newErrors: Record<string, string> = {}

        if (!form.name.trim()) newErrors.name = 'Company name is required'
        if (!form.product.trim()) newErrors.product = 'Product name is required'
        if (!form.description.trim()) {
            newErrors.description = 'Description is required'
        } else if (form.description.trim().length < 50) {
            newErrors.description = `Description too short (${form.description.trim().length}/50 min characters)`
        } else if (form.description.trim().length > 1000) {
            newErrors.description = 'Description too long (max 1000 characters)'
        }
        if (!form.domain.trim()) newErrors.domain = 'Industry/domain is required'
        if (!form.market.trim()) newErrors.market = 'Target market is required'

        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault()

        if (!hasEnoughCredits) {
            toast('error', 'Insufficient Credits', 'Reach out for more credits or upgrade your plan.')
            return
        }

        if (!validate()) {
            toast('error', 'Please fix the errors', 'All required fields must be filled correctly.')
            return
        }

        onSubmit(form)
    }

    return (
        <Card className="p-8 relative overflow-hidden">
            <div className="absolute top-0 right-0 p-4">
                <Badge variant="neutral" className={`border-gold/30 bg-gold/5 ${!hasEnoughCredits ? 'text-error border-error/20 bg-error/5' : 'text-gold'}`}>
                    <Zap className="h-3 w-3 mr-1" />
                    10 Credits / Analysis
                </Badge>
            </div>

            <h2 className="text-2xl font-display font-bold text-[var(--text-primary)] mb-2">
                New Market Analysis
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-8 max-w-lg">
                Input your company details below. Our AI agents will research 50+ sources to build your competitive intelligence matrix.
            </p>

            <form onSubmit={handleSubmit} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <Building2 className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                        <Input
                            label="Company Name"
                            placeholder="e.g., Acme Inc"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            error={errors.name}
                            className="pl-10 h-11"
                        />
                    </div>

                    <div className="relative">
                        <Package className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                        <Input
                            label="Product Name"
                            placeholder="e.g., AcmeAI Analytics"
                            value={form.product}
                            onChange={e => setForm(f => ({ ...f, product: e.target.value }))}
                            error={errors.product}
                            className="pl-10 h-11"
                        />
                    </div>
                </div>

                <Textarea
                    label="Description"
                    placeholder="Describe what your product does, who it's for, and what problem it solves. Be as specific as possible for better results. (min 50 characters)"
                    value={form.description}
                    onChange={e => setForm(f => ({ ...f, description: e.target.value }))}
                    error={errors.description}
                    hint={`${form.description.length}/1000 characters`}
                    rows={4}
                    className="resize-none"
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div className="relative">
                        <FileText className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                        <Input
                            label="Industry / Domain"
                            placeholder="e.g., Project Management SaaS"
                            value={form.domain}
                            onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                            error={errors.domain}
                            className="pl-10 h-11"
                        />
                    </div>

                    <div className="relative">
                        <MapPin className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                        <Input
                            label="Target Market"
                            placeholder="e.g., United States, Europe"
                            value={form.market}
                            onChange={e => setForm(f => ({ ...f, market: e.target.value }))}
                            error={errors.market}
                            className="pl-10 h-11"
                        />
                    </div>
                </div>

                {!hasEnoughCredits && (
                    <div className="flex items-start gap-3 p-4 rounded-xl bg-error/5 border border-error/20">
                        <AlertCircle className="h-5 w-5 text-error mt-0.5 shrink-0" />
                        <div className="flex-1">
                            <p className="text-sm font-bold text-error mb-1">Low Credit Balance</p>
                            <p className="text-xs text-error/80 leading-relaxed">
                                You need at least 10 credits to perform an analysis. You currently have <b>{credits}</b> credits.
                            </p>
                        </div>
                    </div>
                )}

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full mt-2 py-6 rounded-xl relative overflow-hidden group shadow-lg shadow-gold/5"
                    isLoading={isLoading}
                    disabled={isLoading || !hasEnoughCredits}
                >
                    {isLoading ? (
                        <>Analyzing Market...</>
                    ) : (
                        <>
                            <Zap className="h-4 w-4 mr-2" />
                            Run Deep Intelligence Analysis
                        </>
                    )}
                </Button>

                <p className="text-[10px] text-center text-[var(--text-muted)] uppercase tracking-widest font-bold">
                    Analysis takes 2-3 minutes to research and generate.
                </p>
            </form>
        </Card>
    )
}
