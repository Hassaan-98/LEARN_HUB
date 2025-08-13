"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CreditCard, Shield, Lock, CheckCircle, AlertCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardHeader, CardTitle, CardContent } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Separator } from "../components/ui/separator"
import { Alert, AlertDescription } from "../components/ui/alert"
import { PaymentElement, useStripe, useElements } from "@stripe/react-stripe-js"



interface PlanDetails {
  name: string
  price: string
  period: string
  description: string
  features: string[]
}

const planData: Record<string, PlanDetails> = {
  free: {
    name: "Free",
    price: "$0",
    period: "forever",
    description: "Perfect for getting started with learning.",
    features: ["Access to 10 free courses", "Basic community access", "Course completion certificates"],
  },
  pro: {
    name: "Pro",
    price: "$29",
    period: "per month",
    description: "Ideal for serious learners and professionals.",
    features: [
      "Unlimited access to all courses",
      "Priority community support",
      "1-on-1 instructor sessions",
      "HD video quality",
    ],
  },
  team: {
    name: "Team",
    price: "$99",
    period: "per month",
    description: "For organizations training multiple employees.",
    features: ["Everything in Pro", "Up to 10 team members", "Team progress tracking", "Dedicated account manager"],
  },
}

const convertToSubcurrency = (amount: number) => {
  return Math.round(amount * 100) // Convert to cents
}

export default function PaymentFormPage() {
  const searchParams = useSearchParams()
  const planType = searchParams.get("plan") || "pro"
  const plan = planData[planType] || planData.pro
  const amount = Number.parseInt(plan.price.replace("$", "")) || 0

  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")

  useEffect(() => {
    if (amount === 0) {
      setClientSecret("free_plan")
      return
    }
    fetch("/api/create-payment-intent", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ amount: convertToSubcurrency(amount) }),
    })
      .then((res) => res.json())
      .then((data) => setClientSecret(data.clientSecret))
  }, [amount])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret) return

    setIsProcessing(true)
    setErrorMessage("")

    try {
      if (amount === 0) {
        // Handle free plan
        setPaymentStatus("success")
        return
      }

      const { error: submitError } = await elements.submit()
      if (submitError) {
        setErrorMessage(submitError.message || "Payment submission failed")
        setPaymentStatus("error")
        return
      }

      const { error } = await stripe.confirmPayment({
        elements,
        clientSecret,
        confirmParams: {
          return_url: `${window.location.origin}/payment-success?plan=${planType}`,
        },
      })

      if (error) {
        setErrorMessage(error.message || "Payment processing failed")
        setPaymentStatus("error")
      } else {
        setPaymentStatus("success")
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred")
      setPaymentStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentStatus === "success") {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex items-center justify-center p-4">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5 }}
          className="max-w-md w-full"
        >
          <Card className="text-center border-green-200 dark:border-green-800">
            <CardContent className="pt-8 pb-8">
              <div className="size-16 mx-auto mb-4 rounded-full bg-green-100 dark:bg-green-900 flex items-center justify-center">
                <CheckCircle className="size-8 text-green-600 dark:text-green-400" />
              </div>
              <h2 className="text-2xl font-bold mb-2 text-green-800 dark:text-green-200">Payment Successful!</h2>
              <p className="text-green-600 dark:text-green-400 mb-6">
                Welcome to {plan.name}! Your subscription is now active.
              </p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href="/">Start Learning</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    )
  }

//   if (!clientSecret || !stripe || !elements) {

//     return (
  
//       <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 dark:from-slate-900 dark:to-blue-950 flex items-center justify-center">
//         <div
//           className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-current border-e-transparent align-[-0.125em] text-primary motion-reduce:animate-[spin_1.5s_linear_infinite]"
//           role="status"
//         >
//           <span className="!absolute !-m-px !h-px !w-px !overflow-hidden !whitespace-nowrap !border-0 !p-0 ![clip:rect(0,0,0,0)]">
//             Loading...
//           </span>
//         </div>
//       </div>
//     )
//   }
 

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
            <Link href="/">
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
            <h1 className="text-3xl md:text-4xl font-bold mb-4">Complete Your Purchase</h1>
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
                      <h3 className="font-semibold">{plan.name} Plan</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {plan.price}/{plan.period}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="space-y-2">
                    <h4 className="font-medium text-sm">What's included:</h4>
                    <ul className="space-y-1">
                      {plan.features.slice(0, 4).map((feature, index) => (
                        <li key={index} className="flex items-center gap-2 text-sm text-muted-foreground">
                          <CheckCircle className="size-3 text-green-500 flex-shrink-0" />
                          <span>{feature}</span>
                        </li>
                      ))}
                    </ul>
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
                    <PaymentElement />
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