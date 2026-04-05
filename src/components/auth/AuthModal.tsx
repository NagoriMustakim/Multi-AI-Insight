'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Mail, Lock, User, Eye, EyeOff } from 'lucide-react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAuth } from '@/hooks/useAuth'
import { useToast } from '@/components/ui/Toast'

interface AuthModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    defaultTab?: 'login' | 'register'
}

function getPasswordStrength(password: string): { label: string; color: string; width: string } {
    if (password.length === 0) return { label: '', color: '', width: '0%' }
    let score = 0
    if (password.length >= 8) score++
    if (/[A-Z]/.test(password)) score++
    if (/[0-9]/.test(password)) score++
    if (/[^A-Za-z0-9]/.test(password)) score++
    if (password.length >= 12) score++

    if (score <= 1) return { label: 'Weak', color: 'bg-danger', width: '25%' }
    if (score <= 2) return { label: 'Fair', color: 'bg-warning', width: '50%' }
    if (score <= 3) return { label: 'Good', color: 'bg-gold', width: '75%' }
    return { label: 'Strong', color: 'bg-success', width: '100%' }
}

export function AuthModal({ open, onOpenChange, defaultTab = 'login' }: AuthModalProps) {
    const [tab, setTab] = useState<'login' | 'register'>(defaultTab)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [fullName, setFullName] = useState('')
    const [showPassword, setShowPassword] = useState(false)
    const [isLoading, setIsLoading] = useState(false)
    const [error, setError] = useState('')

    const { login, register } = useAuth()
    const { toast } = useToast()

    const resetForm = () => {
        setEmail('')
        setPassword('')
        setFullName('')
        setError('')
        setShowPassword(false)
    }

    const switchTab = (newTab: 'login' | 'register') => {
        setTab(newTab)
        resetForm()
    }

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault()
        setError('')
        setIsLoading(true)

        try {
            if (tab === 'login') {
                await login(email, password)
                toast('success', 'Welcome back!', 'You\'re now signed in.')
            } else {
                await register(email, password, fullName)
                toast('success', 'Account created!', 'Welcome to Multi AI Insight.')
            }
            resetForm()
            onOpenChange(false)
        } catch (err) {
            const message = err instanceof Error ? err.message : 'Something went wrong'
            setError(message)
            toast('error', tab === 'login' ? 'Login failed' : 'Registration failed', message)
        } finally {
            setIsLoading(false)
        }
    }

    const strength = getPasswordStrength(password)

    return (
        <Modal open={open} onOpenChange={onOpenChange}>
            {/* Tab Switcher */}
            <div className="flex mb-6 bg-ink-800 rounded-lg p-1">
                {(['login', 'register'] as const).map(t => (
                    <button
                        key={t}
                        onClick={() => switchTab(t)}
                        className={`
              flex-1 py-2.5 text-sm font-medium rounded-md transition-all duration-200
              ${tab === t
                                ? 'bg-ink-700 text-[var(--text-primary)] shadow-sm'
                                : 'text-[var(--text-muted)] hover:text-[var(--text-secondary)]'
                            }
            `}
                    >
                        {t === 'login' ? 'Sign In' : 'Create Account'}
                    </button>
                ))}
            </div>

            {/* Form */}
            <AnimatePresence mode="wait">
                <motion.form
                    key={tab}
                    initial={{ opacity: 0, x: tab === 'login' ? -10 : 10 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: tab === 'login' ? 10 : -10 }}
                    transition={{ duration: 0.15 }}
                    onSubmit={handleSubmit}
                    className="space-y-4"
                >
                    {tab === 'register' && (
                        <div className="relative">
                            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                            <input
                                type="text"
                                placeholder="Full Name (optional)"
                                value={fullName}
                                onChange={e => setFullName(e.target.value)}
                                className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ink-800/60 border border-ink-700 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                            />
                        </div>
                    )}

                    <div className="relative">
                        <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                        <input
                            type="email"
                            placeholder="Email address"
                            required
                            value={email}
                            onChange={e => setEmail(e.target.value)}
                            className="w-full pl-10 pr-4 py-2.5 rounded-lg bg-ink-800/60 border border-ink-700 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                        />
                    </div>

                    <div className="relative">
                        <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                        <input
                            type={showPassword ? 'text' : 'password'}
                            placeholder="Password"
                            required
                            value={password}
                            onChange={e => setPassword(e.target.value)}
                            className="w-full pl-10 pr-11 py-2.5 rounded-lg bg-ink-800/60 border border-ink-700 text-[var(--text-primary)] placeholder:text-[var(--text-muted)] focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30 transition-all"
                        />
                        <button
                            type="button"
                            onClick={() => setShowPassword(!showPassword)}
                            className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                        >
                            {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </button>
                    </div>

                    {/* Password Strength Indicator */}
                    {tab === 'register' && password.length > 0 && (
                        <div className="space-y-1">
                            <div className="h-1.5 bg-ink-800 rounded-full overflow-hidden">
                                <motion.div
                                    className={`h-full ${strength.color} rounded-full`}
                                    initial={{ width: 0 }}
                                    animate={{ width: strength.width }}
                                    transition={{ duration: 0.3 }}
                                />
                            </div>
                            <p className={`text-xs ${strength.label === 'Weak' ? 'text-danger' :
                                    strength.label === 'Fair' ? 'text-warning' :
                                        strength.label === 'Good' ? 'text-gold' : 'text-success'
                                }`}>
                                Password strength: {strength.label}
                            </p>
                        </div>
                    )}

                    {/* Error */}
                    {error && (
                        <motion.p
                            initial={{ opacity: 0, y: -5 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2"
                        >
                            {error}
                        </motion.p>
                    )}

                    <Button
                        type="submit"
                        variant="primary"
                        size="lg"
                        isLoading={isLoading}
                        className="w-full"
                    >
                        {tab === 'login' ? 'Sign In' : 'Create Account'}
                    </Button>
                </motion.form>
            </AnimatePresence>
        </Modal>
    )
}
