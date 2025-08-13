"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, MapPin, Clock, Users, Heart, Zap, Target } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"

const jobOpenings = [
  {
    id: 1,
    title: "Senior Frontend Developer",
    department: "Engineering",
    location: "Remote",
    type: "Full-time",
    description: "Join our engineering team to build the next generation of online learning experiences.",
  },
  {
    id: 2,
    title: "Product Manager",
    department: "Product",
    location: "San Francisco, CA",
    type: "Full-time",
    description: "Lead product strategy and development for our core learning platform.",
  },
  {
    id: 3,
    title: "UX Designer",
    department: "Design",
    location: "Remote",
    type: "Full-time",
    description: "Design intuitive and engaging user experiences for millions of learners.",
  },
  {
    id: 4,
    title: "Content Marketing Manager",
    department: "Marketing",
    location: "New York, NY",
    type: "Full-time",
    description: "Create compelling content that inspires and educates our community.",
  },
]

const benefits = [
  {
    icon: <Heart className="size-6" />,
    title: "Health & Wellness",
    description: "Comprehensive health insurance, mental health support, and wellness programs.",
  },
  {
    icon: <Zap className="size-6" />,
    title: "Professional Growth",
    description: "Learning stipend, conference attendance, and career development opportunities.",
  },
  {
    icon: <Users className="size-6" />,
    title: "Work-Life Balance",
    description: "Flexible hours, unlimited PTO, and remote work options.",
  },
  {
    icon: <Target className="size-6" />,
    title: "Impact & Purpose",
    description: "Work on products that transform lives and democratize education globally.",
  },
]

export default function CareersPage() {
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
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} animate={{ opacity: 1, x: 0 }} transition={{ duration: 0.8 }}>
              <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                💼 Join Our Team
              </Badge>
              <h1 className="text-4xl md:text-5xl font-bold mb-6">
                Build the Future of{" "}
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                  Education
                </span>
              </h1>
              <p className="text-lg text-muted-foreground mb-8">
                Join a passionate team dedicated to democratizing education and empowering learners worldwide. We're
                looking for talented individuals who share our mission.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" className="rounded-full">
                  View Open Positions
                </Button>
                <Button size="lg" variant="outline" className="rounded-full bg-transparent">
                  Learn About Our Culture
                </Button>
              </div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="relative"
            >
              <div className="rounded-2xl overflow-hidden shadow-2xl">
                <Image
                  src="https://images.unsplash.com/photo-1522071820081-009f0129c71c?w=600&h=400&fit=crop"
                  width={600}
                  height={400}
                  alt="Team collaboration at LearnHub"
                  className="w-full h-auto"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-20">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Why Work at LearnHub?</h2>
            <p className="text-lg text-muted-foreground">
              We believe in creating an environment where our team can thrive, grow, and make a meaningful impact.
            </p>
          </motion.div>

          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
            {benefits.map((benefit, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6 text-center">
                    <div className="size-12 mx-auto mb-4 rounded-full bg-primary/10 flex items-center justify-center text-primary">
                      {benefit.icon}
                    </div>
                    <h3 className="font-bold mb-2">{benefit.title}</h3>
                    <p className="text-sm text-muted-foreground">{benefit.description}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Job Openings */}
      <section className="py-20 bg-muted/30">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto mb-12"
          >
            <h2 className="text-3xl font-bold mb-4">Open Positions</h2>
            <p className="text-lg text-muted-foreground">
              Explore opportunities to join our growing team and make an impact on education worldwide.
            </p>
          </motion.div>

          <div className="max-w-4xl mx-auto space-y-6">
            {jobOpenings.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="border-border/40 bg-gradient-to-r from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg">
                  <CardContent className="p-6">
                    <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-xl font-bold">{job.title}</h3>
                          <Badge variant="outline">{job.department}</Badge>
                        </div>
                        <p className="text-muted-foreground mb-4">{job.description}</p>
                        <div className="flex items-center gap-4 text-sm text-muted-foreground">
                          <div className="flex items-center gap-1">
                            <MapPin className="size-3" />
                            <span>{job.location}</span>
                          </div>
                          <div className="flex items-center gap-1">
                            <Clock className="size-3" />
                            <span>{job.type}</span>
                          </div>
                        </div>
                      </div>
                      <Button className="rounded-full">Apply Now</Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Don't See the Right Role?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              We're always looking for talented individuals who are passionate about education. Send us your resume and
              let us know how you'd like to contribute.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full px-8">
              Send Us Your Resume
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
