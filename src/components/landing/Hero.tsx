'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { ArrowRight, Crosshair, LogIn, UserPlus } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { AuthModal } from '@/components/auth/AuthModal'

const radarLabels = [
    { label: 'Pricing Gap', angle: 30, radius: 72 },
    { label: 'Feature Blind Spot', angle: 90, radius: 85 },
    { label: 'Market Opportunity', angle: 150, radius: 68 },
    { label: 'Weak Positioning', angle: 210, radius: 78 },
    { label: 'AI Advantage', angle: 270, radius: 65 },
    { label: 'Growth Signal', angle: 330, radius: 80 },
]

function RadarVisual() {
    return (
        <div className="relative w-full max-w-[640px] aspect-square mx-auto">
            {/* Glow backdrop */}
            <div className="absolute inset-0 rounded-full bg-gold/5 blur-3xl" />

            {/* Concentric rings */}
            {[100, 75, 50, 25].map((size) => (
                <motion.div
                    key={size}
                    className="absolute rounded-full border border-gold/20"
                    style={{
                        width: `${size}%`,
                        height: `${size}%`,
                        top: `${(100 - size) / 2}%`,
                        left: `${(100 - size) / 2}%`,
                    }}
                    animate={{ opacity: [0.3, 0.6, 0.3] }}
                    transition={{ duration: 3 + size * 0.02, repeat: Infinity, delay: size * 0.01 }}
                />
            ))}

            {/* Cross lines */}
            <div className="absolute top-0 left-1/2 w-px h-full bg-gold/10" />
            <div className="absolute top-1/2 left-0 h-px w-full bg-gold/10" />
            <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(45deg, transparent 49.5%, rgba(201,168,76,0.06) 49.5%, rgba(201,168,76,0.06) 50.5%, transparent 50.5%)' }} />
            <div className="absolute top-0 left-0 w-full h-full" style={{ background: 'linear-gradient(-45deg, transparent 49.5%, rgba(201,168,76,0.06) 49.5%, rgba(201,168,76,0.06) 50.5%, transparent 50.5%)' }} />

            {/* Center dot */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 rounded-full bg-gold shadow-[0_0_20px_rgba(201,168,76,0.6)]" />
            <motion.div
                className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-12 h-12 rounded-full border border-gold/30"
                animate={{ scale: [1, 1.5, 1], opacity: [0.6, 0, 0.6] }}
                transition={{ duration: 2, repeat: Infinity }}
            />

            {/* Scan sweep */}
            <motion.div
                className="absolute top-0 left-0 w-full h-full"
                animate={{ rotate: [0, 360] }}
                transition={{ duration: 6, repeat: Infinity, ease: 'linear' }}
                style={{ transformOrigin: '50% 50%' }}
            >
                <div
                    className="absolute top-1/2 left-1/2 h-px w-1/2 origin-left"
                    style={{
                        background: 'linear-gradient(to right, rgba(201,168,76,0.6), transparent)',
                        transform: 'translateY(-50%)',
                    }}
                />
                {/* Sweep sector */}
                <div
                    className="absolute top-0 left-0 w-full h-full rounded-full"
                    style={{
                        background: 'conic-gradient(from 0deg, rgba(201,168,76,0.08) 0deg, transparent 60deg)',
                    }}
                />
            </motion.div>

            {/* Data points */}
            {radarLabels.map((item, i) => {
                const rad = (item.angle * Math.PI) / 180
                const x = 50 + (item.radius / 2) * Math.cos(rad)
                const y = 50 + (item.radius / 2) * Math.sin(rad)
                return (
                    <motion.div
                        key={item.label}
                        className="absolute"
                        style={{ left: `${x}%`, top: `${y}%` }}
                        initial={{ opacity: 0, scale: 0 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ delay: 0.6 + i * 0.2, duration: 0.5, type: 'spring' }}
                    >
                        <div className="relative -translate-x-1/2 -translate-y-1/2">
                            <motion.div
                                className="w-4 h-4 rounded-full bg-gold shadow-[0_0_12px_rgba(201,168,76,0.5)]"
                                animate={{ scale: [1, 1.3, 1] }}
                                transition={{ duration: 2, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <motion.div
                                className="absolute inset-0 rounded-full border border-gold/40"
                                animate={{ scale: [1, 2], opacity: [0.5, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.3 }}
                            />
                            <span className="absolute whitespace-nowrap text-sm text-gold font-semibold mt-3 left-1/2 -translate-x-1/2 tracking-wide drop-shadow-lg">
                                {item.label}
                            </span>
                        </div>
                    </motion.div>
                )
            })}
        </div>
    )
}

export function Hero() {
    const { isAuthenticated } = useAuth()
    const [showAuth, setShowAuth] = useState(false)
    const [authTab, setAuthTab] = useState<'login' | 'register'>('register')

    const scrollToSample = () => {
        document.getElementById('sample-report')?.scrollIntoView({ behavior: 'smooth' })
    }

    const openAuth = (tab: 'login' | 'register') => {
        setAuthTab(tab)
        setShowAuth(true)
    }

    return (
        <>
            <section className="relative min-h-screen flex flex-col overflow-hidden">
                {/* Navigation bar */}
                <nav className="w-full px-6 py-5 flex items-center justify-between max-w-7xl mx-auto">
                    <div className="flex items-center gap-3 shrink-0">
                        <div className="p-2 rounded-xl bg-gold-muted border border-gold/20">
                            <Crosshair className="h-5 w-5 text-gold" />
                        </div>
                        <span className="font-display font-bold text-lg sm:text-xl text-[var(--text-primary)]">
                            CompetitorGap<span className="text-gold"> AI</span>
                        </span>
                    </div>
                    {!isAuthenticated && (
                        <div className="flex items-center gap-2 sm:gap-3">
                            <Button variant="ghost" size="sm" onClick={() => openAuth('login')} className="px-2 sm:px-4">
                                <LogIn className="h-4 w-4" />
                                <span className="hidden xs:inline">Sign In</span>
                                <span className="xs:hidden">Login</span>
                            </Button>
                            <Button variant="primary" size="sm" onClick={() => openAuth('register')} className="px-3 sm:px-4">
                                <UserPlus className="h-4 w-4" />
                                <span className="hidden xs:inline">Get Started</span>
                                <span className="xs:hidden">Start</span>
                            </Button>
                        </div>
                    )}
                    {isAuthenticated && (
                        <Button variant="primary" size="sm" onClick={() => window.location.href = '/dashboard'}>
                            Go to Dashboard
                            <ArrowRight className="h-4 w-4" />
                        </Button>
                    )}
                </nav>

                {/* Hero content */}
                <div className="flex-1 flex items-center">
                    <div className="max-w-7xl mx-auto px-6 py-12 w-full">
                        <div className="grid lg:grid-cols-2 gap-16 items-center">
                            {/* Left: Copy */}
                            <motion.div
                                initial={{ opacity: 0, y: 30 }}
                                animate={{ opacity: 1, y: 0 }}
                                transition={{ duration: 0.7, ease: 'easeOut' }}
                            >
                                <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-gold-muted border border-gold/20 text-gold text-sm font-medium mb-8">
                                    <Crosshair className="h-4 w-4" />
                                    Multi-Agent AI Competitive Intelligence
                                </div>

                                <h1 className="font-display text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-bold leading-[1.1] mb-6">
                                    <span className="text-[var(--text-primary)]">Your Competitors</span>
                                    <br />
                                    <span className="text-[var(--text-primary)]">Are Moving.</span>
                                    <br className="sm:hidden" />
                                    <span className="text-gradient-gold">We Tell You</span>
                                    <br />
                                    <span className="text-gradient-gold">Exactly How.</span>
                                </h1>

                                <p className="text-lg text-[var(--text-secondary)] max-w-xl mb-10 leading-relaxed">
                                    Our multi-agent AI system researches your entire competitive landscape in real-time —
                                    scanning live data, identifying gaps, and delivering board-ready intelligence in under 3 minutes.
                                </p>

                                <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                    <Button
                                        variant="primary"
                                        size="lg"
                                        className="w-full sm:w-auto"
                                        onClick={() => {
                                            if (isAuthenticated) {
                                                window.location.href = '/dashboard'
                                            } else {
                                                openAuth('register')
                                            }
                                        }}
                                    >
                                        Get Started
                                        <ArrowRight className="h-4 w-4" />
                                    </Button>
                                    <Button variant="ghost" size="lg" className="w-full sm:w-auto" onClick={scrollToSample}>
                                        See Sample Report
                                    </Button>
                                </div>

                                <div className="grid grid-cols-2 lg:flex lg:flex-wrap gap-x-6 gap-y-3 text-sm text-[var(--text-muted)]">
                                    <span>✓ No setup required</span>
                                    <span>✓ Detailed AI insights</span>
                                    <span>✓ Results in 3 minutes</span>
                                    <span>✓ Board-ready intelligence</span>
                                </div>
                            </motion.div>

                            {/* Right: Large Radar Visual */}
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ delay: 0.3, duration: 1 }}
                                className="hidden lg:block"
                            >
                                <RadarVisual />
                            </motion.div>
                        </div>
                    </div>
                </div>
            </section>

            <AuthModal open={showAuth} onOpenChange={setShowAuth} defaultTab={authTab} />
        </>
    )
}
