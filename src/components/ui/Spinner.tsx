'use client'

import React from 'react'

interface SpinnerProps {
    size?: 'sm' | 'md' | 'lg'
    className?: string
}

const sizeMap = {
    sm: 'h-4 w-4 border-2',
    md: 'h-8 w-8 border-2',
    lg: 'h-12 w-12 border-3',
}

export function Spinner({ size = 'md', className = '' }: SpinnerProps) {
    return (
        <div
            className={`
        ${sizeMap[size]}
        rounded-full
        border-gold/30
        border-t-gold
        animate-spin
        will-change-transform
        ${className}
      `.trim()}
            role="status"
            aria-label="Loading"
        />
    )
}
