"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { Button } from "./ui/button";
import { Badge } from "./ui/badge";
import {
  ArrowRight,
  Play,
  Star,
  BookOpen,
  Users,
  Award,
  TrendingUp,
  Sparkles,
  CheckCircle,
} from "lucide-react";

export function HeroBanner() {
  const [mounted, setMounted] = useState(false);
  const { scrollY } = useScroll();
  const y1 = useTransform(scrollY, [0, 300], [0, -50]);
  const y2 = useTransform(scrollY, [0, 300], [0, -100]);
  const opacity = useTransform(scrollY, [0, 300], [1, 0.8]);

  useEffect(() => {
    setMounted(true);
  }, []);

  const stats = [
    {
      icon: <Users className="size-4" />,
      value: "50K+",
      label: "Active Students",
    },
    {
      icon: <BookOpen className="size-4" />,
      value: "500+",
      label: "Expert Courses",
    },
    { icon: <Award className="size-4" />, value: "95%", label: "Success Rate" },
    {
      icon: <Star className="size-4 text-yellow-500 fill-yellow-500" />,
      value: "4.9",
      label: "Average Rating",
    },
  ];

  const features = [
    "Learn from industry experts",
    "Lifetime access to courses",
    "Interactive projects & quizzes",
    "Certificate upon completion",
  ];

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-background via-background to-primary/5">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 -z-10">
        {/* Grid Pattern */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#f0f0f0_1px,transparent_1px),linear-gradient(to_bottom,#f0f0f0_1px,transparent_1px)] dark:bg-[linear-gradient(to_right,#1f1f1f_1px,transparent_1px),linear-gradient(to_bottom,#1f1f1f_1px,transparent_1px)] bg-[size:4rem_4rem] [mask-image:radial-gradient(ellipse_80%_50%_at_50%_0%,#000_70%,transparent_110%)]" />

        {/* Floating Orbs */}
        <motion.div
          style={{ y: y1, opacity }}
          className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-r from-primary/20 to-secondary/20 rounded-full blur-3xl"
          animate={{
            scale: [1, 1.2, 1],
            rotate: [0, 180, 360],
          }}
          transition={{
            duration: 20,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />
        <motion.div
          style={{ y: y2, opacity }}
          className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-r from-secondary/20 to-primary/20 rounded-full blur-3xl"
          animate={{
            scale: [1.2, 1, 1.2],
            rotate: [360, 180, 0],
          }}
          transition={{
            duration: 25,
            repeat: Number.POSITIVE_INFINITY,
            ease: "linear",
          }}
        />

        {/* Floating Icons */}
        {mounted && (
          <>
            <motion.div
              className="absolute top-1/4 left-1/4 text-primary/20"
              animate={{
                y: [-20, 20, -20],
                rotate: [0, 360],
              }}
              transition={{
                duration: 6,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <BookOpen className="size-8" />
            </motion.div>
            <motion.div
              className="absolute top-1/3 right-1/4 text-secondary/20"
              animate={{
                y: [20, -20, 20],
                rotate: [360, 0],
              }}
              transition={{
                duration: 8,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <Award className="size-6" />
            </motion.div>
            <motion.div
              className="absolute bottom-1/3 left-1/3 text-primary/20"
              animate={{
                y: [-15, 15, -15],
                x: [-10, 10, -10],
              }}
              transition={{
                duration: 7,
                repeat: Number.POSITIVE_INFINITY,
                ease: "easeInOut",
              }}
            >
              <TrendingUp className="size-7" />
            </motion.div>
          </>
        )}
      </div>

      <div className="container px-4 md:px-6 relative z-10 mt-10 ">
        <div className="grid lg:grid-cols-2 gap-12 items-center ">
          {/* Left Content */}
          <motion.div
            initial={{ opacity: 0, x: -50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="text-center lg:text-left space-y-8"
          >
            {/* Badge */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              <Badge className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium ">
                <Sparkles className="size-3" />
                🎓 Transform Your Career Today
              </Badge>
            </motion.div>

            {/* Main Heading */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              className="space-y-4"
            >
              <h1 className="text-4xl md:text-5xl lg:text-6xl xl:text-7xl font-bold tracking-tight">
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  Master Skills
                </span>
                <br />
                <span className="bg-clip-text text-transparent bg-gradient-to-r from-blue-400 via-purple-500 to-pink-500">
                  Shape Future
                </span>
              </h1>

              <p className="text-lg md:text-xl text-muted-foreground max-w-2xl mx-auto lg:mx-0 leading-relaxed">
                Join over 50,000 learners advancing their careers with
                expert-led courses. Learn in-demand skills, build real projects,
                and get certified by industry professionals.
              </p>
            </motion.div>

            {/* Features List */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.5 }}
              className="grid grid-cols-2 gap-3 max-w-lg mx-auto lg:mx-0"
            >
              {features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-sm">
                  <CheckCircle className="size-4 text-primary flex-shrink-0" />
                  <span className="text-muted-foreground">{feature}</span>
                </div>
              ))}
            </motion.div>

            {/* CTA Buttons */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.6 }}
              className="flex flex-col sm:flex-row gap-4 justify-center lg:justify-start"
            >
              <Button
                size="lg"
                className="h-14 px-8 text-base font-semibold rounded-full bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary shadow-lg hover:shadow-xl transition-all duration-300"
              >
                Start Learning Now
                <ArrowRight className="ml-2 size-5" />
              </Button>
              <Button
                size="lg"
                variant="outline"
                className="h-14 px-8 text-base font-semibold rounded-full border-2 hover:bg-primary/5 transition-all duration-300 bg-transparent"
              >
                <Play className="mr-2 size-5" />
                Watch Demo
              </Button>
            </motion.div>

            {/* Stats */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
              className="grid grid-cols-2 md:grid-cols-4 gap-6 pt-8 border-t border-border/50"
            >
              {stats.map((stat, index) => (
                <div key={index} className="text-center lg:text-left">
                  <div className="flex items-center justify-center lg:justify-start gap-2 mb-1">
                    {stat.icon}
                    <span className="text-2xl font-bold text-foreground">
                      {stat.value}
                    </span>
                  </div>
                  <p className="text-xs text-muted-foreground">{stat.label}</p>
                </div>
              ))}
            </motion.div>
          </motion.div>

          {/* Right Content - Hero Image */}
          <motion.div
            initial={{ opacity: 0, x: 50 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="relative"
          >
            <div className="relative">
              {/* Main Hero Image */}
              <div className="relative rounded-2xl overflow-hidden shadow-2xl border border-border/20 bg-gradient-to-br from-background to-muted/20">
                <Image
                  src="https://plus.unsplash.com/premium_photo-1754432777426-46d9027859cf?q=80&w=1025&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D"
                  width={800}
                  height={600}
                  alt="LearnHub learning platform interface showing video player, progress tracking, and interactive features"
                  className="w-full h-auto"
                  priority
                />

                {/* Overlay Elements */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent" />

                {/* Floating UI Elements */}
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 1 }}
                  className="absolute top-4 right-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/20"
                >
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
                    <span className="text-xs font-medium">Live Session</span>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 1.2 }}
                  className="absolute bottom-4 left-4 bg-background/90 backdrop-blur-sm rounded-lg p-3 shadow-lg border border-border/20"
                >
                  <div className="flex items-center gap-2">
                    <Star className="size-4 text-yellow-500 fill-yellow-500" />
                    <span className="text-sm font-medium">4.9 Rating</span>
                  </div>
                </motion.div>
              </div>

              {/* Decorative Elements */}
              <motion.div
                animate={{
                  rotate: [0, 360],
                }}
                transition={{
                  duration: 20,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute -top-6 -right-6 w-12 h-12 border-2 border-primary/30 rounded-full"
              />
              <motion.div
                animate={{
                  rotate: [360, 0],
                }}
                transition={{
                  duration: 15,
                  repeat: Number.POSITIVE_INFINITY,
                  ease: "linear",
                }}
                className="absolute -bottom-4 -left-4 w-8 h-8 border-2 border-secondary/30 rounded-full"
              />
            </div>

            {/* Floating Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.4 }}
              className="absolute -left-8 top-1/2 transform -translate-y-1/2 hidden lg:block"
            >
              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-border/20 max-w-xs">
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center">
                    <BookOpen className="size-5 text-primary" />
                  </div>
                  <div>
                    <p className="font-semibold text-sm">Course Progress</p>
                    <p className="text-xs text-muted-foreground">
                      8 of 12 lessons completed
                    </p>
                  </div>
                </div>
                <div className="mt-3 w-full bg-muted rounded-full h-2">
                  <div
                    className="bg-primary h-2 rounded-full"
                    style={{ width: "67%" }}
                  />
                </div>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: -20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 1.6 }}
              className="absolute -right-8 bottom-1/4 hidden lg:block"
            >
              <div className="bg-background/80 backdrop-blur-sm rounded-xl p-4 shadow-xl border border-border/20">
                <div className="flex items-center gap-2 mb-2">
                  <Users className="size-4 text-secondary" />
                  <span className="text-sm font-semibold">Live Students</span>
                </div>
                <div className="flex -space-x-2">
                  {[1, 2, 3, 4].map((i) => (
                    <div
                      key={i}
                      className="w-8 h-8 bg-gradient-to-br from-primary/20 to-secondary/20 rounded-full border-2 border-background flex items-center justify-center text-xs font-medium"
                    >
                      {String.fromCharCode(65 + i)}
                    </div>
                  ))}
                  <div className="w-8 h-8 bg-muted rounded-full border-2 border-background flex items-center justify-center text-xs font-medium">
                    +12
                  </div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
