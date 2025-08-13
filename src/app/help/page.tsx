"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import {
  BookOpen,
  ArrowLeft,
  Search,
  MessageCircle,
  Phone,
  Mail,
  HelpCircle,
  FileText,
  Video,
  Users,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "../components/ui/accordian"

const helpCategories = [
  {
    icon: <Users className="size-6" />,
    title: "Getting Started",
    description: "Learn the basics of using LearnHub",
    articles: 12,
  },
  {
    icon: <Video className="size-6" />,
    title: "Courses & Learning",
    description: "Everything about taking courses",
    articles: 18,
  },
  {
    icon: <FileText className="size-6" />,
    title: "Account & Billing",
    description: "Manage your account and payments",
    articles: 8,
  },
  {
    icon: <MessageCircle className="size-6" />,
    title: "Technical Support",
    description: "Troubleshooting and technical issues",
    articles: 15,
  },
]

const popularArticles = [
  "How to enroll in a course",
  "Downloading course materials",
  "Getting a refund",
  "Accessing certificates",
  "Troubleshooting video playback",
  "Changing your password",
]

const faqs = [
  {
    question: "How do I enroll in a course?",
    answer:
      "To enroll in a course, simply browse our course catalog, select the course you want, and click the 'Enroll Now' button. You'll need to create an account and complete the payment process.",
  },
  {
    question: "Can I get a refund if I'm not satisfied?",
    answer:
      "Yes! We offer a 30-day money-back guarantee on all courses. If you're not satisfied with your purchase, you can request a full refund within 30 days of enrollment.",
  },
  {
    question: "How long do I have access to a course?",
    answer:
      "Once you enroll in a course, you have lifetime access to all course materials, including videos, resources, and updates.",
  },
  {
    question: "Do I get a certificate when I complete a course?",
    answer:
      "Yes! Upon successful completion of a course, you'll receive a certificate of completion that you can share on LinkedIn and other professional networks.",
  },
  {
    question: "Can I download course videos for offline viewing?",
    answer:
      "Pro and Team subscribers can download course videos and materials for offline viewing through our mobile app.",
  },
]

export default function HelpPage() {
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
              🆘 Help Center
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">How can we help you?</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Find answers to your questions, get support, and learn how to make the most of LearnHub.
            </p>
            <div className="relative max-w-2xl mx-auto">
              <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
              <Input placeholder="Search for help articles, tutorials, or FAQs..." className="pl-10 h-12" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Help Categories */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4 mb-12">
            {helpCategories.map((category, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg cursor-pointer group">
                  <CardContent className="p-6 text-center">
                    <div className="size-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-colors">
                      {category.icon}
                    </div>
                    <h3 className="font-bold mb-2">{category.title}</h3>
                    <p className="text-sm text-muted-foreground mb-3">{category.description}</p>
                    <Badge variant="outline" className="text-xs">
                      {category.articles} articles
                    </Badge>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Popular Articles */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-3xl font-bold mb-6">Popular Articles</h2>
              <div className="space-y-3">
                {popularArticles.map((article, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-3 p-3 rounded-lg hover:bg-background/50 cursor-pointer transition-colors"
                  >
                    <HelpCircle className="size-4 text-primary flex-shrink-0" />
                    <span className="text-sm">{article}</span>
                  </div>
                ))}
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <h2 className="text-3xl font-bold mb-6">Contact Support</h2>
              <div className="space-y-4">
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <MessageCircle className="size-5 text-primary" />
                      <div>
                        <div className="font-medium">Live Chat</div>
                        <div className="text-sm text-muted-foreground">Get instant help from our support team</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Mail className="size-5 text-primary" />
                      <div>
                        <div className="font-medium">Email Support</div>
                        <div className="text-sm text-muted-foreground">support@learnhub.com</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
                <Card>
                  <CardContent className="p-4">
                    <div className="flex items-center gap-3">
                      <Phone className="size-5 text-primary" />
                      <div>
                        <div className="font-medium">Phone Support</div>
                        <div className="text-sm text-muted-foreground">+1 (555) 123-4567</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </motion.div>
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
            <h2 className="text-3xl font-bold mb-4">Frequently Asked Questions</h2>
            <p className="text-lg text-muted-foreground">Quick answers to the most common questions about LearnHub.</p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            <Accordion type="single" collapsible className="w-full">
              {faqs.map((faq, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                >
                  <AccordionItem value={`item-${index}`} className="border-b border-border/40 py-2">
                    <AccordionTrigger className="text-left font-medium hover:no-underline">
                      {faq.question}
                    </AccordionTrigger>
                    <AccordionContent className="text-muted-foreground">{faq.answer}</AccordionContent>
                  </AccordionItem>
                </motion.div>
              ))}
            </Accordion>
          </div>
        </div>
      </section>
    </div>
  )
}
