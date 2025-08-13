"use client"

import React, { useEffect, useState } from "react"
import { useSearchParams, useRouter } from "next/navigation"
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
const stripePublishableKey = process.env.NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY || ""
if (!stripePublishableKey) {
  console.error("Stripe publishable key is missing. Please set NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY in your .env.local file.")
}
const stripePromise = loadStripe(stripePublishableKey)

interface CourseDetails {
  title: string
  price: string
  description: string
  instructorName: string
}

function PaymentFormContent() {
  const searchParams = useSearchParams()
  const router = useRouter()
  const courseId = searchParams.get("courseId") || ""
  const price = parseFloat(searchParams.get("price") || "0")
  const [course, setCourse] = useState<CourseDetails | null>(null)
  const [isLoading, setIsLoading] = useState(true)
  const stripe = useStripe()
  const elements = useElements()
  const [clientSecret, setClientSecret] = useState("")
  const [errorMessage, setErrorMessage] = useState("")
  const [isProcessing, setIsProcessing] = useState(false)
  const [paymentStatus, setPaymentStatus] = useState<"idle" | "success" | "error">("idle")
  const [paymentRequest, setPaymentRequest] = useState<null | any>(null)

  // Fetch course details
  useEffect(() => {
    if (!courseId) {
      setErrorMessage("Invalid course ID")
      setPaymentStatus("error")
      setIsLoading(false)
      return
    }

    const fetchCourse = async () => {
      try {
        const response = await fetch(`/api/courses/${courseId}`)
        if (!response.ok) throw new Error("Course not found")
        const data = await response.json()
        setCourse({
          title: data.title,
          price: `$${data.price}`,
          description: data.description,
          instructorName: `${data.instructor.firstName} ${data.instructor.lastName}`,
        })
      } catch (error) {
        console.error("Error fetching course:", error)
        setErrorMessage("Failed to load course details")
        setPaymentStatus("error")
      } finally {
        setIsLoading(false)
      }
    }
    fetchCourse()
  }, [courseId])

  // Initialize Stripe payment
  useEffect(() => {
    if (!stripePublishableKey) {
      setErrorMessage("Stripe configuration error: Publishable key is missing.")
      setPaymentStatus("error")
      setIsLoading(false)
      return
    }

    if (!stripe || !elements || !courseId || price <= 0) {
      return
    }

    // Set up PaymentRequest for Google Pay/Apple Pay
    const pr = stripe.paymentRequest({
      country: "US",
      currency: "usd",
      total: {
        label: `Course: ${course?.title || "Course Purchase"}`,
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
    const payload = { amount: Math.round(price * 100), courseId }
    console.log(" sending request to /api/payments/purchase:", { method: "POST", body: payload })

    fetch(`/api/payments/purchase`, {
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
  }, [stripe, elements, courseId, price, course])

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
          router.push(`/payment-success?courseId=${courseId}&title=${encodeURIComponent(course?.title || "Course")}`)
        }
      } catch (error) {
        ev.complete("fail")
        setErrorMessage("An unexpected error occurred with Google Pay/Apple Pay")
        setPaymentStatus("error")
      } finally {
        setIsProcessing(false)
      }
    })
  }, [paymentRequest, stripe, clientSecret, router, courseId, course])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!stripe || !elements || !clientSecret || !courseId) {
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
          return_url: `${window.location.origin}/payment-success?courseId=${courseId}&title=${encodeURIComponent(course?.title || "Course")}`,
        },
      })

      if (error) {
        setErrorMessage(error.message || "Payment processing failed")
        setPaymentStatus("error")
      } else if (paymentIntent.status === "succeeded") {
        setPaymentStatus("success")
        router.push(`/payment-success?courseId=${courseId}&title=${encodeURIComponent(course?.title || "Course")}`)
      }
    } catch (error) {
      setErrorMessage("An unexpected error occurred")
      setPaymentStatus("error")
    } finally {
      setIsProcessing(false)
    }
  }

  if (paymentStatus === "success") {
    return null // Redirect handled above
  }

  if (isLoading || !stripe || !elements || !clientSecret || !course) {
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
            <Link href="/courses">
              <ArrowLeft className="size-4 mr-2" />
              Back to Courses
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
                      <h3 className="font-semibold">{course.title}</h3>
                      <p className="text-sm text-muted-foreground">{course.description}</p>
                      <p className="text-sm text-muted-foreground">By {course.instructorName}</p>
                    </div>
                    <Badge variant="secondary" className="ml-2">
                      {course.price}
                    </Badge>
                  </div>

                  <Separator />

                  <div className="flex items-center justify-between font-semibold">
                    <span>Total</span>
                    <span className="text-lg">{course.price}</span>
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
                        `Complete Purchase - ${course.price}`
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

export default function PaymentFormPage() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId") || ""
  const price = parseFloat(searchParams.get("price") || "0")
  const [clientSecret, setClientSecret] = useState("")
  const [error, setError] = useState("")

  useEffect(() => {
    if (!stripePublishableKey) {
      setError("Stripe configuration error: Publishable key is missing.")
      return
    }

    if (price <= 0 || !courseId) {
      setError("Invalid course or price")
      return
    }

    const payload = { amount: Math.round(price * 100), courseId }
    console.log("Sending request to /api/payments/purchase:", { method: "POST", body: payload })

    fetch(`/api/payments/purchase`, {
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
  }, [courseId, price])

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

  if (!clientSecret) {
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
        clientSecret,
        appearance: {
          theme: "stripe",
        },
      }}
    >
      <PaymentFormContent />
    </Elements>
  )
}