'use client'

import React from 'react'

interface NeuralGraphIconProps {
    size?: number
    className?: string
}

/**
 * Neural Graph icon mark — the standalone logomark (no text).
 * Used in navbars, favicons, compact branding spots.
 */
export function NeuralGraphIcon({ size = 32, className = '' }: NeuralGraphIconProps) {
    return (
        <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="-36 -36 72 72"
            width={size}
            height={size}
            className={className}
            aria-label="Multi AI Insight"
        >
            <defs>
                <linearGradient id="ng-gold" x1="0%" y1="0%" x2="100%" y2="100%">
                    <stop offset="0%" stopColor="#d4af37" />
                    <stop offset="100%" stopColor="#fcecba" />
                </linearGradient>
                <filter id="ng-glow">
                    <feGaussianBlur stdDeviation="1.5" result="blur" />
                    <feMerge>
                        <feMergeNode in="blur" />
                        <feMergeNode in="SourceGraphic" />
                    </feMerge>
                </filter>
            </defs>
            <g filter="url(#ng-glow)">
                {/* Connection edges */}
                <line x1="-28" y1="-22" x2="-10" y2="-8" stroke="#d4af37" strokeWidth="0.8" opacity="0.4" />
                <line x1="-28" y1="-22" x2="-22" y2="10" stroke="#6b8cba" strokeWidth="0.8" opacity="0.3" />
                <line x1="-10" y1="-8" x2="8" y2="-24" stroke="#d4af37" strokeWidth="0.8" opacity="0.4" />
                <line x1="-10" y1="-8" x2="-6" y2="18" stroke="#d4af37" strokeWidth="0.8" opacity="0.35" />
                <line x1="-10" y1="-8" x2="14" y2="6" stroke="#6b8cba" strokeWidth="0.8" opacity="0.3" />
                <line x1="8" y1="-24" x2="28" y2="-14" stroke="#d4af37" strokeWidth="0.8" opacity="0.4" />
                <line x1="8" y1="-24" x2="14" y2="6" stroke="#d4af37" strokeWidth="0.8" opacity="0.35" />
                <line x1="14" y1="6" x2="28" y2="-14" stroke="#6b8cba" strokeWidth="0.8" opacity="0.3" />
                <line x1="14" y1="6" x2="26" y2="24" stroke="#d4af37" strokeWidth="0.8" opacity="0.4" />
                <line x1="-6" y1="18" x2="26" y2="24" stroke="#d4af37" strokeWidth="0.8" opacity="0.35" />
                <line x1="-22" y1="10" x2="-6" y2="18" stroke="#d4af37" strokeWidth="0.8" opacity="0.4" />
                <line x1="-22" y1="10" x2="-30" y2="28" stroke="#6b8cba" strokeWidth="0.8" opacity="0.3" />

                {/* Primary gold nodes */}
                <circle cx="-28" cy="-22" r="4.5" fill="#d4af37" opacity="0.9" />
                <circle cx="-10" cy="-8" r="6" fill="#d4af37" />
                <circle cx="8" cy="-24" r="4" fill="#d4af37" opacity="0.85" />
                <circle cx="14" cy="6" r="5" fill="#d4af37" opacity="0.9" />
                <circle cx="-6" cy="18" r="3.5" fill="#d4af37" opacity="0.8" />
                <circle cx="26" cy="24" r="4" fill="#d4af37" opacity="0.85" />

                {/* Secondary steel nodes */}
                <circle cx="-22" cy="10" r="3" fill="#6b8cba" opacity="0.7" />
                <circle cx="28" cy="-14" r="3.5" fill="#6b8cba" opacity="0.7" />
                <circle cx="-30" cy="28" r="2.5" fill="#6b8cba" opacity="0.5" />

                {/* Outer dashed ring */}
                <circle cx="0" cy="0" r="36" fill="none" stroke="#d4af37" strokeWidth="0.5" opacity="0.15" strokeDasharray="3,6" />
            </g>
        </svg>
    )
}

interface BrandLogoProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
    showTagline?: boolean
}

/**
 * Full brand logo — Neural Graph icon + "Multi AI Insight" wordmark.
 * Used in headers, footers, navbar.
 */
export function BrandLogo({ size = 'md', className = '', showTagline = false }: BrandLogoProps) {
    const iconSize = size === 'sm' ? 24 : size === 'md' ? 30 : 40
    const textClass =
        size === 'sm'
            ? 'text-base'
            : size === 'md'
                ? 'text-lg'
                : 'text-xl'

    return (
        <div className={`flex items-center gap-2.5 ${className}`}>
            <div className="p-1.5 rounded-lg bg-gold-muted border border-gold/20">
                <NeuralGraphIcon size={iconSize} />
            </div>
            <div className="flex flex-col">
                <span className={`font-display font-bold ${textClass} text-[var(--text-primary)] leading-tight`}>
                    Multi AI<span className="text-gold"> Insight</span>
                </span>
                {showTagline && (
                    <span className="text-[9px] uppercase tracking-[2px] text-[var(--text-muted)] leading-tight mt-0.5">
                        Multi-Agent Intelligence
                    </span>
                )}
            </div>
        </div>
    )
}
