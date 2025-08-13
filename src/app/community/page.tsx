"use client"

import Link from "next/link"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Users, MessageCircle, Heart, Award, TrendingUp, Calendar } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Avatar, AvatarFallback, AvatarImage } from "../components/ui/avatar"

const communityStats = [
  { label: "Active Members", value: "50K+", icon: <Users className="size-5" /> },
  { label: "Discussions", value: "25K+", icon: <MessageCircle className="size-5" /> },
  { label: "Success Stories", value: "5K+", icon: <Heart className="size-5" /> },
  { label: "Study Groups", value: "1.2K+", icon: <Award className="size-5" /> },
]

const recentDiscussions = [
  {
    id: 1,
    title: "Best practices for learning React in 2024",
    author: "Sarah Chen",
    avatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    replies: 24,
    likes: 156,
    category: "Web Development",
    timeAgo: "2 hours ago",
  },
  {
    id: 2,
    title: "Career transition from marketing to data science",
    author: "Mike Johnson",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    replies: 18,
    likes: 89,
    category: "Career Advice",
    timeAgo: "4 hours ago",
  },
  {
    id: 3,
    title: "Study group for Python fundamentals - Week 3",
    author: "Lisa Park",
    avatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    replies: 12,
    likes: 67,
    category: "Study Groups",
    timeAgo: "6 hours ago",
  },
]

export default function CommunityPage() {
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
            className="text-center max-w-4xl mx-auto"
          >
            <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
              👥 LearnHub Community
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">
              Learn Together,{" "}
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-primary to-secondary">
                Grow Together
              </span>
            </h1>
            <p className="text-lg text-muted-foreground mb-8">
              Join a vibrant community of learners, share knowledge, get support, and celebrate achievements together.
              Connect with peers from around the world who share your passion for learning.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button size="lg" className="rounded-full">
                Join the Community
              </Button>
              <Button size="lg" variant="outline" className="rounded-full bg-transparent">
                Browse Discussions
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Community Stats */}
      <section className="py-12 border-y bg-muted/30">
        <div className="container">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center">
            {communityStats.map((stat, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
                className="space-y-2"
              >
                <div className="flex items-center justify-center gap-2 text-primary">
                  {stat.icon}
                  <div className="text-3xl font-bold">{stat.value}</div>
                </div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Recent Discussions */}
      <section className="py-20">
        <div className="container">
          <div className="grid lg:grid-cols-3 gap-12">
            <div className="lg:col-span-2">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="mb-8"
              >
                <h2 className="text-3xl font-bold mb-4">Recent Discussions</h2>
                <p className="text-muted-foreground">Join the conversation and connect with fellow learners.</p>
              </motion.div>

              <div className="space-y-6">
                {recentDiscussions.map((discussion, index) => (
                  <motion.div
                    key={discussion.id}
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.5, delay: index * 0.1 }}
                  >
                    <Card className="border-border/40 bg-gradient-to-r from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg cursor-pointer">
                      <CardContent className="p-6">
                        <div className="flex items-start gap-4">
                          <Avatar className="size-12">
                            <AvatarImage src={discussion.avatar || "/placeholder.svg"} alt={discussion.author} />
                            <AvatarFallback>{discussion.author.charAt(0)}</AvatarFallback>
                          </Avatar>
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <Badge variant="outline" className="text-xs">
                                {discussion.category}
                              </Badge>
                              <span className="text-xs text-muted-foreground">{discussion.timeAgo}</span>
                            </div>
                            <h3 className="font-semibold mb-2 hover:text-primary transition-colors">
                              {discussion.title}
                            </h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground">
                              <span>by {discussion.author}</span>
                              <div className="flex items-center gap-1">
                                <MessageCircle className="size-3" />
                                <span>{discussion.replies} replies</span>
                              </div>
                              <div className="flex items-center gap-1">
                                <Heart className="size-3" />
                                <span>{discussion.likes} likes</span>
                              </div>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>

              <div className="text-center mt-8">
                <Button variant="outline" className="rounded-full bg-transparent">
                  View All Discussions
                </Button>
              </div>
            </div>

            {/* Sidebar */}
            <div className="space-y-6">
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
              >
                <Card className="border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4">Community Guidelines</h3>
                    <div className="space-y-3 text-sm text-muted-foreground">
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Be respectful and supportive of fellow learners</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Share knowledge and help others succeed</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>Keep discussions relevant and constructive</span>
                      </div>
                      <div className="flex items-start gap-2">
                        <div className="size-1.5 rounded-full bg-primary mt-2 flex-shrink-0" />
                        <span>No spam or self-promotion</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.1 }}
              >
                <Card className="border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4">Popular Categories</h3>
                    <div className="space-y-2">
                      {[
                        "Web Development",
                        "Data Science",
                        "Career Advice",
                        "Study Groups",
                        "Project Showcase",
                        "General Discussion",
                      ].map((category, index) => (
                        <div
                          key={index}
                          className="flex items-center justify-between p-2 rounded hover:bg-muted/50 cursor-pointer transition-colors"
                        >
                          <span className="text-sm">{category}</span>
                          <TrendingUp className="size-3 text-muted-foreground" />
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, x: 20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.2 }}
              >
                <Card className="border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                  <CardContent className="p-6">
                    <h3 className="font-bold mb-4">Upcoming Events</h3>
                    <div className="space-y-3">
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">React Study Group</div>
                          <div className="text-xs text-muted-foreground">Tomorrow, 7:00 PM EST</div>
                        </div>
                      </div>
                      <div className="flex items-start gap-3">
                        <div className="size-8 rounded bg-primary/10 flex items-center justify-center flex-shrink-0">
                          <Calendar className="size-4 text-primary" />
                        </div>
                        <div>
                          <div className="font-medium text-sm">Career Q&A Session</div>
                          <div className="text-xs text-muted-foreground">Friday, 3:00 PM EST</div>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
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
            <h2 className="text-3xl md:text-4xl font-bold mb-4">Ready to Join Our Community?</h2>
            <p className="text-lg text-primary-foreground/80 mb-8 max-w-2xl mx-auto">
              Connect with thousands of learners, share your journey, and accelerate your growth together.
            </p>
            <Button size="lg" variant="secondary" className="rounded-full px-8">
              Join the Community
            </Button>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
