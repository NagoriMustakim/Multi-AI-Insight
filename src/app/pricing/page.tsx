'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Check, Sparkles, Zap, ShieldCheck, ArrowRight, Loader2 } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'
import { AuthModal } from '@/components/auth/AuthModal'

// Plan definitions (matching src/lib/razorpay.ts)
const plans = {
    indie: {
        name: 'Indie',
        description: 'Perfect for solo founders validating a niche.',
        monthlyPrice: 15,
        yearlyPrice: 144, // $12/mo
        monthlyCredits: 20,
        reports: 2,
        rollover: '1 month',
        features: [
            '20 AI Credits per month',
            'Generates 2 Deep Reports',
            'Full Competitive Matrix',
            'Feature Gap Analysis',
            '1 Month Credit Rollover',
            'Standard AI Processing',
        ],
    },
    growth: {
        name: 'Growth',
        description: 'For SaaS startups tracking their market.',
        monthlyPrice: 29,
        yearlyPrice: 288, // $24/mo
        monthlyCredits: 50,
        reports: 5,
        rollover: '3 months',
        popular: true,
        features: [
            '50 AI Credits per month',
            'Generates 5 Deep Reports',
            'All Indie Features',
            'Advanced Market Insights',
            'Priority Support',
            '3 Month Credit Rollover',
            '7-Day Free Trial (New Users)',
        ],
    },
    scale: {
        name: 'Scale',
        description: 'For agencies handling multiple clients.',
        monthlyPrice: 79,
        yearlyPrice: 768, // $64/mo
        monthlyCredits: 150,
        reports: 15,
        rollover: '6 months',
        features: [
            '150 AI Credits per month',
            'Generates 15 Deep Reports',
            'All Growth Features',
            'Agency Reporting Mode',
            'Custom AI Personas',
            '6 Month Credit Rollover',
            'Dedicated Account Manager',
        ],
    },
}

export default function PricingPage() {
    const [isYearly, setIsYearly] = useState(true)
    const [loadingPlan, setLoadingPlan] = useState<string | null>(null)
    const [showAuth, setShowAuth] = useState(false)
    const { isAuthenticated, user, token } = useAuth()
    const { toast } = useToast()
    const router = useRouter()

    const handleSubscribe = async (tier: string) => {
        if (!isAuthenticated) {
            setShowAuth(true)
            return
        }

        setLoadingPlan(tier)
        const planKey = `${tier}_${isYearly ? 'yearly' : 'monthly'}`

        try {
            // 1. Create Subscription on backend
            const response = await fetch('/api/subscription/create', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({ planKey }),
            })

            const result = await response.json()

            if (!result.success) {
                toast('error', 'Subscription failed', result.error || 'Failed to initiate checkout.')
                setLoadingPlan(null)
                return
            }

            const { subscriptionId, razorpayKeyId, planName, amount, currency } = result.data

            // 2. Configure Razorpay Options
            const options = {
                key: razorpayKeyId,
                subscription_id: subscriptionId,
                name: 'CompetitorGap AI',
                description: `${planName} Subscription`,
                image: '/favicon.svg',
                handler: async function (response: any) {
                    // 3. Verify Payment on backend
                    try {
                        const verifyRes = await fetch('/api/subscription/verify', {
                            method: 'POST',
                            headers: {
                                'Content-Type': 'application/json',
                                Authorization: `Bearer ${token}`,
                            },
                            body: JSON.stringify({
                                razorpay_payment_id: response.razorpay_payment_id,
                                razorpay_subscription_id: response.razorpay_subscription_id,
                                razorpay_signature: response.razorpay_signature,
                            }),
                        })

                        const verifyData = await verifyRes.json()

                        if (verifyData.success) {
                            toast('success', 'Welcome aboard!', `You are now subscribed to the ${planName} plan.`)
                            router.push('/dashboard')
                        } else {
                            toast('error', 'Verification failed', verifyData.error || 'Payment verification failed.')
                        }
                    } catch (err) {
                        toast('error', 'Error', 'Failed to verify payment. Please contact support.')
                    } finally {
                        setLoadingPlan(null)
                    }
                },
                prefill: {
                    name: user?.full_name || '',
                    email: user?.email || '',
                },
                theme: {
                    color: '#D4AF37', // Gold
                },
                modal: {
                    ondismiss: function () {
                        setLoadingPlan(null)
                    }
                }
            }

            // 4. Open Razorpay Checktout
            const rzp = new (window as any).Razorpay(options)
            rzp.on('payment.failed', function (response: any) {
                toast('error', 'Payment failed', response.error.description)
                setLoadingPlan(null)
            })
            rzp.open()

        } catch (error) {
            console.error('Checkout error:', error)
            toast('error', 'Error', 'An unexpected error occurred. Please try again.')
            setLoadingPlan(null)
        }
    }

    return (
        <div className="min-h-screen bg-ink-950 text-[var(--text-primary)]">
            <AuthModal open={showAuth} onOpenChange={setShowAuth} />

            {/* Navigation Placeholder/Simple */}
            <header className="max-w-7xl mx-auto px-6 py-8 flex items-center justify-between">
                <a href="/" className="flex items-center gap-3">
                    <div className="p-2 rounded-xl bg-gold-muted border border-gold/20">
                        <Zap className="h-6 w-6 text-gold" />
                    </div>
                    <span className="font-display font-bold text-xl tracking-tight">CompetitorGap AI</span>
                </a>
                <Button variant="ghost" size="sm" onClick={() => router.push(isAuthenticated ? '/dashboard' : '/')}>
                    {isAuthenticated ? 'Dashboard' : 'Sign In'}
                </Button>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-12 md:py-20 text-center">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="max-w-3xl mx-auto mb-16"
                >
                    <Badge variant="neutral" className="mb-4 boarder-gold/30 text-gold bg-gold/5">
                        <Sparkles className="h-3 w-3 mr-1" />
                        Pricing Plans
                    </Badge>
                    <h1 className="text-4xl md:text-5xl font-display font-bold mb-6">
                        Invest in <span className="text-gold">Market Advantage</span>
                    </h1>
                    <p className="text-lg text-[var(--text-muted)]">
                        Stop guessing what your competitors are doing. Get board-ready intelligence reports in minutes, not days.
                    </p>
                </motion.div>

                {/* Toggle */}
                <div className="flex items-center justify-center gap-4 mb-12">
                    <span className={`text-sm font-medium ${!isYearly ? 'text-gold' : 'text-[var(--text-muted)]'}`}>Monthly</span>
                    <button
                        onClick={() => setIsYearly(!isYearly)}
                        className="relative w-14 h-7 rounded-full bg-ink-800 border border-ink-700 p-1 transition-colors"
                    >
                        <motion.div
                            animate={{ x: isYearly ? 28 : 0 }}
                            className="w-5 h-5 rounded-full bg-gold shadow-lg"
                        />
                    </button>
                    <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium ${isYearly ? 'text-gold' : 'text-[var(--text-muted)]'}`}>Yearly</span>
                        <Badge className="bg-success/10 text-success border-success/20 py-0.5 px-2 text-[10px] uppercase tracking-wider">
                            Save 20%
                        </Badge>
                    </div>
                </div>

                {/* Grid */}
                <div className="grid md:grid-cols-3 gap-8 max-w-6xl mx-auto">
                    {Object.entries(plans).map(([key, plan]) => (
                        <motion.div
                            key={key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            whileHover={{ y: -5 }}
                            className="relative"
                        >
                            {(plan as any).popular && (
                                <div className="absolute -top-4 left-1/2 -translate-x-1/2 z-10">
                                    <Badge className="bg-gold text-ink-950 font-bold border-none px-4 py-1">
                                        MOST POPULAR
                                    </Badge>
                                </div>
                            )}

                            <Card className={`h-full flex flex-col p-8 text-left transition-all duration-300 ${(plan as any).popular ? 'border-gold/40 bg-ink-900/40 ring-1 ring-gold/20' : 'bg-ink-900/20'}`}>
                                <div className="mb-6">
                                    <h3 className="text-xl font-bold mb-2">{plan.name}</h3>
                                    <p className="text-sm text-[var(--text-muted)] leading-relaxed">{plan.description}</p>
                                </div>

                                <div className="mb-8 flex items-baseline gap-1">
                                    <span className="text-4xl font-display font-bold">
                                        ${isYearly ? plan.yearlyPrice : plan.monthlyPrice}
                                    </span>
                                    <span className="text-[var(--text-muted)] text-sm">
                                        /{isYearly ? 'year' : 'mo'}
                                    </span>
                                    {isYearly && (
                                        <span className="ml-2 text-xs text-success bg-success/5 px-2 py-0.5 rounded border border-success/10">
                                            ${Math.floor(isYearly ? plan.yearlyPrice / 12 : plan.monthlyPrice)}/mo
                                        </span>
                                    )}
                                </div>

                                <div className="space-y-4 mb-8 flex-1">
                                    {plan.features.map((feature, i) => (
                                        <div key={i} className="flex items-start gap-3">
                                            <div className="mt-1 p-0.5 rounded-full bg-gold/10 border border-gold/20">
                                                <Check className="h-3 w-3 text-gold" />
                                            </div>
                                            <span className="text-sm text-[var(--text-secondary)]">{feature}</span>
                                        </div>
                                    ))}
                                </div>

                                <Button
                                    onClick={() => handleSubscribe(key)}
                                    variant={(plan as any).popular ? 'primary' : 'secondary'}
                                    size="lg"
                                    className="w-full group"
                                    disabled={loadingPlan !== null}
                                >
                                    {loadingPlan === key ? (
                                        <Loader2 className="h-4 w-4 animate-spin" />
                                    ) : (
                                        <>
                                            {(plan as any).popular && !(user as any)?.trial_used ? 'Start 7-Day Free Trial' : 'Subscribe Now'}
                                            <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                                        </>
                                    )}
                                </Button>
                            </Card>
                        </motion.div>
                    ))}
                </div>

                <div className="mt-20 max-w-2xl mx-auto bg-ink-900/40 border border-ink-800 rounded-2xl p-8 flex flex-col md:flex-row items-center gap-8 text-left">
                    <div className="p-4 rounded-2xl bg-gold/10 border border-gold/20">
                        <Zap className="h-8 w-8 text-gold" />
                    </div>
                    <div className="flex-1">
                        <h4 className="text-lg font-bold mb-1">Need extra credits?</h4>
                        <p className="text-sm text-[var(--text-muted)] mb-0">
                            Burned through your plan? You can top up 50 extra credits at any time for $25. No monthly commitment.
                        </p>
                    </div>
                    <Button variant="ghost" className="text-gold hover:text-gold/80" onClick={() => router.push('/dashboard')}>
                        Check Balance
                    </Button>
                </div>

                {/* Trust Badges */}
                <div className="mt-20 flex flex-wrap justify-center gap-12 opacity-50 grayscale hover:grayscale-0 transition-all duration-500">
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <ShieldCheck className="h-5 w-5" />
                        Secure Checkout
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        <Badge className="bg-ink-800 text-[var(--text-primary)] border-ink-700">PCI DSS</Badge>
                        Compliant
                    </div>
                    <div className="flex items-center gap-2 text-sm font-medium">
                        Powered by <b>Razorpay</b>
                    </div>
                </div>
            </main>

            <footer className="border-t border-ink-800 mt-20 py-12 text-center text-[var(--text-muted)] text-sm">
                <p>&copy; {new Date().getFullYear()} CompetitorGap AI. All rights reserved.</p>
            </footer>
        </div>
    )
}
