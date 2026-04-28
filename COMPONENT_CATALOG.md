# Component Catalog Reference

This document provides complete implementation details for all UI components in CompetitorGap AI.

## Button Component

**File**: `src/components/ui/Button.tsx`

### Full Implementation
```tsx
'use client'

import React from 'react'
import { cva, type VariantProps } from 'class-variance-authority'
import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'
import { Loader2 } from 'lucide-react'

const buttonVariants = cva(
    'inline-flex items-center justify-center font-medium transition-all duration-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-offset-ink-950 disabled:opacity-50 disabled:cursor-not-allowed will-change-transform active:scale-95',
    {
        variants: {
            variant: {
                primary: 'bg-gradient-to-br from-gold to-[#b38d22] text-ink-950 hover:brightness-110 focus:ring-gold/50 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)] hover:shadow-[0_6px_20px_rgba(212,175,55,0.23),0_4px_15px_rgba(212,175,55,0.5)] shadow-glass-inner border border-[#e6cc80]',
                secondary: 'glass-card text-text-primary hover:bg-gold/10 hover:border-gold/30 focus:ring-gold/50 transition-colors',
                ghost: 'text-text-secondary hover:text-text-primary hover:bg-ink-800/80 rounded-xl',
                danger: 'bg-danger/10 text-danger border border-danger/20 hover:bg-danger/20 focus:ring-danger/50 shadow-glass-inner',
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
```

### Usage Examples
```tsx
// Primary CTA
<Button variant="primary" size="lg">
  Start Analysis
</Button>

// With icon
<Button variant="primary" size="md">
  <ArrowRight className="h-4 w-4" />
  Continue
</Button>

// Loading state
<Button variant="primary" isLoading>
  Analyzing...
</Button>

// Secondary action
<Button variant="secondary" size="md">
  View Details
</Button>

// Danger action
<Button variant="danger" size="sm">
  Delete Report
</Button>
```

---

## Card Component

**File**: `src/components/ui/Card.tsx`

### Full Implementation
```tsx
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
```

### Usage Examples
```tsx
// Basic card
<Card className="p-6">
  <h3>Content</h3>
</Card>

// Hoverable card
<Card hover className="p-4">
  <p>Click me</p>
</Card>

// Premium card with gold border
<Card goldBorder className="p-8">
  <h2>Premium Feature</h2>
</Card>

// Interactive card
<Card hover onClick={() => navigate('/report')}>
  <div className="p-6">Report Preview</div>
</Card>
```

---

## Input Components

**File**: `src/components/ui/Input.tsx`

### Text Input Implementation
```tsx
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
```

### Textarea Implementation
```tsx
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
```

### Usage Examples
```tsx
// Basic input
<Input 
  label="Company Name"
  placeholder="e.g., Acme Corp"
/>

// With validation
<Input 
  label="Email"
  type="email"
  error={errors.email}
  placeholder="you@company.com"
/>

// With hint
<Input 
  label="Website"
  hint="Optional - helps improve analysis accuracy"
  placeholder="https://..."
/>

// Textarea
<Textarea
  label="Product Description"
  rows={4}
  placeholder="Describe what your product does..."
  hint="Be specific about key features and target market"
/>
```

---

## Badge Component

**File**: `src/components/ui/Badge.tsx`

### Full Implementation
```tsx
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
```

### Usage Examples
```tsx
// Status badges
<Badge variant="success">Active</Badge>
<Badge variant="warning">Pending</Badge>
<Badge variant="danger">Failed</Badge>

// Info badge
<Badge variant="info">Processing</Badge>

// Premium badge
<Badge variant="gold" size="md">Pro</Badge>

// With icons
<Badge variant="success">
  <Check className="h-3 w-3 mr-1" />
  Verified
</Badge>
```

---

## Layout Patterns

### Page Container
```tsx
<div className="min-h-screen bg-ink-950">
  <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
    {/* Content */}
  </div>
</div>
```

### Section Wrapper
```tsx
<section className="py-16 md:py-24">
  <div className="max-w-5xl mx-auto px-4">
    <h2 className="text-3xl md:text-4xl font-display font-semibold mb-8">
      Section Title
    </h2>
    {/* Section content */}
  </div>
</section>
```

### Grid Layouts
```tsx
// 2-column grid
<div className="grid grid-cols-1 md:grid-cols-2 gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</div>

// 3-column grid
<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
  <Card>Item 3</Card>
</div>

// Auto-fit grid (responsive)
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```

### Flex Layouts
```tsx
// Horizontal stack with gap
<div className="flex items-center gap-4">
  <Button>Action 1</Button>
  <Button variant="secondary">Action 2</Button>
</div>

// Space between
<div className="flex items-center justify-between">
  <h3>Title</h3>
  <Button size="sm">Edit</Button>
</div>

// Vertical stack
<div className="flex flex-col gap-6">
  <Card>Item 1</Card>
  <Card>Item 2</Card>
</div>
```

---

## Modal Pattern

### Basic Modal Structure
```tsx
import { Modal } from '@/components/ui/Modal'

<Modal isOpen={isOpen} onClose={() => setIsOpen(false)}>
  <div className="p-6">
    <h2 className="text-2xl font-semibold mb-4">Modal Title</h2>
    <p className="text-secondary mb-6">Modal content</p>
    <div className="flex gap-3 justify-end">
      <Button variant="ghost" onClick={() => setIsOpen(false)}>
        Cancel
      </Button>
      <Button variant="primary" onClick={handleSubmit}>
        Confirm
      </Button>
    </div>
  </div>
</Modal>
```

---

## Loading States

### Spinner
```tsx
import { Spinner } from '@/components/ui/Spinner'

<Spinner size="sm" />   // 16px
<Spinner size="md" />   // 24px
<Spinner size="lg" />   // 32px
```

### Button Loading
```tsx
<Button isLoading>
  Processing...
</Button>
```

### Skeleton Loader
```tsx
<div className="animate-pulse space-y-4">
  <div className="h-4 bg-ink-800 rounded w-3/4"></div>
  <div className="h-4 bg-ink-800 rounded w-1/2"></div>
  <div className="h-4 bg-ink-800 rounded w-5/6"></div>
</div>
```

---

## Toast Notifications

### Usage
```tsx
import { useToast } from '@/components/ui/Toast'

const { showToast } = useToast()

// Success
showToast('Report generated successfully!', 'success')

// Error
showToast('Failed to analyze. Please try again.', 'error')

// Info
showToast('Analysis in progress...', 'info')

// Warning
showToast('Low credits remaining', 'warning')
```

---

## Common Composite Patterns

### Stat Card
```tsx
<Card className="p-6">
  <div className="flex items-center justify-between">
    <div>
      <p className="text-sm text-secondary">Total Reports</p>
      <p className="text-3xl font-bold text-primary mt-1">24</p>
    </div>
    <div className="h-12 w-12 rounded-full bg-gold/10 flex items-center justify-center">
      <TrendingUp className="h-6 w-6 text-gold" />
    </div>
  </div>
  <div className="mt-4 flex items-center gap-2">
    <Badge variant="success" size="sm">+12%</Badge>
    <span className="text-xs text-muted">vs last month</span>
  </div>
</Card>
```

### Feature Card
```tsx
<Card hover className="p-6">
  <div className="h-12 w-12 rounded-xl bg-gold/10 flex items-center justify-center mb-4">
    <Zap className="h-6 w-6 text-gold" />
  </div>
  <h3 className="text-xl font-semibold mb-2">Quick Wins</h3>
  <p className="text-secondary text-sm">
    Actionable insights you can implement this week
  </p>
</Card>
```

### List Item
```tsx
<Card hover className="p-4">
  <div className="flex items-center justify-between">
    <div className="flex items-center gap-4">
      <div className="h-10 w-10 rounded-full bg-ink-800 flex items-center justify-center">
        <Target className="h-5 w-5 text-gold" />
      </div>
      <div>
        <h4 className="font-medium">Report Title</h4>
        <p className="text-sm text-secondary">Generated 2 hours ago</p>
      </div>
    </div>
    <Button variant="ghost" size="sm">
      <ArrowRight className="h-4 w-4" />
    </Button>
  </div>
</Card>
```

### Empty State
```tsx
<div className="text-center py-12">
  <div className="h-16 w-16 rounded-full bg-ink-800 flex items-center justify-center mx-auto mb-4">
    <AlertCircle className="h-8 w-8 text-secondary" />
  </div>
  <h3 className="text-xl font-semibold mb-2">No reports yet</h3>
  <p className="text-secondary mb-6">
    Start your first competitive analysis to see results here
  </p>
  <Button variant="primary">
    Create Report
  </Button>
</div>
```

---

## Form Patterns

### Login Form
```tsx
<form onSubmit={handleSubmit} className="space-y-4">
  <Input
    label="Email"
    type="email"
    placeholder="you@company.com"
    error={errors.email}
    required
  />
  <Input
    label="Password"
    type="password"
    placeholder="••••••••"
    error={errors.password}
    required
  />
  <Button type="submit" className="w-full" isLoading={isLoading}>
    Sign In
  </Button>
</form>
```

### Analysis Form
```tsx
<form onSubmit={handleAnalyze} className="space-y-6">
  <Input
    label="Company Name"
    placeholder="e.g., Acme Corp"
    required
  />
  <Input
    label="Product Name"
    placeholder="e.g., Acme CRM"
    required
  />
  <Textarea
    label="Product Description"
    rows={4}
    placeholder="Describe what your product does..."
    hint="Be specific about key features and target market"
    required
  />
  <Input
    label="Industry/Domain"
    placeholder="e.g., SaaS, E-commerce, FinTech"
    required
  />
  <Input
    label="Target Market"
    placeholder="e.g., Small businesses, Enterprise, B2C"
    required
  />
  <Input
    label="Website (Optional)"
    type="url"
    placeholder="https://..."
    hint="Helps improve analysis accuracy"
  />
  <Button type="submit" size="lg" className="w-full" isLoading={isAnalyzing}>
    <Zap className="h-5 w-5" />
    Analyze Competitors
  </Button>
</form>
```

---

## Responsive Utilities

### Show/Hide on Breakpoints
```tsx
<div className="hidden md:block">Desktop only</div>
<div className="block md:hidden">Mobile only</div>
<div className="hidden lg:block">Large screens only</div>
```

### Responsive Text
```tsx
<h1 className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl">
  Responsive Heading
</h1>
```

### Responsive Spacing
```tsx
<div className="p-4 md:p-6 lg:p-8">
  Responsive padding
</div>

<div className="space-y-4 md:space-y-6 lg:space-y-8">
  Responsive vertical spacing
</div>
```

### Responsive Grid
```tsx
<div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
  {items.map(item => <Card key={item.id}>{item}</Card>)}
</div>
```
