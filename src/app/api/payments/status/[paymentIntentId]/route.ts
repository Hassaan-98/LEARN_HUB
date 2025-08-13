import { type NextRequest, NextResponse } from "next/server"
import { getPaymentIntent } from "../../../../../lib/stripe-utils"

export async function GET(request: NextRequest, { params }: { params: { paymentIntentId: string } }) {
  try {
    const { paymentIntentId } = params

    if (!paymentIntentId) {
      return NextResponse.json({ error: "Payment intent ID is required" }, { status: 400 })
    }

    // Retrieve payment intent from Stripe
    const paymentIntent = await getPaymentIntent(paymentIntentId)
    if (!paymentIntent) {
      return NextResponse.json({ error: "Payment intent not found" }, { status: 404 })
    }

    return NextResponse.json({
      success: true,
      paymentIntent: {
        id: paymentIntent.id,
        status: paymentIntent.status,
        amount: paymentIntent.amount,
        currency: paymentIntent.currency,
        metadata: paymentIntent.metadata,
        created: paymentIntent.created,
        last_payment_error: paymentIntent.last_payment_error,
      },
    })
  } catch (error) {
    console.error("Payment status retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve payment status" }, { status: 500 })
  }
}
