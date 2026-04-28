---
name: design
description: "Use this skill whenever the user wants to modify UI components, change styling, add new visual elements, or update the design system. Triggers include: mentions of 'button', 'color', 'style', 'UI', 'design', 'theme', 'layout', 'component', 'visual', or requests to make something 'look better', 'prettier', 'modern', or change any visual aspect of the application. Also use when creating new components or modifying existing ones to ensure design consistency."
---

# CompetitorGap AI Design System

## Design Philosophy
**Premium Dark Intelligence Aesthetic** — A sophisticated dark theme combining military-grade intelligence UI with luxury fintech aesthetics. Think Bloomberg Terminal meets high-end SaaS.

## Core Design Principles
1. **Glass Morphism** — Layered transparency with backdrop blur
2. **Gold Accent System** — Strategic use of gold (#d4af37) for premium feel
3. **Subtle Motion** — Smooth transitions, no jarring animations
4. **Information Density** — Board-ready intelligence, not consumer fluff
5. **Accessibility First** — High contrast, readable typography

---

## Color System

### Primary Palette
```css
/* Dark Ink Backgrounds */
--ink-950: #05060A   /* Body background */
--ink-900: #0A0B10   /* Card backgrounds */
--ink-800: #11121A   /* Input backgrounds */
--ink-700: #1A1C28   /* Borders, dividers */

/* Accent Colors */
--gold: #d4af37              /* Primary accent, CTAs */
--gold-muted: rgba(212,175,55,0.15)  /* Subtle backgrounds */
--steel: #6b8cba             /* Secondary accent, info states */
--steel-muted: rgba(107,140,186,0.1)

/* Text Hierarchy */
--text-primary: #f0ede8    /* Headings, primary content */
--text-secondary: #9896a4  /* Labels, secondary content */
--text-muted: #5c5a6e      /* Hints, disabled states */

/* Semantic Colors */
--success: #4ade80   /* Positive states, growth signals */
--danger: #f87171    /* Errors, warnings, threats */
--warning: #fbbf24   /* Caution states */
```

### Usage Rules
- **Never use pure white** (#fff) — always use `--text-primary` (#f0ede8)
- **Never use pure black** (#000) — always use `--ink-950` or darker
- **Gold is premium** — use sparingly for CTAs, highlights, key metrics
- **Steel for secondary** — info badges, secondary actions
- **Semantic colors** — only for their intended purpose (success = green, danger = red)

---

## Typography

### Font Stack
```typescript
font-display: 'Playfair Display' (serif)  // Headings, hero text
font-sans: 'DM Sans' (sans-serif)         // Body, UI elements
font-mono: 'JetBrains Mono' (monospace)   // Code, data tables
```

### Type Scale
```tsx
// Headings
<h1 className="text-5xl md:text-6xl font-display font-bold">
<h2 className="text-3xl md:text-4xl font-display font-semibold">
<h3 className="text-2xl font-sans font-semibold">
<h4 className="text-xl font-sans font-medium">

// Body
<p className="text-base text-secondary">     // Default paragraph
<p className="text-sm text-muted">           // Helper text
<p className="text-xs text-muted">           // Captions, timestamps
```

### Typography Rules
- **Headings** — Use `font-display` (Playfair) for H1/H2, `font-sans` for H3+
- **Line height** — 1.5 for body, 1.2 for headings
- **Letter spacing** — Default for body, tight (-0.02em) for large headings
- **Text color** — Always use CSS variables, never hardcoded hex

---

## Component Patterns

### 1. Buttons

**Primary Button** (Gold gradient, high-impact CTAs)
```tsx
<Button variant="primary" size="md">
  Analyze Competitors
</Button>

// Renders as:
className="bg-gradient-to-br from-gold to-[#b38d22] text-ink-950 
  hover:brightness-110 shadow-[0_4px_14px_0_rgba(212,175,55,0.39)]
  hover:shadow-[0_6px_20px_rgba(212,175,55,0.23)] 
  rounded-xl px-5 py-2.5 active:scale-95"
```

**Secondary Button** (Glass card, lower priority)
```tsx
<Button variant="secondary" size="md">
  View Report
</Button>

// Renders as:
className="glass-card text-text-primary hover:bg-gold/10 
  hover:border-gold/30 rounded-xl px-5 py-2.5"
```

**Ghost Button** (Minimal, tertiary actions)
```tsx
<Button variant="ghost" size="sm">
  Cancel
</Button>
```

**Danger Button** (Destructive actions)
```tsx
<Button variant="danger" size="md">
  Delete Report
</Button>
```

**Button Sizes**
- `sm` — px-3 py-1.5 text-sm (inline actions, table rows)
- `md` — px-5 py-2.5 text-sm (default, forms, modals)
- `lg` — px-7 py-3 text-base (hero CTAs, primary landing actions)

**Button States**
- Loading: Shows `<Loader2>` spinner, disabled
- Disabled: opacity-50, cursor-not-allowed
- Active: scale-95 (pressed state)

**Rules**
- Primary buttons = gold gradient only
- Max 1 primary button per screen section
- Use `isLoading` prop, never manually add spinners
- Always include gap-2 for icon spacing

---

### 2. Cards

**Standard Card** (Reports, content blocks)
```tsx
<Card className="p-6">
  {children}
</Card>

// Renders as:
className="rounded-xl bg-ink-900/80 backdrop-blur-sm 
  border border-ink-700/50"
```

**Hoverable Card** (Clickable items, links)
```tsx
<Card hover className="p-4">
  {children}
</Card>

// Adds:
hover:border-gold/20 hover:bg-ink-800/60 
hover:shadow-lg hover:shadow-gold/5 cursor-pointer
```

**Gold Border Card** (Premium features, highlights)
```tsx
<Card goldBorder className="p-6">
  {children}
</Card>

// Uses:
border-gold/30 instead of border-ink-700/50
```

**Glass Card** (Overlays, modals, floating elements)
```tsx
<div className="glass-card p-6">
  {children}
</div>

// Utility class:
backdrop-filter: blur(12px)
background: rgba(17,18,26,0.65)
border: 1px solid rgba(255,255,255,0.08)
box-shadow: 0 8px 32px rgba(0,0,0,0.4)
```

**Rules**
- Always use `rounded-xl` (12px radius)
- Never use sharp corners (rounded-none)
- Padding: p-4 (small), p-6 (default), p-8 (large sections)
- Hover states only on interactive cards

---

### 3. Inputs & Forms

**Text Input**
```tsx
<Input 
  label="Company Name"
  placeholder="e.g., Acme Corp"
  error={errors.name}
  hint="The official company name"
/>

// Renders as:
bg-ink-800/60 border-ink-700
focus:border-gold/50 focus:ring-1 focus:ring-gold/30
rounded-lg px-4 py-2.5
```

**Textarea**
```tsx
<Textarea
  label="Description"
  rows={4}
  placeholder="Describe your product..."
/>
```

**Input States**
- Default: `border-ink-700`
- Focus: `border-gold/50 ring-1 ring-gold/30`
- Error: `border-danger/50 focus:border-danger focus:ring-danger/30`
- Disabled: `opacity-50 cursor-not-allowed`

**Rules**
- Always include labels (accessibility)
- Use `hint` for helper text, `error` for validation
- Placeholder text = `text-muted` color
- Never use `outline-none` without focus ring

---

### 4. Badges

**Status Badges**
```tsx
<Badge variant="success" size="sm">Active</Badge>
<Badge variant="warning" size="sm">Pending</Badge>
<Badge variant="danger" size="sm">Failed</Badge>
<Badge variant="info" size="sm">Processing</Badge>
<Badge variant="gold" size="sm">Premium</Badge>
<Badge variant="neutral" size="sm">Draft</Badge>
```

**Variants**
- `success` — Green, for positive states (growth, active)
- `warning` — Yellow, for caution (pending, review)
- `danger` — Red, for errors (failed, critical)
- `info` — Steel blue, for informational (processing)
- `gold` — Gold, for premium features
- `neutral` — Gray, for default states

**Sizes**
- `sm` — px-2 py-0.5 text-xs (inline, tables)
- `md` — px-3 py-1 text-sm (standalone)

**Rules**
- Always `rounded-full`
- Use semantic variants correctly
- Don't use badges as buttons

---

### 5. Spacing & Layout

**Container Widths**
```tsx
max-w-7xl   // Main content (1280px)
max-w-5xl   // Reports, articles (1024px)
max-w-3xl   // Forms, modals (768px)
max-w-2xl   // Narrow content (672px)
```

**Section Padding**
```tsx
py-12 md:py-16  // Small sections
py-16 md:py-24  // Default sections
py-20 md:py-32  // Hero, major sections
```

**Gap System**
```tsx
gap-2   // Tight (8px) — button icons, inline elements
gap-4   // Default (16px) — form fields, list items
gap-6   // Medium (24px) — card grids
gap-8   // Large (32px) — section spacing
gap-12  // XL (48px) — major section breaks
```

**Rules**
- Use responsive padding (sm/md/lg breakpoints)
- Consistent vertical rhythm (multiples of 4px)
- Never use arbitrary values like `gap-[13px]`

---

## Animation & Motion

### Transitions
```tsx
transition-all duration-300  // Default (buttons, cards)
transition-colors duration-200  // Color-only changes
transition-transform duration-150  // Micro-interactions
```

### Keyframe Animations
```tsx
animate-fade-up    // Entry animations (0.6s)
animate-fade-in    // Simple fades (0.4s)
animate-shimmer    // Loading states (2s loop)
animate-float      // Subtle floating (6s loop)
animate-scan       // Scanning effect (3s loop)
```

### Hover States
```tsx
hover:brightness-110  // Brighten (gold buttons)
hover:scale-105       // Grow (cards, images)
active:scale-95       // Press (buttons)
hover:shadow-lg       // Elevate (cards)
```

**Rules**
- Keep animations under 600ms
- Use `will-change-transform` for performance
- Disable animations in `prefers-reduced-motion`
- Never animate layout shifts

---

## Special Effects

### Glass Morphism
```tsx
// Light glass (modals, overlays)
className="glass"
// backdrop-filter: blur(16px)
// background: rgba(10,11,16,0.75)

// Card glass (content blocks)
className="glass-card"
// backdrop-filter: blur(12px)
// background: rgba(17,18,26,0.65)
```

### Gold Glow
```tsx
className="gold-glow"
// box-shadow: 0 0 20px rgba(201,168,76,0.15), 
//             0 0 60px rgba(201,168,76,0.05)
```

### Text Gradients
```tsx
className="text-gradient-gold"
// background: linear-gradient(135deg, #d4af37 0%, #fcecba 50%, #c19b26 100%)
// -webkit-background-clip: text
// -webkit-text-fill-color: transparent
```

### Background Effects
```tsx
// Radial gradient glow (hero sections)
background: radial-gradient(circle at 50% -20%, 
  rgba(212,175,55,0.08), transparent 50%)

// Noise texture (body::after)
background-image: url("data:image/svg+xml,...")
opacity: 0.04
```

**Rules**
- Use glass effects for layering depth
- Gold glow only on premium elements
- Noise texture = subtle (max 0.04 opacity)
- Test effects on low-end devices

---

## Responsive Design

### Breakpoints
```typescript
xs: '480px'   // Small phones
sm: '640px'   // Large phones
md: '768px'   // Tablets
lg: '1024px'  // Laptops
xl: '1280px'  // Desktops
2xl: '1536px' // Large screens
```

### Mobile-First Patterns
```tsx
// Typography
text-3xl md:text-5xl  // Smaller on mobile

// Spacing
py-8 md:py-16  // Less padding on mobile

// Grid
grid-cols-1 md:grid-cols-2 lg:grid-cols-3

// Visibility
hidden md:block  // Hide on mobile
```

**Rules**
- Design mobile-first, enhance for desktop
- Touch targets min 44px on mobile
- Test on 375px width (iPhone SE)
- Stack grids vertically on mobile

---

## Icon System

**Library**: Lucide React

**Common Icons**
```tsx
import { 
  ArrowRight,    // CTAs, navigation
  Check,         // Success, completed
  X,             // Close, remove
  AlertCircle,   // Warnings, errors
  Info,          // Information
  Loader2,       // Loading states
  TrendingUp,    // Growth, positive
  TrendingDown,  // Decline, negative
  Target,        // Goals, opportunities
  Zap,           // Quick wins, speed
  Shield,        // Security, trust
  Brain,         // AI, intelligence
} from 'lucide-react'
```

**Icon Sizes**
```tsx
h-4 w-4   // Inline text, buttons (16px)
h-5 w-5   // Default UI (20px)
h-6 w-6   // Section icons (24px)
h-8 w-8   // Feature icons (32px)
h-12 w-12 // Hero icons (48px)
```

**Rules**
- Always set both height and width
- Use `strokeWidth={1.5}` for consistency
- Color: `text-gold` (primary), `text-secondary` (default)
- Animate with `animate-spin` for loaders

---

## Data Visualization

### Charts (Recharts)
```tsx
// Color palette for charts
const CHART_COLORS = {
  primary: '#d4af37',    // Gold
  secondary: '#6b8cba',  // Steel
  success: '#4ade80',    // Green
  danger: '#f87171',     // Red
  neutral: '#9896a4',    // Gray
}

// Grid styling
stroke="rgba(255,255,255,0.05)"
strokeDasharray="3 3"

// Tooltip styling
contentStyle={{
  backgroundColor: 'rgba(17,18,26,0.95)',
  border: '1px solid rgba(255,255,255,0.1)',
  borderRadius: '8px',
}}
```

### Radar Charts (Positioning)
```tsx
// Concentric rings
border-gold/20 opacity-30

// Axes
stroke="rgba(201,168,76,0.15)"

// Data fill
fill="rgba(212,175,55,0.2)"
stroke="#d4af37"
```

**Rules**
- Use gold for primary data series
- Steel for secondary/comparison
- Keep backgrounds dark (ink-900/95)
- Ensure text contrast (min 4.5:1)

---

## Accessibility

### Color Contrast
- Text on dark: min 4.5:1 ratio
- Large text (18px+): min 3:1 ratio
- Interactive elements: min 3:1 ratio

### Focus States
```tsx
focus:outline-none focus:ring-2 focus:ring-gold/50 
focus:ring-offset-2 focus:ring-offset-ink-950
```

### ARIA Labels
```tsx
<button aria-label="Close modal">
  <X className="h-4 w-4" />
</button>
```

### Keyboard Navigation
- All interactive elements must be keyboard accessible
- Tab order follows visual flow
- Escape closes modals/dropdowns

**Rules**
- Never remove focus indicators
- Test with keyboard only
- Use semantic HTML (`<button>`, not `<div onClick>`)
- Provide alt text for images

---

## Common Mistakes to Avoid

❌ **Don't**
- Use pure white (#fff) or pure black (#000)
- Hardcode colors instead of CSS variables
- Use `outline-none` without focus ring
- Mix `rounded-lg` and `rounded-xl` in same component
- Add animations longer than 600ms
- Use gold everywhere (it loses premium feel)
- Create buttons with `<div onClick>`
- Forget mobile responsiveness

✅ **Do**
- Use CSS variables from globals.css
- Apply glass effects for depth
- Keep gold for premium/primary elements
- Use semantic HTML
- Test on mobile (375px width)
- Maintain consistent spacing (4px grid)
- Add loading states to async actions
- Follow the component patterns above

---

## Quick Reference

### Most Common Classes
```tsx
// Containers
"max-w-7xl mx-auto px-4 sm:px-6 lg:px-8"

// Cards
"glass-card rounded-xl p-6"

// Buttons
"bg-gradient-to-br from-gold to-[#b38d22] text-ink-950 rounded-xl px-5 py-2.5"

// Text
"text-text-primary font-sans"
"text-text-secondary text-sm"

// Spacing
"space-y-6"  // Vertical stack
"gap-4"      // Grid/flex gap

// Hover
"transition-all duration-300 hover:border-gold/20"
```

### File Locations
- **Global styles**: `src/app/globals.css`
- **Tailwind config**: `tailwind.config.ts`
- **UI components**: `src/components/ui/`
- **Color system**: CSS variables in `:root`

---

## When Making Changes

1. **Check existing components** in `src/components/ui/` first
2. **Use CSS variables** from `globals.css`, never hardcode
3. **Follow the variant system** (Button, Badge have defined variants)
4. **Test responsive** on mobile (375px), tablet (768px), desktop (1280px)
5. **Maintain consistency** — if changing button style, update all buttons
6. **Preserve accessibility** — focus states, ARIA labels, semantic HTML
7. **Keep animations subtle** — this is enterprise software, not a game

## Examples of Good Changes

✅ "Change primary button color to steel blue"
→ Update `buttonVariants.primary` in Button.tsx, use `from-steel to-[#5a7ba0]`

✅ "Add hover effect to competitor cards"
→ Add `hover` prop to Card component in CompetitorCards.tsx

✅ "Make form inputs larger on mobile"
→ Update Input.tsx: `py-2.5 md:py-2.5` → `py-3 md:py-2.5`

✅ "Add a new badge variant for 'beta' features"
→ Add to `badgeVariants` in Badge.tsx: `beta: 'bg-steel/10 text-steel border-steel/20'`
