"use client"

import { useState, useEffect } from "react"
import Link from "next/link"
import { useParams, useRouter } from "next/navigation"
import { motion } from "framer-motion"
import { useSession } from "next-auth/react"
import {
  Star,
  Clock,
  BookOpen,
  Play,
  ChevronRight,
  CheckCircle,
  ArrowLeft,
  RefreshCw,
  AlertCircle,
} from "lucide-react"
import { Button } from "../../components/ui/button"
import { Badge } from "../../components/ui/badge"
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
  CardDescription,
} from "../../components/ui/card"
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "../../components/ui/accordian"
import { Progress } from "../../components/ui/progress"
import { Separator } from "../../components/ui/separator"
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select"
import { Textarea } from "../../components/ui/textarea"
import { Alert, AlertDescription, AlertTitle } from "../../components/ui/alert"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "../../components/ui/tooltip"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "../../components/ui/dialog"
import HlsPlayer from "../../components/hls-player"

// Extend NextAuth session type
declare module "next-auth" {
  interface Session {
    accessToken?: string
    user?: {
      id: string
      userType: string
    }
  }
}

interface Lesson {
  id: string
  title: string
  videoUrl: string
  duration: string
}

interface Module {
  id: string
  title: string
  lessons: Lesson[]
}

interface Review {
  rating: number
  author: string
  comment: string
  createdAt: string
}

interface Instructor {
  firstName: string
  lastName: string
  profilePhoto?: string
  headline?: string
  bio?: string
}

interface Course {
  id: string
  title: string
  description: string
  rating?: number
  students?: number
  duration: string
  level: string
  category: string
  bestseller?: boolean
  price: number
  originalPrice?: number
  whatYoullLearn: string[]
  instructor: Instructor
  reviews: Review[]
  curriculum: Module[]
}

export default function CourseDetailPage() {
  const params = useParams() as { id: string }
  const courseId = params.id.trim()
  const { data: session, status } = useSession()
  const router = useRouter()
  const [course, setCourse] = useState<Course | null>(null)
  const [hasAccess, setHasAccess] = useState<boolean | null>(null)
  const [currentLesson, setCurrentLesson] = useState<{
    moduleId: number
    lessonId: string
  } | null>(null)
  const [completedLessons, setCompletedLessons] = useState<Set<string>>(new Set())
  const [lessonProgress, setLessonProgress] = useState<Record<string, number>>({})
  const [currentLessonProgress, setCurrentLessonProgress] = useState(0)
  const [currentLessonNumber, setCurrentLessonNumber] = useState(1)
  const [loadingCourse, setLoadingCourse] = useState(true)
  const [loadingAccess, setLoadingAccess] = useState(true)
  const [loadingEnrollmentCheck, setLoadingEnrollmentCheck] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [reviewRating, setReviewRating] = useState<string>("")
  const [reviewComment, setReviewComment] = useState("")
  const [reviewSubmitting, setReviewSubmitting] = useState(false)
  const [reviewError, setReviewError] = useState<string | null>(null)
  const [videoError, setVideoError] = useState<string | null>(null)
  const [showCompletionDialog, setShowCompletionDialog] = useState(false)
  const [courseCompleted, setCourseCompleted] = useState(false)

  // Check course access with retry mechanism and fallback enrollment check
  useEffect(() => {
    if (status === "loading") return;

    console.log("Session data", {
      userId: session?.user?.id,
      userType: session?.user?.userType,
      courseId,
    });

    const checkAccess = async (retries = 3, delay = 2000) => {
      try {
        console.log("Fetching access for course", { courseId, url: `/api/courses/${courseId}/access` });
        const response = await fetch(`/api/courses/${courseId}/access`, {
          headers: session?.accessToken
            ? { Authorization: `Bearer ${session.accessToken}` }
            : {},
        });
        if (!response.ok) {
          if (response.status === 401 || response.status === 403 || response.status === 400) {
            console.log("Access check failed", { status: response.status, courseId });
            setHasAccess(false);
            // Trigger fallback enrollment check
            if (session?.user?.id) {
              await checkEnrollment();
            }
            return;
          }
          throw new Error(`Failed to check access: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Access check response", { hasAccess: data.hasAccess, courseId });
        setHasAccess(data.hasAccess);
        if (!data.hasAccess && session?.user?.id) {
          // Fallback to enrollment check if access is denied
          await checkEnrollment();
        }
      } catch (err: any) {
        if (retries > 0) {
          console.log(`Retrying access check (${retries} retries left)`);
          setTimeout(() => checkAccess(retries - 1, delay), delay);
        } else {
          console.error("Error checking access after retries:", {
            message: err.message,
            stack: err.stack,
            courseId,
          });
          setError(err.message);
        }
      } finally {
        setLoadingAccess(false);
      }
    };

    // Fallback check for enrollment in case access API fails
    const checkEnrollment = async () => {
      if (!session?.user?.id) return;
      setLoadingEnrollmentCheck(true);
      try {
        console.log("Checking enrollment fallback", { userId: session.user.id, courseId });
        const response = await fetch(`/api/enrollments?userId=${session.user.id}&courseId=${courseId}`, {
          headers: session?.accessToken
            ? { Authorization: `Bearer ${session.accessToken}` }
            : {},
        });
        if (!response.ok) {
          throw new Error(`Failed to check enrollment: ${response.status} ${response.statusText}`);
        }
        const data = await response.json();
        console.log("Enrollment check response", { hasEnrollment: data.hasEnrollment, courseId });
        if (data.hasEnrollment) {
          setHasAccess(true);
        }
      } catch (err: any) {
        console.error("Error checking enrollment:", {
          message: err.message,
          stack: err.stack,
          courseId,
        });
      } finally {
        setLoadingEnrollmentCheck(false);
      }
    };

    checkAccess();
  }, [courseId, session, status]);

  // Fetch course details with retry mechanism
  useEffect(() => {
    const fetchCourse = async (retries = 3, delay = 2000) => {
      try {
        console.log("Fetching course", { courseId, url: `/api/courses/${courseId}` });
        const response = await fetch(`/api/courses/${courseId}`);
        if (!response.ok) {
          throw new Error(`Failed to fetch course: ${response.status} ${response.statusText}`);
        }
        const data: Course = await response.json();
        console.log("Course fetch response", { courseId, title: data.title });
        setCourse(data);
      } catch (err: any) {
        if (retries > 0) {
          console.log(`Retrying course fetch (${retries} retries left)`);
          setTimeout(() => fetchCourse(retries - 1, delay), delay);
        } else {
          console.error("Error fetching course after retries:", {
            message: err.message,
            stack: err.stack,
            courseId,
          });
          setError(err.message);
        }
      } finally {
        setLoadingCourse(false);
      }
    };
    fetchCourse();
  }, [courseId]);

  // Fetch student progress
  useEffect(() => {
    if (session?.user?.userType === "student" && courseId && hasAccess === true) {
      const fetchProgress = async () => {
        try {
          console.log('Fetching progress for course:', courseId);
          const response = await fetch(`/api/courses/${courseId}/progress`, {
            headers: session?.accessToken
              ? { Authorization: `Bearer ${session.accessToken}` }
              : {},
          });
          if (!response.ok) {
            throw new Error(`Failed to fetch progress: ${response.status} ${response.statusText}`);
          }
          const data = await response.json();
          console.log('Progress data received:', data);
          const completed = new Set<string>();
          const progressMap: Record<string, number> = {};
          if (Array.isArray(data)) {
            data.forEach((p: { lessonId: string; progressPercentage: number; completed: boolean }) => {
              progressMap[p.lessonId] = p.progressPercentage;
              if (p.completed) completed.add(p.lessonId);
            });
          }
          console.log('Setting progress state:', { 
            completedLessons: Array.from(completed), 
            progressMap 
          });
          setCompletedLessons(completed);
          setLessonProgress(progressMap);
        } catch (error) {
          console.error("Error fetching progress:", error);
        }
      };
      fetchProgress();
    }
  }, [session, courseId, hasAccess]);

  // Set initial lesson
  useEffect(() => {
    if (
      course &&
      course.curriculum.length > 0 &&
      course.curriculum[0].lessons.length > 0 &&
      !currentLesson &&
      hasAccess === true
    ) {
      const firstLesson = course.curriculum[0].lessons[0];
      console.log("Setting initial lesson:", { 
        moduleId: 0, 
        lessonId: firstLesson.id,
        lessonTitle: firstLesson.title
      });
      setCurrentLesson({
        moduleId: 0,
        lessonId: firstLesson.id,
      });
      setCurrentLessonProgress(lessonProgress[firstLesson.id] || 0);
      setCurrentLessonNumber(1);
    }
  }, [course, currentLesson, hasAccess, lessonProgress]);

  // Check course completion
  useEffect(() => {
    if (course && completedLessons.size > 0) {
      const totalLessons = course.curriculum.reduce((acc, module) => acc + module.lessons.length, 0);
      const isComplete = completedLessons.size === totalLessons;
      if (isComplete && !courseCompleted) {
        setCourseCompleted(true);
        setShowCompletionDialog(true);
      }
    }
  }, [completedLessons, course, courseCompleted]);

  // Handle lesson complete
  const handleLessonComplete = async (lessonId: string, progress: number) => {
    if (session?.user?.userType !== "student") return;
    try {
      console.log('Updating lesson progress:', { lessonId, progress });
      const response = await fetch(`/api/courses/${courseId}/progress`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(session.accessToken && { Authorization: `Bearer ${session.accessToken}` }),
        },
        body: JSON.stringify({ 
          lessonId, 
          progress: Math.round(progress),
          watchTime: 0
        }),
      });
      if (!response.ok) {
        throw new Error(`Failed to update progress: ${response.status} ${response.statusText}`);
      }
      const result = await response.json();
      console.log('Progress update result:', result);
      setLessonProgress((prev) => ({ 
        ...prev, 
        [lessonId]: Math.round(progress) 
      }));
      if (progress >= 100) {
        setCompletedLessons((prev) => {
          const newSet = new Set([...prev, lessonId]);
          console.log("Lesson completed", { 
            lessonId, 
            completedLessons: Array.from(newSet),
            totalCompleted: newSet.size
          });
          return newSet;
        });
      }
    } catch (error) {
      console.error("Error updating progress:", error);
    }
  };

  // Handle video progress update
  const handleVideoProgress = async (state: { played: number }) => {
    if (currentLesson) {
      const progress = Math.floor(state.played * 100);
      setCurrentLessonProgress(progress);
      if (progress % 10 === 0) {
        await handleLessonComplete(currentLesson.lessonId, progress);
      }
    }
  };

  // Handle video end
  const handleVideoEnd = async () => {
    if (currentLesson) {
      await handleLessonComplete(currentLesson.lessonId, 100);
    }
  };

  // Handle video error
  const handleVideoError = (error: any) => {
    console.error("Video error:", {
      message: error.message,
      type: error.type,
      details: error.details,
      url: currentLessonContent?.videoUrl,
    });
    setVideoError(
      error.message.includes("Invalid Playback ID") || error.type === "not_found"
        ? "Invalid Playback ID. The video cannot be found. Please try again or contact support at support@learnhub.com."
        : `Failed to load video: ${error.message || "Unknown error"}. Please try again or contact support at support@learnhub.com.`
    );
  };

  // Retry video load
  const handleRetryVideo = () => {
    setVideoError(null);
    if (currentLessonContent) {
      setCurrentLesson({ ...currentLesson! });
    }
  };

  // Handle next lesson navigation
  const handleNextLesson = () => {
    if (!currentLesson || !course) return;
    const currentModuleIndex = currentLesson.moduleId;
    const currentLessonIndex = course.curriculum[currentModuleIndex].lessons.findIndex(
      (lesson) => lesson.id === currentLesson.lessonId
    );
    if (currentLessonIndex < course.curriculum[currentModuleIndex].lessons.length - 1) {
      const nextLesson = course.curriculum[currentModuleIndex].lessons[currentLessonIndex + 1];
      setCurrentLesson({
        moduleId: currentModuleIndex,
        lessonId: nextLesson.id,
      });
      setCurrentLessonProgress(lessonProgress[nextLesson.id] || 0);
      setCurrentLessonNumber(currentLessonNumber + 1);
    } else if (currentModuleIndex < course.curriculum.length - 1) {
      const nextLesson = course.curriculum[currentModuleIndex + 1].lessons[0];
      setCurrentLesson({
        moduleId: currentModuleIndex + 1,
        lessonId: nextLesson.id,
      });
      setCurrentLessonProgress(lessonProgress[nextLesson.id] || 0);
      setCurrentLessonNumber(currentLessonNumber + 1);
    }
  };

  // Handle previous lesson navigation
  const handlePrevLesson = () => {
    if (!currentLesson || !course) return;
    const currentModuleIndex = currentLesson.moduleId;
    const currentLessonIndex = course.curriculum[currentModuleIndex].lessons.findIndex(
      (lesson) => lesson.id === currentLesson.lessonId
    );
    if (currentLessonIndex > 0) {
      const prevLesson = course.curriculum[currentModuleIndex].lessons[currentLessonIndex - 1];
      setCurrentLesson({
        moduleId: currentModuleIndex,
        lessonId: prevLesson.id,
      });
      setCurrentLessonProgress(lessonProgress[prevLesson.id] || 0);
      setCurrentLessonNumber(currentLessonNumber - 1);
    } else if (currentModuleIndex > 0) {
      const prevModuleIndex = currentModuleIndex - 1;
      const prevLesson = course.curriculum[prevModuleIndex].lessons[
        course.curriculum[prevModuleIndex].lessons.length - 1
      ];
      setCurrentLesson({
        moduleId: prevModuleIndex,
        lessonId: prevLesson.id,
      });
      setCurrentLessonProgress(lessonProgress[prevLesson.id] || 0);
      setCurrentLessonNumber(currentLessonNumber - course.curriculum[prevModuleIndex].lessons.length);
    } else {
      alert("You are at the beginning of the course.");
    }
  };

  // Determine if a lesson is unlocked
  const isLessonUnlocked = (moduleIndex: number, lessonIndex: number) => {
    if (!course) return false;
    let unlocked = true;
    for (let m = 0; m < moduleIndex; m++) {
      if (course.curriculum[m].lessons.some(lesson => !completedLessons.has(lesson.id))) {
        unlocked = false;
        break;
      }
    }
    if (unlocked && lessonIndex > 0) {
      for (let l = 0; l < lessonIndex; l++) {
        if (!completedLessons.has(course.curriculum[moduleIndex].lessons[l].id)) {
          unlocked = false;
          break;
        }
      }
    }
    return unlocked;
  };

  // Handle review submission
  const handleReviewSubmit = async () => {
    if (session?.user?.userType !== "student") {
      setReviewError("Only students can submit reviews");
      return;
    }
    if (!reviewRating) {
      setReviewError("Please select a rating");
      return;
    }
    setReviewSubmitting(true);
    setReviewError(null);
    try {
      const response = await fetch(`/api/courses/${courseId}/reviews`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.accessToken}`,
        },
        body: JSON.stringify({
          rating: Number(reviewRating),
          comment: reviewComment || null,
          courseId
        }),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || `Failed to submit review: ${response.status} ${response.statusText}`);
      }
      const courseResponse = await fetch(`/api/courses/${courseId}`);
      if (!courseResponse.ok) throw new Error(`Failed to refresh course data: ${courseResponse.status} ${courseResponse.statusText}`);
      const updatedCourse: Course = await courseResponse.json();
      setCourse(updatedCourse);
      setReviewRating("");
      setReviewComment("");
    } catch (error: any) {
      setReviewError(error.message);
      console.error("Error submitting review:", error);
    } finally {
      setReviewSubmitting(false);
    }
  };

  // Handle course completion dialog
  const handleCourseCompletionClose = () => {
    setShowCompletionDialog(false);
    router.push("/courses");
  };

  // Calculate current lesson number
  const calculateLessonNumber = () => {
    if (!currentLesson || !course) return 1;
    let lessonCount = 0;
    let currentModuleName = "";
    for (let i = 0; i < course.curriculum.length; i++) {
      const module = course.curriculum[i];
      for (let j = 0; j < module.lessons.length; j++) {
        lessonCount++;
        if (i === currentLesson.moduleId && module.lessons[j].id === currentLesson.lessonId) {
          currentModuleName = module.title;
          return { number: lessonCount, moduleName: currentModuleName };
        }
      }
    }
    return { number: 1, moduleName: course.curriculum[0]?.title || "" };
  };

  if (loadingCourse || loadingAccess || loadingEnrollmentCheck || status === "loading") {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Loading Course...</CardTitle>
          </CardHeader>
          <CardContent className="flex justify-center">
            <svg
              className="animate-spin h-8 w-8 text-primary"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              ></circle>
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              ></path>
            </svg>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (hasAccess === false) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
      
      
             <Alert className="border-red-200 py-5 mx-auto w-[35vw] bg-red-50 dark:border-red-800 dark:bg-red-950 flex justify-center flex-col">
              <AlertCircle className="size-4 text-red-500 py-2" />
              <AlertTitle className="text-red-800 dark:text-red-200 py-2">
                No Access to Course
              </AlertTitle>
              <AlertDescription className="text-red-800 dark:text-red-200">
                You need to purchase this course or subscribe to a plan to access its content.
              </AlertDescription>
                <div className="flex justify-center py-2">
          <Button><Link href={`/courses`}>Back To courses</Link></Button>
          </div>
            </Alert>
        
  
           
        
        
      </div>
    );
  }

  if (error || !course) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <Card className="w-full max-w-md">
          <CardHeader>
            <CardTitle>Course Not Found</CardTitle>
            <CardDescription>
              The course you are looking for does not exist or there was an error fetching it.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <Button asChild className="w-full">
              <Link href="/courses">Back to Courses</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const totalLessons = course.curriculum.reduce(
    (acc, module) => acc + module.lessons.length,
    0
  );
  const courseProgress = totalLessons > 0 ? Math.round((completedLessons.size / totalLessons) * 100) : 0;
  const { number: currentLessonNumberValue, moduleName: currentModuleName } = calculateLessonNumber();
  const currentLessonContent = currentLesson
    ? course.curriculum[currentLesson.moduleId]?.lessons.find(
        (l) => l.id === currentLesson.lessonId
      )
    : null;
  const isCurrentLessonCompleted = currentLessonProgress >= 100;
  const isValidVideoUrl = currentLessonContent?.videoUrl && 
    currentLessonContent.videoUrl.match(/^https:\/\/stream\.mux\.com\/[a-zA-Z0-9]+(\.m3u8)$/);

  return (
    <div className="min-h-screen bg-background">
      {/* Course Completion Dialog */}
      <Dialog open={showCompletionDialog} onOpenChange={setShowCompletionDialog}>
        <DialogContent className="sm:max-w-md">
          <DialogHeader>
            <DialogTitle className="text-center text-2xl font-bold text-green-600">
              🎉 Congratulations!
            </DialogTitle>
            <DialogDescription className="text-center text-lg">
              You have successfully completed <span className="font-semibold">{course.title}</span>!
            </DialogDescription>
          </DialogHeader>
          <div className="text-center py-4">
            <div className="mx-auto w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mb-4">
              <CheckCircle className="w-12 h-12 text-green-500" />
            </div>
            <p className="text-muted-foreground">
              Great job on completing all {totalLessons} lessons. Keep learning and exploring new courses!
            </p>
          </div>
          <DialogFooter>
            <Button onClick={handleCourseCompletionClose} className="w-full">
              Explore More Courses
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
              <Link href="/courses" className="text-sm font-medium text-primary">
                Courses
              </Link>
              <Link
                href="/instructors"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Instructors
              </Link>
              <Link
                href="/professionalities"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Professionalities
              </Link>
              <Link
                href="/about"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                About
              </Link>
              <Link
                href="/pricing"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Pricing
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button variant="ghost" asChild>
              <Link href="/courses">
                <ArrowLeft className="size-4 mr-2" />
                Back to All Courses
              </Link>
            </Button>
          </div>
        </div>
      </header>

      <main className="container mx-auto py-8 px-4 md:px-6 lg:py-12">
        {/* Progress Bar */}
        {session?.user?.userType === "student" && hasAccess && (
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-8"
          >
            <Card>
              <CardHeader>
                <CardTitle>Your Progress</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between text-sm mb-2">
                  <span>
                    {courseProgress}% completed ({completedLessons.size}/{totalLessons} lessons)
                  </span>
                  <span className="text-muted-foreground">
                    Current: Lesson {currentLessonNumberValue} of {totalLessons} - {currentModuleName}
                  </span>
                </div>
                <Progress value={courseProgress} className="w-full border-2 h-5" />
              </CardContent>
            </Card>
          </motion.div>
        )}

        <div className="grid lg:grid-cols-[2fr_1fr] gap-8">
          {/* Main Content Area (Video Player & Course Details) */}
          <div className="space-y-8">
            {/* Video Player */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="relative aspect-video w-full rounded-lg overflow-hidden shadow-xl bg-black"
            >
              {hasAccess && currentLessonContent ? (
                isValidVideoUrl ? (
                  <>
                    <HlsPlayer
                      key={currentLessonContent.videoUrl}
                      url={currentLessonContent.videoUrl}
                      onProgress={handleVideoProgress}
                      onEnded={handleVideoEnd}
                     
                    />
                    {videoError && (
                      <div className="absolute inset-0 flex flex-col items-center justify-center bg-black/80 text-white gap-4">
                        <AlertCircle className="size-8 text-red-500" />
                        <p className="text-center">{videoError}</p>
                        <div className="flex gap-4">
                          <Button
                            variant="outline"
                            className="text-white border-white hover:bg-white/10"
                            onClick={handleRetryVideo}
                          >
                            <RefreshCw className="size-4 mr-2" />
                            Retry
                          </Button>
                          <Button
                            variant="link"
                            className="text-white"
                            asChild
                          >
                            <Link href="mailto:support@learnhub.com">
                              Contact Support
                            </Link>
                          </Button>
                        </div>
                      </div>
                    )}
                  </>
                ) : (
                  <div className="flex flex-col items-center justify-center h-full text-white text-lg gap-4">
                    <AlertCircle className="size-8 text-red-500" />
                    <p>Invalid video URL format. Please contact support at support@learnhub.com.</p>
                    <Button variant="link" className="text-white" asChild>
                      <Link href="mailto:support@learnhub.com">
                        Contact Support
                      </Link>
                    </Button>
                  </div>
                )
              ) : hasAccess ? (
                <div className="flex items-center justify-center h-full text-white text-lg">
                  Select a lesson to start
                </div>
              ) : (
                <div className="flex items-center justify-center h-full text-white text-lg">
                  Checking access, please wait...
                </div>
              )}
            </motion.div>

            {/* Current Lesson Progress */}
            {currentLessonContent && session?.user?.userType === "student" && hasAccess && (
              <div className="space-y-2">
                <p className="text-sm font-medium">Current Lesson Progress</p>
                <Progress value={currentLessonProgress} className="w-full" />
                <p className="text-xs text-muted-foreground">
                  {currentLessonProgress}% watched
                </p>
              </div>
            )}

            {/* Course Overview */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl md:text-4xl font-bold mb-4">
                {course.title}
              </h1>
              <p className="text-lg text-muted-foreground mb-6">
                {course.description}
              </p>

              <div className="flex flex-wrap items-center gap-6 mb-6">
                <div className="flex items-center gap-2">
                  <Star className="size-5 text-yellow-500 fill-yellow-500" />
                  <span className="font-medium">
                    {course.rating || "N/A"} (
                    {(course.students || 0).toLocaleString()} students)
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <Clock className="size-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {course.duration}
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  <BookOpen className="size-5 text-muted-foreground" />
                  <span className="text-muted-foreground">
                    {totalLessons} lessons
                  </span>
                </div>
                <Badge variant="secondary">{course.level}</Badge>
                <Badge variant="outline">{course.category}</Badge>
                {course.bestseller && (
                  <Badge className="bg-orange-500 text-white">Bestseller</Badge>
                )}
              </div>

              <Separator className="my-8" />

              {/* What you'll learn */}
              <h2 className="text-2xl font-bold mb-4">What you'll learn</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-8">
                {course.whatYoullLearn.map((item, index) => (
                  <div
                    key={index}
                    className="flex items-center gap-2 text-muted-foreground"
                  >
                    <CheckCircle className="size-5 text-primary" />
                    <span>{item}</span>
                  </div>
                ))}
              </div>

              <Separator className="my-8" />

              {/* Instructor */}
              <h2 className="text-2xl font-bold mb-4">Instructor</h2>
              <Card className="p-6 flex items-center gap-4">
                <Avatar className="size-20">
                  <AvatarImage
                    src={course.instructor.profilePhoto || "/placeholder.svg"}
                    alt={course.instructor.firstName}
                  />
                  <AvatarFallback>
                    {course.instructor.firstName.charAt(0)}
                  </AvatarFallback>
                </Avatar>
                <div>
                  <h3 className="text-xl font-bold">
                    {course.instructor.firstName} {course.instructor.lastName}
                  </h3>
                  <p className="text-muted-foreground">
                    {course.instructor.headline || "Instructor"}
                  </p>
                  <p className="text-sm mt-2">
                    {course.instructor.bio || "No bio available"}
                  </p>
                  <Button variant="link" className="p-0 h-auto mt-2" asChild>
                    <Link href="/instructors">View Instructor Profile</Link>
                  </Button>
                </div>
              </Card>

              <Separator className="my-8" />

              {/* Submit Review */}
              {session?.user?.userType === "student" && hasAccess && (
                <>
                  <h2 className="text-2xl font-bold mb-4">Submit Your Review</h2>
                  <Card className="p-6">
                    <div className="space-y-4">
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Rating
                        </label>
                        <Select
                          value={reviewRating}
                          onValueChange={setReviewRating}
                        >
                          <SelectTrigger>
                            <SelectValue placeholder="Select a rating" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="1">1 Star</SelectItem>
                            <SelectItem value="2">2 Stars</SelectItem>
                            <SelectItem value="3">3 Stars</SelectItem>
                            <SelectItem value="4">4 Stars</SelectItem>
                            <SelectItem value="5">5 Stars</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <label className="block text-sm font-medium mb-2">
                          Comment
                        </label>
                        <Textarea
                          value={reviewComment}
                          onChange={(e) => setReviewComment(e.target.value)}
                          placeholder="Share your thoughts about the course"
                          rows={4}
                        />
                      </div>
                      {reviewError && (
                        <p className="text-red-500 text-sm">{reviewError}</p>
                      )}
                      <Button
                        onClick={handleReviewSubmit}
                        disabled={reviewSubmitting || !reviewRating}
                      >
                        {reviewSubmitting ? "Submitting..." : "Submit Review"}
                      </Button>
                    </div>
                  </Card>
                  <Separator className="my-8" />
                </>
              )}

              {/* Reviews */}
              <h2 className="text-2xl font-bold mb-4">Student Reviews</h2>
              <div className="space-y-6">
                {course.reviews.length > 0 ? (
                  course.reviews.map((review, index) => (
                    <Card key={index} className="p-4">
                      <div className="flex items-center gap-2 mb-2">
                        {Array(review.rating)
                          .fill(0)
                          .map((_, i) => (
                            <Star
                              key={i}
                              className="size-4 text-yellow-500 fill-yellow-500"
                            />
                          ))}
                        <span className="text-sm text-muted-foreground ml-auto">
                          {new Date(review.createdAt).toLocaleDateString()}
                        </span>
                      </div>
                      <p className="font-medium mb-2">{review.author}</p>
                      <p className="text-muted-foreground">{review.comment}</p>
                    </Card>
                  ))
                ) : (
                  <p className="text-muted-foreground">No reviews yet.</p>
                )}
              </div>
            </motion.div>
          </div>

          {/* Sidebar (Course Curriculum & Enrollment) */}
          <div className="space-y-8">
            {/* Enrollment Card */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="sticky top-24">
                <CardHeader>
                  {courseCompleted ? (
                    <>
                      <CardTitle className="text-3xl font-bold text-green-600">
                        Completed
                      </CardTitle>
                      <CardDescription>
                        You have successfully completed this course!
                      </CardDescription>
                    </>
                  ) : (
                    <>
                      <CardTitle className="text-3xl font-bold">
                        ${course.price}
                        {course.originalPrice && (
                          <span className="text-base text-muted-foreground line-through ml-2">
                            ${course.originalPrice}
                          </span>
                        )}
                      </CardTitle>
                      <CardDescription>
                        Lifetime access to all course materials.
                      </CardDescription>
                    </>
                  )}
                </CardHeader>
                <CardContent>
                  {courseCompleted && (
                    <div className="text-center p-4 bg-green-50 dark:bg-green-950 rounded-lg border border-green-200 dark:border-green-800">
                      <CheckCircle className="mx-auto size-8 text-green-500 mb-2" />
                      <p className="text-green-700 dark:text-green-300 font-medium">
                        Course Completed!
                      </p>
                      <p className="text-sm text-green-600 dark:text-green-400">
                        Congratulations on finishing this course
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>

            {/* Course Curriculum */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Course Curriculum</CardTitle>
                </CardHeader>
                <CardContent>
                  <Accordion type="multiple" className="w-full">
                    {course.curriculum.map((module, moduleIndex) => (
                      <AccordionItem
                        key={module.id}
                        value={`module-${module.id}`}
                      >
                        <AccordionTrigger className="text-base font-semibold">
                          Module {moduleIndex + 1}: {module.title} ({module.lessons.length} lessons)
                        </AccordionTrigger>
                        <AccordionContent>
                          <ul className="space-y-2">
                            {module.lessons.map((lesson, lessonIndex) => {
                              const unlocked = isLessonUnlocked(moduleIndex, lessonIndex);
                              const isCompleted = completedLessons.has(lesson.id);
                              const isCurrent = currentLesson?.moduleId === moduleIndex &&
                                currentLesson?.lessonId === lesson.id;
                              return (
                                <li
                                  key={lesson.id}
                                  className={`flex items-center justify-between p-2 rounded-md cursor-pointer transition-colors ${
                                    isCompleted
                                      ? "bg-green-100 text-green-800 dark:bg-green-950 dark:text-green-200"
                                      : isCurrent
                                      ? "bg-primary/10 text-primary"
                                      : unlocked
                                      ? "hover:bg-muted/50"
                                      : "pointer-events-none opacity-50 cursor-not-allowed"
                                  }`}
                                  onClick={() => {
                                    if (unlocked) {
                                      setCurrentLesson({
                                        moduleId: moduleIndex,
                                        lessonId: lesson.id,
                                      });
                                      setCurrentLessonProgress(lessonProgress[lesson.id] || 0);
                                      setCurrentLessonNumber(
                                        calculateLessonNumber().number
                                      );
                                    }
                                  }}
                                >
                                  <div className="flex items-center gap-2">
                                    {isCompleted ? (
                                      <CheckCircle className="size-4 text-green-500" />
                                    ) : (
                                      <Play className="size-4 text-muted-foreground" />
                                    )}
                                    <span className="text-sm">{lesson.title}</span>
                                  </div>
                                  <span className="text-sm text-muted-foreground">
                                    {lesson.duration}
                                  </span>
                                </li>
                              );
                            })}
                          </ul>
                        </AccordionContent>
                      </AccordionItem>
                    ))}
                  </Accordion>
                  {hasAccess && (
                    <div className="flex justify-between mt-4 gap-2">
                      <Button 
                        onClick={handlePrevLesson} 
                        variant="outline"
                        disabled={!currentLesson || (currentLesson.moduleId === 0 && course.curriculum[0].lessons[0].id === currentLesson.lessonId)}
                      >
                        Previous Lesson
                      </Button>
                      <TooltipProvider>
                        <Tooltip>
                          <TooltipTrigger asChild>
                            <Button
                              onClick={handleNextLesson}
                              disabled={!currentLesson || !isCurrentLessonCompleted || 
                                (currentLesson.moduleId === course.curriculum.length - 1 && 
                                 course.curriculum[currentLesson.moduleId].lessons[course.curriculum[currentLesson.moduleId].lessons.length - 1].id === currentLesson.lessonId)}
                            >
                              Next Lesson <ChevronRight className="ml-2 size-4" />
                            </Button>
                          </TooltipTrigger>
                          {!isCurrentLessonCompleted && (
                            <TooltipContent>
                              Complete the current lesson to proceed
                            </TooltipContent>
                          )}
                        </Tooltip>
                      </TooltipProvider>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
}