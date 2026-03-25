import { NextRequest, NextResponse } from 'next/server'
import { requireAuth } from '@/lib/auth'
import { grantCredits } from '@/lib/supabase'
import { verifyOrderPaymentSignature, ADDON_CREDITS } from '@/lib/razorpay'

export const POST = requireAuth(
    async (req: NextRequest, { userId }: { userId: string; email: string }) => {
        try {
            const body = await req.json()
            const {
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature,
            } = body as {
                razorpay_order_id: string
                razorpay_payment_id: string
                razorpay_signature: string
            }

            // Validate required fields
            if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
                return NextResponse.json(
                    { success: false, error: 'Missing payment verification data', code: 'MISSING_FIELDS' },
                    { status: 400 }
                )
            }

            // Verify Razorpay signature (cryptographic proof)
            const isValid = verifyOrderPaymentSignature(
                razorpay_order_id,
                razorpay_payment_id,
                razorpay_signature
            )

            if (!isValid) {
                console.error('Credit purchase signature verification failed for user:', userId)
                return NextResponse.json(
                    { success: false, error: 'Payment verification failed', code: 'SIGNATURE_INVALID' },
                    { status: 400 }
                )
            }

            // Grant credits
            const newBalance = await grantCredits(
                userId,
                ADDON_CREDITS.amount,
                'add_on_purchase',
                `Purchased ${ADDON_CREDITS.amount} credits`,
                razorpay_payment_id
            )

            return NextResponse.json({
                success: true,
                data: {
                    creditsAdded: ADDON_CREDITS.amount,
                    newBalance,
                },
            })
        } catch (error) {
            console.error('Credit verification error:', error)
            return NextResponse.json(
                { success: false, error: 'Failed to verify credit purchase', code: 'SERVER_ERROR' },
                { status: 500 }
            )
        }
    }
)
