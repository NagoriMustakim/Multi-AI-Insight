'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Check, ArrowRight, Zap, Sparkles } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useRouter } from 'next/navigation'

const plans = [
    {
        name: 'Indie',
        price: '15',
        description: 'Perfect for solo founders validating a niche.',
        credits: '20 Credits/mo',
        features: [
            '2 Deep Reports',
            'Full Competitive Matrix',
            'Feature Gap Analysis',
            '1 Month Rollover',
        ],
    },
    {
        name: 'Growth',
        price: '29',
        description: 'For SaaS startups tracking their market.',
        credits: '50 Credits/mo',
        popular: true,
        features: [
            '5 Deep Reports',
            'Advanced Market Insights',
            '7-Day Free Trial',
            '3 Month Rollover',
            'Priority Support',
        ],
    },
    {
        name: 'Scale',
        price: '79',
        description: 'For agencies handling multiple clients.',
        credits: '150 Credits/mo',
        features: [
            '15 Deep Reports',
            'Agency Reporting Mode',
            '6 Month Rollover',
            'Dedicated Manager',
        ],
    },
]

export function PricingSection() {
    const router = useRouter()

    return (
        <section id="pricing" className="py-24 relative overflow-hidden border-t border-ink-800/50">
            {/* Background Accents */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gold/5 blur-[120px] rounded-full -z-10" />

            <div className="max-w-7xl mx-auto px-6">
                <div className="text-center mb-16">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                    >
                        <Badge variant="neutral" className="mb-4 border-gold/30 text-gold bg-gold/5">
                            <Zap className="h-3 w-3 mr-1" />
                            Pricing
                        </Badge>
                        <h2 className="text-3xl md:text-5xl font-display font-bold mb-6 italic">
                            Plans for <span className="text-gold">Every Stage</span>
                        </h2>
                        <p className="text-[var(--text-muted)] max-w-2xl mx-auto text-lg leading-relaxed">
                            Simple, credit-based pricing. No hidden fees. Upgrade or budget your analysis needs as your market research evolves.
                        </p>
                    </motion.div>
                </div>

                <div className="grid md:grid-cols-3 gap-8 mb-16">
                    {plans.map((plan, i) => (
                        <motion.div
                            key={plan.name}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                        >
                            <Card className={`p-8 h-full flex flex-col relative transition-all duration-300 hover:border-gold/30 ${plan.popular ? 'border-gold/40 bg-ink-900/40' : 'bg-ink-900/20'}`}>
                                {plan.popular && (
                                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                                        <Badge className="bg-gold text-ink-950 font-bold border-none px-4 py-1 shadow-lg">
                                            MOST POPULAR
                                        </Badge>
                                    </div>
                                )}

                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-[var(--text-muted)] min-h-[40px] leading-relaxed">
                                        {plan.description}
                                    </p>
                                </div>

                                <div className="mb-6">
                                    <div className="flex items-baseline gap-1">
                                        <span className="text-4xl font-display font-bold text-gradient-gold">${plan.price}</span>
                                        <span className="text-[var(--text-muted)] text-sm">/mo</span>
                                    </div>
                                    <Badge className="mt-2 bg-ink-800 text-gold border-gold/10 font-mono text-[10px] uppercase tracking-wider">
                                        {plan.credits}
                                    </Badge>
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, j) => (
                                        <div key={j} className="flex items-start gap-3">
                                            <div className="mt-1 p-0.5 rounded-full bg-gold/10 border border-gold/20">
                                                <Check className="h-3 w-3 text-gold" />
                                            </div>
                                            <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    variant={plan.popular ? 'primary' : 'secondary'}
                                    className="w-full group"
                                    onClick={() => router.push('/pricing')}
                                >
                                    Get Started
                                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center"
                >
                    <div className="inline-flex items-center gap-2 p-1.5 rounded-full bg-ink-900/60 border border-ink-800 backdrop-blur-sm pr-6">
                        <div className="bg-gold/10 p-2 rounded-full">
                            <Sparkles className="h-4 w-4 text-gold" />
                        </div>
                        <span className="text-sm text-[var(--text-secondary)]">
                            Save up to 20% with annual billing. <button onClick={() => router.push('/pricing')} className="text-gold font-bold hover:underline ml-1">View Yearly Plans →</button>
                        </span>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
