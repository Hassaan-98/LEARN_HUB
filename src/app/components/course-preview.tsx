"use client"

import { motion } from "framer-motion"
import Image from "next/image"
import { Badge } from "./ui/badge"
import { Button } from "./ui/button"
import { Card, CardContent } from "./ui/card"
import { Play, Clock, Users, Star } from "lucide-react"

export function CoursePreview() {
  return (
    <section className="w-full py-20 md:py-32 container">
      <div className=" px-10 md:px-6">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5 }}
          >
            <Badge className="mb-4 rounded-full px-4 py-1.5 text-sm font-medium" variant="secondary">
              Course Preview
            </Badge>
            <h2 className="text-3xl md:text-4xl font-bold tracking-tight mb-6">Experience Interactive Learning</h2>
            <p className="text-lg text-muted-foreground mb-8">
              Our courses feature high-quality video content, interactive exercises, downloadable resources, and
              real-world projects to ensure you gain practical skills.
            </p>
            <div className="space-y-4 mb-8">
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Play className="size-4 text-primary" />
                </div>
                <span>HD video lectures with subtitles</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Clock className="size-4 text-primary" />
                </div>
                <span>Self-paced learning with lifetime access</span>
              </div>
              <div className="flex items-center gap-3">
                <div className="size-8 rounded-full bg-primary/10 flex items-center justify-center">
                  <Users className="size-4 text-primary" />
                </div>
                <span>Community discussions and Q&A</span>
              </div>
            </div>
            <Button size="lg" className="rounded-full">
              Try Free Course
            </Button>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="relative"
          >
            <Card className="overflow-hidden border-border/40 shadow-2xl">
              <div className="relative">
                <Image
                  src="https://plus.unsplash.com/premium_vector-1726073300336-f9444f4dd4bc?q=80&w=1170&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={500}
                  height={300}
                  alt="Course video player interface"
                  className="w-full h-auto"
                />
                <div className="absolute inset-0 bg-black/20 flex items-center justify-center">
                  <div className="size-16 rounded-full bg-white/90 flex items-center justify-center shadow-lg">
                    <Play className="size-6 text-primary ml-1" />
                  </div>
                </div>
                <div className="absolute bottom-4 left-4 right-4">
                  <div className="bg-black/70 text-white px-3 py-2 rounded text-sm">
                    Lesson 3: Building Your First React Component
                  </div>
                </div>
              </div>
              <CardContent className="p-4">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium">Course Progress</span>
                  <span className="text-sm text-muted-foreground">65%</span>
                </div>
                <div className="w-full bg-muted rounded-full h-2 mb-4">
                  <div className="bg-primary h-2 rounded-full" style={{ width: "65%" }}></div>
                </div>
                <div className="flex items-center justify-between text-sm text-muted-foreground">
                  <span>12 of 18 lessons completed</span>
                  <div className="flex items-center gap-1">
                    <Star className="size-3 text-yellow-500 fill-yellow-500" />
                    <span>4.9</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  )
}
