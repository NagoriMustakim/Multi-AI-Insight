'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, XCircle, Save, LogOut, Crosshair, Search, RefreshCw, Zap, Plus, CreditCard, Shield } from 'lucide-react'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { Badge } from '@/components/ui/Badge'

interface UserRow {
    id: string
    email: string
    full_name: string | null
    subscription_tier: string
    subscription_status: string
    available_credits: number
    created_at: string
    analysis_count: number
}

function formatDate(str: string) {
    return new Date(str).toLocaleDateString('en-US', {
        year: 'numeric', month: 'short', day: 'numeric',
    })
}

export default function AdminDashboardPage() {
    const [users, setUsers] = useState<UserRow[]>([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState('')
    const [search, setSearch] = useState('')
    const [grantingId, setGrantingId] = useState<string | null>(null)
    const [grantAmount, setGrantAmount] = useState(50)

    const getToken = () =>
        typeof window !== 'undefined' ? sessionStorage.getItem('adminToken') : null

    const fetchUsers = async () => {
        setLoading(true)
        setError('')
        const token = getToken()
        if (!token) { window.location.href = '/admin'; return }

        try {
            const res = await fetch('/api/admin/users', {
                headers: { Authorization: `Bearer ${token}` },
            })
            if (res.status === 401) { window.location.href = '/admin'; return }
            const data = await res.json()
            if (!data.success) throw new Error(data.error)
            setUsers(data.users)
        } catch (e: unknown) {
            setError(e instanceof Error ? e.message : 'Failed to load users')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchUsers() }, [])

    const handleGrantCredits = async (userId: string) => {
        const token = getToken()
        try {
            const res = await fetch(`/api/admin/users/${userId}`, {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify({
                    grantAmount,
                    grantReason: 'Admin Manual Grant'
                }),
            })
            if (res.ok) {
                setGrantingId(null)
                fetchUsers()
            }
        } catch (err) {
            setError('Failed to grant credits')
        }
    }

    const logout = () => {
        sessionStorage.removeItem('adminToken')
        window.location.href = '/admin'
    }

    const filtered = users.filter(u =>
        u.email.toLowerCase().includes(search.toLowerCase()) ||
        (u.full_name ?? '').toLowerCase().includes(search.toLowerCase())
    )

    return (
        <div className="min-h-screen bg-ink-950">
            {/* Header */}
            <header className="border-b border-ink-700/30 bg-ink-900/60 backdrop-blur-sm sticky top-0 z-10">
                <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        <div className="p-1.5 rounded-lg bg-gold-muted border border-gold/20">
                            <Crosshair className="h-4 w-4 text-gold" />
                        </div>
                        <span className="font-display font-bold text-lg text-[var(--text-primary)]">
                            Admin Dashboard
                        </span>
                    </div>
                    <div className="flex items-center gap-3">
                        <Button variant="ghost" size="sm" onClick={fetchUsers}>
                            <RefreshCw className="h-4 w-4" />
                        </Button>
                        <Button variant="ghost" size="sm" onClick={logout}>
                            <LogOut className="h-4 w-4" />
                            Sign Out
                        </Button>
                    </div>
                </div>
            </header>

            <main className="max-w-7xl mx-auto px-6 py-10">
                {/* Stats */}
                <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: users.length, icon: Users, color: 'text-steel' },
                        { label: 'Active Subs', value: users.filter(u => u.subscription_status === 'active').length, icon: CheckCircle, color: 'text-success' },
                        { label: 'Indie+', value: users.filter(u => u.subscription_tier !== 'free').length, icon: Shield, color: 'text-gold' },
                        { label: 'Total Reports', value: users.reduce((acc, u) => acc + u.analysis_count, 0), icon: Zap, color: 'text-gold' },
                    ].map(stat => (
                        <Card key={stat.label} className="p-5 flex items-center gap-4 bg-ink-900/60">
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            <div>
                                <p className="text-2xl font-bold font-display text-[var(--text-primary)]">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                            </div>
                        </Card>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-6">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-ink-800/60 border border-ink-700/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-gold/30 transition-colors max-w-xs"
                    />
                </div>

                {/* Table */}
                <Card className="overflow-hidden border-ink-700/30">
                    <div className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_140px] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-6 py-4 bg-ink-800/50 border-b border-ink-700/30">
                        <span>User</span>
                        <span>Tier</span>
                        <span>Status</span>
                        <span>Credits</span>
                        <span>Reports</span>
                        <span className="text-right">Grant</span>
                    </div>

                    {loading ? (
                        <div className="py-16 text-center text-[var(--text-muted)] text-sm">Loading...</div>
                    ) : (
                        <div className="divide-y divide-ink-700/10">
                            {filtered.map((user, i) => (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.02 }}
                                    className="grid grid-cols-[1.5fr_1fr_1fr_1fr_1fr_140px] items-center px-6 py-4 hover:bg-ink-800/30 transition-colors"
                                >
                                    <div>
                                        <p className="text-sm font-medium truncate">{user.full_name || '—'}</p>
                                        <p className="text-[10px] text-[var(--text-muted)] truncate">{user.email}</p>
                                    </div>
                                    <div className="capitalize text-xs font-mono text-gold">{user.subscription_tier.split('_')[0]}</div>
                                    <div>
                                        <Badge variant={user.subscription_status === 'active' ? 'success' : 'neutral'}>
                                            {user.subscription_status}
                                        </Badge>
                                    </div>
                                    <div className="flex items-center gap-1.5 font-mono text-sm">
                                        <Zap className="h-3 w-3 text-gold" />
                                        {user.available_credits}
                                    </div>
                                    <div className="text-sm font-bold">{user.analysis_count}</div>
                                    <div className="text-right">
                                        {grantingId === user.id ? (
                                            <div className="flex items-center justify-end gap-2">
                                                <input
                                                    type="number"
                                                    value={grantAmount}
                                                    onChange={e => setGrantAmount(parseInt(e.target.value))}
                                                    className="w-16 bg-ink-950 border border-gold/30 rounded px-2 py-1 text-xs"
                                                />
                                                <Button size="sm" onClick={() => handleGrantCredits(user.id)}>Add</Button>
                                                <Button variant="ghost" size="sm" onClick={() => setGrantingId(null)}>×</Button>
                                            </div>
                                        ) : (
                                            <Button variant="ghost" size="sm" onClick={() => setGrantingId(user.id)}>
                                                <Plus className="h-4 w-4" />
                                            </Button>
                                        )}
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    )}
                </Card>
            </main>
        </div>
    )
}
