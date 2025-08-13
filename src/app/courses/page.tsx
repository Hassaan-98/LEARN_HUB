"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import Image from "next/image"
import { motion } from "framer-motion"
import { Search, Star, Clock, Users, BookOpen, Grid3X3, List, ArrowLeft, Play } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Badge } from "../components/ui/badge"
import { Card, CardContent } from "../components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { useSession } from "next-auth/react"

interface Instructor {
  firstName: string
  lastName: string
}

interface Course {
  id: string
  title: string
  category: string
  instructor: Instructor
  thumbnailUrl?: string
  bestseller?: boolean
  level: string
  duration: string
  rating?: number
  students?: number
  totalLessons?: number
  price: number | string
  originalPrice?: number | string
  description: string
  createdAt: string
}

const categories: string[] = [
  "All Courses",
  "Web Development",
  "Data Science",
  "Digital Marketing",
  "Design",
  "Business",
  "Photography",
  "Mobile Development",
  "AI & Machine Learning",
]

export default function CoursesPage() {
  const { data: session } = useSession()
  const [searchTerm, setSearchTerm] = useState<string>("")
  const [selectedCategory, setSelectedCategory] = useState<string>("All Courses")
  const [sortBy, setSortBy] = useState<string>("popularity")
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid")
  const [courses, setCourses] = useState<Course[]>([])
  const [filteredCourses, setFilteredCourses] = useState<Course[]>([])
  const [courseAccess, setCourseAccess] = useState<Record<string, boolean>>({})
  const [courseCompletion, setCourseCompletion] = useState<Record<string, boolean>>({})
  const [hasActiveSubscription, setHasActiveSubscription] = useState<boolean>(false)
  const [loading, setLoading] = useState<boolean>(true)
  const [error, setError] = useState<string | null>(null)

  // Fetch courses, enrolled courses, and subscription status
  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true)
        const coursesResponse = await fetch('/api/courses')

        // Handle courses fetch
        if (!coursesResponse.ok) throw new Error('Failed to fetch courses')
        const coursesData = await coursesResponse.json()
        setCourses(coursesData)
        setFilteredCourses(coursesData)

        // Handle subscription fetch for students
        if (session?.user?.userType === "student") {
          const subscriptionResponse = await fetch('/api/subscriptions')
          if (subscriptionResponse.ok) {
            const subscriptionData = await subscriptionResponse.json()
            setHasActiveSubscription(subscriptionData?.status === "active" && ["pro", "team"].includes(subscriptionData.planId))
            console.log("subscriptionData:", subscriptionData)
          }
          
          // Check access for each course
          const accessChecks = await Promise.all(
            coursesData.map(async (course: Course) => {
              try {
                const accessResponse = await fetch(`/api/courses/${course.id}/access`)
                if (accessResponse.ok) {
                  const accessData = await accessResponse.json()
                  return { courseId: course.id, hasAccess: accessData.hasAccess }
                }
                return { courseId: course.id, hasAccess: false }
              } catch (error) {
                console.error(`Error checking access for course ${course.id}:`, error)
                return { courseId: course.id, hasAccess: false }
              }
            })
          )
          
          // Update course access state
          const accessMap: Record<string, boolean> = {}
          accessChecks.forEach(({ courseId, hasAccess }) => {
            accessMap[courseId] = hasAccess
          })
          setCourseAccess(accessMap)
          console.log("courseAccess",courseAccess);
          
          // Check completion status for each course
          const completionChecks = await Promise.all(
            coursesData.map(async (course: Course) => {
              try {
                // Only check completion for courses the user has access to
                if (accessMap[course.id]) {
                  const enrollmentResponse = await fetch(`/api/student/enrollments`)
                  if (enrollmentResponse.ok) {
                    const enrollments = await enrollmentResponse.json()
                    const courseEnrollment = enrollments.find((e: any) => e.course.id === course.id)
                    if (courseEnrollment && courseEnrollment.enrollment.progress === 100) {
                      return { courseId: course.id, isCompleted: true }
                    }
                  }
                }
                return { courseId: course.id, isCompleted: false }
              } catch (error) {
                console.error(`Error checking completion for course ${course.id}:`, error)
                return { courseId: course.id, isCompleted: false }
              }
            })
          )
          
          // Update course completion state
          const completionMap: Record<string, boolean> = {}
          completionChecks.forEach(({ courseId, isCompleted }) => {
            completionMap[courseId] = isCompleted
          })
          setCourseCompletion(completionMap)
        }
      } catch (err: any) {
        setError(err.message)
        console.error("Error fetching data:", err)
      } finally {
        setLoading(false)
      }
    }
    fetchData()
   
  }, [session])

  // Filter and sort courses
  useEffect(() => {
    let filtered = [...courses]

    if (searchTerm) {
      const term = searchTerm.toLowerCase()
      filtered = filtered.filter(
        (course) =>
          course.title.toLowerCase().includes(term) ||
          course.category.toLowerCase().includes(term)
      )
    }

    if (selectedCategory !== "All Courses") {
      filtered = filtered.filter((course) => course.category === selectedCategory)
    }

    switch (sortBy) {
      case "popularity":
        filtered.sort((a, b) => (b.students ?? 0) - (a.students ?? 0))
        break
      case "rating":
        filtered.sort((a, b) => (b.rating ?? 0) - (a.rating ?? 0))
        break
      case "price-low":
        filtered.sort((a, b) => (parseFloat(String(a.price)) || 0) - (parseFloat(String(b.price)) || 0))
        break
      case "price-high":
        filtered.sort((a, b) => (parseFloat(String(b.price)) || 0) - (parseFloat(String(a.price)) || 0))
        break
      case "newest":
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime())
        break
    }

    setFilteredCourses(filtered)
  }, [searchTerm, selectedCategory, sortBy, courses])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Loading courses...</p>
      </div>
    )
  }

  if (error) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <p>Error: {error}</p>
      </div>
    )
  }

  const CourseCTA = ({
  courseId,
  price,
}: {
  courseId: string
  price: number | string
}) => {
  const { data: session } = useSession()
  const [hasAccess] = useState(courseAccess[courseId])
  const [isCompleted] = useState(courseCompletion[courseId])

  if (!session) {
    return (
      <Button className="w-full rounded-full" size="sm" asChild>
        <Link href="/sign-in">Sign in to Buy</Link>
      </Button>
    )
  }

  if (session.user?.userType === "instructor") {
    return null // Instructors don’t buy courses
  }

  // Student flow
  if (hasAccess) {
    if (isCompleted) {
      return (
        <Button className="w-full rounded-full" size="sm" disabled>
          Completed
        </Button>
      )
    }
    return (
      <Button className="w-full rounded-full"  size="sm" >
        Purchased
      </Button>
    )
  }

  return (
    <Button className="w-full rounded-full" size="sm" asChild>
      <Link href={`/payment-form?courseId=${courseId}&price=${price}`}>
        Buy Now
      </Link>
    </Button>
  )
}
  return (
    <div className="min-h-screen bg-background py-20">

      {/* Hero Section */}
      <section className="py-12 bg-gradient-to-br from-primary/5 to-secondary/5">
        <div className="container">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Explore Our Courses</h1>
            <p className="text-lg text-muted-foreground mb-8">
              Discover over 500+ expert-led courses designed to help you master new skills and advance your career.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 max-w-2xl mx-auto">
              <div className="relative flex-1">
                <Search className="absolute left-3 top-3 size-4 text-muted-foreground" />
                <Input
                  placeholder="Search courses, instructors, or topics..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
              <Button size="lg" className="px-8">
                Search
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Filters and Controls */}
      <section className="py-6 border-b bg-muted/30">
        <div className="container">
          <div className="flex flex-col lg:flex-row gap-4 items-center justify-between">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <Button
                  key={category}
                  variant={selectedCategory === category ? "default" : "outline"}
                  size="sm"
                  onClick={() => setSelectedCategory(category)}
                  className="rounded-full"
                >
                  {category}
                </Button>
              ))}
            </div>
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2">
                <span className="text-sm text-muted-foreground">Sort by:</span>
                <Select value={sortBy} onValueChange={setSortBy}>
                  <SelectTrigger className="w-40">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="popularity">Most Popular</SelectItem>
                    <SelectItem value="rating">Highest Rated</SelectItem>
                    <SelectItem value="price-low">Price: Low to High</SelectItem>
                    <SelectItem value="price-high">Price: High to Low</SelectItem>
                    <SelectItem value="newest">Newest</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="flex items-center border rounded-lg">
                <Button
                  variant={viewMode === "grid" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("grid")}
                  className="rounded-r-none"
                >
                  <Grid3X3 className="size-4" />
                </Button>
                <Button
                  variant={viewMode === "list" ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setViewMode("list")}
                  className="rounded-l-none"
                >
                  <List className="size-4" />
                </Button>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Courses Grid/List */}
      <section className="py-12">
        <div className="container">
          <div className="mb-6">
            <p className="text-muted-foreground">
              Showing {filteredCourses.length} of {courses.length} courses
            </p>
          </div>

          {viewMode === "grid" ? (
            <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="h-full overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10 backdrop-blur transition-all hover:shadow-lg group cursor-pointer">
                    <div className="relative overflow-hidden">
                      <Image
                        src={course.thumbnailUrl || "/placeholder.svg"}
                        alt={course.title}
                        width={400}
                        height={250}
                        className="w-full h-48 object-cover transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {course.bestseller && <Badge className="bg-orange-500 text-white">Bestseller</Badge>}
                        <Badge variant="secondary">{course.level}</Badge>
                      </div>
                      <div className="absolute top-2 right-2 bg-black/70 text-white px-2 py-1 rounded text-xs">
                        {course.duration}
                      </div>
                      <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-colors flex items-center justify-center opacity-0 group-hover:opacity-100">
                        <Button size="sm" className="rounded-full" asChild>
                          <Link href={`/courses/${course.id}`}>
                            <Play className="size-4 mr-2" />
                            Preview
                          </Link>
                        </Button>
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-col h-full">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">
                          {course.category}
                        </Badge>
                      </div>
                      <h3 className="font-bold mb-2 line-clamp-2 group-hover:text-primary transition-colors">
                        {course.title}
                      </h3>
                      <p className="text-xs text-muted-foreground mb-3 line-clamp-2">{course.description}</p>
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="size-3 text-yellow-500 fill-yellow-500" />
                          <span className="font-medium">{course.rating || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>{(course.students || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          <span>{course.totalLessons || 0} lessons</span>
                        </div>
                      </div>
                      <div className="">
                        <div className="flex items-center gap-2 mb-3">
                          <span className="text-lg font-bold">${course.price}</span>
                          {course.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through">${course.originalPrice}</span>
                          )}
                        </div>
                       <CourseCTA courseId={course.id} price={course.price} />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="space-y-6">
              {filteredCourses.map((course, index) => (
                <motion.div
                  key={course.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <Card className="flex flex-col md:flex-row overflow-hidden border-border/40 bg-gradient-to-b from-background to-muted/10">
                    <div className="relative w-full md:w-1/3 h-48 md:h-auto">
                      <Image
                        src={course.thumbnailUrl || "/placeholder.svg"}
                        alt={course.title}
                        layout="fill"
                        objectFit="cover"
                        className="transition-transform group-hover:scale-105"
                      />
                      <div className="absolute top-2 left-2 flex gap-2">
                        {course.bestseller && <Badge className="bg-orange-500 text-white">Bestseller</Badge>}
                        <Badge variant="secondary">{course.level}</Badge>
                      </div>
                    </div>
                    <CardContent className="p-4 flex flex-col flex-1">
                      <div className="flex items-center gap-2 mb-2">
                        <Badge variant="outline" className="text-xs">{course.category}</Badge>
                      </div>
                      <h3 className="font-bold text-lg mb-2">{course.title}</h3>
                      <p className="text-sm text-muted-foreground mb-3">{course.description}</p>
                      <div className="flex items-center gap-4 mb-3 text-xs text-muted-foreground">
                        <div className="flex items-center gap-1">
                          <Star className="size-3 text-yellow-500 fill-yellow-500" />
                          <span>{course.rating || 'N/A'}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Users className="size-3" />
                          <span>{(course.students || 0).toLocaleString()}</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <BookOpen className="size-3" />
                          <span>{course.totalLessons || 0} lessons</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="size-3" />
                          <span>{course.duration}</span>
                        </div>
                      </div>
                      <div className=" flex items-center gap-4">
                        <div>
                          <span className="text-lg font-bold">${course.price}</span>
                          {course.originalPrice && (
                            <span className="text-sm text-muted-foreground line-through ml-2">${course.originalPrice}</span>
                          )}
                        </div>
                     
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          )}
        </div>
      </section>
    </div>
  )
}