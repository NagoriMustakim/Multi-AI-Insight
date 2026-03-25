import { NextRequest, NextResponse } from 'next/server'
import { extractToken, verifyToken } from '@/lib/auth'
import { deductCredits, getUserCredits, saveAnalysisRecord } from '@/lib/supabase'
import { runAnalysis } from '@/lib/ai-engine'
import { CompanyInput } from '@/types'

// Allow long-running requests (Vercel Pro: up to 300s)
export const maxDuration = 300

const CREDITS_PER_REPORT = 10

export async function POST(req: NextRequest) {
    // Auth check
    const token = extractToken(req)
    if (!token) {
        return NextResponse.json(
            { success: false, error: 'Authentication required', code: 'NO_TOKEN' },
            { status: 401 }
        )
    }

    let userId: string
    try {
        const payload = await verifyToken(token)
        userId = payload.userId
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
            { status: 401 }
        )
    }

    // ── Credit balance check ─────────────────────────────────────────────
    try {
        const credits = await getUserCredits(userId)
        if (credits < CREDITS_PER_REPORT) {
            return NextResponse.json(
                {
                    success: false,
                    code: 'INSUFFICIENT_CREDITS',
                    error: `Not enough credits. You need ${CREDITS_PER_REPORT} credits to generate a report.`,
                    data: {
                        required: CREDITS_PER_REPORT,
                        available: credits,
                        upsell: {
                            credits: 50,
                            priceLabel: '$25',
                            message: 'Buy 50 credits to continue generating reports.',
                        },
                    },
                },
                { status: 403 }
            )
        }
    } catch (error) {
        console.error('Credit check failed:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to verify credit balance', code: 'SERVER_ERROR' },
            { status: 500 }
        )
    }

    // ── Atomic credit deduction (before analysis starts) ─────────────────
    try {
        const deducted = await deductCredits(userId, CREDITS_PER_REPORT)
        if (!deducted) {
            // Race condition: someone else consumed the credits between check and deduct
            return NextResponse.json(
                {
                    success: false,
                    code: 'INSUFFICIENT_CREDITS',
                    error: 'Credits were consumed by another request. Please try again.',
                },
                { status: 403 }
            )
        }
    } catch (error) {
        console.error('Credit deduction failed:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to deduct credits', code: 'SERVER_ERROR' },
            { status: 500 }
        )
    }

    // Parse and validate request body
    let company: CompanyInput
    try {
        const body = await req.json()
        company = body.company

        if (!company?.name || !company?.product || !company?.description || !company?.domain || !company?.market) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Missing required fields: name, product, description, domain, market',
                    code: 'VALIDATION_ERROR',
                },
                { status: 400 }
            )
        }

        if (company.description.length < 50 || company.description.length > 1000) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Description must be between 50 and 1000 characters',
                    code: 'VALIDATION_ERROR',
                },
                { status: 400 }
            )
        }
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid request body', code: 'PARSE_ERROR' },
            { status: 400 }
        )
    }

    // Create SSE stream
    const encoder = new TextEncoder()
    const stream = new ReadableStream({
        async start(controller) {
            const sendEvent = (data: Record<string, unknown>) => {
                controller.enqueue(encoder.encode(`data: ${JSON.stringify(data)}\n\n`))
            }

            try {
                // Run analysis with progress callbacks
                const report = await runAnalysis(company, (step, message) => {
                    sendEvent({ type: 'progress', step, message })
                })

                // Save to database
                try {
                    await saveAnalysisRecord(
                        userId,
                        company.name,
                        company.domain,
                        company.market,
                        report
                    )
                } catch (dbError) {
                    console.error('Failed to save analysis record:', dbError)
                    // Don't fail the entire request — user still gets their report
                }

                // Send complete event
                sendEvent({ type: 'complete', report })
            } catch (error) {
                console.error('Analysis error:', error)
                sendEvent({
                    type: 'error',
                    error: error instanceof Error ? error.message : 'Analysis failed. Please try again.',
                })
                // Note: credits are NOT refunded on analysis failure.
                // This is intentional — the AI API calls were still consumed.
                // For refund cases, admin can manually grant credits.
            } finally {
                controller.close()
            }
        },
    })

    return new Response(stream, {
        headers: {
            'Content-Type': 'text/event-stream',
            'Cache-Control': 'no-cache',
            Connection: 'keep-alive',
        },
    })
}
