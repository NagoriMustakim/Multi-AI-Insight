import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { getUserAnalysisCount, getUserAnalysisHistory, getAnalysisById, getUserIsActive } from '@/lib/supabase'

export const GET = requireAuth(
    async (req: NextRequest, { userId }: { userId: string; email: string }) => {
        try {
            // Check if requesting a specific report
            const reportId = req.nextUrl.searchParams.get('reportId')
            if (reportId) {
                const record = await getAnalysisById(reportId)
                if (!record || record.user_id !== userId) {
                    return NextResponse.json(
                        { success: false, error: 'Report not found', code: 'NOT_FOUND' },
                        { status: 404 }
                    )
                }
                return NextResponse.json({
                    success: true,
                    data: { report: record.report_data },
                })
            }

            // Default: return usage info + activation status in parallel
            const [analysisCount, history, isActive] = await Promise.all([
                getUserAnalysisCount(userId),
                getUserAnalysisHistory(userId),
                getUserIsActive(userId),
            ])

            return NextResponse.json({
                success: true,
                data: {
                    analysisCount,
                    isActive,
                    history,
                },
            })
        } catch (error) {
            console.error('Usage check error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to check usage', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
