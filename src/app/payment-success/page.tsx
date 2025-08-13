"use client"

import React from "react"
import { useSearchParams } from "next/navigation"
import Link from "next/link"
import { motion } from "framer-motion"
import { ArrowLeft, CheckCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Card, CardContent } from "../components/ui/card"

export default function PaymentSuccess() {
  const searchParams = useSearchParams()
  const courseId = searchParams.get("courseId") || ""
  const title = searchParams.get("title") || "Course"

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 to-emerald-100 dark:from-green-950 dark:to-emerald-900 flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between">
          <Link href="/" className="flex items-center gap-2 font-bold">
            <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <CheckCircle className="size-4" />
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

      {/* Success Content */}
      <div className="flex-1 flex items-center justify-center p-4">
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
                You have successfully enrolled in {decodeURIComponent(title)}!
              </p>
              <Button asChild className="w-full bg-green-600 hover:bg-green-700">
                <Link href={`/courses/${courseId}`}>Start Learning</Link>
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  )
}