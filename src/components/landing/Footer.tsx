'use client'

import React from 'react'
import { Crosshair, Linkedin, Mail } from 'lucide-react'

export function Footer() {
    return (
        <footer className="border-t border-ink-700/30 py-16">
            <div className="max-w-7xl mx-auto px-6">
                <div className="grid md:grid-cols-4 gap-10 mb-12">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-3 mb-4">
                            <div className="p-2 rounded-xl bg-gold-muted border border-gold/20">
                                <Crosshair className="h-5 w-5 text-gold" />
                            </div>
                            <span className="font-display font-bold text-xl text-[var(--text-primary)]">
                                CompetitorGap<span className="text-gold"> AI</span>
                            </span>
                        </div>
                        <p className="text-sm text-[var(--text-muted)] max-w-xs leading-relaxed mb-5">
                            AI-powered competitive intelligence for modern product teams. Understand your market in minutes, not months.
                        </p>
                        <div className="flex gap-3">
                            <a
                                href="https://www.linkedin.com/in/mustakimnagori"
                                target="_blank"
                                rel="noopener noreferrer"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-[#0A66C2]/10 border border-[#0A66C2]/20 text-sm text-[#4fa3e0] hover:bg-[#0A66C2]/20 transition-colors"
                            >
                                <Linkedin className="h-4 w-4" />
                                LinkedIn
                            </a>
                            <a
                                href="mailto:mustakimnagori076@gmail.com"
                                className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gold-muted border border-gold/20 text-sm text-gold hover:border-gold/40 transition-colors"
                            >
                                <Mail className="h-4 w-4" />
                                Email
                            </a>
                        </div>
                    </div>

                    {/* Product */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Product</h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: '#how-it-works', label: 'How It Works' },
                                { href: '#live-feed', label: 'Live Intelligence' },
                                { href: '#sample-report', label: 'Sample Report' },
                                { href: '#pricing', label: 'Pricing' },
                                { href: '/dashboard', label: 'Dashboard' },
                            ].map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Legal */}
                    <div>
                        <h4 className="text-sm font-semibold text-[var(--text-primary)] mb-4">Legal</h4>
                        <ul className="space-y-2.5">
                            {[
                                { href: '/privacy', label: 'Privacy Policy' },
                                { href: '/terms', label: 'Terms of Service' },
                            ].map(link => (
                                <li key={link.label}>
                                    <a href={link.href} className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors">
                                        {link.label}
                                    </a>
                                </li>
                            ))}
                            <li>
                                <a href="mailto:mustakimnagori076@gmail.com" className="text-sm text-[var(--text-muted)] hover:text-gold transition-colors">
                                    Contact
                                </a>
                            </li>
                        </ul>
                    </div>
                </div>

                <div className="border-t border-ink-700/30 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-xs text-[var(--text-muted)]">
                        © 2026 CompetitorGap AI. Built by{' '}
                        <a
                            href="https://www.linkedin.com/in/mustakimnagori"
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-gold hover:underline"
                        >
                            Mustakim Nagori
                        </a>
                    </p>
                    <div className="flex gap-6 text-xs text-[var(--text-muted)]">
                        <a href="/privacy" className="hover:text-gold transition-colors">Privacy</a>
                        <a href="/terms" className="hover:text-gold transition-colors">Terms</a>
                    </div>
                </div>
            </div>
        </footer>
    )
}
