import { type NextRequest, NextResponse } from "next/server"
import { findCustomerByEmail } from "../../../../lib/stripe-utils"
import { stripe } from "../../../../lib/stripe"

// Get customer invoices
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const email = searchParams.get("email")
    const limit = Number.parseInt(searchParams.get("limit") || "10")

    if (!email) {
      return NextResponse.json({ error: "Email parameter is required" }, { status: 400 })
    }

    // Find customer
    const customer = await findCustomerByEmail(email)
    if (!customer) {
      return NextResponse.json({ error: "Customer not found" }, { status: 404 })
    }

    // Get invoices
    const invoices = await stripe.invoices.list({
      customer: customer.id,
      limit: Math.min(limit, 100), // Cap at 100
      expand: ["data.payment_intent"],
    })

    const formattedInvoices = invoices.data.map((invoice) => ({
      id: invoice.id,
      number: invoice.number,
      status: invoice.status,
      amount_due: invoice.amount_due,
      amount_paid: invoice.amount_paid,
      currency: invoice.currency,
      created: invoice.created,
      due_date: invoice.due_date,
      hosted_invoice_url: invoice.hosted_invoice_url,
      invoice_pdf: invoice.invoice_pdf,
      period_start: invoice.period_start,
      period_end: invoice.period_end,
      subscription: invoice.subscription as string,
    }))

    return NextResponse.json({
      success: true,
      invoices: formattedInvoices,
      has_more: invoices.has_more,
    })
  } catch (error) {
    console.error("Invoice retrieval error:", error)
    return NextResponse.json({ error: "Failed to retrieve invoices" }, { status: 500 })
  }
}
