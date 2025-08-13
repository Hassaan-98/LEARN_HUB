import { type NextRequest, NextResponse } from "next/server"
import { findCustomerByEmail } from "../../../../lib/stripe-utils"
import { stripe } from "../../../../lib/stripe"

// Create billing portal session
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, returnUrl } = body

    if (!email) {
      return NextResponse.json({ error: "Email is required" }, { status: 400 })
    }

    // Find customer
    const customer = await findCustomerByEmail(email)
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Create billing portal session
    const portalSession = await stripe.billingPortal.sessions.create({
      customer: customer.id,
      return_url: returnUrl || `${process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000"}/dashboard`,
    })

    return NextResponse.json({
      success: true,
      url: portalSession.url,
    })
  } catch (error) {
    console.error("Billing portal creation error:", error)
    return NextResponse.json({ error: "Failed to create billing portal session" }, { status: 500 })
  }
}
