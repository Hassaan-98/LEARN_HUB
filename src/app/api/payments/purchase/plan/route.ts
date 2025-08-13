import { NextResponse } from "next/server"
import Stripe from "stripe"
import { getServerSession } from "next-auth"
import { authOptions } from "../../../auth/[...nextauth]/route"

const stripe = new Stripe("sk_test_51Rm2rz1CoNhvvcj3yfyZqYvD65wYHRhlVbEJ8qEVdFXrkcM4GcLSfH730ntlEUqAZggYlXZRyACp85LUDCfkPfDP00ox9RNiGO", {
  apiVersion: "2025-07-30.basil",
})

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions)
    if (!session || !session.user || session.user.userType !== "student") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 })
    }

    const body = await req.json()
    const { amount, userId, planId } = body

    if (!amount || !userId || !planId) {
      return NextResponse.json({ error: "Missing required fields" }, { status: 400 })
    }

    if (userId !== session.user.id) {
      return NextResponse.json({ error: "Invalid user ID" }, { status: 403 })
    }

    const paymentIntent = await stripe.paymentIntents.create({
      amount: Math.round(amount), // Ensure amount is an integer (cents)
      currency: "usd",
      metadata: {
        userId,
        planId,
      },
    })

    return NextResponse.json({ clientSecret: paymentIntent.client_secret })
  } catch (error: any) {
    console.error("Error creating plan payment intent:", {
      message: error.message,
      stack: error.stack,
    })
    return NextResponse.json({ error: "Failed to create payment intent" }, { status: 500 })
  }
}