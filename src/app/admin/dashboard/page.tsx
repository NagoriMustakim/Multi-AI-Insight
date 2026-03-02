'use client'

import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { Users, CheckCircle, XCircle, Save, LogOut, Crosshair, Search, RefreshCw, Mail, Linkedin, Phone } from 'lucide-react'
import { Button } from '@/components/ui/Button'

interface UserRow {
    id: string
    email: string
    full_name: string | null
    is_active: boolean
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
    const [pending, setPending] = useState<Record<string, boolean>>({}) // userId → new is_active
    const [loading, setLoading] = useState(true)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')
    const [saveMsg, setSaveMsg] = useState('')
    const [search, setSearch] = useState('')

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

    const toggle = (userId: string, current: boolean) => {
        const currentValue = userId in pending ? pending[userId] : current
        setPending(prev => ({ ...prev, [userId]: !currentValue }))
    }

    const getActive = (user: UserRow) =>
        user.id in pending ? pending[user.id] : user.is_active

    const changedCount = Object.keys(pending).length

    const saveChanges = async () => {
        if (!changedCount) return
        setSaving(true)
        setSaveMsg('')
        const token = getToken()
        if (!token) { window.location.href = '/admin'; return }

        try {
            await Promise.all(
                Object.entries(pending).map(([userId, isActive]) =>
                    fetch(`/api/admin/users/${userId}`, {
                        method: 'PATCH',
                        headers: {
                            'Content-Type': 'application/json',
                            Authorization: `Bearer ${token}`,
                        },
                        body: JSON.stringify({ isActive }),
                    })
                )
            )
            // Merge pending into users
            setUsers(prev =>
                prev.map(u => u.id in pending ? { ...u, is_active: pending[u.id] } : u)
            )
            setPending({})
            setSaveMsg(`✓ Saved ${changedCount} change${changedCount > 1 ? 's' : ''}`)
            setTimeout(() => setSaveMsg(''), 3000)
        } catch {
            setError('Failed to save changes')
        } finally {
            setSaving(false)
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

    const activeCount = users.filter(u => getActive(u)).length
    const inactiveCount = users.length - activeCount

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
                        {saveMsg && (
                            <span className="text-sm text-success font-medium">{saveMsg}</span>
                        )}
                        {changedCount > 0 && (
                            <Button
                                variant="primary"
                                size="sm"
                                onClick={saveChanges}
                                disabled={saving}
                            >
                                <Save className="h-4 w-4" />
                                Save {changedCount} Change{changedCount > 1 ? 's' : ''}
                            </Button>
                        )}
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
                <div className="grid grid-cols-3 gap-4 mb-8">
                    {[
                        { label: 'Total Users', value: users.length, icon: Users, color: 'text-steel' },
                        { label: 'Active', value: activeCount, icon: CheckCircle, color: 'text-success' },
                        { label: 'Inactive', value: inactiveCount, icon: XCircle, color: 'text-danger' },
                    ].map(stat => (
                        <div key={stat.label} className="bg-ink-900/60 border border-ink-700/30 rounded-xl p-5 flex items-center gap-4">
                            <stat.icon className={`h-8 w-8 ${stat.color}`} />
                            <div>
                                <p className="text-2xl font-bold font-display text-[var(--text-primary)]">
                                    {stat.value}
                                </p>
                                <p className="text-sm text-[var(--text-muted)]">{stat.label}</p>
                            </div>
                        </div>
                    ))}
                </div>

                {/* Search */}
                <div className="relative mb-4">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[var(--text-muted)]" />
                    <input
                        type="text"
                        placeholder="Search by email or name..."
                        value={search}
                        onChange={e => setSearch(e.target.value)}
                        className="w-full bg-ink-800/60 border border-ink-700/30 rounded-xl pl-10 pr-4 py-2.5 text-sm text-[var(--text-primary)] focus:outline-none focus:border-gold/30 transition-colors max-w-xs"
                    />
                </div>

                {/* Error */}
                {error && (
                    <div className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-4 py-3 mb-4">
                        {error}
                    </div>
                )}

                {/* Table */}
                <div className="bg-ink-900/60 border border-ink-700/30 rounded-2xl overflow-hidden">
                    <div className="grid grid-cols-[1fr_160px_100px_100px_140px] text-xs font-semibold text-[var(--text-muted)] uppercase tracking-wide px-6 py-3 border-b border-ink-700/30 bg-ink-800/30">
                        <span>User</span>
                        <span>Joined</span>
                        <span>Analyses</span>
                        <span>Status</span>
                        <span>Toggle Active</span>
                    </div>

                    {loading ? (
                        <div className="py-16 text-center text-[var(--text-muted)] text-sm">
                            Loading users...
                        </div>
                    ) : filtered.length === 0 ? (
                        <div className="py-16 text-center text-[var(--text-muted)] text-sm">
                            {search ? 'No users match your search.' : 'No users yet.'}
                        </div>
                    ) : (
                        filtered.map((user, i) => {
                            const isActive = getActive(user)
                            const isChanged = user.id in pending

                            return (
                                <motion.div
                                    key={user.id}
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    transition={{ delay: i * 0.03 }}
                                    className={`grid grid-cols-[1fr_160px_100px_100px_140px] items-center px-6 py-4 border-b border-ink-700/10 last:border-0 hover:bg-ink-800/20 transition-colors ${isChanged ? 'bg-gold/5' : ''}`}
                                >
                                    {/* User info */}
                                    <div className="min-w-0">
                                        <p className="text-sm font-medium text-[var(--text-primary)] truncate">
                                            {user.full_name || '—'}
                                        </p>
                                        <p className="text-xs text-[var(--text-muted)] truncate">{user.email}</p>
                                    </div>

                                    {/* Joined */}
                                    <span className="text-xs text-[var(--text-secondary)] font-mono">
                                        {formatDate(user.created_at)}
                                    </span>

                                    {/* Analysis count */}
                                    <span className={`text-sm font-bold ${user.analysis_count > 0 ? 'text-gold' : 'text-[var(--text-muted)]'}`}>
                                        {user.analysis_count}
                                    </span>

                                    {/* Status badge */}
                                    <span className={`inline-flex items-center gap-1.5 text-xs font-medium ${isActive ? 'text-success' : 'text-danger'}`}>
                                        {isActive
                                            ? <><CheckCircle className="h-3.5 w-3.5" /> Active</>
                                            : <><XCircle className="h-3.5 w-3.5" /> Inactive</>
                                        }
                                    </span>

                                    {/* Toggle */}
                                    <button
                                        onClick={() => toggle(user.id, user.is_active)}
                                        className={`relative w-12 h-6 rounded-full transition-colors duration-200 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-900 ${isActive
                                            ? 'bg-success focus:ring-success'
                                            : 'bg-ink-700 focus:ring-ink-600'
                                            }`}
                                        aria-label={`Toggle ${user.email}`}
                                    >
                                        <span className={`absolute top-0.5 left-0.5 w-5 h-5 rounded-full bg-white shadow transition-transform duration-200 ${isActive ? 'translate-x-6' : 'translate-x-0'}`} />
                                    </button>
                                </motion.div>
                            )
                        })
                    )}
                </div>

                {/* Help card */}
                <div className="mt-8 bg-ink-900/40 border border-ink-700/20 rounded-xl p-5">
                    <p className="text-sm font-medium text-[var(--text-secondary)] mb-3">
                        💡 When users are blocked, they see this message and your contact details:
                    </p>
                    <div className="bg-ink-800/60 rounded-xl border border-ink-700/20 p-4 text-sm text-[var(--text-muted)] flex flex-col gap-2">
                        <p className="text-[var(--text-secondary)]">
                            "Your account is pending activation. This helps us prevent spam and ensure quality."
                        </p>
                        <div className="flex gap-3">
                            <a href="https://www.linkedin.com/in/mustakimnagori" target="_blank" rel="noreferrer"
                                className="inline-flex items-center gap-1.5 text-xs text-[#4fa3e0] hover:underline">
                                <Linkedin className="h-3.5 w-3.5" /> linkedin.com/in/mustakimnagori
                            </a>
                            <a href="mailto:mustakimnagori076@gmail.com"
                                className="inline-flex items-center gap-1.5 text-xs text-gold hover:underline">
                                <Mail className="h-3.5 w-3.5" /> mustakimnagori076@gmail.com
                            </a>
                            <a href="tel:+919313067765"
                                className="inline-flex items-center gap-1.5 text-xs text-[var(--text-muted)] hover:text-gold hover:underline">
                                <Phone className="h-3.5 w-3.5" /> +91 9313067765
                            </a>
                        </div>
                    </div>
                </div>
            </main>
        </div>
    )
}
