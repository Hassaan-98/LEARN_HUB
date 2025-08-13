"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Check,
  ChevronRight,
  Menu,
  X,
  Moon,
  Sun,
  ArrowRight,
  Star,
  Play,
  Users,
  BookOpen,
  Award,
  Clock,
  TrendingUp,
  Upload,
  DollarSign,
} from "lucide-react"
import { Button } from "./components/ui/button"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "./components/ui/accordian"
import { Badge } from "./components/ui/badge"
import { Card, CardContent } from "./components/ui/card"
import { useTheme } from "next-themes"
import { AuthDialog } from "./components/auth/auth-dialog"
import { HeroBanner } from "./components/hero-banner"
import { CourseCategories } from "./components/course-categories"
import { FeaturedInstructors } from "./components/featured-instructors"
import { CoursePreview } from "./components/course-preview"

export default function CoursePlatform() {
  const [isScrolled, setIsScrolled] = useState(false)
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false)
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => {
    setMounted(true)
    const handleScroll = () => {
      if (window.scrollY > 10) {
        setIsScrolled(true)
      } else {
        setIsScrolled(false)
      }
    }

    window.addEventListener("scroll", handleScroll)
    return () => window.removeEventListener("scroll", handleScroll)
  }, [])

  const toggleTheme = () => {
    setTheme(theme === "dark" ? "light" : "dark")
  }

  const container = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: {
        staggerChildren: 0.1,
      },
    },
  }

  const item = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0 },
  }

  const features = [
    {
      title: "Interactive Learning",
      description: "Engage with video lessons, quizzes, and hands-on projects to master new skills.",
      icon: <Play className="size-5" />,
    },
    {
      title: "Expert Instructors",
      description: "Learn from industry professionals and certified experts in their fields.",
      icon: <Award className="size-5" />,
    },
    {
      title: "Flexible Schedule",
      description: "Study at your own pace with lifetime access to course materials.",
      icon: <Clock className="size-5" />,
    },
    {
      title: "Community Support",
      description: "Connect with fellow learners and get help from our active community.",
      icon: <Users className="size-5" />,
    },
    {
      title: "Course Creation Tools",
      description: "Easy-to-use tools for creators to upload and manage their courses.",
      icon: <Upload className="size-5" />,
    },
    {
      title: "Revenue Sharing",
      description: "Earn money from your expertise with our fair revenue sharing model.",
      icon: <DollarSign className="size-5" />,
    },
  ]

  const popularCourses = [
    {
      id: 1,
      title: "Complete Web Development Bootcamp",
      instructor: "Sarah Johnson",
      rating: 4.9,
      students: 12543,
      price: 89.99,
      originalPrice: 199.99,
      image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=400&h=250&fit=crop",
      duration: "42 hours",
      level: "Beginner to Advanced",
    },
    {
      id: 2,
      title: "Data Science with Python",
      instructor: "Dr. Michael Chen",
      rating: 4.8,
      students: 8921,
      price: 79.99,
      originalPrice: 149.99,
      image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=400&h=250&fit=crop",
      duration: "35 hours",
      level: "Intermediate",
    },
    {
      id: 3,
      title: "Digital Marketing Mastery",
      instructor: "Emily Rodriguez",
      rating: 4.7,
      students: 15632,
      price: 69.99,
      originalPrice: 129.99,
      image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=400&h=250&fit=crop",
      duration: "28 hours",
      level: "Beginner",
    },
    {
      id: 4,
      title: "UI/UX Design Fundamentals",
      instructor: "David Kim",
      rating: 4.9,
      students: 7854,
      price: 94.99,
      originalPrice: 179.99,
      image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=400&h=250&fit=crop",
      duration: "38 hours",
      level: "Beginner to Intermediate",
    },
  ]

  return (
    <div className="flex min-h-[100dvh] flex-col">
    

      <main className="flex-1">
        {/* Enhanced Hero Section */}
        <HeroBanner />

        {/* Stats Section */}
        <section className="w-full py-12 border-y bg-muted/30">
          <div className="container px-4 md:px-6">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">50K+</div>
                <div className="text-sm text-muted-foreground">Active Students</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">500+</div>
                <div className="text-sm text-muted-foreground">Expert Courses</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">95%</div>
                <div className="text-sm text-muted-foreground">Completion Rate</div>
              </div>
              <div>
                <div className="text-3xl md:text-4xl font-bold text-primary mb-2">4.8★</div>
                <div className="text-sm text-muted-foreground">Average Rating</div>
              </div>
            </div>
          </div>
        </section>

        {/* Popular Courses Section */}
        <section id="courses" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Popular Courses
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Start Learning Today</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Discover our most popular courses taught by industry experts. Get hands-on experience and build
                real-world projects.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 md:grid-cols-2 lg:grid-cols-4"
            >
              {popularCourses.map((course, i) => (
                <motion.div key={i} variants={item}>
                  <Link href={`/courses/${course.id}`}>
                    <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg group cursor-pointer">
                      <div className="relative overflow-hidden">
                        <Image
                          src={course.image || "/placeholder.svg"}
                          alt={course.title}
                          width={400}
                          height={250}
                          className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                        />
                        <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                          {course.duration}
                        </div>
                      </div>
                      <CardContent className="p-4 flex flex-col h-full">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge variant="secondary" className="text-xs">
                            {course.level}
                          </Badge>
                        </div>
                        <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                          {course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-3">by {course.instructor}</p>
                        <div className="flex items-center gap-2 mb-3">
                          <div className="flex items-center gap-1">
                            <Star className="size-3 text-yellow-500 fill-yellow-500" />
                            <span className="text-xs font-medium">{course.rating}</span>
                          </div>
                          <span className="text-xs text-muted-foreground">
                            ({course.students.toLocaleString()} students)
                          </span>
                        </div>
                        <div className="mt-auto">
                          <div className="flex items-center gap-2 mb-3">
                            <span className="text-lg font-bold">${course.price}</span>
                            <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                          </div>
                          <Button className="w-full rounded-full" size="sm">
                            Enroll Now
                          </Button>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              ))}
            </motion.div>

            <div className="text-center mt-12">
              <Button variant="outline" size="lg" className="rounded-full bg-transparent" asChild>
                <Link href="/courses">
                  View All Courses
                  <ArrowRight className="ml-2 size-4" />
                </Link>
              </Button>
            </div>
          </div>
        </section>

        {/* Course Categories Section */}
        <CourseCategories />

        {/* Featured Instructors Section */}
        <FeaturedInstructors />

        {/* Course Preview Section */}
        <CoursePreview />

        {/* Features Section */}
        <section className="w-full py-20 md:py-32 bg-muted/30 relative overflow-hidden">
          <div className="absolute inset-0 -z-10 h-full w-full bg-white dark:bg-black bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_50%,#000_40%,transparent_100%)]"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Why Choose LearnHub
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Everything You Need to Succeed</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Our platform provides comprehensive tools for both learners and instructors to create an exceptional
                educational experience.
              </p>
            </motion.div>

            <motion.div
              variants={container}
              initial="hidden"
              whileInView="show"
              viewport={{ once: true }}
              className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3"
            >
              {features.map((feature, i) => (
                <motion.div key={i} variants={item}>
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="size-10 rounded-full bg-primary/10 dark:bg-primary/20 flex items-center justify-center text-primary mb-4">
                        {feature.icon}
                      </div>
                      <h3 className="text-xl font-bold mb-2">{feature.title}</h3>
                      <p className="text-muted-foreground">{feature.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </motion.div>
          </div>
        </section>

        {/* Become Instructor Section */}
        <section id="instructors" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
              >
                <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                  For Instructors
                </Badge>
                <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">
                  Share Your Knowledge, Earn Revenue
                </h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join thousands of instructors who are making a living by teaching what they love. Our platform
                  provides all the tools you need to create, market, and sell your courses.
                </p>
                <div className="space-y-4 mb-8">
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Upload className="size-4 text-primary" />
                    </div>
                    <span>Easy course creation tools</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="size-4 text-primary" />
                    </div>
                    <span>Built-in marketing and analytics</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="size-4 text-primary" />
                    </div>
                    <span>Competitive revenue sharing (up to 70%)</span>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                      <Users className="size-4 text-primary" />
                    </div>
                    <span>Access to global student community</span>
                  </div>
                </div>
                <Button size="lg" className="rounded-full" asChild>
                  <Link href="/instructors">
                    Start Teaching Today
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="relative"
              >
                <div className="rounded-xl overflow-hidden shadow-2xl border border-border/40">
                  <Image
                    src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=500&fit=crop"
                    width={600}
                    height={500}
                    alt="Instructor dashboard showing course analytics and revenue"
                    className="w-full h-auto"
                  />
                </div>
                <div className="absolute -bottom-4 -right-4 -z-10 h-[200px] w-[200px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70"></div>
              </motion.div>
            </div>
          </div>
        </section>

        {/* Testimonials Section */}
        <section className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Success Stories
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">What Our Students Say</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Hear from learners who have transformed their careers with our courses.
              </p>
            </motion.div>

            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
              {[
                {
                  quote:
                    "The web development course completely changed my career. I went from zero coding knowledge to landing my dream job as a frontend developer in just 6 months.",
                  author: "Alex Thompson",
                  role: "Frontend Developer at TechCorp",
                  course: "Complete Web Development Bootcamp",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=80&h=80&fit=crop&crop=face",
                },
                {
                  quote:
                    "The data science course was incredibly comprehensive. The hands-on projects helped me build a portfolio that impressed employers. Highly recommended!",
                  author: "Maria Garcia",
                  role: "Data Analyst at DataFlow",
                  course: "Data Science with Python",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=80&h=80&fit=crop&crop=face",
                },
                {
                  quote:
                    "As a course creator, LearnHub's platform made it easy to share my expertise. I've earned over $50k in my first year teaching digital marketing.",
                  author: "James Wilson",
                  role: "Digital Marketing Instructor",
                  course: "Digital Marketing Mastery",
                  rating: 5,
                  image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=80&h=80&fit=crop&crop=face",
                },
              ].map((testimonial, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.5, delay: i * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div className="flex mb-4">
                        {Array(testimonial.rating)
                          .fill(0)
                          .map((_, j) => (
                            <Star key={j} className="size-4 text-yellow-500 fill-yellow-500" />
                          ))}
                      </div>
                      <p className="text-lg mb-4 flex-grow">"{testimonial.quote}"</p>
                      <div className="space-y-2">
                        <div className="flex items-center gap-3">
                          <Image
                            src={testimonial.image || "/placeholder.svg"}
                            alt={testimonial.author}
                            width={40}
                            height={40}
                            className="size-10 rounded-full object-cover"
                          />
                          <div>
                            <p className="font-medium">{testimonial.author}</p>
                            <p className="text-sm text-muted-foreground">{testimonial.role}</p>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {testimonial.course}
                        </Badge>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* Pricing Section */}
        <section id="pricing" className="w-full py-20 md:py-32">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Pricing Plans
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Choose Your Learning Path</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Flexible pricing options for every learner. Start free and upgrade as you grow.
              </p>
            </motion.div>

            <div className="mx-auto max-w-4xl">
              <div className="grid gap-6 lg:grid-cols-3">
                {[
                  {
                    name: "Free",
                    price: "$0",
                    description: "Perfect for getting started with learning.",
                    features: [
                      "Access to 10 free courses",
                      "Basic community access",
                      "Course completion certificates",
                      "Mobile app access",
                    ],
                    cta: "Get Started Free",
                    popular: false,
                  },
                  {
                    name: "Pro",
                    price: "$29",
                    description: "Ideal for serious learners and professionals.",
                    features: [
                      "Unlimited access to all courses",
                      "Priority community support",
                      "Downloadable resources",
                      "Advanced certificates",
                      "1-on-1 instructor sessions",
                      "Career guidance",
                    ],
                    cta: "Start Pro Trial",
                    popular: true,
                  },
                  {
                    name: "Team",
                    price: "$99",
                    description: "For organizations training multiple employees.",
                    features: [
                      "Everything in Pro",
                      "Up to 10 team members",
                      "Team progress tracking",
                      "Custom learning paths",
                      "Dedicated account manager",
                      "Bulk certificates",
                    ],
                    cta: "Contact Sales",
                    popular: false,
                  },
                ].map((plan, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: i * 0.1 }}
                  >
                    <Card
                      className={`relative overflow-hidden h-full ${plan.popular ? "border-primary shadow-lg scale-105" : "border-border/40 shadow-md"} bg-gradient-to-b from-background to-muted/10 backdrop-blur`}
                    >
                      {plan.popular && (
                        <div className="absolute top-0 right-0 bg-primary text-primary-foreground px-3 py-1 text-xs font-medium rounded-bl-lg">
                          Most Popular
                        </div>
                      )}
                      <CardContent className="p-6 flex flex-col h-full">
                        <h3 className="text-2xl font-bold">{plan.name}</h3>
                        <div className="flex items-baseline mt-4">
                          <span className="text-4xl font-bold">{plan.price}</span>
                          <span className="text-muted-foreground ml-1">/month</span>
                        </div>
                        <p className="text-muted-foreground mt-2">{plan.description}</p>
                        <ul className="space-y-3 my-6 flex-grow">
                          {plan.features.map((feature, j) => (
                            <li key={j} className="flex items-center">
                              <Check className="mr-2 size-4 text-primary" />
                              <span className="text-sm">{feature}</span>
                            </li>
                          ))}
                        </ul>
                        <Button
                          className={`w-full mt-auto rounded-full ${plan.popular ? "bg-primary hover:bg-primary/90" : ""}`}
                          variant={plan.popular ? "default" : "outline"}
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

        {/* FAQ Section */}
        <section id="faq" className="w-full py-20 md:py-32 bg-muted/30">
          <div className="container px-4 md:px-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-4 text-center mb-12"
            >
              <Badge className="rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                FAQ
              </Badge>
              <h2 className="text-3xl md:text-4xl font-bold tracking-tight">Frequently Asked Questions</h2>
              <p className="max-w-[800px] text-muted-foreground md:text-lg">
                Find answers to common questions about our learning platform.
              </p>
            </motion.div>

            <div className="mx-auto max-w-3xl">
              <Accordion type="single" collapsible className="w-full">
                {[
                  {
                    question: "How do I get started with LearnHub?",
                    answer:
                      "Simply create a free account to access our starter courses. You can browse our course catalog, enroll in free courses, and upgrade to Pro for unlimited access to all content.",
                  },
                  {
                    question: "Can I download courses for offline viewing?",
                    answer:
                      "Yes! Pro and Team subscribers can download course videos and materials for offline viewing through our mobile app. This feature is perfect for learning on the go.",
                  },
                  {
                    question: "How do I become an instructor on LearnHub?",
                    answer:
                      "Apply to become an instructor through our instructor application process. Once approved, you'll get access to our course creation tools and can start uploading your content. We provide full support throughout the process.",
                  },
                  {
                    question: "What's the revenue share for instructors?",
                    answer:
                      "Instructors earn up to 70% of the revenue from their course sales. The exact percentage depends on how students find your course - direct enrollments earn the highest percentage.",
                  },
                  {
                    question: "Do you offer certificates upon course completion?",
                    answer:
                      "Yes! All courses come with completion certificates. Pro subscribers get enhanced certificates that can be shared on LinkedIn and other professional networks.",
                  },
                  {
                    question: "Is there a mobile app available?",
                    answer:
                      "Yes, we have mobile apps for both iOS and Android. You can access all your courses, download content for offline viewing, and continue learning anywhere.",
                  },
                ].map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.3, delay: i * 0.05 }}
                  >
                    <AccordionItem value={`item-${i}`} className="border-b border-border/40 py-2">
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

        {/* CTA Section */}
        <section className="w-full py-20 md:py-32 bg-gradient-to-br from-primary to-primary/80 text-primary-foreground relative overflow-hidden">
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(to_right,#ffffff10_1px,transparent_1px),linear-gradient(to_bottom,#ffffff10_1px,transparent_1px)] bg-[size:4rem_4rem]"></div>
          <div className="absolute -top-24 -left-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>
          <div className="absolute -bottom-24 -right-24 w-64 h-64 bg-white/10 rounded-full blur-3xl"></div>

          <div className="container px-4 md:px-6 relative">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="flex flex-col items-center justify-center space-y-6 text-center"
            >
              <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold tracking-tight">
                Ready to Start Your Learning Journey?
              </h2>
              <p className="mx-auto max-w-[700px] text-primary-foreground/80 md:text-xl">
                Join thousands of learners who are advancing their careers with our expert-led courses. Start learning
                today and unlock your potential.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 mt-4">
                <Button size="lg" variant="secondary" className="rounded-full h-12 px-8 text-base" asChild>
                  <Link href="/courses">
                    Browse Courses
                    <ArrowRight className="ml-2 size-4" />
                  </Link>
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="rounded-full h-12 px-8 text-base bg-transparent border-white text-white hover:bg-white/10"
                  asChild
                >
                  <Link href="/instructors">Become an Instructor</Link>
                </Button>
              </div>
              <p className="text-sm text-primary-foreground/80 mt-4">
                Start with free courses. No credit card required.
              </p>
            </motion.div>
          </div>
        </section>
      </main>
    </div>
  )
}
