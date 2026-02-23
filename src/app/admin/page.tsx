'use client'

import React, { useState } from 'react'
import { motion } from 'framer-motion'
import { Crosshair, Eye, EyeOff, Lock, AlertCircle } from 'lucide-react'
import { Button } from '@/components/ui/Button'

export default function AdminLoginPage() {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [showPass, setShowPass] = useState(false)
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const res = await fetch('/api/admin/auth', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ email, password }),
            })
            const data = await res.json()

            if (!data.success) {
                setError(data.error || 'Invalid credentials')
                return
            }

            // Store admin token in sessionStorage (clears on tab close)
            sessionStorage.setItem('adminToken', data.token)
            window.location.href = '/admin/dashboard'
        } catch {
            setError('Connection error. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="min-h-screen bg-ink-950 flex items-center justify-center px-4">
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="w-full max-w-sm"
            >
                {/* Logo */}
                <div className="text-center mb-8">
                    <div className="inline-flex items-center justify-center w-14 h-14 rounded-2xl bg-gold-muted border border-gold/20 mb-4">
                        <Crosshair className="h-7 w-7 text-gold" />
                    </div>
                    <h1 className="font-display text-2xl font-bold text-[var(--text-primary)]">
                        Admin Access
                    </h1>
                    <p className="text-sm text-[var(--text-muted)] mt-1">
                        CompetitorGap AI — Restricted
                    </p>
                </div>

                <div className="bg-ink-900/80 border border-ink-700/50 rounded-2xl p-8">
                    <div className="flex items-center gap-2 text-xs text-[var(--text-muted)] bg-ink-800/60 rounded-lg px-3 py-2 mb-6">
                        <Lock className="h-3.5 w-3.5" />
                        Secure admin portal — unauthorized access is logged
                    </div>

                    <form onSubmit={handleLogin} className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                Admin Email
                            </label>
                            <input
                                type="email"
                                value={email}
                                onChange={e => setEmail(e.target.value)}
                                required
                                autoComplete="email"
                                className="w-full bg-ink-800 border border-ink-700/50 rounded-xl px-4 py-3 text-sm text-[var(--text-primary)] focus:outline-none focus:border-gold/40 transition-colors"
                                placeholder="admin@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-[var(--text-secondary)] mb-1.5">
                                Password
                            </label>
                            <div className="relative">
                                <input
                                    type={showPass ? 'text' : 'password'}
                                    value={password}
                                    onChange={e => setPassword(e.target.value)}
                                    required
                                    autoComplete="current-password"
                                    className="w-full bg-ink-800 border border-ink-700/50 rounded-xl px-4 py-3 pr-11 text-sm text-[var(--text-primary)] focus:outline-none focus:border-gold/40 transition-colors"
                                    placeholder="••••••••••••"
                                />
                                <button
                                    type="button"
                                    onClick={() => setShowPass(!showPass)}
                                    className="absolute right-3 top-1/2 -translate-y-1/2 text-[var(--text-muted)] hover:text-[var(--text-secondary)] transition-colors"
                                >
                                    {showPass ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                </button>
                            </div>
                        </div>

                        {error && (
                            <motion.div
                                initial={{ opacity: 0, y: -4 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="flex items-center gap-2 text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2"
                            >
                                <AlertCircle className="h-4 w-4 shrink-0" />
                                {error}
                            </motion.div>
                        )}

                        <Button
                            type="submit"
                            variant="primary"
                            size="lg"
                            className="w-full"
                            disabled={loading}
                        >
                            {loading ? 'Verifying...' : 'Sign In to Admin'}
                        </Button>
                    </form>
                </div>

                <p className="text-center text-xs text-[var(--text-muted)] mt-6">
                    <a href="/" className="hover:text-gold transition-colors">← Back to site</a>
                </p>
            </motion.div>
        </div>
    )
}
