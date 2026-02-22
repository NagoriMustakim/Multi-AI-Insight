'use client'

import React, { createContext, useContext, useEffect, useState, useCallback } from 'react'

interface User {
    id: string
    email: string
    full_name?: string | null
    created_at: string
}

interface AuthContextType {
    user: User | null
    token: string | null
    isLoading: boolean
    isAuthenticated: boolean
    login: (email: string, password: string) => Promise<void>
    register: (email: string, password: string, fullName?: string) => Promise<void>
    logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}

export function AuthProvider({ children }: { children: React.ReactNode }) {
    const [user, setUser] = useState<User | null>(null)
    const [token, setToken] = useState<string | null>(null)
    const [isLoading, setIsLoading] = useState(true)

    // On mount: check for stored token
    useEffect(() => {
        const storedToken = localStorage.getItem('cgap_token')
        const storedUser = localStorage.getItem('cgap_user')

        if (storedToken && storedUser) {
            setToken(storedToken)
            setUser(JSON.parse(storedUser))

            // Verify token is still valid
            fetch('/api/usage', {
                headers: { Authorization: `Bearer ${storedToken}` },
            })
                .then(res => {
                    if (!res.ok) {
                        // Token expired or invalid
                        localStorage.removeItem('cgap_token')
                        localStorage.removeItem('cgap_user')
                        setToken(null)
                        setUser(null)
                    }
                })
                .catch(() => {
                    // Network error — keep the stored auth
                })
                .finally(() => setIsLoading(false))
        } else {
            setIsLoading(false)
        }
    }, [])

    const login = useCallback(async (email: string, password: string) => {
        const res = await fetch('/api/auth/login', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Login failed')
        }

        const { token: newToken, user: newUser } = data.data
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('cgap_token', newToken)
        localStorage.setItem('cgap_user', JSON.stringify(newUser))
    }, [])

    const register = useCallback(async (email: string, password: string, fullName?: string) => {
        const res = await fetch('/api/auth/register', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ email, password, fullName }),
        })

        const data = await res.json()

        if (!res.ok || !data.success) {
            throw new Error(data.error || 'Registration failed')
        }

        const { token: newToken, user: newUser } = data.data
        setToken(newToken)
        setUser(newUser)
        localStorage.setItem('cgap_token', newToken)
        localStorage.setItem('cgap_user', JSON.stringify(newUser))
    }, [])

    const logout = useCallback(() => {
        setToken(null)
        setUser(null)
        localStorage.removeItem('cgap_token')
        localStorage.removeItem('cgap_user')
    }, [])

    return (
        <AuthContext.Provider
            value={{
                user,
                token,
                isLoading,
                isAuthenticated: !!token && !!user,
                login,
                register,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    )
}
