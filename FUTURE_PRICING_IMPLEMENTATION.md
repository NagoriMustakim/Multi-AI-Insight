# CompetitorGap AI: Pricing Implementation Plan

## Overview
This document outlines the technical implementation plan for the optimized "Audible Credit Model" (featuring Credit Inflation & Yearly Toggles), the Free Trial Abuse Protection system, and the future "AI Competitor Ping" feature. 

This document is designed to be fed into an AI code editor (like Cursor or Windsurf) to rapidly scaffold the billing infrastructure.

---

## 1. The Credit Inflation Model (Primary Subscriptions)
We use a 3-Tier "Credit Inflation" pricing strategy. In this system, generating **1 Deep Gap Analysis Report costs 10 Credits.**

### 🥉 Tier 1: "Indie" Plan 
*Designed for solo founders validating a niche.*
*   **Monthly:** $15 / month
*   **Yearly (20% Off):** $144 / year ($12/mo)
*   **Credits:** 20 AI Credits per month (Generates 2 Reports).
*   **Rollover:** Unused credits roll over to the next month only (Max balance: 40).

### 🥈 Tier 2: "Growth" Plan (The Target Plan)
*Designed for SaaS startups tracking their core market.*
*   **Monthly:** $29 / month
*   **Yearly (20% Off):** $288 / year ($24/mo)
*   **Credits:** 50 AI Credits per month (Generates 5 Reports).
*   **Rollover:** Rolls over for 3 months (Max balance: 150).

### 🥇 Tier 3: "Scale" Plan (The Anchor Plan)
*Designed for Marketing Agencies handling multiple clients.*
*   **Monthly:** $79 / month
*   **Yearly (20% Off):** $768 / year ($64/mo)
*   **Credits:** 150 AI Credits per month (Generates 15 Reports).
*   **Rollover:** Rolls over for 6 months (Max balance: 900).

### Add-On Purchases
If a user burns through their plan's credits, the "Generate" button triggers a Stripe Modal:
**"Buy 50 Extra Credits for $25"** (Slightly more expensive per credit than the Growth plan, pushing heavy users to naturally upgrade to Scale).

---

## 2. Database Schema Updates (Supabase)
```sql
-- User Subscription Profile
ALTER TABLE users ADD COLUMN subscription_tier text DEFAULT 'free'; -- e.g., 'free', 'indie_monthly', 'growth_yearly'
ALTER TABLE users ADD COLUMN subscription_status text DEFAULT 'inactive';
ALTER TABLE users ADD COLUMN available_credits integer DEFAULT 0;

-- Credits Ledger (for tracking expiry and rollover)
CREATE TABLE credit_ledger (
    id uuid PRIMARY KEY,
    user_id uuid REFERENCES users(id),
    amount integer NOT NULL,
    transaction_type text, -- 'subscription_grant', 'add_on_purchase', 'report_usage', 'trial_grant'
    created_at timestamp DEFAULT now(),
    expires_at timestamp
);
```

---

## 3. The Front-End UI Architecture
### UI Components Needed
1.  **Credit Balance Indicator:** A prominent display in the dashboard header (e.g., "🪙 40 Credits").
2.  **Generate Button State:** The "Generate Report" button checks the user's balance.
    *   If balance >= 10: Active -> "Generate Report (10 Credits)".
    *   If balance < 10: Triggers Up-sell Modal -> "Not enough credits. Top up 50 Credits for $25!"
3.  **Pricing Page Toggle:** Implementation of a Monthly / Yearly switch that crosses out the monthly price and highlights the 20% annual savings.

---

## 4. Abuse-Proof Free Trial System (The "Card-On-File" Wall)
Since solo founders often use @gmail.com or @yahoo.com addresses before launching their company domains, we **cannot** block free email addresses. However, to prevent malicious users from spinning up 100 fake Gmails to steal free API runs, we must implement a strict "Credit Card on File" wall via Stripe.

### Implementation Strategy
1.  **Zero-Credit Signups:** When a user creates an account, `available_credits` is set to 0. They can view the dashboard and see demo data but cannot run a real AI report.
2.  **Stripe Trial Initiation:** To get their free trial (e.g., 20 Free Credits = 2 Free Reports), the user must click "Start 7-Day Free Trial".
3.  **The Checkout Wall:** This button routes them to a Stripe Checkout Session configured with a 7-day free trial period for the $29 Growth Plan. **They must input a valid Credit/Debit Card.**
4.  **Credit Dispensation:** If Stripe verifies the true card identity, a webhook fires back to Supabase granting the 20 Trial Credits immediately.
5.  **Fair Billing:** If the user cancels the subscription in your dashboard before Day 7, Stripe does *not* charge the card. If they don't cancel, they automatically roll into the active Growth Plan and are charged $29. This permanently stops 99.9% of scammers while allowing legitimate solo founders to test the product safely.

---

## 5. AI Competitor Ping (Future Roadmap)
To be implemented *after* the core product achieves product-market fit.
*   **Cost:** 1 Credit per day per competitor tracked (granular costing enabled by the inflated system).
*   **Action:** The system monitors the user's top 3 competitors 24/7 for changes to pricing or massive new features.
*   **Technical Pipeline:** A background worker (Vercel Cron) scrapes the target URLs daily. If the DOM hash changes, trigger an LLM (Claude/GPT) to summarize *what* changed, and instantly email the user.
