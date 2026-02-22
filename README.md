# CompetitorGap AI

**AI-Powered Competitive Intelligence** — Analyze your market in real-time using Perplexity + Claude Opus.

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- A Supabase account with a project
- Anthropic API key (Claude)
- Perplexity API key

### 1. Install Dependencies

```bash
npm install
```

### 2. Set Up Supabase

1. Create a new project at [supabase.com](https://supabase.com).
2. Go to the SQL Editor and run the contents of `supabase/schema.sql`.
3. Go to **Settings → API** and copy:
   - Project URL → `NEXT_PUBLIC_SUPABASE_URL`
   - `service_role` key → `SUPABASE_SERVICE_ROLE_KEY`

### 3. Configure Environment Variables

Copy `.env.example` to `.env.local`:

```bash
cp .env.example .env.local
```

Fill in all values:

```
NEXT_PUBLIC_SUPABASE_URL=https://your-project.supabase.co
SUPABASE_SERVICE_ROLE_KEY=your-service-role-key
JWT_SECRET=your-secret-min-32-chars
ANTHROPIC_API_KEY=sk-ant-...
PERPLEXITY_API_KEY=pplx-...
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

Generate a JWT secret:
```bash
openssl rand -base64 32
```

### 4. Run Locally

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

### 5. Deploy to Vercel

```bash
npx vercel
```

Set all environment variables in Vercel dashboard → **Settings → Environment Variables**.

> **Note:** The analysis endpoint uses `maxDuration = 300` (requires Vercel Pro plan for >60s).

## 🏗️ Tech Stack

| Layer | Technology |
|-------|-----------|
| Framework | Next.js 14 (App Router, TypeScript) |
| Styling | Tailwind CSS + Framer Motion |
| UI | Radix UI + Lucide Icons |
| Auth | Custom JWT via `jose` |
| Database | Supabase (service role) |
| AI Layer 1 | Perplexity (`sonar-deep-research`) |
| AI Layer 2 | Anthropic Claude (`claude-sonnet-4-20250514` with extended thinking) |

## 📁 Project Structure

```
src/
├── app/
│   ├── page.tsx              # Landing page
│   ├── layout.tsx            # Root layout
│   ├── globals.css           # Design system
│   ├── dashboard/page.tsx    # Protected dashboard
│   ├── report/[id]/page.tsx  # Report view
│   └── api/
│       ├── auth/register/    # POST registration
│       ├── auth/login/       # POST login
│       ├── analyze/          # POST analysis (SSE)
│       └── usage/            # GET usage + reports
├── components/
│   ├── landing/              # 6 landing sections
│   ├── auth/                 # AuthModal
│   ├── analysis/             # Form + Loading
│   ├── report/               # 10 report components
│   └── ui/                   # 7 UI primitives
├── lib/
│   ├── supabase.ts           # DB helpers
│   ├── auth.ts               # JWT + bcrypt
│   └── ai-engine.ts          # AI pipeline
├── types/index.ts            # All interfaces
└── hooks/useAuth.tsx         # Auth context
```

## 📊 How It Works

1. User registers/logs in (JWT auth)
2. Enters company details in dashboard
3. **Phase 1:** Perplexity scans live web for competitor data
4. **Phase 2:** Claude Opus analyzes research with extended thinking
5. Full intelligence report rendered with 11 sections
6. Report saved to Supabase for history

## License

MIT
