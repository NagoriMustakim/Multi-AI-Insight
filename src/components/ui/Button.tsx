'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Loader2 } from 'lucide-react'

function cn(...inputs: (string | undefined | null | boolean)[]) {
    return twMerge(clsx(inputs))
}

const buttonVariants = cva(
    'inline-flex items-center justify-center font-medium transition-all duration-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform',
    {
        variants: {
            variant: {
                primary:
                    'bg-gold text-ink-950 hover:bg-gold/90 focus:ring-gold/50 shadow-lg shadow-gold/20 hover:shadow-gold/30',
                secondary:
                    'border border-steel/40 text-steel hover:bg-steel/10 focus:ring-steel/50',
                ghost:
                    'text-text-secondary hover:text-text-primary hover:bg-ink-800/50',
                danger:
                    'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 focus:ring-danger/50',
            },
            size: {
                sm: 'px-3 py-1.5 text-sm gap-1.5',
                md: 'px-5 py-2.5 text-sm gap-2',
                lg: 'px-7 py-3 text-base gap-2.5',
            },
        },
        defaultVariants: {
            variant: 'primary',
            size: 'md',
        },
    }
)

export interface ButtonProps
    extends React.ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
    isLoading?: boolean
    children: React.ReactNode
}

export const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
    ({ className, variant, size, isLoading, children, disabled, ...props }, ref) => {
        return (
            <button
                className={cn(buttonVariants({ variant, size }), className)}
                ref={ref}
                disabled={disabled || isLoading}
                {...props}
            >
                {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
                {children}
            </button>
        )
    }
)
Button.displayName = 'Button'
