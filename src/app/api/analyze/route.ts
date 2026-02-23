import { NextRequest, NextResponse } from 'next/server'
import { extractToken, verifyToken } from '@/lib/auth'
import { getUserAnalysisCount, saveAnalysisRecord, getUserIsActive } from '@/lib/supabase'
import { runAnalysis } from '@/lib/ai-engine'
import { CompanyInput } from '@/types'

// Allow long-running requests (Vercel Pro: up to 300s)
export const maxDuration = 300

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
    let email: string
    try {
        const payload = await verifyToken(token)
        userId = payload.userId
        email = payload.email
    } catch {
        return NextResponse.json(
            { success: false, error: 'Invalid or expired token', code: 'INVALID_TOKEN' },
            { status: 401 }
        )
    }

    // ── Account activation gate ──────────────────────────────────────────
    try {
        const isActive = await getUserIsActive(userId)
        if (!isActive) {
            return NextResponse.json(
                {
                    success: false,
                    code: 'ACCOUNT_INACTIVE',
                    error: 'Your account is pending activation.',
                    contact: {
                        linkedin: 'https://www.linkedin.com/in/mustakimnagori',
                        email: 'mustakimnagori076@gmail.com',
                    },
                },
                { status: 403 }
            )
        }
    } catch (error) {
        console.error('Active check failed:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to verify account status', code: 'SERVER_ERROR' },
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

    // Check usage limit
    try {
        const analysisCount = await getUserAnalysisCount(userId)
        if (analysisCount >= 1) {
            return NextResponse.json(
                {
                    success: false,
                    error: 'Free analysis used. Upgrade to Pro for unlimited analyses.',
                    code: 'LIMIT_REACHED',
                },
                { status: 403 }
            )
        }
    } catch (error) {
        console.error('Usage check failed:', error)
        return NextResponse.json(
            { success: false, error: 'Failed to check usage', code: 'SERVER_ERROR' },
            { status: 500 }
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
