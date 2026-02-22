'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Lock, ShieldCheck, Globe, Zap, Database, CreditCard } from 'lucide-react'

const badges = [
    { icon: Lock, label: 'SOC 2 Compliant', sub: 'via Supabase' },
    { icon: ShieldCheck, label: '256-bit Encryption', sub: 'End-to-end' },
    { icon: Globe, label: 'GDPR Compliant', sub: 'Data privacy' },
    { icon: Zap, label: '99.9% Uptime', sub: 'SLA guaranteed' },
    { icon: Database, label: 'No Data Training', sub: 'Your data stays yours' },
    { icon: CreditCard, label: 'Secure Payments', sub: 'Stripe powered' },
]

export function TrustBar() {
    return (
        <section className="py-20 border-t border-ink-700/30">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-12"
                >
                    <h2 className="font-display text-3xl font-bold text-[var(--text-primary)] mb-2">
                        Enterprise-Grade <span className="text-gradient-gold">Security</span>
                    </h2>
                    <p className="text-[var(--text-secondary)]">
                        Trusted by 500+ product teams worldwide
                    </p>
                </motion.div>

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                    {badges.map((badge, i) => (
                        <motion.div
                            key={badge.label}
                            initial={{ opacity: 0, y: 20 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.07 }}
                            className="flex flex-col items-center gap-2 p-5 rounded-xl bg-ink-900/60 border border-ink-700/30 hover:border-gold/20 transition-colors text-center"
                        >
                            <div className="p-2.5 rounded-xl bg-gold-muted">
                                <badge.icon className="h-5 w-5 text-gold" />
                            </div>
                            <p className="text-sm font-semibold text-[var(--text-primary)]">{badge.label}</p>
                            <p className="text-xs text-[var(--text-muted)]">{badge.sub}</p>
                        </motion.div>
                    ))}
                </div>
            </div>
        </section>
    )
}
