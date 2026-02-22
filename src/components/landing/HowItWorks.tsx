'use client'

import React, { useEffect, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import { Target, Cpu, FileText, Clock, Users, Radar, Zap, Database, Globe, Shield } from 'lucide-react'

const stats = [
    { label: 'Analysis Time', value: 3, suffix: ' min', icon: Clock },
    { label: 'Competitors Mapped', value: 4, suffix: '+', icon: Users },
    { label: 'AI Agents Running', value: 6, suffix: '', icon: Cpu },
    { label: 'First Analysis', value: 0, suffix: 'Free', icon: Zap },
]

function AnimatedCounter({ target, suffix }: { target: number; suffix: string }) {
    const [count, setCount] = useState(0)
    const ref = useRef<HTMLDivElement>(null)
    const hasAnimated = useRef(false)

    useEffect(() => {
        const observer = new IntersectionObserver(
            ([entry]) => {
                if (entry.isIntersecting && !hasAnimated.current) {
                    hasAnimated.current = true
                    if (target === 0) { setCount(0); return }
                    let start = 0
                    const increment = target / 40
                    const timer = setInterval(() => {
                        start += increment
                        if (start >= target) { setCount(target); clearInterval(timer) }
                        else setCount(Math.floor(start))
                    }, 25)
                    return () => clearInterval(timer)
                }
            },
            { threshold: 0.5 }
        )
        if (ref.current) observer.observe(ref.current)
        return () => observer.disconnect()
    }, [target])

    return (
        <div ref={ref} className="text-4xl font-bold font-display text-gradient-gold">
            {target === 0 ? suffix : `${count}${suffix}`}
        </div>
    )
}

const steps = [
    {
        icon: Target,
        title: 'Tell Us About Your Company',
        description: 'Describe your product, target market, and domain. Takes 60 seconds — no lengthy setup.',
        detail: 'Our intake form is designed to capture exactly what our AI agents need to focus their research.',
    },
    {
        icon: Globe,
        title: 'AI Agents Research in Real-Time',
        description: 'Our web research agent scans live competitor data across 50+ sources simultaneously.',
        detail: 'Pricing pages, review sites, product pages, news, job postings — all gathered in real-time.',
    },
    {
        icon: Cpu,
        title: 'Deep Analysis Engine Activates',
        description: 'Our strategic reasoning agent processes the research with advanced chain-of-thought analysis.',
        detail: 'It identifies patterns, gaps, and opportunities that would take a human analyst days to find.',
    },
    {
        icon: FileText,
        title: 'Intelligence Report Delivered',
        description: 'A full board-ready report with 11 sections, prioritized actions, and visualizations.',
        detail: 'Export-ready, shareable, and backed by real evidence from live sources.',
    },
]

export function HowItWorks() {
    return (
        <section className="py-24" id="how-it-works">
            <div className="max-w-7xl mx-auto px-6">
                {/* Stats Bar */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="grid grid-cols-2 md:grid-cols-4 gap-6 mb-24 p-8 rounded-2xl bg-ink-900/60 border border-ink-700/50"
                >
                    {stats.map((stat) => (
                        <div key={stat.label} className="text-center">
                            <stat.icon className="h-6 w-6 text-gold/50 mx-auto mb-2" />
                            <AnimatedCounter target={stat.value} suffix={stat.suffix} />
                            <p className="text-sm text-[var(--text-muted)] mt-1">{stat.label}</p>
                        </div>
                    ))}
                </motion.div>

                {/* Section Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl lg:text-5xl font-bold text-[var(--text-primary)] mb-4">
                        How Our <span className="text-gradient-gold">AI Pipeline</span> Works
                    </h2>
                    <p className="text-lg text-[var(--text-secondary)] max-w-2xl mx-auto">
                        A multi-agent system designed for depth and speed — from company details to board-ready intelligence in minutes.
                    </p>
                </motion.div>

                {/* Steps — vertical timeline on mobile, horizontal on desktop */}
                <div className="relative">
                    {/* Desktop connecting line */}
                    <div className="hidden md:block absolute top-14 left-[12.5%] right-[12.5%] h-px bg-gradient-to-r from-gold/10 via-gold/40 to-gold/10" />

                    <div className="grid md:grid-cols-4 gap-8">
                        {steps.map((step, i) => (
                            <motion.div
                                key={step.title}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.15, duration: 0.5 }}
                                className="relative text-center group"
                            >
                                <div className="relative inline-flex items-center justify-center w-20 h-20 rounded-2xl bg-ink-800 border border-gold/20 mb-6 group-hover:border-gold/50 transition-colors duration-300">
                                    <step.icon className="h-9 w-9 text-gold" />
                                    <span className="absolute -top-3 -right-3 w-7 h-7 rounded-full bg-gold text-ink-950 text-xs font-bold flex items-center justify-center shadow-lg shadow-gold/30">
                                        {i + 1}
                                    </span>
                                </div>
                                <h3 className="text-lg font-semibold text-[var(--text-primary)] mb-2">
                                    {step.title}
                                </h3>
                                <p className="text-sm text-[var(--text-secondary)] leading-relaxed mb-2">
                                    {step.description}
                                </p>
                                <p className="text-xs text-[var(--text-muted)] leading-relaxed opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                                    {step.detail}
                                </p>
                            </motion.div>
                        ))}
                    </div>
                </div>

                {/* Agent stack visual */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.3 }}
                    className="mt-20 p-8 rounded-2xl bg-ink-900/60 border border-ink-700/50"
                >
                    <h3 className="text-center text-lg font-semibold text-[var(--text-primary)] mb-8">
                        AI Infrastructure You Can Trust
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                        {[
                            { icon: Globe, label: 'Web Research Agent', desc: 'Live data from 50+ sources' },
                            { icon: Cpu, label: 'Strategic Analysis Agent', desc: 'Advanced chain-of-thought reasoning' },
                            { icon: Database, label: 'Pattern Recognition', desc: 'Cross-competitor gap detection' },
                            { icon: Shield, label: 'Evidence Validation', desc: 'Every insight backed by sources' },
                            { icon: Radar, label: 'Market Radar', desc: 'Real-time signal monitoring' },
                            { icon: Zap, label: 'Report Generator', desc: '11-section structured output' },
                        ].map((agent) => (
                            <div key={agent.label} className="flex items-start gap-3 p-4 rounded-xl bg-ink-800/40 border border-ink-700/20 hover:border-gold/20 transition-colors">
                                <div className="p-2 rounded-lg bg-gold-muted shrink-0">
                                    <agent.icon className="h-4 w-4 text-gold" />
                                </div>
                                <div>
                                    <p className="text-sm font-medium text-[var(--text-primary)]">{agent.label}</p>
                                    <p className="text-xs text-[var(--text-muted)] mt-0.5">{agent.desc}</p>
                                </div>
                            </div>
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    )
}
