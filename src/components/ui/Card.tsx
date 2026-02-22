'use client'

import React from 'react'

interface CardProps {
    children: React.ReactNode
    className?: string
    hover?: boolean
    goldBorder?: boolean
    onClick?: () => void
}

export function Card({ children, className = '', hover = false, goldBorder = false, onClick }: CardProps) {
    return (
        <div
            className={`
        rounded-xl bg-ink-900/80 backdrop-blur-sm border
        ${goldBorder ? 'border-gold/30' : 'border-ink-700/50'}
        ${hover ? 'transition-all duration-300 hover:border-gold/20 hover:bg-ink-800/60 hover:shadow-lg hover:shadow-gold/5 cursor-pointer' : ''}
        ${onClick ? 'cursor-pointer' : ''}
        ${className}
      `.trim()}
            onClick={onClick}
        >
            {children}
        </div>
    )
}
