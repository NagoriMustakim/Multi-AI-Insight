import Anthropic from '@anthropic-ai/sdk'
import { CompanyInput, CompetitorReport } from '@/types'

const anthropic = new Anthropic({
    apiKey: process.env.ANTHROPIC_API_KEY!,
})

// ========================
// PHASE 1 — PERPLEXITY REAL-TIME RESEARCH
// ========================

async function researchWithPerplexity(company: CompanyInput): Promise<string> {
    const systemPrompt = `You are a senior competitive intelligence analyst. Provide detailed, factual research with specific data points, exact prices, feature lists, and customer sentiment from reviews. Always cite sources. Be specific — avoid generic statements.`

    const userPrompt = `Research the competitive landscape for this company:

Company: ${company.name}
Product: ${company.product}
Description: ${company.description}
Industry/Domain: ${company.domain}
Target Market: ${company.market}
${company.website ? `Website: ${company.website}` : ''}

Please provide comprehensive research on:

1. **Top 3-4 Direct Competitors** in the ${company.domain} space targeting ${company.market}:
   - Company name and website
   - Current pricing (exact plan names and prices)
   - Key features and capabilities
   - Recent product updates (last 6 months)
   - Customer complaints from G2, Capterra, Trustpilot, Reddit, App Store reviews
   - Company size, funding status, and growth signals
   - Their strongest marketing angle / positioning

2. **Market-wide Customer Frustrations**: What are the most common unmet needs and complaints across the entire ${company.domain} market?

3. **Pricing Landscape**: What pricing models are used? What's the typical price range? Are there pricing gaps?

4. **Recent Market Movements**: Any competitor funding rounds, product launches, acquisitions, or notable customer churn signals in the last 6 months?

5. **AI/Technology Adoption**: How are competitors using AI? Who's ahead, who's behind? Any technology gaps?

Be as specific as possible with data points, numbers, and direct quotes from reviews when available.`

    try {
        const response = await fetch('https://api.perplexity.ai/chat/completions', {
            method: 'POST',
            headers: {
                'Authorization': `Bearer ${process.env.PERPLEXITY_API_KEY}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                model: 'sonar-deep-research',
                messages: [
                    { role: 'system', content: systemPrompt },
                    { role: 'user', content: userPrompt },
                ],
                temperature: 0.1,
                max_tokens: 6000,
            }),
        })

        if (!response.ok) {
            const errorText = await response.text()
            console.error('Perplexity API error:', response.status, errorText)
            throw new Error(`Perplexity API error: ${response.status}`)
        }

        const data = await response.json()
        return data.choices?.[0]?.message?.content || 'No research data returned.'
    } catch (error) {
        console.error('Perplexity research failed:', error)
        return `[Perplexity research unavailable — proceeding with Claude's own knowledge. Note: results may be less current.]

Company to analyze: ${company.name} (${company.product})
Domain: ${company.domain}
Market: ${company.market}
Description: ${company.description}`
    }
}

// ========================
// PHASE 2 — CLAUDE OPUS DEEP ANALYSIS
// ========================

async function analyzeWithClaude(
    company: CompanyInput,
    perplexityResearch: string
): Promise<CompetitorReport> {
    const systemPrompt = `You are an elite competitive intelligence strategist combining McKinsey analytical rigor with AI-powered pattern recognition. You transform raw market research into precise, board-ready competitive intelligence. Every insight must be specific, evidence-based, and immediately actionable. You think in terms of competitive moats, timing windows, and asymmetric opportunities. Output ONLY valid JSON — no markdown, no preamble.`

    const userPrompt = `Analyze this company and its competitive landscape. Generate a complete CompetitorReport JSON object.

=== COMPANY DETAILS ===
Name: ${company.name}
Product: ${company.product}
Description: ${company.description}
Domain: ${company.domain}
Market: ${company.market}
${company.website ? `Website: ${company.website}` : ''}

=== RAW MARKET RESEARCH (from live web scan) ===
${perplexityResearch}

=== REQUIRED JSON OUTPUT ===
Generate a JSON object with this EXACT structure (no other keys or format):

{
  "generated_at": "${new Date().toISOString()}",
  "company": {
    "name": "${company.name}",
    "product": "${company.product}",
    "description": "${company.description}",
    "domain": "${company.domain}",
    "market": "${company.market}"${company.website ? `,\n    "website": "${company.website}"` : ''}
  },
  "executive_summary": "3-4 sentence sharp summary: market position + biggest threat + biggest opportunity + #1 action",
  "market_landscape": "2-3 sentences on competitive density, who dominates, where it's heading",
  "competitors": [
    {
      "name": "Competitor Name",
      "website": "https://...",
      "description": "What they do in 1-2 sentences",
      "market_share_estimate": "e.g., ~25% or 'Top 3 player'",
      "strengths": ["specific strength 1", "specific strength 2", "specific strength 3"],
      "features": ["feature 1", "feature 2", "feature 3", "feature 4", "feature 5"],
      "pricing": "exact plan names and prices, e.g., 'Free, Pro $29/mo, Enterprise custom'",
      "customer_reviews_summary": "specific loves AND specific complaints with evidence from reviews",
      "growth_signals": ["recent funding/launch/hire signal"],
      "ai_intelligence_score": 7
    }
  ],
  "feature_gaps": {
    "their_gaps": ["specific gap competitor X has that ${company.name} can exploit"],
    "our_gaps": ["honest gap ${company.name} has vs competitors"]
  },
  "pain_points": ["specific customer pain point with evidence"],
  "market_opportunities": [
    {
      "title": "Short opportunity title",
      "description": "HOW to capture this opportunity specifically",
      "effort": "low|medium|high",
      "impact": "low|medium|high",
      "timeframe": "immediate|3-6 months|6-12 months",
      "priority_score": 85
    }
  ],
  "growth_signals": [
    {
      "competitor": "Competitor Name",
      "signal": "specific signal description",
      "source": "where this was found",
      "impact": "high|medium|low"
    }
  ],
  "quick_wins": [
    {
      "action": "Specific action doable THIS WEEK",
      "rationale": "why this works based on competitor gaps",
      "effort_days": 3,
      "expected_impact": "specific measurable outcome"
    }
  ],
  "pricing_intelligence": {
    "market_average_low": "$X/mo",
    "market_average_high": "$Y/mo",
    "pricing_models_used": ["per-seat", "usage-based"],
    "your_positioning": "where ${company.name} sits or should sit",
    "pricing_opportunity": "specific pricing strategy recommendation"
  },
  "positioning_radar": {
    "dimensions": [
      { "name": "AI/Automation", "your_score": 7, "competitor_avg": 5, "leader_score": 9 },
      { "name": "Ease of Use", "your_score": 6, "competitor_avg": 6, "leader_score": 8 },
      { "name": "Price/Value", "your_score": 7, "competitor_avg": 5, "leader_score": 8 },
      { "name": "Feature Depth", "your_score": 5, "competitor_avg": 7, "leader_score": 9 },
      { "name": "Support Quality", "your_score": 6, "competitor_avg": 5, "leader_score": 8 },
      { "name": "Market Reach", "your_score": 4, "competitor_avg": 6, "leader_score": 9 }
    ],
    "white_space": "describe the unchallenged area where ${company.name} can dominate"
  },
  "ai_adoption_analysis": {
    "overall_market_ai_maturity": "early|growing|mature",
    "your_ai_advantage": ["specific AI advantage 1", "specific AI advantage 2"],
    "competitors_ai_gaps": ["AI gap competitor has"],
    "ai_opportunity": "single biggest AI opportunity in this market"
  },
  "recommended_actions": [
    {
      "priority": 1,
      "category": "product|marketing|pricing|technical|positioning",
      "action": "specific concrete action",
      "rationale": "why this is top priority, with evidence",
      "kpi": "how to measure success",
      "timeline": "when to execute"
    }
  ],
  "data_sources": ["source 1", "source 2"],
  "confidence_score": 82
}

=== RULES ===
- Include 3-4 competitors with complete data for each
- Include 3-5 market opportunities, sorted by priority_score descending
- Include 3-5 quick wins, sorted by effort_days ascending
- Include 5 recommended actions, sorted by priority
- Use ONLY data from the provided research — never hallucinate
- Every gap/opportunity must be specific and actionable
- Quick wins must be genuinely achievable in the stated timeframe
- Be honest about ${company.name}'s gaps — it builds trust
- Scores must be realistic (not everything 8+/10)
- Confidence score: 60-65 if research data was limited, 80-95 if data was rich
- Output ONLY the JSON object. No markdown code fences. No explanation text.`

    const response = await anthropic.messages.create({
        model: 'claude-sonnet-4-20250514',
        max_tokens: 8000,
        thinking: {
            type: 'enabled' as const,
            budget_tokens: 5000,
        },
        system: systemPrompt,
        messages: [
            { role: 'user', content: userPrompt },
        ],
    } as any)

    // Extract text content from response
    let reportText = ''
    for (const block of response.content) {
        if (block.type === 'text') {
            reportText = block.text
            break
        }
    }

    if (!reportText) {
        throw new Error('No text content in Claude response')
    }

    // Strip markdown code fences if present
    reportText = reportText.trim()
    if (reportText.startsWith('```json')) {
        reportText = reportText.slice(7)
    } else if (reportText.startsWith('```')) {
        reportText = reportText.slice(3)
    }
    if (reportText.endsWith('```')) {
        reportText = reportText.slice(0, -3)
    }
    reportText = reportText.trim()

    const report: CompetitorReport = JSON.parse(reportText)

    // Ensure generated_at is set
    if (!report.generated_at) {
        report.generated_at = new Date().toISOString()
    }

    return report
}

// ========================
// MAIN EXPORT — TWO-PHASE PIPELINE
// ========================

export async function runAnalysis(
    company: CompanyInput,
    onProgress?: (step: string, message: string) => void
): Promise<CompetitorReport> {
    // Phase 1: Perplexity Research
    onProgress?.('researching', 'Connecting to live web research...')

    const perplexityResearch = await researchWithPerplexity(company)

    onProgress?.('scanning', 'Scanning competitor landscape...')

    // Small delay to let progress update propagate
    await new Promise(resolve => setTimeout(resolve, 500))

    onProgress?.('identifying', 'Identifying market gaps...')

    // Phase 2: Claude Analysis
    onProgress?.('analyzing', 'Claude is reasoning deeply...')

    const report = await analyzeWithClaude(company, perplexityResearch)

    onProgress?.('complete', 'Building your intelligence report...')

    return report
}
