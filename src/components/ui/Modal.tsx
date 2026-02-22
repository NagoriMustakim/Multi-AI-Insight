'use client'

import React from 'react'
import * as DialogPrimitive from '@radix-ui/react-dialog'
import { X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'

interface ModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    children: React.ReactNode
    title?: string
    description?: string
}

export function Modal({ open, onOpenChange, children, title, description }: ModalProps) {
    return (
        <DialogPrimitive.Root open={open} onOpenChange={onOpenChange}>
            <AnimatePresence>
                {open && (
                    <DialogPrimitive.Portal forceMount>
                        <DialogPrimitive.Overlay asChild>
                            <motion.div
                                className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                transition={{ duration: 0.2 }}
                            />
                        </DialogPrimitive.Overlay>
                        <DialogPrimitive.Content asChild>
                            <motion.div
                                className="fixed left-[50%] top-[50%] z-50 w-full max-w-lg translate-x-[-50%] translate-y-[-50%] rounded-2xl glass border border-ink-700/50 p-6 shadow-2xl"
                                initial={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                                animate={{ opacity: 1, scale: 1, y: '-50%', x: '-50%' }}
                                exit={{ opacity: 0, scale: 0.95, y: '-48%', x: '-50%' }}
                                transition={{ duration: 0.2, ease: 'easeOut' }}
                            >
                                <div className="flex items-start justify-between mb-4">
                                    <div>
                                        {title && (
                                            <DialogPrimitive.Title className="text-lg font-semibold text-[var(--text-primary)]">
                                                {title}
                                            </DialogPrimitive.Title>
                                        )}
                                        {description && (
                                            <DialogPrimitive.Description className="text-sm text-[var(--text-secondary)] mt-1">
                                                {description}
                                            </DialogPrimitive.Description>
                                        )}
                                    </div>
                                    <DialogPrimitive.Close className="rounded-lg p-1.5 text-[var(--text-muted)] hover:text-[var(--text-primary)] hover:bg-ink-800 transition-colors">
                                        <X className="h-4 w-4" />
                                    </DialogPrimitive.Close>
                                </div>
                                {children}
                            </motion.div>
                        </DialogPrimitive.Content>
                    </DialogPrimitive.Portal>
                )}
            </AnimatePresence>
        </DialogPrimitive.Root>
    )
}
