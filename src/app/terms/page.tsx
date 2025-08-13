"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, FileText, Scale, Shield, AlertTriangle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"

export default function TermsPage() {
  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 w-full backdrop-blur-lg bg-background/80 border-b">
        <div className="container flex h-16 items-center justify-between">
          <div className="flex items-center gap-4">
            <Link href="/" className="flex items-center gap-2 font-bold">
              <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                <BookOpen className="size-4" />
              </div>
              <span>LearnHub</span>
            </Link>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/">
                <ArrowLeft className="size-4 mr-2" />
                Back to Home
              </Link>
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-3xl mx-auto"
          >
            <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
              📋 Terms of Service
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Terms of Service</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Please read these terms carefully before using LearnHub. By using our service, you agree to these terms.
            </p>
            <div className="text-sm text-muted-foreground">Last updated: December 15, 2024</div>
          </motion.div>
        </div>
      </section>

      {/* Terms Content */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="space-y-8">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <FileText className="size-6 text-primary" />
                      <h2 className="text-2xl font-bold">1. Acceptance of Terms</h2>
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        By accessing and using LearnHub, you accept and agree to be bound by the terms and provision of
                        this agreement. If you do not agree to abide by the above, please do not use this service.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Scale className="size-6 text-primary" />
                      <h2 className="text-2xl font-bold">2. Use License</h2>
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        Permission is granted to temporarily access the materials on LearnHub for personal,
                        non-commercial transitory viewing only. This is the grant of a license, not a transfer of title,
                        and under this license you may not:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>modify or copy the materials</li>
                        <li>use the materials for any commercial purpose or for any public display</li>
                        <li>attempt to reverse engineer any software contained on the website</li>
                        <li>remove any copyright or other proprietary notations from the materials</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Shield className="size-6 text-primary" />
                      <h2 className="text-2xl font-bold">3. User Accounts</h2>
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        When you create an account with us, you must provide information that is accurate, complete, and
                        current at all times. You are responsible for safeguarding the password and for all activities
                        that occur under your account.
                      </p>
                      <p>
                        You agree not to disclose your password to any third party. You must notify us immediately upon
                        becoming aware of any breach of security or unauthorized use of your account.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.3 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">4. Course Access and Content</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        Upon enrollment in a course, you will be granted access to the course materials for the duration
                        specified. Course content is for your personal use only and may not be shared, distributed, or
                        used for commercial purposes.
                      </p>
                      <p>
                        We reserve the right to modify course content, pricing, and availability at any time without
                        prior notice.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">5. Payment and Refunds</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        All payments are processed securely through our payment partners. We offer a 30-day money-back
                        guarantee on all course purchases. Refund requests must be submitted within 30 days of purchase.
                      </p>
                      <p>Subscription fees are billed in advance and are non-refundable except as required by law.</p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.5 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">6. Prohibited Uses</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>You may not use our service:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>For any unlawful purpose or to solicit others to perform unlawful acts</li>
                        <li>
                          To violate any international, federal, provincial, or state regulations, rules, laws, or local
                          ordinances
                        </li>
                        <li>
                          To infringe upon or violate our intellectual property rights or the intellectual property
                          rights of others
                        </li>
                        <li>To harass, abuse, insult, harm, defame, slander, disparage, intimidate, or discriminate</li>
                        <li>To submit false or misleading information</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <AlertTriangle className="size-6 text-primary" />
                      <h2 className="text-2xl font-bold">7. Disclaimer</h2>
                    </div>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        The information on this website is provided on an "as is" basis. To the fullest extent permitted
                        by law, this Company excludes all representations, warranties, conditions and terms whether
                        express or implied, statutory or otherwise.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.7 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">8. Limitations</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        In no event shall LearnHub or its suppliers be liable for any damages (including, without
                        limitation, damages for loss of data or profit, or due to business interruption) arising out of
                        the use or inability to use the materials on LearnHub's website.
                      </p>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.8 }}
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">9. Contact Information</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>If you have any questions about these Terms of Service, please contact us at:</p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p>
                          <strong>Email:</strong> legal@learnhub.com
                        </p>
                        <p>
                          <strong>Address:</strong> 123 Learning Street, Education City, EC 12345
                        </p>
                        <p>
                          <strong>Phone:</strong> +1 (555) 123-4567
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>
          </div>
        </div>
      </section>
    </div>
  )
}
