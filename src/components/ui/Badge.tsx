'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

const badgeVariants = cva(
    'inline-flex items-center font-medium rounded-full border',
    {
        variants: {
            variant: {
                success: 'bg-success/10 text-success border-success/20',
                warning: 'bg-warning/10 text-warning border-warning/20',
                danger: 'bg-danger/10 text-danger border-danger/20',
                info: 'bg-steel/10 text-steel border-steel/20',
                neutral: 'bg-ink-800 text-[var(--text-secondary)] border-ink-700',
                gold: 'bg-gold-muted text-gold border-gold/20',
            },
            size: {
                sm: 'px-2 py-0.5 text-xs',
                md: 'px-3 py-1 text-sm',
            },
        },
        defaultVariants: {
            variant: 'neutral',
            size: 'sm',
        },
    }
)

interface BadgeProps
    extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
    children: React.ReactNode
}

export function Badge({ className, variant, size, children, ...props }: BadgeProps) {
    return (
        <span
            className={twMerge(clsx(badgeVariants({ variant, size })), className)}
            {...props}
        >
            {children}
        </span>
    )
}
