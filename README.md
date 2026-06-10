# CompetitorGap AI

**Type a company name. Get a deep competitive-intelligence report in minutes — powered by Claude + Perplexity deep research.**

---

## The Problem

Sales teams, product managers, and agency strategists burn hours — sometimes days — manually researching competitors. They cobble together Google searches, stale G2 reviews, and guesswork into spreadsheets that are outdated the moment they hit "save."

CompetitorGap AI replaces that entire workflow. Enter your company details, and our multi-agent AI pipeline delivers a board-ready competitive intelligence report covering feature gaps, pricing blind spots, market opportunities, and actionable quick wins — in under 3 minutes.

**Live product:** [multiaiinsight.in](https://multiaiinsight.in)

---

## Who It's For

| Segment | What You Get |
|---------|-------------|
| **SaaS Product Teams** | Feature gap analysis and positioning radar against your top competitors — every sprint, not every quarter |
| **Marketing & UX Agencies** | Client-ready competitive reports before every pitch, strategy session, or quarterly review |
| **Founders & PMs** | Real-time market intelligence for fundraising decks, roadmap prioritization, and go-to-market decisions |

---

## How It Works — The AI Pipeline

CompetitorGap uses a **two-phase multi-agent architecture** that combines live web research with deep language model reasoning:

```
┌─────────────────────────────────────────────────────────┐
│  PHASE 1: Live Intelligence Gathering                   │
│  ┌───────────────────────────────────────┐              │
│  │  Perplexity AI (sonar-deep-research)  │              │
│  │  ─────────────────────────────────────│              │
│  │  • Scans live web for competitor data │              │
│  │  • Extracts pricing, features, growth │              │
│  │  • Pulls customer sentiment from G2,  │              │
│  │    Trustpilot, Reddit, app stores     │              │
│  │  • Surfaces recent funding, launches, │              │
│  │    acquisitions from the last 6 months│              │
│  └──────────────┬────────────────────────┘              │
│                 │ Raw research payload                   │
│                 ▼                                        │
│  PHASE 2: Strategic Reasoning                           │
│  ┌───────────────────────────────────────┐              │
│  │  Claude (Extended Thinking Mode)      │              │
│  │  ─────────────────────────────────────│              │
│  │  • Synthesizes research into          │              │
│  │    structured competitive analysis    │              │
│  │  • Maps feature gaps across products  │              │
│  │  • Identifies pricing blind spots     │              │
│  │  • Generates market opportunity matrix│              │
│  │  • Produces actionable quick wins     │              │
│  │  • Outputs structured JSON report     │              │
│  └──────────────┬────────────────────────┘              │
│                 │                                        │
│                 ▼                                        │
│  11-Section Board-Ready Report                          │
│  (Executive Summary, Competitor Cards, Positioning      │
│   Radar, Feature Gap Table, Pricing Analysis,           │
│   Market Opportunities, Quick Wins, and more)           │
└─────────────────────────────────────────────────────────┘
```

This isn't a static database lookup. Every report is generated from **live web data** — meaning your competitive intelligence is as fresh as the internet itself.

---

## Pricing

Uses a **credit-based model** — 1 report = 10 credits.

| Plan | Monthly | Yearly (20% off) | Credits/Month | Reports/Month |
|------|---------|-------------------|---------------|---------------|
| **Indie** | $15/mo | $144/yr | 20 | 2 |
| **Growth** | $29/mo | $288/yr | 50 | 5 |
| **Scale** | $79/mo | $768/yr | 150 | 15 |

Need more? Buy 50 add-on credits for $25 anytime. Unused credits roll over based on plan tier.

---

## Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + Framer Motion |
| UI | Radix UI primitives + Lucide Icons + Recharts |
| Auth | Custom JWT via `jose` |
| Database | Supabase (PostgreSQL) |
| Payments | Razorpay (subscriptions + one-time credit purchases) |
| AI — Phase 1 | Perplexity (`sonar-deep-research`) |
| AI — Phase 2 | Anthropic Claude (extended thinking mode) |
| Hosting | Vercel (serverless, 300s max duration) |

---

## Local Development

### Prerequisites
- Node.js 18+
- Supabase project
- Anthropic API key
- Perplexity API key
- Razorpay account (for payments)

### Setup

```bash
# Install dependencies
npm install

# Configure environment
cp .env.example .env.local
```

Fill in `.env.local`:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-min-32-chars
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...
RAZORPAY_KEY_ID=rzp_...
RAZORPAY_KEY_SECRET=your-razorpay-secret
RAZORPAY_WEBHOOK_SECRET=your-webhook-secret
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a JWT secret:
```bash
openssl rand -base64 32
```

### Database

Run the schema in your Supabase SQL Editor:
```bash
# See supabase/schema.sql for the full schema
```

### Run

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### Deploy

```bash
npx vercel
```

Set all environment variables in Vercel dashboard. The analysis endpoint uses `maxDuration = 300` (requires Vercel Pro for >60s functions).

---

## Roadmap

- **AI Competitor Ping** — 24/7 background monitoring of competitor websites. When a competitor changes pricing or ships a major feature, you get an instant email alert. (1 credit/day per tracked competitor)
- **PDF Export** — One-click branded PDF reports for agency client deliverables
- **Team Seats** — Shared workspace with role-based access for enterprise teams
- **API Access** — Programmatic report generation for integration into existing workflows

---

## License

MIT
