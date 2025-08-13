"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Check, X, Users, Award, Calendar, Shield, Zap, Crown } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"

const plans = [
  {
    name: "Free",
    price: "$0",
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
  },
  {
    name: "Pro",
    price: "$29",
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
  },
  {
    name: "Team",
    price: "$99",
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
  return (
     <footer className="w-full border-t bg-background/95 backdrop-blur-sm">
        <div className="container flex flex-col gap-8 px-4 py-10 md:px-6 lg:py-16">
          <div className="grid gap-8 sm:grid-cols-2 md:grid-cols-4">
            <div className="space-y-4">
              <div className="flex items-center gap-2 font-bold">
                <div className="size-8 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
                  <BookOpen className="size-4" />
                </div>
                <span>LearnHub</span>
              </div>
              <p className="text-sm text-muted-foreground">
                Empowering learners worldwide with expert-led courses and comprehensive learning resources.
              </p>
              <div className="flex gap-4">
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"></path>
                  </svg>
                  <span className="sr-only">Facebook</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M22 4s-.7 2.1-2 3.4c1.6 10-9.4 17.3-18 11.6 2.2.1 4.4-.6 6-2C3 15.5.5 9.6 3 5c2.2 2.6 5.6 4.1 9 4-.9-4.2 4-6.6 7-3.8 1.1 0 3-1.2 3-1.2z"></path>
                  </svg>
                  <span className="sr-only">Twitter</span>
                </Link>
                <Link href="#" className="text-muted-foreground hover:text-foreground transition-colors">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    width="24"
                    height="24"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    className="size-5"
                  >
                    <path d="M16 8a6 6 0 0 1 6 6v7h-4v-7a2 2 0 0 0-2-2 2 2 0 0 0-2 2v7h-4v-7a6 6 0 0 1 6-6z"></path>
                    <rect width="4" height="12" x="2" y="9"></rect>
                    <circle cx="4" cy="4" r="2"></circle>
                  </svg>
                  <span className="sr-only">LinkedIn</span>
                </Link>
              </div>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Courses</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Web Development
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Data Science
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Digital Marketing
                  </Link>
                </li>
                <li>
                  <Link href="/courses" className="text-muted-foreground hover:text-foreground transition-colors">
                    Design
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Resources</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/help" className="text-muted-foreground hover:text-foreground transition-colors">
                    Help Center
                  </Link>
                </li>
                <li>
                  <Link href="/teaching" className="text-muted-foreground hover:text-foreground transition-colors">
                    Teaching Center
                  </Link>
                </li>
                <li>
                  <Link href="/blog" className="text-muted-foreground hover:text-foreground transition-colors">
                    Blog
                  </Link>
                </li>
                <li>
                  <Link href="/community" className="text-muted-foreground hover:text-foreground transition-colors">
                    Community
                  </Link>
                </li>
              </ul>
            </div>
            <div className="space-y-4">
              <h4 className="text-sm font-bold">Company</h4>
              <ul className="space-y-2 text-sm">
                <li>
                  <Link href="/about" className="text-muted-foreground hover:text-foreground transition-colors">
                    About Us
                  </Link>
                </li>
                <li>
                  <Link href="/careers" className="text-muted-foreground hover:text-foreground transition-colors">
                    Careers
                  </Link>
                </li>
                <li>
                  <Link href="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link href="/terms" className="text-muted-foreground hover:text-foreground transition-colors">
                    Terms of Service
                  </Link>
                </li>
              </ul>
            </div>
          </div>
          <div className="flex flex-col gap-4 sm:flex-row justify-between items-center border-t border-border/40 pt-8">
            <p className="text-xs text-muted-foreground">
              &copy; {new Date().getFullYear()} LearnHub. All rights reserved.
            </p>
            <div className="flex gap-4">
              <Link href="/privacy" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Privacy Policy
              </Link>
              <Link href="/terms" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Terms of Service
              </Link>
              <Link href="/cookies" className="text-xs text-muted-foreground hover:text-foreground transition-colors">
                Cookie Policy
              </Link>
            </div>
          </div>
        </div>
      </footer>
  )
}
