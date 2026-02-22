'use client'

import React from 'react'

interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string
    error?: string
    hint?: string
}

export const Input = React.forwardRef<HTMLInputElement, InputProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--text-secondary)]"
                    >
                        {label}
                    </label>
                )}
                <input
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5 rounded-lg
            bg-ink-800/60 border border-ink-700 
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            transition-all duration-200
            focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger/50 focus:border-danger focus:ring-danger/30' : ''}
            ${className}
          `.trim()}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-danger">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-xs text-[var(--text-muted)]">{hint}</p>
                )}
            </div>
        )
    }
)
Input.displayName = 'Input'

interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
    label?: string
    error?: string
    hint?: string
}

export const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
    ({ label, error, hint, className = '', id, ...props }, ref) => {
        const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

        return (
            <div className="space-y-1.5">
                {label && (
                    <label
                        htmlFor={inputId}
                        className="block text-sm font-medium text-[var(--text-secondary)]"
                    >
                        {label}
                    </label>
                )}
                <textarea
                    ref={ref}
                    id={inputId}
                    className={`
            w-full px-4 py-2.5 rounded-lg resize-none
            bg-ink-800/60 border border-ink-700
            text-[var(--text-primary)] placeholder:text-[var(--text-muted)]
            transition-all duration-200
            focus:outline-none focus:border-gold/50 focus:ring-1 focus:ring-gold/30
            disabled:opacity-50 disabled:cursor-not-allowed
            ${error ? 'border-danger/50 focus:border-danger focus:ring-danger/30' : ''}
            ${className}
          `.trim()}
                    {...props}
                />
                {error && (
                    <p className="text-sm text-danger">{error}</p>
                )}
                {hint && !error && (
                    <p className="text-xs text-[var(--text-muted)]">{hint}</p>
                )}
            </div>
        )
    }
)
Textarea.displayName = 'Textarea'
