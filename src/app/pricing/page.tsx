"use client"

import Link from "next/link"
import { useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Check, X, Users, Award, Calendar, Shield, Zap, Crown } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"

const plans = [
  {
    name: "Free",
    price: "0",
    period: "forever",
    description: "Perfect for getting started with learning.",
    features: [
      "Access to 10 free courses",
      "Basic community access",
      "Course completion certificates",
      "Mobile app access",
      "Standard video quality",
    ],
    limitations: [
      "No downloadable resources",
      "Limited course selection",
      "No instructor Q&A",
      "Basic certificates only",
    ],
    cta: "Get Started Free",
    popular: false,
    color: "border-border/40",
    planId: "free",
  },
  {
    name: "Pro",
    price: "29",
    period: "per month",
    description: "Ideal for serious learners and professionals.",
    features: [
      "Unlimited access to all courses",
      "Priority community support",
      "Downloadable resources",
      "Advanced certificates",
      "1-on-1 instructor sessions",
      "Career guidance",
      "HD video quality",
      "Offline viewing",
      "Progress tracking",
      "Personalized learning paths",
    ],
    limitations: [],
    cta: "Start Pro Trial",
    popular: true,
    color: "border-primary shadow-lg",
    planId: "pro",
  },
  {
    name: "Team",
    price: "99",
    period: "per month",
    description: "For organizations training multiple employees.",
    features: [
      "Everything in Pro",
      "Up to 10 team members",
      "Team progress tracking",
      "Custom learning paths",
      "Dedicated account manager",
      "Bulk certificates",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "API access",
    ],
    limitations: [],
    cta: "Contact Sales",
    popular: false,
    color: "border-border/40",
    planId: "team",
  },
]

const enterpriseFeatures = [
  {
    icon: <Shield className="size-6" />,
    title: "Enterprise Security",
    description: "Advanced security features including SSO, SCIM, and compliance certifications.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Unlimited Users",
    description: "Scale to any number of learners across your organization.",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Custom Integrations",
    description: "Integrate with your existing LMS, HR systems, and business tools.",
  },
  {
    icon: <Award className="size-6" />,
    title: "Custom Content",
    description: "Work with our team to create custom courses for your specific needs.",
  },
]

const faqs = [
  {
    question: "Can I switch plans at any time?",
    answer:
      "Yes, you can upgrade or downgrade your plan at any time. Changes will be reflected in your next billing cycle.",
  },
  {
    question: "Is there a free trial for Pro plans?",
    answer: "Yes, we offer a 7-day free trial for Pro plans. No credit card required to start your trial.",
  },
  {
    question: "What payment methods do you accept?",
    answer: "We accept all major credit cards, PayPal, and bank transfers for annual plans.",
  },
  {
    question: "Can I cancel my subscription anytime?",
    answer:
      "Absolutely. You can cancel your subscription at any time from your account settings. You'll continue to have access until the end of your billing period.",
  },
  {
    question: "Do you offer student discounts?",
    answer:
      "Yes, we offer a 50% discount for students with a valid .edu email address. Contact support to apply for student pricing.",
  },
  {
    question: "What's included in the Team plan?",
    answer:
      "The Team plan includes everything in Pro plus team management features, bulk certificates, and dedicated support for up to 10 users.",
  },
]

export default function PricingPage() {
  const router = useRouter()

  const handlePlanSelect = (planId: string, price: string) => {
    router.push(`/plan-payment-form?plan=${planId}&price=${price}`)
  }

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
            <nav className="hidden md:flex gap-6">
              <Link href="/courses" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Courses
              </Link>
              <Link href="/instructors" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                Instructors
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                About
              </Link>
              <Link href="/pricing" className="text-sm font-medium text-primary">
                Pricing
              </Link>
            </nav>
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
      <section className="py-20 bg-gradient-to-br from-primary/10 via-primary/5 to-transparent relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        <div className="container relative">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
              💰 Simple, Transparent Pricing
            </Badge>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
              Choose Your{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Learning Path
              </span>
            </h1>
            <p className="text-lg md:text-xl text-muted-foreground mb-8 max-w-3xl mx-auto">
              Flexible pricing options designed to grow with you. Start free and upgrade as you advance your skills.
            </p>
            <div className="flex items-center justify-center gap-8 text-sm text-muted-foreground">
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-500" />
                <span>7-day free trial</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-500" />
                <span>Cancel anytime</span>
              </div>
              <div className="flex items-center gap-2">
                <Check className="size-4 text-green-500" />
                <span>No setup fees</span>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Pricing Plans */}
      <section className="py-20">
        <div className="container">
          <div className="max-w-6xl mx-auto">
            <div className="grid gap-8 lg:grid-cols-3">
              {plans.map((plan, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card
                    className={`relative overflow-hidden h-full ${plan.color} ${plan.popular ? "scale-105" : ""} bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg`}
                  >
                    {plan.popular && (
                      <div className="absolute top-0 left-0 right-0 bg-gradient-to-r from-primary to-secondary text-primary-foreground text-center py-2 text-sm font-medium">
                        <Crown className="inline size-4 mr-1" />
                        Most Popular
                      </div>
                    )}
                    <CardContent className={`p-8 flex flex-col h-full ${plan.popular ? "pt-12" : ""}`}>
                      <div className="text-center mb-8">
                        <h3 className="text-2xl font-bold mb-2">{plan.name}</h3>
                        <div className="mb-4">
                          <span className="text-4xl font-bold">${plan.price}</span>
                          <span className="text-muted-foreground ml-1">/{plan.period}</span>
                        </div>
                        <p className="text-muted-foreground">{plan.description}</p>
                      </div>

                      <div className="space-y-4 mb-8 flex-grow">
                        <div>
                          <h4 className="font-semibold mb-3 text-green-600">What's included:</h4>
                          <ul className="space-y-2">
                            {plan.features.map((feature, i) => (
                              <li key={i} className="flex items-start gap-2 text-sm">
                                <Check className="size-4 text-green-500 mt-0.5 flex-shrink-0" />
                                <span>{feature}</span>
                              </li>
                            ))}
                          </ul>
                        </div>

                        {plan.limitations.length > 0 && (
                          <div>
                            <h4 className="font-semibold mb-3 text-muted-foreground">Limitations:</h4>
                            <ul className="space-y-2">
                              {plan.limitations.map((limitation, i) => (
                                <li key={i} className="flex items-start gap-2 text-sm text-muted-foreground">
                                  <X className="size-4 text-muted-foreground mt-0.5 flex-shrink-0" />
                                  <span>{limitation}</span>
                                </li>
                              ))}
                            </ul>
                          </div>
                        )}
                      </div>

                      <Button
                        className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                        variant={plan.popular ? "default" : "outline"}
                        size="lg"
                        onClick={() => handlePlanSelect(plan.planId, plan.price)}
                      >
                        {plan.cta}
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Enterprise Section */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Enterprise Solutions</h2>
            <p className="text-lg text-muted-foreground">
              Custom solutions for large organizations with advanced security, compliance, and support needs.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {enterpriseFeatures.map((feature, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                  <CardContent className="p-6 text-center">
                    <div className="size-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {feature.icon}
                    </div>
                    <h3 className="font-bold mb-2">{feature.title}</h3>
                    <p className="text-sm text-muted-foreground">{feature.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center">
            <Button size="lg" className="rounded-full px-8" onClick={() => handlePlanSelect("team", "99")}>
              Contact Enterprise Sales
            </Button>
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Everything you need to know about our pricing and plans.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <div className="space-y-6">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <Card className="border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                    <CardContent className="p-6">
                      <h3 className="font-semibold mb-2">{faq.question}</h3>
                      <p className="text-muted-foreground">{faq.answer}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground">
        <div className="container text-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Learning?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join thousands of learners who are advancing their careers with LearnHub. Start your free trial today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button
                size="lg"
                variant="secondary"
                className="rounded-full px-8"
                onClick={() => handlePlanSelect("pro", "29")}
              >
                Start Free Trial
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 bg-transparent border-white text-white hover:bg-white/10"
                onClick={() => handlePlanSelect("team", "99")}
              >
                <Calendar className="mr-2 size-4" />
                Schedule Demo
              </Button>
            </div>
            <p className="text-sm text-primary-foreground/60 mt-4">No credit card required • Cancel anytime</p>
          </motion.div>
        </div>
      </section>
    </div>
  )
}