'use client'

import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

interface LoadingAnalysisProps {
    currentStep: string
    currentMessage: string
}

const progressSteps = [
    { key: 'researching', label: 'AI research agents connecting to live web...', icon: '🔍' },
    { key: 'scanning', label: 'Mapping competitor landscape in real-time...', icon: '📡' },
    { key: 'identifying', label: 'AI detecting market gaps and blind spots...', icon: '🎯' },
    { key: 'analyzing', label: 'Strategic reasoning engine processing data...', icon: '🧠' },
    { key: 'complete', label: 'Structuring your intelligence report...', icon: '📊' },
]

export function LoadingAnalysis({ currentStep, currentMessage }: LoadingAnalysisProps) {
    const [elapsedTime, setElapsedTime] = useState(0)
    const [activeStepIndex, setActiveStepIndex] = useState(0)

    useEffect(() => {
        const timer = setInterval(() => {
            setElapsedTime(t => t + 1)
        }, 1000)
        return () => clearInterval(timer)
    }, [])

    useEffect(() => {
        if (currentStep) {
            const idx = progressSteps.findIndex(s => s.key === currentStep)
            if (idx >= 0) setActiveStepIndex(idx)
        }
    }, [currentStep])

    useEffect(() => {
        const timer = setInterval(() => {
            setActiveStepIndex(prev => Math.min(prev + 1, progressSteps.length - 2))
        }, 25000)
        return () => clearInterval(timer)
    }, [])

    const minutes = Math.floor(elapsedTime / 60)
    const seconds = elapsedTime % 60
    const progress = Math.min((activeStepIndex / (progressSteps.length - 1)) * 100, 95)

    return (
        <div className="fixed inset-0 z-50 bg-ink-950/97 backdrop-blur-md flex items-center justify-center">
            <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="max-w-lg w-full mx-4 text-center"
            >
                {/* Large animated scanner */}
                <div className="relative w-64 h-64 mx-auto mb-10">
                    {/* Outer rings */}
                    {[1, 2, 3, 4].map(i => (
                        <motion.div
                            key={i}
                            className="absolute rounded-full border border-gold/20"
                            style={{
                                width: `${25 * i}%`,
                                height: `${25 * i}%`,
                                top: `${(100 - 25 * i) / 2}%`,
                                left: `${(100 - 25 * i) / 2}%`,
                            }}
                            animate={{ opacity: [0.2, 0.6, 0.2], scale: [1, 1.03, 1] }}
                            transition={{
                                duration: 2 + i * 0.4,
                                repeat: Infinity,
                                delay: i * 0.2,
                            }}
                        />
                    ))}

                    {/* Center glow */}
                    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2">
                        <motion.div
                            className="w-16 h-16 rounded-full bg-gold/20 blur-xl"
                            animate={{ scale: [1, 1.5, 1], opacity: [0.5, 1, 0.5] }}
                            transition={{ duration: 2, repeat: Infinity }}
                        />
                        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full bg-gold shadow-[0_0_30px_rgba(201,168,76,0.8)]">
                            <motion.div
                                className="absolute inset-0 rounded-full border-2 border-gold"
                                animate={{ scale: [1, 2.5], opacity: [0.6, 0] }}
                                transition={{ duration: 1.5, repeat: Infinity }}
                            />
                        </div>
                    </div>

                    {/* Sweep rotation */}
                    <motion.div
                        className="absolute inset-0 rounded-full overflow-hidden"
                        animate={{ rotate: [0, 360] }}
                        transition={{ duration: 4, repeat: Infinity, ease: 'linear' }}
                    >
                        <div
                            className="absolute top-0 left-0 w-full h-full rounded-full"
                            style={{
                                background: 'conic-gradient(from 0deg, rgba(201,168,76,0.15) 0deg, transparent 70deg)',
                            }}
                        />
                        <div
                            className="absolute top-1/2 left-1/2 h-px origin-left"
                            style={{
                                width: '50%',
                                background: 'linear-gradient(to right, rgba(201,168,76,0.8), transparent)',
                                marginTop: '-0.5px',
                            }}
                        />
                    </motion.div>

                    {/* Ping dots around edge */}
                    {[0, 60, 120, 180, 240, 300].map((angle, i) => {
                        const rad = (angle * Math.PI) / 180
                        const x = 50 + 45 * Math.cos(rad)
                        const y = 50 + 45 * Math.sin(rad)
                        return (
                            <motion.div
                                key={angle}
                                className="absolute w-2.5 h-2.5 rounded-full bg-gold/60"
                                style={{ left: `${x}%`, top: `${y}%`, transform: 'translate(-50%,-50%)' }}
                                animate={{ opacity: [0.3, 1, 0.3], scale: [0.8, 1.2, 0.8] }}
                                transition={{ duration: 1.5, repeat: Infinity, delay: i * 0.25 }}
                            />
                        )
                    })}
                </div>

                {/* Progress bar */}
                <div className="h-1 bg-ink-700 rounded-full mb-8 overflow-hidden">
                    <motion.div
                        className="h-full bg-gradient-to-r from-gold/50 to-gold rounded-full"
                        animate={{ width: `${progress}%` }}
                        transition={{ duration: 0.8, ease: 'easeOut' }}
                    />
                </div>

                {/* Steps */}
                <div className="space-y-2 mb-8">
                    {progressSteps.map((step, i) => {
                        const isActive = i === activeStepIndex
                        const isDone = i < activeStepIndex

                        return (
                            <motion.div
                                key={step.key}
                                initial={{ opacity: 0, x: -10 }}
                                animate={{
                                    opacity: isDone || isActive ? 1 : 0.3,
                                    x: 0,
                                }}
                                transition={{ delay: i * 0.1 }}
                                className={`flex items-center gap-3 px-5 py-3 rounded-xl transition-colors ${isActive ? 'bg-gold-muted border border-gold/20' : ''}`}
                            >
                                <span className="text-xl">{step.icon}</span>
                                <span className={`text-sm flex-1 text-left ${isActive ? 'text-gold font-medium' : isDone ? 'text-[var(--text-secondary)]' : 'text-[var(--text-muted)]'}`}>
                                    {step.label}
                                </span>
                                {isDone && <span className="text-success font-bold">✓</span>}
                                {isActive && (
                                    <motion.div
                                        className="w-4 h-4 rounded-full border-2 border-gold/30 border-t-gold"
                                        animate={{ rotate: 360 }}
                                        transition={{ duration: 0.8, repeat: Infinity, ease: 'linear' }}
                                    />
                                )}
                            </motion.div>
                        )
                    })}
                </div>

                {/* Timer */}
                <p className="text-[var(--text-muted)] text-sm font-mono mb-2">
                    {minutes}:{seconds.toString().padStart(2, '0')} elapsed
                </p>
                <p className="text-[var(--text-muted)] text-xs">
                    Our AI agents are working hard — typically takes 2-3 minutes. Please don&apos;t close this tab.
                </p>
            </motion.div>
        </div>
    )
}
