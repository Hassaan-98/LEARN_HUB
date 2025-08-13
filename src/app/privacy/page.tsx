"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Shield, Eye, Lock, Users } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"

const privacyPrinciples = [
  {
    icon: <Shield className="size-6" />,
    title: "Data Protection",
    description: "We use industry-standard security measures to protect your personal information.",
  },
  {
    icon: <Eye className="size-6" />,
    title: "Transparency",
    description: "We're clear about what data we collect and how we use it.",
  },
  {
    icon: <Lock className="size-6" />,
    title: "User Control",
    description: "You have control over your data and can modify or delete it at any time.",
  },
  {
    icon: <Users className="size-6" />,
    title: "No Selling",
    description: "We never sell your personal information to third parties.",
  },
]

export default function PrivacyPage() {
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
              🔒 Privacy Policy
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Your Privacy Matters</h1>
            <p className="text-lg text-muted-foreground mb-8">
              We're committed to protecting your privacy and being transparent about how we collect, use, and share your
              information.
            </p>
            <div className="text-sm text-muted-foreground">Last updated: December 15, 2024</div>
          </motion.div>
        </div>
      </section>

      {/* Privacy Principles */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-16">
            {privacyPrinciples.map((principle, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <div className="size-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {principle.icon}
                    </div>
                    <h3 className="font-bold mb-2">{principle.title}</h3>
                    <p className="text-sm text-muted-foreground">{principle.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Privacy Policy Content */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="max-w-4xl mx-auto">
            <div className="prose prose-gray dark:prose-invert max-w-none">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="space-y-8"
              >
                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">1. Information We Collect</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        We collect information you provide directly to us, such as when you create an account, enroll in
                        courses, or contact us for support. This may include:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Name, email address, and contact information</li>
                        <li>Payment information (processed securely by our payment partners)</li>
                        <li>Profile information and preferences</li>
                        <li>Course progress and completion data</li>
                        <li>Communications with our support team</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">2. How We Use Your Information</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>We use the information we collect to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Provide, maintain, and improve our services</li>
                        <li>Process transactions and send related information</li>
                        <li>Send you technical notices and support messages</li>
                        <li>Communicate with you about courses, features, and updates</li>
                        <li>Personalize your learning experience</li>
                        <li>Monitor and analyze usage patterns</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">3. Information Sharing</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        We do not sell, trade, or otherwise transfer your personal information to third parties. We may
                        share your information only in the following circumstances:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>With your consent</li>
                        <li>With service providers who assist us in operating our platform</li>
                        <li>To comply with legal obligations</li>
                        <li>To protect our rights and the safety of our users</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">4. Data Security</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        We implement appropriate security measures to protect your personal information against
                        unauthorized access, alteration, disclosure, or destruction. These measures include:
                      </p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Encryption of data in transit and at rest</li>
                        <li>Regular security audits and assessments</li>
                        <li>Access controls and authentication measures</li>
                        <li>Employee training on data protection</li>
                      </ul>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">5. Your Rights</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>You have the right to:</p>
                      <ul className="list-disc pl-6 space-y-2">
                        <li>Access and update your personal information</li>
                        <li>Delete your account and associated data</li>
                        <li>Opt out of marketing communications</li>
                        <li>Request a copy of your data</li>
                        <li>Object to certain processing of your data</li>
                      </ul>
                      <p className="mt-4">To exercise these rights, please contact us at privacy@learnhub.com.</p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">6. Cookies and Tracking</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        We use cookies and similar technologies to enhance your experience, analyze usage, and provide
                        personalized content. You can control cookie settings through your browser preferences.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">7. Changes to This Policy</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        We may update this privacy policy from time to time. We will notify you of any changes by
                        posting the new policy on this page and updating the "Last updated" date.
                      </p>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardContent className="p-8">
                    <h2 className="text-2xl font-bold mb-4">8. Contact Us</h2>
                    <div className="space-y-4 text-muted-foreground">
                      <p>
                        If you have any questions about this privacy policy or our data practices, please contact us at:
                      </p>
                      <div className="bg-muted/50 p-4 rounded-lg">
                        <p>
                          <strong>Email:</strong> privacy@learnhub.com
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
