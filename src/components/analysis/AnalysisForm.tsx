'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Button } from '@/components/ui/Button'
import { Input, Textarea } from '@/components/ui/Input'
import { Card } from '@/components/ui/Card'
import { useToast } from '@/components/ui/Toast'
import { Send, Globe, Building2, FileText, MapPin, Package, AlertTriangle } from 'lucide-react'
import { CompanyInput } from '@/types'

interface AnalysisFormProps {
    onSubmit: (company: CompanyInput) => void
    hasUsedFree: boolean
    isLoading: boolean
}

export function AnalysisForm({ onSubmit, hasUsedFree, isLoading }: AnalysisFormProps) {
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

        if (!validate()) {
            toast('error', 'Please fix the errors', 'All required fields must be filled correctly.')
            return
        }

        onSubmit(form)
    }

    if (hasUsedFree) {
        return (
            <Card className="p-8">
                <div className="text-center">
                    <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-warning/10 border border-warning/20 mb-4">
                        <AlertTriangle className="h-8 w-8 text-warning" />
                    </div>
                    <h3 className="text-xl font-semibold text-[var(--text-primary)] mb-2">
                        Free Analysis Used
                    </h3>
                    <p className="text-[var(--text-secondary)] mb-6">
                        You&apos;ve used your free analysis. Upgrade to Pro for unlimited competitive intelligence reports.
                    </p>
                    <Button variant="primary" size="lg" disabled>
                        Pro — Coming Soon
                    </Button>
                </div>
            </Card>
        )
    }

    return (
        <Card className="p-6">
            <h2 className="text-xl font-semibold text-[var(--text-primary)] mb-1">
                Run Your Analysis
            </h2>
            <p className="text-sm text-[var(--text-muted)] mb-6">
                Tell us about your company and we&apos;ll analyze your competitive landscape.
            </p>

            <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <Building2 className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                        <Input
                            label="Company Name"
                            placeholder="e.g., Acme Inc"
                            value={form.name}
                            onChange={e => setForm(f => ({ ...f, name: e.target.value }))}
                            error={errors.name}
                            className="pl-10"
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
                            className="pl-10"
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
                />

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="relative">
                        <FileText className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                        <Input
                            label="Industry / Domain"
                            placeholder="e.g., Project Management SaaS"
                            value={form.domain}
                            onChange={e => setForm(f => ({ ...f, domain: e.target.value }))}
                            error={errors.domain}
                            className="pl-10"
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
                            className="pl-10"
                        />
                    </div>
                </div>

                <div className="relative">
                    <Globe className="absolute left-3 top-[38px] h-4 w-4 text-[var(--text-muted)] z-10" />
                    <Input
                        label="Website (optional)"
                        placeholder="https://yourcompany.com"
                        value={form.website}
                        onChange={e => setForm(f => ({ ...f, website: e.target.value }))}
                        className="pl-10"
                    />
                </div>

                <Button
                    type="submit"
                    variant="primary"
                    size="lg"
                    className="w-full mt-2"
                    isLoading={isLoading}
                    disabled={isLoading}
                >
                    <Send className="h-4 w-4" />
                    Run Free Analysis
                </Button>

                <p className="text-xs text-center text-[var(--text-muted)]">
                    Analysis takes 2-3 minutes. You get 1 free analysis.
                </p>
            </form>
        </Card>
    )
}
