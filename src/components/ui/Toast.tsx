'use client'

import React, { createContext, useContext, useState, useCallback } from 'react'
import * as ToastPrimitive from '@radix-ui/react-toast'
import { AnimatePresence, motion } from 'framer-motion'
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react'

// ========================
// TOAST TYPES
// ========================

type ToastType = 'success' | 'error' | 'info'

interface Toast {
    id: string
    type: ToastType
    title: string
    description?: string
}

interface ToastContextType {
    toast: (type: ToastType, title: string, description?: string) => void
}

const ToastContext = createContext<ToastContextType | null>(null)

export function useToast() {
    const ctx = useContext(ToastContext)
    if (!ctx) throw new Error('useToast must be used within ToastProvider')
    return ctx
}

// ========================
// TOAST PROVIDER
// ========================

export function ToastProvider({ children }: { children: React.ReactNode }) {
    const [toasts, setToasts] = useState<Toast[]>([])

    const addToast = useCallback((type: ToastType, title: string, description?: string) => {
        const id = Math.random().toString(36).slice(2)
        setToasts(prev => [...prev, { id, type, title, description }])
        // Auto-dismiss after 4 seconds
        setTimeout(() => {
            setToasts(prev => prev.filter(t => t.id !== id))
        }, 4000)
    }, [])

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id))
    }, [])

    const icons: Record<ToastType, React.ReactNode> = {
        success: <CheckCircle className="h-5 w-5 text-success" />,
        error: <AlertCircle className="h-5 w-5 text-danger" />,
        info: <Info className="h-5 w-5 text-steel" />,
    }

    const borderColors: Record<ToastType, string> = {
        success: 'border-success/30',
        error: 'border-danger/30',
        info: 'border-steel/30',
    }

    return (
        <ToastContext.Provider value={{ toast: addToast }}>
            <ToastPrimitive.Provider swipeDirection="right">
                {children}
                <AnimatePresence mode="popLayout">
                    {toasts.map(t => (
                        <ToastPrimitive.Root key={t.id} asChild forceMount>
                            <motion.div
                                layout
                                initial={{ opacity: 0, x: 100, scale: 0.9 }}
                                animate={{ opacity: 1, x: 0, scale: 1 }}
                                exit={{ opacity: 0, x: 100, scale: 0.9 }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                                className={`
                  fixed bottom-4 right-4 z-[100] min-w-[320px] max-w-[420px]
                  rounded-xl bg-ink-900 border ${borderColors[t.type]}
                  backdrop-blur-sm p-4 shadow-2xl
                `}
                            >
                                <div className="flex items-start gap-3">
                                    <div className="mt-0.5">{icons[t.type]}</div>
                                    <div className="flex-1 min-w-0">
                                        <ToastPrimitive.Title className="text-sm font-semibold text-[var(--text-primary)]">
                                            {t.title}
                                        </ToastPrimitive.Title>
                                        {t.description && (
                                            <ToastPrimitive.Description className="text-sm text-[var(--text-secondary)] mt-0.5">
                                                {t.description}
                                            </ToastPrimitive.Description>
                                        )}
                                    </div>
                                    <ToastPrimitive.Close
                                        className="text-[var(--text-muted)] hover:text-[var(--text-primary)] transition-colors"
                                        onClick={() => removeToast(t.id)}
                                    >
                                        <X className="h-4 w-4" />
                                    </ToastPrimitive.Close>
                                </div>
                            </motion.div>
                        </ToastPrimitive.Root>
                    ))}
                </AnimatePresence>
                <ToastPrimitive.Viewport />
            </ToastPrimitive.Provider>
        </ToastContext.Provider>
    )
}
