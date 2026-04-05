# Product Requirements Document: CompetitorGap AI 
**Version:** 1.0 (Live Brownfield Documentation)
**Last Updated:** 2026-03-31

---

## 1. Product Overview & Vision
### Vision Statement
CompetitorGap AI is an elite, multi-agent artificial intelligence platform designed to replace days of manual market research with a single 3-minute generation flow. By synthesizing live web data with deep language model reasoning, it provides startups, SaaS founders, and marketing agencies with "board-ready" competitive intelligence. 

### Target Audience
1. **SaaS Founders & PMs:** Seeking immediate tactical advantages, feature gap identification, and pricing strategy optimization.
2. **Marketing & UX Agencies:** Requiring pristine, deeply analytical deliverables to present to their clients to justify retainers and strategic direction.

### Positioning
Positioned as an "Apple-level Premium" enterprise tool. It entirely rejects the "cheap AI wrapper" aesthetic in favor of heavy glassmorphism, precise data visualizations, and high-fidelity insights that justify a $29-$79/month subscription.

---

## 2. Technical Architecture
### Frontend Stack
* **Framework:** Next.js 14+ (App Router)
* **Styling:** Tailwind CSS (Custom Dark Mode: `#05060A` Slate Core, Luminous Gold Accents)
* **Components:** Custom Radix-style UI primitives (`Button`, `AuthModal`).
* **Visualizations:** `recharts` for quantitative graphing (e.g., Radar Charts) and `framer-motion` for fluid, premium micro-interactions.

### Intelligence Pipeline (AI Engine)
The engine operates via a strictly defined two-phase pipeline defined in `src/lib/ai-engine.ts`:
1. **Phase 1 (Live Data Acquisition):** Perplexity AI (`sonar-deep-research`) conducts deep, real-time scraping of the target company and up to 4 direct competitors. It extracts feature sets, exact pricing models, funding rounds, and raw customer sentiment from review boards (G2, Trustpilot).
2. **Phase 2 (Synthesis & Formatting):** Anthropic's Claude (`claude-sonnet-4`) ingests the unstructured market research. Using a rigorous McKinsey-style prompt, it acts as an analytical synthesizer, outputting a strictly typed `CompetitorReport` JSON artifact containing feature gaps, quick wins, and an overarching executive summary.

### Backend Services
* **Database & Auth:** Supabase (Next.js SSR integrated via `@supabase/ssr`).
* **Payments & Subscriptions:** Razorpay integration managing both recurring billing and one-off credit top-ups (`src/lib/razorpay.ts`).
* **Compute:** Vercel Edge/Serverless functions (`src/app/api/...`).

---

## 3. Database Schema (Supabase)
The database focuses heavily on user lifecycle and a resilient, ledger-based credit system. 

### `users` Table
Extended standard Supabase Auth profiles to include:
- `subscription_tier`: 'free', 'indie', 'growth', 'scale' (Monthly/Yearly variants).
- `subscription_status`: 'active', 'canceled', 'past_due'.
- `available_credits`: Integer tracking the user's spending power.
- `trial_used`: Boolean preventing free-trial abuse.
- `razorpay_customer_id` / `razorpay_subscription_id`.

### `credit_ledger` Table
An immutable ledger tracking all AI usage to prevent race conditions and ensure accurate rollover accounting.
- Fields: `id`, `user_id`, `amount` (positive for grants, negative for usage), `transaction_type` ('subscription_grant', 'usage', etc.), and `expires_at`.

### Stored Procedures
- `grant_credits(user_id, amount, ...)`: Atomically adds credits and logs the ledger entry.
- `deduct_credits(user_id, amount, ...)`: Atomically verifies balance, subtracts usage, and logs deduction.

---

## 4. Business Model & Billing (The "Credit Inflation" Model)
CompetitorGap AI operates on a high-value consumable model where **1 Generation = 10 Credits**. 

### Subscription Tiers (Razorpay)
1. **Indie ($15/mo or $144/yr):** Grants 20 Credits (2 Reports). Maximum rollover balance: 40.
2. **Growth ($29/mo or $288/yr):** Grants 50 Credits (5 Reports). Maximum rollover balance: 150.
3. **Scale ($79/mo or $768/yr):** Grants 150 Credits (15 Reports). Maximum rollover balance: 900.
4. **Ad-Hoc Add-ons:** $25 for 50 Credits via quick-checkout modal.

### Trial Abuse Protection
To block email generators, zero credits are granted on normal signup. Users must bind a credit card via a Razorpay/Stripe trial initialization flow to unlock the 20 Trial Credits.

---

## 5. Core Application Flows

### 1. Onboarding & Dashboard Access
- User lands on the aggressively optimized UI, creates an account using email/password (Supabase Auth).
- Redirected to `/dashboard`. Unpaid users see zero balance and prompts to start trial.

### 2. The Analysis Generation (Wait Time UX)
- User inputs Company Name, Website, and Target Market.
- Hits **"Generate Report (10 Credits)"**.
- The API deducts credits atomically and initiates the `ai-engine.ts` pipeline.
- **UX Strategy:** The UI enters a 3-minute dynamic loading state utilizing `framer-motion` to narrate the AI's internal process ("Connecting to live web research..." → "Scanning competitor landscape..." → "Claude reasoning deeply..."), preventing churn during processing.

### 3. Report Consumption
The final output is rendered via discrete semantic components in `src/components/report`:
- `ExecutiveSummary.tsx`: 3-sentence board-ready brief.
- `CompetitorCards.tsx`: Top 3-4 players, exact pricing, and sentiment.
- `PositioningRadar.tsx`: Interactive Recharts graphic plotting dimensions (Price, Automation, Features).
- `FeatureGapTable.tsx` & `QuickWins.tsx`: Actionable, immediate tasks the user can execute based on gaps.

---

## 6. Future Implementation & Roadmap
1. **AI Competitor Ping:** A 24/7 background worker chron job. For a subscription of 1 Credit/Day, the system scrapes competitor DOMs daily. If updates occur, Claude summarizes the pricing/feature shift and instantly emails the user.
2. **Export Functionality:** Direct dynamic exports of the React components to branded PDF files for agency users.
3. **Admin Panel Expansion:** Enhanced metric tracking for churn forecasting within `/admin/dashboard`.

*(End of PRD)*
