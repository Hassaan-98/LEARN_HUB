import { type NextRequest, NextResponse } from "next/server"
import { createPaymentIntent, createStripeCustomer, findCustomerByEmail } from "../../../../lib/stripe-utils"
import { getPlanDetails, type PlanType } from "../../../../lib/stripe"
import { createPayment, createUser, getUserByEmail } from "../../../../lib/payment-database"


export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { email, fullName, plan, billingAddress, city, zipCode, country } = body

    // Validate required fields
    if (!email || !fullName || !plan) {
      return NextResponse.json(
        { error: "Missing required fields: email, fullName, and plan are required" },
        { status: 400 },
      )
    }

    // Validate plan type
    const planDetails = getPlanDetails(plan as PlanType)
    if (!planDetails) {
      return NextResponse.json({ error: "Invalid plan type" }, { status: 400 })
    }

    // For free plan, no payment needed
    if (plan === "free") {
      return NextResponse.json({
        success: true,
        message: "Free plan activated successfully",
        plan: planDetails,
      })
    }

    // Find or create Stripe customer
    let customer = await findCustomerByEmail(email)
    if (!customer) {
      customer = await createStripeCustomer({
        email,
        name: fullName,
        metadata: { plan },
      })
    }

    // Create payment intent
   const paymentIntent = await createPaymentIntent({
  amount: planDetails.price,
  currency: "usd",
  customer: customer.id,
  metadata: {
    plan,
    email,
    fullName,
    billingAddress: billingAddress || "",
    city: city || "",
    zipCode: zipCode?.toString() || "",
    country: country || "",
  },
});


    // Store user in database if not exists
    let user = await getUserByEmail(email)
    if (!user) {
      user = await createUser({ email, full_name: fullName })
    }

    // Create payment record in database
    if (user) {
      await createPayment({
        stripe_payment_id: paymentIntent.id,
        user_id: user.id,
        email,
        full_name: fullName,
        plan_type: plan as PlanType,
        amount: planDetails.price,
        currency: "usd",
        status: "pending",
        billing_address: billingAddress,
        billing_city: city,
        billing_postal_code: zipCode,
        billing_country: country,
        stripe_created_at: new Date().toISOString(),
        metadata: { plan },
      })
    }

    return NextResponse.json({
      success: true,
      clientSecret: paymentIntent.client_secret,
      paymentIntentId: paymentIntent.id,
      amount: planDetails.price,
      currency: "usd",
      plan: planDetails,
    })
  } catch (error) {
    console.error("Payment intent creation error:", error)
    return NextResponse.json({ error: "Failed to create payment intent. Please try again." }, { status: 500 })
  }
}
