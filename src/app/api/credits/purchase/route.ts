import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { createOrder, ADDON_CREDITS } from '@/lib/razorpay'

export const POST = requireAuth(
    async (_req: NextRequest, { userId, email }: { userId: string; email: string }) => {
        try {
            // Create a Razorpay order for 50 credits
            const receipt = `credits_${userId}_${Date.now()}`
            const order = await createOrder(
                ADDON_CREDITS.amountINR,
                'INR',
                receipt,
                {
                    user_id: userId,
                    user_email: email,
                    type: 'credit_purchase',
                    credits: String(ADDON_CREDITS.amount),
                }
            )

            return NextResponse.json({
                success: true,
                data: {
                    orderId: order.id,
                    amount: ADDON_CREDITS.amountINR,
                    currency: 'INR',
                    credits: ADDON_CREDITS.amount,
                    razorpayKeyId: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
                },
            })
        } catch (error) {
            console.error('Credit purchase order error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to create credit purchase order', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
