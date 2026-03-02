'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Sparkles, Linkedin, Mail, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/auth/AuthModal'

const contactPlan = {
    name: 'Standard Analysis',
    price: 'Contact Us',
    period: '',
    description: 'Get a deep-dive competitive intelligence report for your product.',
    features: [
        'Complete competitor mapping',
        'All 11 report sections',
        'AI positioning radar chart',
        'Quick wins & prioritized actions',
        'Feature gap analysis',
        'Market opportunity matrix',
        'Direct founder support',
    ],
}

const proPlan = {
    name: 'Pro',
    price: '$49',
    period: '/mo',
    description: 'For teams that need ongoing competitive monitoring.',
    features: [
        'Unlimited analyses',
        'All products & clients',
        'Full analysis history',
        'Team sharing & collaboration',
        'Priority AI processing',
        'PDF export',
        'Slack & email alerts',
        'API access',
    ],
}

export function PricingSection() {
    const { isAuthenticated } = useAuth()
    const [showAuth, setShowAuth] = useState(false)

    return (
        <>
            <section className="py-24 border-t border-ink-700/30" id="pricing">
                <div className="max-w-5xl mx-auto px-6">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="text-center mb-16"
                    >
                        <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
                            Simple, <span className="text-gradient-gold">Transparent</span> Pricing
                        </h2>
                        <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                            Get industry-leading competitive intelligence. Contact us to run your analysis.
                        </p>
                    </motion.div>

                    <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
                        {/* Contact/Demo Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0 }}
                        >
                            <Card goldBorder className="p-8 relative gold-glow h-full flex flex-col">
                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{contactPlan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-4xl font-bold font-display text-gradient-gold">{contactPlan.price}</span>
                                </div>
                                <p className="text-[var(--text-secondary)] mb-6">{contactPlan.description}</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {contactPlan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3">
                                            <Check className="h-4 w-4 text-gold shrink-0" />
                                            <span className="text-sm text-[var(--text-secondary)]">{f}</span>
                                        </li>
                                    ))}
                                </ul>
                                <Button
                                    variant="primary"
                                    size="lg"
                                    className="w-full"
                                    onClick={() => {
                                        document.getElementById('pricing')?.scrollIntoView({ behavior: 'smooth' })
                                        // Focus on email/call
                                    }}
                                >
                                    Contact for Analysis
                                    <ArrowRight className="h-4 w-4" />
                                </Button>
                            </Card>
                        </motion.div>

                        {/* Pro Plan */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: 0.1 }}
                        >
                            <Card className="p-8 relative h-full flex flex-col">
                                <div className="absolute top-4 right-4">
                                    <Badge variant="gold" size="sm">
                                        <Sparkles className="h-3 w-3 mr-1" />
                                        Coming Soon
                                    </Badge>
                                </div>

                                <h3 className="text-2xl font-bold text-[var(--text-primary)] mb-2">{proPlan.name}</h3>
                                <div className="flex items-baseline gap-1 mb-3">
                                    <span className="text-4xl font-bold font-display text-gradient-gold">{proPlan.price}</span>
                                    <span className="text-[var(--text-muted)]">{proPlan.period}</span>
                                </div>
                                <p className="text-[var(--text-secondary)] mb-6">{proPlan.description}</p>
                                <ul className="space-y-3 mb-8 flex-1">
                                    {proPlan.features.map(f => (
                                        <li key={f} className="flex items-center gap-3">
                                            <Check className="h-4 w-4 text-steel shrink-0" />
                                            <span className="text-sm text-[var(--text-secondary)]">{f}</span>
                                        </li>
                                    ))}
                                </ul>

                                {/* Contact section */}
                                <div className="space-y-3">
                                    <p className="text-xs text-[var(--text-muted)] text-center mb-4">
                                        Interested in Pro or Enterprise? Reach out directly:
                                    </p>
                                    <a
                                        href="https://www.linkedin.com/in/mustakimnagori"
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="flex items-center gap-3 p-3.5 rounded-xl bg-[#0A66C2]/10 border border-[#0A66C2]/30 hover:bg-[#0A66C2]/20 transition-colors group w-full"
                                    >
                                        <div className="p-2 rounded-lg bg-[#0A66C2]/20">
                                            <Linkedin className="h-4 w-4 text-[#0A66C2]" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-[#4fa3e0] transition-colors">
                                                Connect on LinkedIn
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">linkedin.com/in/mustakimnagori</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-[#4fa3e0] transition-colors" />
                                    </a>

                                    <a
                                        href="mailto:mustakimnagori076@gmail.com"
                                        className="flex items-center gap-3 p-3.5 rounded-xl bg-gold-muted border border-gold/20 hover:border-gold/40 transition-colors group w-full"
                                    >
                                        <div className="p-2 rounded-lg bg-gold/10">
                                            <Mail className="h-4 w-4 text-gold" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-gold transition-colors">
                                                Email the Founder
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">mustakimnagori076@gmail.com</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-gold transition-colors" />
                                    </a>

                                    <a
                                        href="tel:+919313067765"
                                        className="flex items-center gap-3 p-3.5 rounded-xl bg-ink-800 border border-ink-700/30 hover:border-gold/20 transition-colors group w-full"
                                    >
                                        <div className="p-2 rounded-lg bg-ink-700/50 text-[var(--text-muted)] group-hover:text-gold">
                                            <Phone className="h-4 w-4" />
                                        </div>
                                        <div className="flex-1 text-left">
                                            <p className="text-sm font-medium text-[var(--text-primary)] group-hover:text-gold transition-colors">
                                                Call or WhatsApp
                                            </p>
                                            <p className="text-xs text-[var(--text-muted)]">+91 9313067765</p>
                                        </div>
                                        <ArrowRight className="h-4 w-4 text-[var(--text-muted)] group-hover:text-gold transition-colors" />
                                    </a>
                                </div>
                            </Card>
                        </motion.div>
                    </div>
                </div>
            </section>
            <AuthModal open={showAuth} onOpenChange={setShowAuth} defaultTab="register" />
        </>
    )
}
