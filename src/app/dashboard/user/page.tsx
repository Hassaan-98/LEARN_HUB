"use client";

import type React from "react";
import { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  BookOpen,
  Award,
  Star,
  Save,
  Camera,
  Globe,
  Target,
  Loader2,
  AlertCircle,
  Plus,
  Calendar,
  TrendingUp,
} from "lucide-react";
import { Button } from "../../components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "../../components/ui/card";
import {
  Avatar,
  AvatarFallback,
  AvatarImage,
} from "../../components/ui/avatar";
import { Badge } from "../../components/ui/badge";
import { Progress } from "../../components/ui/progress";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "../../components/ui/tabs";
import { Input } from "../../components/ui/input";
import { Textarea } from "../../components/ui/textarea";
import { Label } from "../../components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "../../components/ui/select";
// import { toast } from "@/hooks/use-toast"

interface StudentProfile {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    profilePhoto?: string;
    userType: string;
    isVerified: boolean;
    createdAt: string;
  };
  profile: {
    bio?: string;
    interests?: string[];
    learningGoals?: string;
    experience?: string;
    country?: string;
    city?: string;
  } | null;
  subscription?: {
    planId: string;
    status: string;
    createdAt: string;
  } | null;
}

interface StudentStats {
  totalEnrollments: number;
  completedCourses: number;
  certificatesEarned: number;
}

interface Enrollment {
  enrollment: {
    id: string;
    progress: number;
    enrollmentDate: string;
    completedAt?: string;
    certificateIssued: boolean;
  };
  course: {
    id: string;
    title: string;
    subtitle?: string;
    thumbnailUrl?: string;
    category?: string;
    level?: string;
  };
  instructor: {
    firstName: string;
    lastName: string;
  };
  averageRating: number;
}

export default function UserDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    bio: "",
    interests: "",
    learningGoals: "",
    experience: "",
    country: "",
    city: "",
  });

  const [profileData, setProfileData] = useState<StudentProfile | null>(null);
  const [stats, setStats] = useState<StudentStats | null>(null);
  const [enrollments, setEnrollments] = useState<Enrollment[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );

  // Handle authentication and initialize profile data
  useEffect(() => {
    if (status === "loading") return;

    if (status === "unauthenticated") {
      router.push("/");
      return;
    }

    if (status === "authenticated" && session?.user) {
      if (session.user.userType !== "student") {
        setAuthError("This dashboard is only available for students.");
        return;
      }
      setAuthError(null);

      // Initialize profile data with minimal fields if not already set
      if (!profileData) {
        setProfileData({
          user: {
            id: session.user.id || "",
            firstName: session.user.firstName || "",
            lastName: session.user.lastName || "",
            email: session.user.email || "",
            profilePhoto: "",
            userType: "student",
            isVerified: false,
            createdAt: new Date().toISOString(),
          },
          profile: {
            bio: "",
            interests: [],
            learningGoals: "",
            experience: "",
            country: "",
            city: "",
          },
        });
      }
      fetchStudentData();
    }
  }, [status, session, router, profileData]);

  const fetchStudentData = async () => {
    try {
      setIsLoading(true);

      // Fetch profile data
      const profileResponse = await fetch("/api/student/profile");
      if (profileResponse.ok) {
        const fetchedProfile = await profileResponse.json();
        setProfileData({
          user: {
            id: fetchedProfile.user.id || "",
            firstName: fetchedProfile.user.firstName || "",
            lastName: fetchedProfile.user.lastName || "",
            email: fetchedProfile.user.email || "",
            profilePhoto: fetchedProfile.user.profilePhoto || null,
            userType: fetchedProfile.user.userType || "student",
            isVerified: fetchedProfile.user.isVerified || false,
            createdAt:
              fetchedProfile.user.createdAt || new Date().toISOString(),
          },
          profile: {
            bio: fetchedProfile.profile?.bio || "",
            interests: fetchedProfile.profile?.interests || [],
            learningGoals: fetchedProfile.profile?.learningGoals || "",
            experience: fetchedProfile.profile?.experience || "",
            country: fetchedProfile.profile?.country || "",
            city: fetchedProfile.profile?.city || "",
          },
        });
      }

      // Fetch stats
      const statsResponse = await fetch("/api/student/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalEnrollments: statsData.totalEnrollments || 0,
          completedCourses: statsData.completedCourses || 0,
          certificatesEarned: statsData.certificatesEarned || 0,
        });
      }

      // Fetch enrollments
      const enrollmentsResponse = await fetch("/api/student/enrollments");
      if (enrollmentsResponse.ok) {
        const enrollmentsData = await enrollmentsResponse.json();
        setEnrollments(enrollmentsData || []);
      }
    } catch (error) {
      console.error("Error fetching student data:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load student data. Please try again.",
      //   variant: "destructive",
      // })
    } finally {
      setIsLoading(false);
    }
  };

  const handlePhotoChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      setProfilePhoto(file);
      setProfilePhotoPreview(URL.createObjectURL(file));
    }
  };

  const handleSaveProfile = async () => {
    try {
      setIsSaving(!isSaving);;

      // Convert comma-separated strings into arrays
      const interestsArray = formData.interests
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);

      const payload = {
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
        },
        profile: {
          bio: formData.bio,
          interests: interestsArray,
          learningGoals: formData.learningGoals,
          experience: formData.experience,
          country: formData.country,
          city: formData.city,
        },
      };

      // Now call your API with the payload
      const response = await fetch("/api/student/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      // On success, you can update your local state or refetch
      // e.g. setIsEditing(false);
    } catch (error) {
      console.error(error);
      // handle error UI
    } finally {
      setIsSaving(false);
    }
  };

  const handleProfileChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleDownloadCertificate = (enrollmentId: string) => {
    console.log(`Downloading certificate for enrollment: ${enrollmentId}`);
    // Example: window.open(`/api/certificate/${enrollmentId}`, '_blank')
    // toast({
    //   title: "Certificate",
    //   description: "Initiating certificate download...",
    // })
  };

  // Show loading state while session is loading
  // if (status === "loading" || isLoading) {
  //   return (
  //     <div className="min-h-screen bg-background flex items-center justify-center">
  //       <div className="flex items-center gap-2">
  //         <Loader2 className="h-6 w-6 animate-spin" />
  //         <span>Loading dashboard...</span>
  //       </div>
  //     </div>
  //   )
  // }

  // Show error if there's an authentication issue
  if (authError) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">{authError}</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Sign In as Student</Link>
              </Button>
              <Button
                variant="outline"
                asChild
                className="w-full bg-transparent"
              >
                <Link href="/">Go to Home</Link>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Show login prompt if not authenticated
  if (status === "unauthenticated") {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <h2 className="text-2xl font-bold mb-4">Authentication Required</h2>
            <p className="text-muted-foreground mb-6">
              Please sign in to access the student dashboard.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  if (!profileData || !stats) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="flex items-center gap-2">
          <Loader2 className="h-6 w-6 animate-spin" />
          <span>Loading profile...</span>
        </div>
      </div>
    );
  }

  const displayName =
    `${profileData.user.firstName} ${profileData.user.lastName}`.trim();

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
              <Link
                href="/dashboard/user"
                className="text-sm font-medium text-primary"
              >
                Dashboard
              </Link>
              <Link
                href="/courses"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                Browse Courses
              </Link>
              <Link
                href="/my-learning"
                className="text-sm font-medium text-muted-foreground hover:text-foreground"
              >
                My Learning
              </Link>
            </nav>
          </div>
          <div className="flex items-center gap-4">
            <Button asChild>
              <Link href="/courses">
                <Plus className="size-4 mr-2" />
                Browse Courses
              </Link>
            </Button>
            <Avatar>
              <AvatarImage
                src={
                  profilePhotoPreview ||
                  profileData.user.profilePhoto ||
                  "/placeholder.svg"
                }
                alt={displayName}
              />
              <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
            </Avatar>
          </div>
        </div>
      </header>

      <div className="container py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="learning">My Learning</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="achievements">Achievements</TabsTrigger>
          </TabsList>

          <TabsContent value="overview" className="space-y-8">
            {/* Welcome Section */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Card className="bg-gradient-to-r from-primary/10 to-secondary/10">
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <Avatar className="size-16">
                      <AvatarImage
                        src={
                          profileData.user.profilePhoto || "/placeholder.svg"
                        }
                        alt={displayName}
                      />
                      <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                    </Avatar>
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <h1 className="text-2xl font-bold">
                          Welcome back, {displayName}!
                        </h1>
                        {profileData.user.isVerified && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <Award className="size-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {profileData.profile?.learningGoals ||
                          "Continue your learning journey"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Learning since{" "}
                        {new Date(profileData.user.createdAt).getFullYear()}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <TrendingUp className="size-4 text-primary" />
                        <span className="font-semibold">
                          {stats.totalEnrollments > 0
                            ? Math.round(
                                (stats.completedCourses /
                                  stats.totalEnrollments) *
                                  100
                              )
                            : 0}
                          %
                        </span>
                        <span className="text-sm text-muted-foreground">
                          completion rate
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalEnrollments} courses enrolled
                      </p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Stats Cards */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="grid grid-cols-1 md:grid-cols-3 gap-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Courses Enrolled
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalEnrollments}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {
                      enrollments.filter((e) => e.enrollment.progress > 0)
                        .length
                    }{" "}
                    in progress
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Courses Completed
                  </CardTitle>
                  <Award className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.completedCourses}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.totalEnrollments - stats.completedCourses} remaining
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Certificates Earned
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.certificatesEarned}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    {stats.completedCourses - stats.certificatesEarned} pending
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Recent Learning Activity */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Continue Learning</CardTitle>
                </CardHeader>
                <CardContent>
                  {enrollments.length > 0 ? (
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
                      {enrollments
                        .filter(
                          (enrollment) => enrollment.enrollment.progress < 100
                        )
                        .slice(0, 4)
                        .map((enrollment) => (
                          <Card key={enrollment.enrollment.id} className="p-4">
                            <div className="flex items-start gap-4">
                              <div className="relative w-16 h-12 rounded overflow-hidden flex-shrink-0">
                                <Image
                                  src={
                                    enrollment.course.thumbnailUrl ||
                                    "/placeholder.svg?height=48&width=64"
                                  }
                                  alt={enrollment.course.title}
                                  fill
                                  className="object-cover"
                                />
                              </div>
                              <div className="flex-1 min-w-0">
                                <h4 className="font-medium text-sm line-clamp-2 mb-1">
                                  {enrollment.course.title}
                                </h4>
                                <p className="text-xs text-muted-foreground mb-2">
                                  by {enrollment.instructor.firstName}{" "}
                                  {enrollment.instructor.lastName}
                                </p>
                                <div className="flex items-center gap-2 mb-2">
                                  <Progress
                                    value={enrollment.enrollment.progress}
                                    className="flex-1 h-2"
                                  />
                                  <span className="text-xs font-medium">
                                    {enrollment.enrollment.progress}%
                                  </span>
                                </div>
                                <Button size="sm" asChild className="w-full">
                                  <Link
                                    href={`/course/${enrollment.course.id}`}
                                  >
                                    Continue
                                  </Link>
                                </Button>
                              </div>
                            </div>
                          </Card>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <BookOpen className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold mb-2">
                        No courses enrolled yet
                      </h3>
                      <p className="text-muted-foreground mb-4">
                        Start your learning journey by enrolling in a course
                      </p>
                      <Button asChild>
                        <Link href="/courses">Browse Courses</Link>
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="learning" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Learning</h2>
              <Button asChild>
                <Link href="/courses">
                  <Plus className="size-4 mr-2" />
                  Browse More Courses
                </Link>
              </Button>
            </div>

            {enrollments.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {enrollments.map((enrollment) => (
                  <motion.div
                    key={enrollment.enrollment.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={
                            enrollment.course.thumbnailUrl ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={enrollment.course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          {enrollment.enrollment.progress === 100 ? (
                            <Badge className="bg-green-600">Completed</Badge>
                          ) : (
                            <Badge variant="secondary">
                              {enrollment.enrollment.progress}% Complete
                            </Badge>
                          )}
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {enrollment.course.title}
                        </h3>
                        <p className="text-sm text-muted-foreground mb-2">
                          by {enrollment.instructor.firstName}{" "}
                          {enrollment.instructor.lastName}
                        </p>

                        <div className="space-y-2 text-sm text-muted-foreground mb-4">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Enrolled{" "}
                              {new Date(
                                enrollment.enrollment.enrollmentDate
                              ).toLocaleDateString()}
                            </span>
                            {enrollment.averageRating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {enrollment.averageRating.toFixed(1)}
                              </span>
                            )}
                          </div>
                          {enrollment.course.category && (
                            <Badge variant="outline" className="text-xs">
                              {enrollment.course.category}
                            </Badge>
                          )}
                        </div>

                        {enrollment.enrollment.progress < 100 && (
                          <div className="mb-4">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Progress</span>
                              <span>{enrollment.enrollment.progress}%</span>
                            </div>
                            <Progress
                              value={enrollment.enrollment.progress}
                              className="h-2"
                            />
                          </div>
                        )}

                        <div className="flex gap-2">
                          <Button size="sm" className="flex-1" asChild>
                            <Link href={`/course/${enrollment.course.id}`}>
                              {enrollment.enrollment.progress === 100
                                ? "Review"
                                : "Continue"}
                            </Link>
                          </Button>
                          {enrollment.enrollment.certificateIssued && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              onClick={() =>
                                handleDownloadCertificate(
                                  enrollment.enrollment.id
                                )
                              }
                            >
                              <Award className="h-4 w-4 mr-1" />
                              Certificate
                            </Button>
                          )}
                        </div>
                      </CardContent>
                    </Card>
                  </motion.div>
                ))}
              </div>
            ) : (
              <Card>
                <CardContent className="p-8 text-center">
                  <BookOpen className="h-16 w-16 mx-auto mb-4 text-muted-foreground/50" />
                  <h3 className="text-xl font-semibold mb-2">
                    No courses enrolled yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Discover amazing courses and start your learning journey
                    today
                  </p>
                  <Button asChild>
                    <Link href="/courses">Browse Courses</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Student Profile</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            <div className="grid lg:grid-cols-3 gap-8">
              {/* Profile Photo & Basic Info */}
              <Card>
                <CardContent className="p-6">
                  <div className="text-center space-y-4">
                    <div className="relative inline-block">
                      <Avatar className="size-32 mx-auto">
                        <AvatarImage
                          src={
                            profilePhotoPreview ||
                            profileData.user.profilePhoto ||
                            "/placeholder.svg"
                          }
                          alt={displayName}
                        />
                        <AvatarFallback className="text-2xl">
                          {displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                      {isEditing && (
                        <label className="absolute bottom-0 right-0 bg-primary text-primary-foreground rounded-full p-2 cursor-pointer hover:bg-primary/90">
                          <Camera className="h-4 w-4" />
                          <input
                            type="file"
                            accept="image/*"
                            onChange={handlePhotoChange}
                            className="hidden"
                          />
                        </label>
                      )}
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{displayName}</h3>
                      <p className="text-muted-foreground">Student</p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {profileData.profile?.city &&
                          profileData.profile?.country
                            ? `${profileData.profile.city}, ${profileData.profile.country}`
                            : "Location not set"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      {" "}
                      {profileData.profile?.experience}
                    </div>
                    {profileData.user.isVerified && (
                      <Badge
                        variant="secondary"
                        className="bg-green-100 text-green-800"
                      >
                        <Award className="size-3 mr-1" />
                        Verified Student
                      </Badge>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Profile Details */}
              <div className="lg:col-span-2 space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>About Me</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    {isEditing ? (
                      <>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="firstName">First Name</Label>
                            <Input
                              name="firstName"
                              value={formData.firstName}
                              onChange={handleProfileChange}
                              placeholder="First name"
                            />
                          </div>
                          <div>
                            <Label htmlFor="lastName">Last Name</Label>
                            <Input
                              name="lastName"
                              value={formData.lastName}
                              onChange={handleProfileChange}
                              placeholder="Last name"
                            />
                          </div>
                        </div>
                        <div>
                          <Label htmlFor="bio">Bio</Label>
                          <Textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleProfileChange}
                            rows={3}
                            placeholder="Tell us about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="interests">
                            Interests (comma-separated)
                          </Label>
                          <Input
                            name="interests"
                            value={formData.interests}
                            onChange={handleProfileChange}
                            placeholder="e.g., Coding, Data Science, Design"
                          />
                        </div>
                        <div>
                          <Label htmlFor="learningGoals">Learning Goals</Label>
                          <Textarea
                            name="learningGoals"
                            value={formData.learningGoals}
                            onChange={handleProfileChange}
                            rows={2}
                            placeholder="What do you want to achieve through learning?"
                          />
                        </div>
                        <div>
                          <Label htmlFor="experience">Experience Level</Label>
                          <Select
                            name="experience"
                            value={formData.experience}
                            onValueChange={(value) =>
                              handleProfileChange({
                                target: {
                                  name: "experience",
                                  value,
                                },
                              } as React.ChangeEvent<HTMLInputElement>)
                            }
                          >
                            <SelectTrigger>
                              <SelectValue placeholder="Select your experience level" />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="beginner">Beginner</SelectItem>
                              <SelectItem value="intermediate">
                                Intermediate
                              </SelectItem>
                              <SelectItem value="advanced">Advanced</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleProfileChange}
                              placeholder="Your city"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              name="country"
                              value={formData.country}
                              onChange={handleProfileChange}
                              placeholder="Your country"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground leading-relaxed">
                          {profileData.profile?.bio || "No bio provided yet."}
                        </p>
                        {profileData.profile?.learningGoals && (
                          <div>
                            <h4 className="font-medium mb-2 flex items-center gap-2">
                              <Target className="h-4 w-4" />
                              Learning Goals
                            </h4>
                            <p className="text-sm text-muted-foreground">
                              {profileData.profile.learningGoals}
                            </p>
                          </div>
                        )}
                        {profileData.profile?.experience && (
                          <div>
                            <h4 className="font-medium mb-2">
                              Experience Level
                            </h4>
                            <Badge variant="outline" className="capitalize">
                              {profileData.profile.experience}
                            </Badge>
                          </div>
                        )}
                        {profileData.profile?.interests &&
                          profileData.profile.interests.length > 0 && (
                            <div>
                              <h4 className="font-medium mb-2">Interests</h4>
                              <div className="flex flex-wrap gap-2">
                                {profileData.profile.interests.map(
                                  (interest, index) => (
                                    <Badge key={index} variant="secondary">
                                      {interest}
                                    </Badge>
                                  )
                                )}
                              </div>
                            </div>
                          )}
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Learning Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Learning Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.totalEnrollments}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Enrolled
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.completedCourses}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Completed
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.certificatesEarned}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Certificates
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.totalEnrollments > 0
                            ? Math.round(
                                (stats.completedCourses /
                                  stats.totalEnrollments) *
                                  100
                              )
                            : 0}
                          %
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Success Rate
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                {isEditing && (
                  <div className="flex gap-4">
                    <Button
                      onClick={handleSaveProfile}
                      className="flex-1"
                      disabled={isSaving}
                    >
                      {isSaving ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4 mr-2" />
                          Save Changes
                        </>
                      )}
                    </Button>
                    <Button
                      variant="outline"
                      onClick={() => setIsEditing(false)}
                      className="flex-1"
                      disabled={isSaving}
                    >
                      Cancel
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </TabsContent>

          <TabsContent value="achievements" className="space-y-6">
            <h2 className="text-2xl font-bold">Achievements & Certificates</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Certificates Earned</CardTitle>
                </CardHeader>
                <CardContent>
                  {stats.certificatesEarned > 0 ? (
                    <div className="space-y-4">
                      {enrollments
                        .filter((e) => e.enrollment.certificateIssued)
                        .map((enrollment) => (
                          <div
                            key={enrollment.enrollment.id}
                            className="flex items-center gap-4 p-4 border rounded-lg"
                          >
                            <Award className="h-8 w-8 text-yellow-500" />
                            <div className="flex-1">
                              <h4 className="font-medium">
                                {enrollment.course.title}
                              </h4>
                              <p className="text-sm text-muted-foreground">
                                Completed on{" "}
                                {new Date(
                                  enrollment.enrollment.completedAt!
                                ).toLocaleDateString()}
                              </p>
                            </div>
                            <Button
                              size="sm"
                              variant="outline"
                              className="bg-transparent"
                              onClick={() =>
                                handleDownloadCertificate(
                                  enrollment.enrollment.id
                                )
                              }
                            >
                              Download
                            </Button>
                          </div>
                        ))}
                    </div>
                  ) : (
                    <div className="text-center py-8">
                      <Award className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <h3 className="text-lg font-semibold mb-2">
                        No certificates yet
                      </h3>
                      <p className="text-muted-foreground">
                        Complete courses to earn certificates
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Learning Milestones</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center">
                        <BookOpen className="h-6 w-6 text-primary" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">First Course Enrolled</h4>
                        <p className="text-sm text-muted-foreground">
                          {enrollments.length > 0
                            ? new Date(
                                Math.min(
                                  ...enrollments.map((e) =>
                                    new Date(
                                      e.enrollment.enrollmentDate
                                    ).getTime()
                                  )
                                )
                              ).toLocaleDateString()
                            : "Not yet"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center">
                        <Award className="h-6 w-6 text-green-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">First Course Completed</h4>
                        <p className="text-sm text-muted-foreground">
                          {stats.completedCourses > 0
                            ? enrollments.find(
                                (e) => e.enrollment.progress === 100
                              )
                              ? new Date(
                                  enrollments.find(
                                    (e) => e.enrollment.progress === 100
                                  )!.enrollment.completedAt!
                                ).toLocaleDateString()
                              : "Recently completed"
                            : "Not yet"}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-4 p-4 border rounded-lg">
                      <div className="w-12 h-12 rounded-full bg-yellow-100 flex items-center justify-center">
                        <Star className="h-6 w-6 text-yellow-600" />
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium">Learning Streak</h4>
                        <p className="text-sm text-muted-foreground">
                          {
                            enrollments.filter((e) => e.enrollment.progress > 0)
                              .length
                          }{" "}
                          active courses
                        </p>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
