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
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform active:scale-95',
    {
        variants: {
            variant: {
                primary:
                    'bg-gradient-to-br from-gold to-[#b38d22] text-ink-950 hover:brightness-110 focus:ring-gold/50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23),0_4px_15px_rgba(212,175,55,0.5)] shadow-glass-inner border border-[#e6cc80]',
                secondary:
                    'glass-card text-text-primary hover:bg-gold/10 hover:border-gold/30 focus:ring-gold/50 transition-colors',
                ghost:
                    'text-text-secondary hover:text-text-primary hover:bg-ink-800/80 rounded-xl',
                danger:
                    'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 focus:ring-danger/50 shadow-glass-inner',
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
