"use client"

import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { BookOpen, ArrowLeft, Calendar, Clock, ArrowRight } from "lucide-react"
import { Button } from "../components/ui/button"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Input } from "../components/ui/input"

const blogPosts = [
  {
    id: 1,
    title: "The Future of Online Learning: Trends to Watch in 2024",
    excerpt:
      "Explore the latest trends shaping the future of online education, from AI-powered personalization to immersive virtual reality experiences.",
    image: "https://images.unsplash.com/photo-1522202176988-66273c2fd55f?w=600&h=400&fit=crop",
    author: "Sarah Johnson",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    date: "December 15, 2024",
    readTime: "8 min read",
    category: "Education Technology",
    featured: true,
  },
  {
    id: 2,
    title: "How to Build a Successful Career in Web Development",
    excerpt:
      "A comprehensive guide to starting and advancing your career in web development, including essential skills and career paths.",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=600&h=400&fit=crop",
    author: "Michael Chen",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    date: "December 12, 2024",
    readTime: "12 min read",
    category: "Career Development",
    featured: false,
  },
  {
    id: 3,
    title: "Data Science vs Machine Learning: Understanding the Difference",
    excerpt:
      "Clear explanations of data science and machine learning, their differences, similarities, and which career path might be right for you.",
    image: "https://images.unsplash.com/photo-1551288049-bebda4e38f71?w=600&h=400&fit=crop",
    author: "Dr. Lisa Park",
    authorImage: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=50&h=50&fit=crop&crop=face",
    date: "December 10, 2024",
    readTime: "10 min read",
    category: "Data Science",
    featured: false,
  },
  {
    id: 4,
    title: "Digital Marketing Strategies That Actually Work in 2024",
    excerpt:
      "Proven digital marketing strategies and tactics that are driving results for businesses in today's competitive landscape.",
    image: "https://images.unsplash.com/photo-1460925895917-afdab827c52f?w=600&h=400&fit=crop",
    author: "Emily Rodriguez",
    authorImage: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=50&h=50&fit=crop&crop=face",
    date: "December 8, 2024",
    readTime: "7 min read",
    category: "Digital Marketing",
    featured: false,
  },
  {
    id: 5,
    title: "The Psychology of Learning: How to Study More Effectively",
    excerpt:
      "Science-backed techniques and strategies to improve your learning efficiency and retention, based on cognitive psychology research.",
    image: "https://images.unsplash.com/photo-1513475382585-d06e58bcb0e0?w=600&h=400&fit=crop",
    author: "Dr. James Wilson",
    authorImage: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=50&h=50&fit=crop&crop=face",
    date: "December 5, 2024",
    readTime: "9 min read",
    category: "Learning Science",
    featured: false,
  },
  {
    id: 6,
    title: "UI/UX Design Principles Every Developer Should Know",
    excerpt:
      "Essential design principles that will help developers create better user experiences and collaborate more effectively with designers.",
    image: "https://images.unsplash.com/photo-1561070791-2526d30994b5?w=600&h=400&fit=crop",
    author: "David Kim",
    authorImage: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=50&h=50&fit=crop&crop=face",
    date: "December 3, 2024",
    readTime: "11 min read",
    category: "Design",
    featured: false,
  },
]

const categories = [
  "All Posts",
  "Education Technology",
  "Career Development",
  "Data Science",
  "Digital Marketing",
  "Learning Science",
  "Design",
]

export default function BlogPage() {
  const featuredPost = blogPosts.find((post) => post.featured)
  const regularPosts = blogPosts.filter((post) => !post.featured)

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
              📝 LearnHub Blog
            </Badge>
            <h1 className="text-4xl md:text-5xl font-bold mb-6">Learn, Grow, Succeed</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Insights, tips, and stories from the world of online learning and professional development.
            </p>
            <div className="relative max-w-md mx-auto">
              <Input placeholder="Search articles..." className="pl-4 h-12" />
            </div>
          </motion.div>
        </div>
      </section>

      {/* Featured Post */}
      {featuredPost && (
        <section className="py-20">
          <div className="container">
            <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
              <Badge className="mb-6 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
                Featured Article
              </Badge>
              <Card className="overflow-hidden border-border/40 bg-gradient-to-br from-background to-muted/10 backdrop-blur">
                <div className="grid lg:grid-cols-2 gap-0">
                  <div className="relative aspect-[4/3] lg:aspect-auto">
                    <Image
                      src={featuredPost.image || "/placeholder.svg"}
                      alt={featuredPost.title}
                      fill
                      className="object-cover"
                    />
                  </div>
                  <CardContent className="p-8 flex flex-col justify-center">
                    <Badge variant="outline" className="w-fit mb-4">
                      {featuredPost.category}
                    </Badge>
                    <h2 className="text-2xl md:text-3xl font-bold mb-4 leading-tight">{featuredPost.title}</h2>
                    <p className="text-muted-foreground mb-6 text-lg">{featuredPost.excerpt}</p>
                    <div className="flex items-center gap-4 mb-6">
                      <div className="flex items-center gap-2">
                        <Image
                          src={featuredPost.authorImage || "/placeholder.svg"}
                          alt={featuredPost.author}
                          width={32}
                          height={32}
                          className="rounded-full"
                        />
                        <span className="text-sm font-medium">{featuredPost.author}</span>
                      </div>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{featuredPost.date}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{featuredPost.readTime}</span>
                        </div>
                      </div>
                    </div>
                    <Button className="w-fit">
                      Read Article
                      <ArrowRight className="ml-2 size-4" />
                    </Button>
                  </CardContent>
                </div>
              </Card>
            </motion.div>
          </div>
        </section>
      )}

      {/* Categories */}
      <section className="py-8 border-y bg-muted/30">
        <div className="container">
          <div className="flex flex-wrap gap-2 justify-center">
            {categories.map((category) => (
              <Button key={category} variant="outline" size="sm" className="rounded-full bg-transparent">
                {category}
              </Button>
            ))}
          </div>
        </div>
      </section>

      {/* Blog Posts Grid */}
      <section className="py-20">
        <div className="container">
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {regularPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: index * 0.1 }}
              >
                <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg group cursor-pointer">
                  <div className="relative aspect-[4/3] overflow-hidden">
                    <Image
                      src={post.image || "/placeholder.svg"}
                      alt={post.title}
                      fill
                      className="object-cover transition-transform group-hover:scale-105"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge variant="secondary" className="bg-background/80 backdrop-blur">
                        {post.category}
                      </Badge>
                    </div>
                  </div>
                  <CardContent className="p-6 flex flex-col h-full">
                    <h3 className="font-bold text-lg mb-3 line-clamp-2 group-hover:text-primary transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-muted-foreground mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <Image
                          src={post.authorImage || "/placeholder.svg"}
                          alt={post.author}
                          width={24}
                          height={24}
                          className="rounded-full"
                        />
                        <span className="font-medium">{post.author}</span>
                      </div>
                      <div className="flex items-center gap-3 text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Calendar className="size-3" />
                          <span>{post.date.split(",")[0]}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{post.readTime}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-12">
            <Button variant="outline" size="lg" className="rounded-full bg-transparent">
              Load More Articles
            </Button>
          </div>
        </div>
      </section>
    </div>
  )
}
