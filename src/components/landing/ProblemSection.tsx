'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Clock, DollarSign, CalendarX, ChevronRight } from 'lucide-react'

const pains = [
    {
        icon: Clock,
        stat: '8+ hours',
        label: 'Manual research per product',
        description: 'Visiting competitor sites, reading reviews, writing summaries — for every single product update.',
        color: 'text-danger',
        bg: 'bg-danger/10 border-danger/20',
    },
    {
        icon: DollarSign,
        stat: '$5,000+',
        label: 'Cost of a McKinsey assessment',
        description: 'Enterprise-grade competitive intelligence is only for companies with big consulting budgets.',
        color: 'text-warning',
        bg: 'bg-warning/10 border-warning/20',
    },
    {
        icon: CalendarX,
        stat: '30 days',
        label: 'Before your data is outdated',
        description: "By the time you finish your analysis, competitors have already shipped the features you didn't know existed.",
        color: 'text-steel',
        bg: 'bg-steel/10 border-steel/20',
    },
]

export function ProblemSection() {
    return (
        <section className="py-24 border-t border-ink-700/30">
            <div className="max-w-7xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        How Long Did Your Last <span className="text-gradient-gold">Competitor Analysis</span> Take?
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        While you&apos;re Googling competitors, they&apos;re shipping features you didn&apos;t know existed.
                    </p>
                </motion.div>

                <div className="grid md:grid-cols-3 gap-6 mb-16">
                    {pains.map((pain, i) => (
                        <motion.div
                            key={pain.stat}
                            initial={{ opacity: 0, y: 30 }}
                            whileInView={{ opacity: 1, y: 0 }}
                            viewport={{ once: true }}
                            transition={{ delay: i * 0.1 }}
                            className={`p-8 rounded-2xl border ${pain.bg} text-center`}
                        >
                            <pain.icon className={`h-10 w-10 ${pain.color} mx-auto mb-4`} />
                            <div className={`font-display text-5xl font-bold ${pain.color} mb-2`}>
                                {pain.stat}
                            </div>
                            <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-3">
                                {pain.label}
                            </h3>
                            <p className="text-sm text-[var(--text-secondary)] leading-relaxed">
                                {pain.description}
                            </p>
                        </motion.div>
                    ))}
                </div>

                {/* Timeline visual */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="bg-ink-900/60 border border-ink-700/50 rounded-2xl p-8"
                >
                    <div className="grid md:grid-cols-2 gap-8 items-center">
                        {/* Left: Competitor timeline */}
                        <div>
                            <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <span className="text-danger">⚡</span> While you&apos;re doing manual research...
                            </h3>
                            <div className="space-y-3">
                                {[
                                    ['Day 1', 'You Google your top 3 competitors'],
                                    ['Day 3', 'Trying to understand their pricing'],
                                    ['Day 7', 'Reading G2 reviews one by one'],
                                    ['Day 14', 'Building a messy spreadsheet'],
                                    ['Day 30', 'Presenting outdated findings'],
                                ].map(([day, action]) => (
                                    <div key={day} className="flex items-start gap-3">
                                        <span className="text-xs font-mono text-danger/70 bg-danger/10 px-2 py-1 rounded shrink-0">{day}</span>
                                        <span className="text-sm text-[var(--text-secondary)]">{action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Right: CompetitorGap timeline */}
                        <div>
                            <h3 className="font-semibold text-[var(--text-primary)] mb-4 flex items-center gap-2">
                                <span className="text-success">✓</span> With CompetitorGap AI...
                            </h3>
                            <div className="space-y-3">
                                {[
                                    ['0:00', 'Enter your company details'],
                                    ['0:30', 'AI agents begin live web research'],
                                    ['1:30', 'Strategic reasoning engine activates'],
                                    ['2:30', 'Report structured and formatted'],
                                    ['3:00', '🎯 Full intelligence report is ready'],
                                ].map(([time, action]) => (
                                    <div key={time} className="flex items-start gap-3">
                                        <span className="text-xs font-mono text-success/70 bg-success/10 px-2 py-1 rounded shrink-0">{time}</span>
                                        <span className="text-sm text-[var(--text-secondary)]">{action}</span>
                                    </div>
                                ))}
                            </div>
                        </div>
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
