"use client"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import {
  Star,
  Users,
  BookOpen,
  ArrowLeft,
  Play,
  Award,
  TrendingUp,
  DollarSign,
  Upload,
  CheckCircle,
  MessageCircle,
  Calendar,
} from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../components/ui/tabs"

const featuredInstructors = [
  {
    id: 1,
    name: "Sarah Johnson",
    title: "Senior Full Stack Developer",
    company: "Google",
    image: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    students: 25000,
    courses: 8,
    specialty: "Web Development",
    bio: "Sarah has over 10 years of experience in web development and has worked at top tech companies including Google and Facebook. She specializes in React, Node.js, and modern web technologies.",
    achievements: ["Google Developer Expert", "React Conference Speaker", "Open Source Contributor"],
    totalEarnings: "$150,000+",
  },
  {
    id: 2,
    name: "Dr. Michael Chen",
    title: "Data Science Lead",
    company: "Microsoft",
    image: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face",
    rating: 4.8,
    students: 18500,
    courses: 6,
    specialty: "Data Science",
    bio: "Dr. Chen holds a PhD in Computer Science and leads the data science team at Microsoft. He's passionate about making complex data concepts accessible to everyone.",
    achievements: ["PhD Computer Science", "Microsoft MVP", "Published Researcher"],
    totalEarnings: "$120,000+",
  },
  {
    id: 3,
    name: "Emily Rodriguez",
    title: "Marketing Director",
    company: "HubSpot",
    image: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face",
    rating: 4.7,
    students: 32000,
    courses: 12,
    specialty: "Digital Marketing",
    bio: "Emily is a marketing expert with 8+ years of experience helping businesses grow through digital marketing strategies. She's helped over 500 companies increase their online presence.",
    achievements: ["HubSpot Certified Trainer", "Marketing Week Speaker", "Forbes Contributor"],
    totalEarnings: "$200,000+",
  },
  {
    id: 4,
    name: "David Kim",
    title: "Senior UX Designer",
    company: "Apple",
    image: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face",
    rating: 4.9,
    students: 15000,
    courses: 5,
    specialty: "UI/UX Design",
    bio: "David is a design leader at Apple with expertise in user experience design, design systems, and product strategy. He's designed products used by millions of users worldwide.",
    achievements: ["Apple Design Award Winner", "Design Systems Expert", "UX Conference Speaker"],
    totalEarnings: "$100,000+",
  },
]

const instructorBenefits = [
  {
    icon: <DollarSign className="size-6" />,
    title: "Earn Up to 70% Revenue Share",
    description: "Keep the majority of your course sales with our industry-leading revenue sharing model.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Global Student Reach",
    description: "Access our community of 50,000+ active learners from around the world.",
  },
  {
    icon: <Upload className="size-6" />,
    title: "Easy Course Creation",
    description: "Use our intuitive tools to create, upload, and manage your courses effortlessly.",
  },
  {
    icon: <TrendingUp className="size-6" />,
    title: "Marketing & Analytics",
    description: "Built-in marketing tools and detailed analytics to grow your student base.",
  },
  {
    icon: <Award className="size-6" />,
    title: "Instructor Certification",
    description: "Get certified as a LearnHub instructor and boost your credibility.",
  },
  {
    icon: <MessageCircle className="size-6" />,
    title: "Student Interaction",
    description: "Engage with students through Q&A, discussions, and direct messaging.",
  },
]

const steps = [
  {
    step: 1,
    title: "Apply to Teach",
    description: "Submit your instructor application with your expertise and teaching experience.",
    icon: <CheckCircle className="size-8" />,
  },
  {
    step: 2,
    title: "Create Your Course",
    description: "Use our course creation tools to build engaging content with videos, quizzes, and resources.",
    icon: <Upload className="size-8" />,
  },
  {
    step: 3,
    title: "Launch & Earn",
    description: "Publish your course and start earning from day one with our marketing support.",
    icon: <DollarSign className="size-8" />,
  },
]

export default function InstructorsPage() {
  const [activeTab, setActiveTab] = useState("overview")

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
              <Link href="/instructors" className="text-sm font-medium text-primary">
                Instructors
              </Link>
              <Link href="/about" className="text-sm font-medium text-muted-foreground hover:text-foreground">
                About
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                🎓 Become an Instructor
              </Badge>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6">
                Share Your Knowledge,{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Earn Revenue
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8 max-w-2xl">
                Join thousands of expert instructors who are making a living by teaching what they love. Create courses,
                reach global audiences, and build a sustainable income stream.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full h-12 px-8">
                  Start Teaching Today
                </Button>
                <Button size="lg" variant="outline" className="rounded-full h-12 px-8 bg-transparent">
                  <Play className="mr-2 size-4" />
                  Watch Success Stories
                </Button>
              </div>
              <div className="grid grid-cols-3 gap-6 mt-12 pt-8 border-t border-border/50">
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">$150K+</div>
                  <div className="text-xs text-muted-foreground">Top Instructor Earnings</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">50K+</div>
                  <div className="text-xs text-muted-foreground">Global Students</div>
                </div>
                <div className="text-center">
                  <div className="text-2xl font-bold text-primary mb-1">70%</div>
                  <div className="text-xs text-muted-foreground">Revenue Share</div>
                </div>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl border border-border/20">
                <Image
                  src="https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop"
                  width={600}
                  height={400}
                  alt="Instructor teaching online course"
                  className="w-full h-auto"
                />
              </div>
              <div className="absolute -bottom-6 -right-6 -z-10 h-[200px] w-[200px] rounded-full bg-gradient-to-br from-primary/30 to-secondary/30 blur-3xl opacity-70" />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Tabs Navigation */}
      <section className="py-8 border-b bg-muted/30">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full grid-cols-4 max-w-2xl mx-auto">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="instructors">Top Instructors</TabsTrigger>
              <TabsTrigger value="benefits">Benefits</TabsTrigger>
              <TabsTrigger value="how-it-works">How It Works</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>
      </section>

      {/* Tab Content */}
      <section className="py-12">
        <div className="container">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <TabsContent value="overview" className="space-y-12">
              {/* Stats Section */}
              <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">2,500+</div>
                  <div className="text-sm text-muted-foreground">Active Instructors</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">$2M+</div>
                  <div className="text-sm text-muted-foreground">Paid to Instructors</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">4.8★</div>
                  <div className="text-sm text-muted-foreground">Average Rating</div>
                </div>
                <div className="space-y-2">
                  <div className="text-3xl font-bold text-primary">95%</div>
                  <div className="text-sm text-muted-foreground">Instructor Satisfaction</div>
                </div>
              </div>

              {/* Why Teach Section */}
              <div className="text-center max-w-3xl mx-auto">
                <h2 className="text-3xl font-bold mb-4">Why Teach on LearnHub?</h2>
                <p className="text-lg text-muted-foreground mb-8">
                  Join a community of passionate educators and entrepreneurs who are building successful online teaching
                  businesses.
                </p>
                <div className="grid md:grid-cols-3 gap-8">
                  <div className="text-center">
                    <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <TrendingUp className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Grow Your Audience</h3>
                    <p className="text-sm text-muted-foreground">
                      Reach students worldwide and build your personal brand as an expert in your field.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <DollarSign className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Generate Income</h3>
                    <p className="text-sm text-muted-foreground">
                      Create a sustainable income stream by monetizing your expertise and knowledge.
                    </p>
                  </div>
                  <div className="text-center">
                    <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center">
                      <Award className="size-8 text-primary" />
                    </div>
                    <h3 className="font-semibold mb-2">Make an Impact</h3>
                    <p className="text-sm text-muted-foreground">
                      Help students achieve their goals and transform their careers through education.
                    </p>
                  </div>
                </div>
              </div>
            </TabsContent>

            <TabsContent value="instructors" className="space-y-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">Meet Our Top Instructors</h2>
                <p className="text-lg text-muted-foreground">
                  Learn from industry experts who are making a real impact in their students' lives.
                </p>
              </div>

              <div className="grid gap-8 md:grid-cols-2">
                {featuredInstructors.map((instructor, index) => (
                  <motion.div
                    key={instructor.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4 mb-4">
                          <Image
                            src={instructor.image || "/placeholder.svg"}
                            alt={instructor.name}
                            width={80}
                            height={80}
                            className="rounded-full object-cover border-2 border-border"
                          />
                          <div className="flex-1">
                            <h3 className="font-bold text-lg mb-1">{instructor.name}</h3>
                            <p className="text-sm text-muted-foreground mb-1">{instructor.title}</p>
                            <p className="text-xs text-muted-foreground mb-2">{instructor.company}</p>
                            <Badge variant="outline" className="text-xs">
                              {instructor.specialty}
                            </Badge>
                          </div>
                          <div className="text-right">
                            <div className="text-sm font-medium text-green-600">{instructor.totalEarnings}</div>
                            <div className="text-xs text-muted-foreground">Total Earnings</div>
                          </div>
                        </div>

                        <p className="text-sm text-muted-foreground mb-4 line-clamp-3">{instructor.bio}</p>

                        <div className="grid grid-cols-3 gap-4 mb-4 text-center">
                          <div>
                            <div className="flex items-center justify-center gap-1 mb-1">
                              <Star className="size-3 text-yellow-500 fill-yellow-500" />
                              <span className="text-sm font-medium">{instructor.rating}</span>
                            </div>
                            <div className="text-xs text-muted-foreground">Rating</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">{instructor.students.toLocaleString()}</div>
                            <div className="text-xs text-muted-foreground">Students</div>
                          </div>
                          <div>
                            <div className="text-sm font-medium mb-1">{instructor.courses}</div>
                            <div className="text-xs text-muted-foreground">Courses</div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <div className="text-xs font-medium text-muted-foreground">Achievements:</div>
                          <div className="flex flex-wrap gap-1">
                            {instructor.achievements.map((achievement, i) => (
                              <Badge key={i} variant="secondary" className="text-xs">
                                {achievement}
                              </Badge>
                            ))}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="benefits" className="space-y-8">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">Instructor Benefits</h2>
                <p className="text-lg text-muted-foreground">
                  Everything you need to succeed as an online instructor on our platform.
                </p>
              </div>

              <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
                {instructorBenefits.map((benefit, index) => (
                  <motion.div
                    key={index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="h-full border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur transition-all hover:shadow-md">
                      <CardContent className="p-6">
                        <div className="size-12 rounded-full bg-primary/10 flex items-center justify-center text-primary mb-4">
                          {benefit.icon}
                        </div>
                        <h3 className="font-bold mb-2">{benefit.title}</h3>
                        <p className="text-sm text-muted-foreground">{benefit.description}</p>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            </TabsContent>

            <TabsContent value="how-it-works" className="space-y-12">
              <div className="text-center max-w-3xl mx-auto mb-12">
                <h2 className="text-3xl font-bold mb-4">How It Works</h2>
                <p className="text-lg text-muted-foreground">
                  Get started as an instructor in just three simple steps.
                </p>
              </div>

              <div className="max-w-4xl mx-auto">
                <div className="grid gap-8 md:grid-cols-3">
                  {steps.map((step, index) => (
                    <motion.div
                      key={step.step}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      className="text-center relative"
                    >
                      {index < steps.length - 1 && (
                        <div className="hidden md:block absolute top-8 left-full w-full h-0.5 bg-gradient-to-r from-primary/50 to-transparent transform -translate-x-1/2" />
                      )}
                      <div className="size-16 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary relative z-10">
                        {step.icon}
                      </div>
                      <div className="text-sm font-medium text-primary mb-2">Step {step.step}</div>
                      <h3 className="font-bold mb-2">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </motion.div>
                  ))}
                </div>
              </div>

              <div className="text-center">
                <Button size="lg" className="rounded-full px-8">
                  Apply to Become an Instructor
                </Button>
              </div>
            </TabsContent>
          </Tabs>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Start Teaching?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Join our community of successful instructors and start building your online teaching business today.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" variant="secondary" className="rounded-full px-8">
                Apply Now
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="rounded-full px-8 bg-transparent border-white text-white hover:bg-white/10"
              >
                <Calendar className="mr-2 size-4" />
                Schedule a Call
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
