'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

const faqs = [
    {
        q: 'How accurate is the AI analysis?',
        a: "Our multi-agent system combines real-time web research across 50+ sources with advanced strategic reasoning. Our confidence scores average 85%, and every insight is backed by cited evidence. You can trace every claim back to its source.",
    },
    {
        q: "What if my competitors aren't well-known?",
        a: "Our AI researches based on your domain and market description — it actively discovers competitors even if you don't know who they are yet. Give it your industry context and it will find the players.",
    },
    {
        q: 'How is this different from manually Googling competitors?',
        a: "You'd need 8+ hours to visit every site, read hundreds of reviews, analyze pricing, identify feature gaps, and write a report. Our AI pipeline does all of this simultaneously in under 3 minutes, with deeper pattern recognition than any human analyst.",
    },
    {
        q: 'Can I run analyses for multiple products?',
        a: "Free tier: 1 analysis to experience the full platform. Pro tier (coming soon): unlimited analyses for all your products and clients, with history and team sharing.",
    },
    {
        q: 'Do you store my data?',
        a: "Your company info and reports are stored securely with 256-bit encryption. We never share your data with third parties or use it to train AI models. You own your data and can request deletion at any time.",
    },
    {
        q: "What if I disagree with the AI's assessment?",
        a: "The AI provides evidence-based insights with sources for every claim. You maintain full strategic control — treat it as a research assistant, not a decision-maker. The confidence score tells you how reliable each analysis is.",
    },
    {
        q: 'Can I export the report?',
        a: 'Yes — use your browser print function (Ctrl+P / Cmd+P) to save as PDF. The report is print-optimized. Native PDF download is planned for the Pro tier.',
    },
    {
        q: 'Is there a limit on company size or industry?',
        a: 'No. The system works for pre-launch startups to enterprise products, across any B2B or B2C market globally. The AI adapts its research approach based on your specific domain.',
    },
]

function FAQItem({ q, a, i }: { q: string; a: string; i: number }) {
    const [open, setOpen] = useState(false)
    return (
        <motion.div
            initial={{ opacity: 0, y: 10 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.05 }}
            className="border border-ink-700/50 rounded-xl overflow-hidden"
        >
            <button
                onClick={() => setOpen(!open)}
                className="w-full flex items-center justify-between gap-4 p-5 text-left hover:bg-ink-800/30 transition-colors"
            >
                <span className="font-medium text-[var(--text-primary)]">{q}</span>
                <motion.div animate={{ rotate: open ? 180 : 0 }} transition={{ duration: 0.2 }}>
                    <ChevronDown className="h-5 w-5 text-[var(--text-muted)] shrink-0" />
                </motion.div>
            </button>
            <AnimatePresence>
                {open && (
                    <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: 'auto', opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        transition={{ duration: 0.2 }}
                    >
                        <p className="px-5 pb-5 text-sm text-[var(--text-secondary)] leading-relaxed border-t border-ink-700/30 pt-4">
                            {a}
                        </p>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    )
}

export function FAQSection() {
    return (
        <section className="py-24 border-t border-ink-700/30">
            <div className="max-w-3xl mx-auto px-6">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="text-center mb-16"
                >
                    <h2 className="font-display text-4xl font-bold text-[var(--text-primary)] mb-4">
                        Questions? <span className="text-gradient-gold">We&apos;ve Got Answers.</span>
                    </h2>
                </motion.div>
                <div className="space-y-3">
                    {faqs.map((faq, i) => (
                        <FAQItem key={i} q={faq.q} a={faq.a} i={i} />
                    ))}
                </div>
            </div>
        </section>
    )
}
