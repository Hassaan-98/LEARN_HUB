"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
import { useSession } from "next-auth/react"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Shield, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription } from "../components/ui/alert"
import { PaymentElement, PaymentRequestButtonElement, useStripe, useElements, Elements } from "@stripe/react-stripe-js"
import { loadStripe } from "@stripe/stripe-js"

// Initialize Stripe with the publishable key
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || "pk_test_51Rm2rz1CoNhvvcj3yQ0W7X8x2a3Y4f5g6h7i8j9k0l1m2n3o4p5q6r7s8t9u0v1w2x3y4z5A6B7C8D9E0F1G2H3"
if (!stripePublishableKey) {
  console.error("Stripe publishable key is missing. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file.")
}
const stripePromise = loadStripe(stripePublishableKey)

interface PlanDetails {
  title: string
  price: string
  description: string
}

function PlanPaymentFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const { data: session, status } = useSession()
  const planId = searchParams.get("plan") || ""
  const price = parseFloat(searchParams.get("price") || "0")
  const stripe = useStripe()
  const elements = useElements()
  const [plan, setPlan] = useState<PlanDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const [clientSecret, setClientSecret] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [paymentRequest, setPaymentRequest] = useState<null | any>(null)

  // Redirect if not authenticated
  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signup?callbackUrl=/plan-payment-form")
    }
  }, [status, router])

  // Fetch plan details and handle free plan
  useEffect(() => {
    if (!planId) {
      setErrorMessage("Invalid plan ID")
      setPaymentStatus("error")
      setIsLoading(false)
      return
    }

    if (planId === "free" && session?.user?.userType === "student") {
      const handleFreePlan = async () => {
        try {
          setIsProcessing(true)
          const response = await fetch("/api/subscriptions/free", { method: "POST" })
          if (!response.ok) throw new Error("Failed to process free plan")
          setPaymentStatus("success")
          router.push("/courses")
        } catch (err: any) {
          setErrorMessage(err.message || "Failed to process free plan")
          setPaymentStatus("error")
          console.error("Error processing free plan:", err)
        } finally {
          setIsProcessing(false)
          setIsLoading(false)
        }
      }
      handleFreePlan()
      return
    }

    const fetchPlan = async () => {
      try {
        const plans: { [key: string]: PlanDetails } = {
          pro: {
            title: "Pro Plan",
            price: "$29",
            description: "Ideal for serious learners and professionals with unlimited course access.",
          },
          team: {
            title: "Team Plan",
            price: "$99",
            description: "For organizations training multiple employees with advanced features.",
          },
        }
        const planDetails = plans[planId]
        if (!planDetails) throw new Error("Plan not found")
        setPlan(planDetails)
      } catch (error) {
        console.error("Error fetching plan:", error)
        setErrorMessage("Failed to load plan details")
        setPaymentStatus("error")
      } finally {
        setIsLoading(false)
      }
    }
    fetchPlan()
  }, [planId, session])

  // Initialize Stripe payment
  useEffect(() => {
    if (!stripePublishableKey) {
      setErrorMessage("Stripe configuration error: Publishable key is missing.")
      setPaymentStatus("error")
      setIsLoading(false)
      return
    }

    if (!stripe || !elements || !planId || price <= 0 || planId === "free") {
      return
    }

    // Set up PaymentRequest for Google Pay/Apple Pay
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: `Plan: ${plan?.title || "Plan Purchase"}`,
        amount: Math.round(price * 100), // Convert to cents
      },
      requestPayerName: true,
      requestPayerEmail: true,
      requestPayerPhone: true,
    })

    // Check if Google Pay/Apple Pay is available
    pr.canMakePayment().then((result) => {
      if (result) {
        setPaymentRequest(pr)
      }
    })

    // Create payment intent
    const payload = { amount: Math.round(price * 100), planId, userId: session?.user?.id || "" }
    console.log("Sending request to /api/payments/plan-purchase:", { method: "POST", body: payload })

    fetch(`/api/payments/purchase/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("API Response Status:", res.status, res.statusText)
        if (!res.ok) {
          if (res.status === 405) {
            throw new Error("Method Not Allowed: Ensure the API endpoint accepts POST requests")
          }
          throw new Error(`Failed to create payment intent: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log("API Response Data:", data)
        if (!data.clientSecret) {
          throw new Error("No client secret returned from server")
        }
        setClientSecret(data.clientSecret)
        setIsLoading(false)
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error)
        setErrorMessage(error.message || "Failed to initialize payment. Please try again.")
        setPaymentStatus("error")
        setIsLoading(false)
      })
  }, [stripe, elements, planId, price, plan, session])

  // Handle Google Pay/Apple Pay payment
  useEffect(() => {
    if (!paymentRequest || !stripe || !clientSecret) {
      return
    }

    paymentRequest.on("paymentmethod", async (ev: any) => {
      setIsProcessing(true)
      try {
        const { error } = await stripe.confirmCardPayment(
          clientSecret,
          {
            payment_method: ev.paymentMethod.id,
          },
          { handleActions: false }
        )

        if (error) {
          ev.complete("fail")
          setErrorMessage(error.message || "Google Pay/Apple Pay payment failed")
          setPaymentStatus("error")
        } else {
          ev.complete("success")
          setPaymentStatus("success")
          router.push(`/payment-success?plan=${planId}&title=${encodeURIComponent(plan?.title || "Plan")}`)
        }
      } catch (error) {
        ev.complete("fail")
        setErrorMessage("An unexpected error occurred with Google Pay/Apple Pay")
        setPaymentStatus("error")
      } finally {
        setIsProcessing(false)
      }
    })
  }, [paymentRequest, stripe, clientSecret, router, planId, plan])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret || !planId) {
      setErrorMessage("Payment system is not initialized properly.")
      setPaymentStatus("error")
      return
    }

    setIsProcessing(true)
    setErrorMessage("")

    try {
      const { error: submitError } = await elements.submit()
      if (submitError) {
        setErrorMessage(submitError.message || "Payment submission failed")
        setPaymentStatus("error")
        return
      }

      const { error, paymentIntent } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?plan=${planId}&title=${encodeURIComponent(plan?.title || "Plan")}`,
        },
      })

      if (error) {
        setErrorMessage(error.message || "Payment processing failed")
        setPaymentStatus("error")
      } else if (paymentIntent.status === "succeeded") {
        setPaymentStatus("success")
        router.push(`/payment-success?plan=${planId}&title=${encodeURIComponent(plan?.title || "Plan")}`)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred")
      setPaymentStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (status === "loading" || isLoading || (planId === "free" && isProcessing)) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  if (status !== "authenticated" || session?.user?.userType !== "student") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <Alert className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="size-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            Please sign up as a student to make a purchase.
            <Button
              variant="link"
              className="p-0 ml-2"
              onClick={() => router.push("/auth/signup?callbackUrl=/plan-payment-form")}
            >
              Sign Up
            </Button>
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (paymentStatus === "success") {
    return null // Redirect handled above
  }

  if (!plan) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <Alert className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="size-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">{errorMessage || "Invalid plan ID"}</AlertDescription>
        </Alert>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <CreditCard className="size-4" />
            </div>
            <span>LearnHub</span>
          </Link>
          <Button variant="ghost" asChild>
            <Link href="/pricing">
              <ArrowLeft className="size-4 mr-2" />
              Back to Pricing
            </Link>
          </Button>
        </div>
      </header>

      <div className="container py-8">
        <div className="max-w-4xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center mb-8"
          >
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Plan Purchase</h1>
            <p className="text-muted-foreground">Secure checkout powered by Stripe</p>
          </motion.div>

          <div className="grid gap-8 lg:grid-cols-2">
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.1 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Shield className="size-5 text-primary" />
                    Order Summary
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold">{plan.title}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {plan.price}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{plan.price}</span>
                  </div>

                  <div className="flex items-center gap-2 text-xs text-muted-foreground bg-muted/50 p-3 rounded-lg">
                    <Lock className="size-3" />
                    <span>Secured by Stripe</span>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Payment Form */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Payment Details</CardTitle>
                </CardHeader>
                <CardContent>
                  {paymentStatus === "error" && (
                    <Alert className="mb-6 border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
                      <AlertCircle className="size-4 text-red-600" />
                      <AlertDescription className="text-red-800 dark:text-red-200">{errorMessage}</AlertDescription>
                    </Alert>
                  )}

                  <form onSubmit={handleSubmit} className="space-y-6">
                    {paymentRequest && (
                      <div className="mb-4">
                        <PaymentRequestButtonElement options={{ paymentRequest }} />
                        <Separator className="my-4" />
                      </div>
                    )}
                    {clientSecret && <PaymentElement />}
                    <Button
                      type="submit"
                      className="w-full h-12 text-base font-semibold"
                      disabled={isProcessing || !stripe || !clientSecret}
                    >
                      {isProcessing ? (
                        <div className="flex items-center gap-2">
                          <div className="size-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                          Processing Payment...
                        </div>
                      ) : (
                        `Complete Purchase - ${plan.price}`
                      )}
                    </Button>
                    <p className="text-xs text-muted-foreground text-center">
                      By completing your purchase, you agree to our Terms of Service and Privacy Policy. Your payment
                      information is encrypted and secure.
                    </p>
                  </form>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PlanPaymentFormPage() {
  const searchParams = useSearchParams()
  const { data: session, status } = useSession()
  const planId = searchParams.get("plan") || ""
  const price = parseFloat(searchParams.get("price") || "0")
  const [clientSecret, setClientSecret] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!stripePublishableKey) {
      setError("Stripe configuration error: Publishable key is missing.")
      return
    }

    if (price <= 0 || !planId) {
      setError("Invalid plan or price")
      return
    }

    if (planId === "free" || status !== "authenticated" || session?.user?.userType !== "student") {
      return // Free plan handled in PlanPaymentFormContent
    }

    const payload = { amount: Math.round(price * 100), planId, userId: session?.user?.id || "" }
    console.log("Sending request to /api/payments/plan-purchase:", { method: "POST", body: payload })

    fetch(`/api/payments/purchase/plan`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(payload),
    })
      .then((res) => {
        console.log("API Response Status:", res.status, res.statusText)
        if (!res.ok) {
          if (res.status === 405) {
            throw new Error("Method Not Allowed: Ensure the API endpoint accepts POST requests")
          }
          throw new Error(`Failed to create payment intent: ${res.statusText}`)
        }
        return res.json()
      })
      .then((data) => {
        console.log("API Response Data:", data)
        if (!data.clientSecret) {
          throw new Error("No client secret returned from server")
        }
        setClientSecret(data.clientSecret)
      })
      .catch((error) => {
        console.error("Error fetching client secret:", error)
        setError(error.message || "Failed to initialize payment. Please try again.")
      })
  }, [planId, price, session, status])

  if (error || !stripePublishableKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <Alert className="max-w-md border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950">
          <AlertCircle className="size-4 text-red-600" />
          <AlertDescription className="text-red-800 dark:text-red-200">
            {error || "Stripe configuration error: Please contact support."}
          </AlertDescription>
        </Alert>
      </div>
    )
  }

  if (!clientSecret && planId !== "free") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
        <div
          className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
          role="status"
        >
          <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
            Loading...
          </span>
        </div>
      </div>
    )
  }

  return (
    <Elements
      stripe={stripePromise}
      options={{
        clientSecret: planId === "free" ? undefined : clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <PlanPaymentFormContent />
    </Elements>
  )
}