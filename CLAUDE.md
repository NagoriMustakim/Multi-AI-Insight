# CompetitorGap AI

## What This Is
AI-powered competitive intelligence platform that delivers board-ready market analysis in 3 minutes using a two-phase AI pipeline: Perplexity for live web research + Claude Sonnet 4 with extended thinking for strategic analysis.

## Tech Stack
- **Framework**: Next.js 14 (App Router, TypeScript)
- **Database**: Supabase (PostgreSQL)
- **Auth**: Custom JWT via `jose` + bcryptjs
- **AI Pipeline**: Perplexity (`sonar-deep-research`) → Claude (`claude-sonnet-4-20250514` with extended thinking)
- **UI**: Tailwind CSS, Radix UI, Framer Motion, Lucide icons
- **Payments**: Razorpay (Indian market)

## Project Structure
```
src/
├── app/              # Next.js routes (landing, dashboard, API)
├── components/       # UI components (landing, auth, analysis, report)
├── lib/              # Core logic (ai-engine, auth, supabase, razorpay)
├── types/index.ts    # All TypeScript interfaces
└── hooks/useAuth.tsx # Auth context
```

## Key Files
- **AI Pipeline**: `src/lib/ai-engine.ts` (two-phase analysis system)
- **Type Definitions**: `src/types/index.ts` (all interfaces)
- **Database Schema**: `supabase/schema.sql`
- **Auth Logic**: `src/lib/auth.ts`

## Commands
**Build**: `npm run build` (outputs to `dist/`)  
**Dev**: `npm run dev`  
**Lint**: `npm run lint` (fix before commit)

## Conventions
- Conventional Commits (`feat:`, `fix:`, `docs:`)
- Never use `--legacy-peer-deps`; update `package.json` instead
- Environment variables in `.env.local` (never commit)

## Environment Setup
Required variables (see `README.md` for details):
- `NEXT_PUBLIC_SUPABASE_URL`
- `SUPABASE_SERVICE_ROLE_KEY`
- `JWT_SECRET` (min 32 chars)
- `ANTHROPIC_API_KEY`
- `PERPLEXITY_API_KEY`
- `NEXT_PUBLIC_APP_URL`

## How Analysis Works
1. User submits company details via dashboard
2. **Phase 1**: Perplexity scans live web for competitor data (6000 tokens, `sonar-deep-research`)
3. **Phase 2**: Claude analyzes research with extended thinking (5000 budget tokens) and generates structured JSON report
4. Report saved to Supabase `analysis_usage` table
5. Frontend renders 11-section intelligence report

## Database
- **Schema**: `supabase/schema.sql` defines `users`, `analysis_usage`, and credit system tables
- **Access**: Service role key for server-side operations (never expose to client)
- **Credit System**: Subscription-based credits tracked in `credit_ledger` table

## Business Context
- **Target Market**: Marketing agencies, SaaS product teams, UX research firms
- **Pricing**: Contact-based → $49/mo Pro (see `BUSINESS_STRATEGY.md` for full GTM plan)
- **Deployment**: Vercel (requires Pro plan for 300s timeout on `/api/analyze`)

## Finding Information
- **Business strategy**: `BUSINESS_STRATEGY.md`
- **Pricing roadmap**: `FUTURE_PRICING_IMPLEMENTATION.md`
- **Setup instructions**: `README.md`
- **Planning artifacts**: `planning-artifacts/` directory
