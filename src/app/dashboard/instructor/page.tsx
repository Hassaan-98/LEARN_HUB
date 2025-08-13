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
  Users,
  DollarSign,
  Star,
  Eye,
  Plus,
  Settings,
  Camera,
  Edit3,
  Globe,
  Calendar,
  MessageSquare,
  BarChart3,
  CheckCircle,
  Loader2,
  AlertCircle,
  Save,
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
// import { toast } from "@/hooks/use-toast"

interface InstructorProfile {
  user: {
    id: string;
    firstName: string;
    lastName: string;
    email?: string;
    profilePhoto?: string | null;
    userType?: string;
    isVerified?: boolean;
    createdAt?: string;
  };
  profile: {
    headline?: string | null;
    bio?: string | null;
    expertise?: string | null;
    website?: string | null;
    linkedinUrl?: string | null;
    twitterUrl?: string | null;
    country?: string | null;
    city?: string | null;
    languages?: string[] | null;
    specializations?: string[] | null;
  } | null;
}

interface InstructorStats {
  totalCourses: number;
  totalStudents: number;
  totalRevenue: number;
  averageRating: number;
  totalReviews: number;
}

interface Course {
  id: string;
  title: string;
  subtitle?: string | null;
  thumbnailUrl?: string | null;
  enrollmentCount: number;
  averageRating: number;
  reviewCount: number;
  totalRevenue: number;
  status: string;
  progress: number;
  updatedAt: string;
}

export default function InstructorDashboard() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("overview");
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    headline: "",
    bio: "",
    expertise: "",
    website: "",
    linkedinUrl: "",
    twitterUrl: "",
    country: "",
    city: "",
    languages: "", // comma separated string here
    specializations: "", // comma separated string here
    // add other fields you want to edit
  });

  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [authError, setAuthError] = useState<string | null>(null);

  const [profileData, setProfileData] = useState<InstructorProfile | null>(
    null
  );
  const [stats, setStats] = useState<InstructorStats>({
    totalCourses: 0,
    totalStudents: 0,
    totalRevenue: 0,
    averageRating: 0,
    totalReviews: 0,
  });
  const [courses, setCourses] = useState<Course[]>([]);
  const [profilePhoto, setProfilePhoto] = useState<File | null>(null);
  const [profilePhotoPreview, setProfilePhotoPreview] = useState<string | null>(
    null
  );

  // Initialize profile data with minimal required fields
 useEffect(() => {
  if (status === "loading") return;

  if (status === "unauthenticated") {
    router.push("/");
    return;
  }

  if (status === "authenticated" && session?.user) {
    if (session.user.userType !== "instructor") {
      setAuthError("This dashboard is only available for instructors.");
      return;
    }
    setAuthError(null);

    // Initialize profileData if not set
    if (!profileData) {
      const initialProfileData = {
        user: {
          id: session.user.id || "",
          firstName: session.user.firstName || "",
          lastName: session.user.lastName || "",
          email: session.user.email || "",
          profilePhoto: null,
          userType: "instructor",
          isVerified: false,
          createdAt: new Date().toISOString(),
        },
        profile: {
          headline: null,
          bio: null,
          expertise: null,
          website: null,
          linkedinUrl: null,
          twitterUrl: null,
          country: null,
          city: null,
          languages: [],
          specializations: [],
        },
      };
      setProfileData(initialProfileData);

      // Also initialize formData from initialProfileData safely
      setFormData({
        firstName: initialProfileData.user.firstName || "",
        lastName: initialProfileData.user.lastName || "",
        email: initialProfileData.user.email || "",
        headline: initialProfileData.profile.headline ?? "",
        bio: initialProfileData.profile.bio ?? "",
        expertise: initialProfileData.profile.expertise ?? "",
        website: initialProfileData.profile.website ?? "",
        linkedinUrl: initialProfileData.profile.linkedinUrl ?? "",
        twitterUrl: initialProfileData.profile.twitterUrl ?? "",
        country: initialProfileData.profile.country ?? "",
        city: initialProfileData.profile.city ?? "",
        languages: (initialProfileData.profile.languages || []).join(", "),
        specializations: (initialProfileData.profile.specializations || []).join(", "),
      });
    }

    fetchInstructorData();
  }
  // Note: Removed profileData from dependency to avoid effect re-run loop
}, [status, session, router,isEditing]);


  const fetchInstructorData = async () => {
    try {
      setIsLoading(true);

      // Fetch profile data
      const profileResponse = await fetch("/api/instructor/profile");
      if (profileResponse.ok) {
        const fetchedProfile = await profileResponse.json();
        setProfileData({
          user: {
            id: fetchedProfile.user.id || "",
            firstName: fetchedProfile.user.firstName || "",
            lastName: fetchedProfile.user.lastName || "",
            email: fetchedProfile.user.email || "",
            profilePhoto: fetchedProfile.user.profilePhoto || null,
            userType: fetchedProfile.user.userType || "instructor",
            isVerified: fetchedProfile.user.isVerified || false,
            createdAt:
              fetchedProfile.user.createdAt || new Date().toISOString(),
          },
          profile: {
            headline: fetchedProfile.profile?.headline || null,
            bio: fetchedProfile.profile?.bio || null,
            expertise: fetchedProfile.profile?.expertise || null,
            website: fetchedProfile.profile?.website || null,
            linkedinUrl: fetchedProfile.profile?.linkedinUrl || null,
            twitterUrl: fetchedProfile.profile?.twitterUrl || null,
            country: fetchedProfile.profile?.country || null,
            city: fetchedProfile.profile?.city || null,
            languages: fetchedProfile.profile?.languages || [],
            specializations: fetchedProfile.profile?.specializations || [],
          },
        });
        
        // Update form data with fetched profile data
        setFormData({
          firstName: fetchedProfile.user.firstName || "",
          lastName: fetchedProfile.user.lastName || "",
          email: fetchedProfile.user.email || "",
          headline: fetchedProfile.profile?.headline ?? "",
          bio: fetchedProfile.profile?.bio ?? "",
          expertise: fetchedProfile.profile?.expertise ?? "",
          website: fetchedProfile.profile?.website ?? "",
          linkedinUrl: fetchedProfile.profile?.linkedinUrl ?? "",
          twitterUrl: fetchedProfile.profile?.twitterUrl ?? "",
          country: fetchedProfile.profile?.country ?? "",
          city: fetchedProfile.profile?.city ?? "",
          languages: (fetchedProfile.profile?.languages || []).join(", "),
          specializations: (fetchedProfile.profile?.specializations || []).join(", "),
        });
      }

      // Fetch stats
      const statsResponse = await fetch("/api/instructor/stats");
      if (statsResponse.ok) {
        const statsData = await statsResponse.json();
        setStats({
          totalCourses: statsData.totalCourses || 0,
          totalStudents: statsData.totalStudents || 0,
          totalRevenue: statsData.totalRevenue || 0,
          averageRating: statsData.averageRating || 0,
          totalReviews: statsData.totalReviews || 0,
        });
      }

      // Fetch courses
      const coursesResponse = await fetch("/api/instructor/courses");
      if (coursesResponse.ok) {
        const coursesData = await coursesResponse.json();
        setCourses(coursesData || []);
      }
    } catch (error) {
      console.error("Error fetching instructor data:", error);
      // toast({
      //   title: "Error",
      //   description: "Failed to load instructor data. Please try again.",
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
      setIsSaving(true);

      // Convert comma-separated strings into arrays
      const languagesArray = formData.languages
        .split(",")
        .map((l) => l.trim())
        .filter(Boolean);
      const specializationsArray = formData.specializations
        .split(",")
        .map((s) => s.trim())
        .filter(Boolean);

      const payload = {
        user: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          // other user fields if any
        },
        profile: {
          headline: formData.headline,
          bio: formData.bio,
          expertise: formData.expertise,
          website: formData.website,
          linkedinUrl: formData.linkedinUrl,
          twitterUrl: formData.twitterUrl,
          country: formData.country,
          city: formData.city,
          languages: languagesArray,
          specializations: specializationsArray,
        },
      };

      // Now call your API with the payload
      const response = await fetch("/api/instructor/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to save profile");
      }

      // Close the edit form and refresh data
      setIsEditing(false);
      fetchInstructorData();
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

  const handleAddPaymentMethod = async () => {
    console.log("Initiating payment method setup");
    // Example: router.push("/settings/payments/setup")
    // toast({
    //   title: "Payment Method",
    //   description: "Redirecting to payment setup...",
    // })
  };

  const handleConfigureNotifications = async (type: "email" | "messages") => {
    console.log(`Configuring ${type} notifications`);
    // Example API call:
    // await fetch("/api/settings/notifications", {
    //   method: "POST",
    //   body: JSON.stringify({ type, enabled: true }),
    // })
    // toast({
    //   title: "Success",
    //   description: `${type.charAt(0).toUpperCase() + type.slice(1)} notifications configured`,
    // })
  };

  const handleUpdateTaxInfo = async () => {
    console.log("Updating tax information");
    // Example: router.push("/settings/tax/update")
    // toast({
    //   title: "Tax Information",
    //   description: "Redirecting to tax information update...",
    // })
  };

  const handleViewMessages = () => {
    console.log("Navigating to Q&A messages");
    // Example: router.push("/instructor/messages")
    // toast({
    //   title: "Messages",
    //   description: "Opening Q&A messages...",
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
      <div className="min-h-screen py-20 bg-background  flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardContent className="p-6 text-center">
            <AlertCircle className="h-12 w-12 text-destructive mx-auto mb-4" />
            <h2 className="text-2xl font-bold mb-4">Access Denied</h2>
            <p className="text-muted-foreground mb-6">{authError}</p>
            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/">Sign In as Instructor</Link>
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
              Please sign in to access the instructor dashboard.
            </p>
            <Button asChild className="w-full">
              <Link href="/">Sign In</Link>
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  const displayName = `${profileData?.user.firstName || "Instructor"} ${
    profileData?.user.lastName || ""
  }`.trim();

  return (
    <div className="min-h-screen bg-background py-20">

      <div className="container py-8">
        <Tabs
          value={activeTab}
          onValueChange={setActiveTab}
          className="space-y-8"
        >
          <TabsList className="grid w-full grid-cols-5">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="courses">Courses</TabsTrigger>
            <TabsTrigger value="analytics">Analytics</TabsTrigger>
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="settings">Settings</TabsTrigger>
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
                          profileData?.user.profilePhoto || "/placeholder.svg"
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
                        {profileData?.user.isVerified && (
                          <Badge
                            variant="secondary"
                            className="bg-green-100 text-green-800"
                          >
                            <CheckCircle className="size-3 mr-1" />
                            Verified
                          </Badge>
                        )}
                      </div>
                      <p className="text-muted-foreground">
                        {profileData?.profile?.headline || "Instructor"}
                      </p>
                      <p className="text-sm text-muted-foreground mt-1">
                        Teaching since{" "}
                        {profileData?.user.createdAt
                          ? new Date(profileData.user.createdAt).getFullYear()
                          : "N/A"}
                      </p>
                    </div>
                    <div className="text-right">
                      <div className="flex items-center gap-1 mb-1">
                        <Star className="size-4 text-yellow-500 fill-yellow-500" />
                        <span className="font-semibold">
                          {stats.averageRating.toFixed(1)}
                        </span>
                        <span className="text-sm text-muted-foreground">
                          ({stats.totalReviews.toLocaleString()} reviews)
                        </span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        {stats.totalStudents.toLocaleString()} students
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
              className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
            >
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Revenue
                  </CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    ${stats.totalRevenue.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +12.5% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Total Students
                  </CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.totalStudents.toLocaleString()}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    +8.2% from last month
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Published Courses
                  </CardTitle>
                  <BookOpen className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{stats.totalCourses}</div>
                  <p className="text-xs text-muted-foreground">
                    {courses.filter((c) => c.status === "draft").length} in
                    draft
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">
                    Average Rating
                  </CardTitle>
                  <Star className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">
                    {stats.averageRating.toFixed(1)}
                  </div>
                  <p className="text-xs text-muted-foreground">
                    From {stats.totalReviews.toLocaleString()} reviews
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            {/* Quick Actions */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card>
                <CardHeader>
                  <CardTitle>Quick Actions</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <Button asChild className="h-auto p-4 flex-col gap-2">
                      <Link href="/teaching">
                        <Plus className="h-6 w-6" />
                        <span>Create New Course</span>
                      </Link>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2 bg-transparent"
                      onClick={() => setActiveTab("analytics")}
                    >
                      <BarChart3 className="h-6 w-6" />
                      <span>View Analytics</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2 bg-transparent"
                      onClick={handleViewMessages}
                    >
                      <MessageSquare className="h-6 w-6" />
                      <span>Q&A Messages</span>
                    </Button>
                    <Button
                      variant="outline"
                      className="h-auto p-4 flex-col gap-2 bg-transparent"
                      onClick={() => setActiveTab("settings")}
                    >
                      <Settings className="h-6 w-6" />
                      <span>Account Settings</span>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </TabsContent>

          <TabsContent value="courses" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">My Courses</h2>
              <Button asChild>
                <Link href="/teaching">
                  <Plus className="size-4 mr-2" />
                  Create New Course
                </Link>
              </Button>
            </div>

            {courses.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {courses.map((course) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                  >
                    <Card className="overflow-hidden">
                      <div className="relative aspect-video">
                        <Image
                          src={
                            course.thumbnailUrl ||
                            "/placeholder.svg?height=200&width=300"
                          }
                          alt={course.title}
                          fill
                          className="object-cover"
                        />
                        <div className="absolute top-2 right-2">
                          <Badge
                            variant={
                              course.status === "published"
                                ? "default"
                                : course.status === "draft"
                                ? "secondary"
                                : "destructive"
                            }
                          >
                            {course.status}
                          </Badge>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-semibold mb-2 line-clamp-2">
                          {course.title}
                        </h3>

                        {course.status === "draft" && (
                          <div className="mb-3">
                            <div className="flex items-center justify-between text-sm mb-1">
                              <span>Course Progress</span>
                              <span>{course.progress}%</span>
                            </div>
                            <Progress value={course.progress} className="h-2" />
                          </div>
                        )}

                        <div className="space-y-2 text-sm text-muted-foreground">
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <Users className="h-4 w-4" />
                              {course.enrollmentCount.toLocaleString()} students
                            </span>
                            {course.averageRating > 0 && (
                              <span className="flex items-center gap-1">
                                <Star className="h-4 w-4 text-yellow-500 fill-yellow-500" />
                                {course.averageRating.toFixed(1)} (
                                {course.reviewCount})
                              </span>
                            )}
                          </div>
                          <div className="flex items-center justify-between">
                            <span className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />$
                              {course.totalRevenue.toLocaleString()}
                            </span>
                            <span className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              {new Date(course.updatedAt).toLocaleDateString()}
                            </span>
                          </div>
                        </div>

                        <div className="flex gap-2 mt-4">
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            asChild
                          >
                            <Link href={`/teaching/course/${course.id}`}>
                              <Edit3 className="h-4 w-4 mr-1" />
                              Edit
                            </Link>
                          </Button>
                          <Button
                            size="sm"
                            variant="outline"
                            className="flex-1 bg-transparent"
                            asChild
                          >
                            <Link href={`/course/${course.id}`}>
                              <Eye className="h-4 w-4 mr-1" />
                              View
                            </Link>
                          </Button>
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
                    No courses created yet
                  </h3>
                  <p className="text-muted-foreground mb-6">
                    Start sharing your knowledge by creating your first course
                  </p>
                  <Button asChild>
                    <Link href="/teaching">Create Your First Course</Link>
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="profile" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Instructor Profile</h2>
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
                            profileData?.user.profilePhoto ||
                            "/placeholder.svg"
                          }
                          alt={displayName}
                        />
                        <AvatarFallback className="text-2xl">
                          {displayName.charAt(0)}
                        </AvatarFallback>
                      </Avatar>
                    </div>

                    <div>
                      <h3 className="text-xl font-bold">{displayName}</h3>
                      <p className="text-muted-foreground">
                        {profileData?.profile?.headline || "Instructor"}
                      </p>
                      <div className="flex items-center justify-center gap-2 mt-2">
                        <Globe className="h-4 w-4 text-muted-foreground" />
                        <span className="text-sm text-muted-foreground">
                          {profileData?.profile?.city &&
                          profileData?.profile?.country
                            ? `${profileData.profile.city}, ${profileData.profile.country}`
                            : "Location not set"}
                        </span>
                      </div>
                    </div>

                    <div className="flex justify-center gap-4">
                      {profileData?.user.isVerified && (
                        <Badge
                          variant="secondary"
                          className="bg-green-100 text-green-800"
                        >
                          <CheckCircle className="size-3 mr-1" />
                          Verified Instructor
                        </Badge>
                      )}
                    </div>
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
                          <Label htmlFor="headline">Professional Headline</Label>
                          <Input
                            name="headline"
                            value={formData.headline}
                            onChange={handleProfileChange}
                            placeholder="e.g., Senior Full Stack Developer & Tech Educator"
                          />
                        </div>
                        <div>
                          <Label htmlFor="bio">Biography</Label>
                          <Textarea
                            name="bio"
                            value={formData.bio}
                            onChange={handleProfileChange}
                            rows={4}
                            placeholder="Tell students about yourself..."
                          />
                        </div>
                        <div>
                          <Label htmlFor="expertise">Area of Expertise</Label>
                          <Input
                            name="expertise"
                            value={formData.expertise}
                            onChange={handleProfileChange}
                            placeholder="e.g., Web Development, Data Science"
                          />
                        </div>
                        <div>
                          <Label htmlFor="languages">
                            Languages (comma-separated)
                          </Label>
                          <Input
                            name="languages"
                            value={formData.languages}
                            onChange={handleProfileChange}
                            placeholder="e.g., English, Spanish"
                          />
                        </div>
                        <div>
                          <Label htmlFor="specializations">
                            Specializations (comma-separated)
                          </Label>
                          <Input
                            name="specializations"
                            value={formData.specializations}
                            onChange={handleProfileChange}
                            placeholder="e.g., React, Python, Machine Learning"
                          />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="website">Website</Label>
                            <Input
                              name="website"
                              value={formData.website}
                              onChange={handleProfileChange}
                              placeholder="https://yourwebsite.com"
                            />
                          </div>
                          <div>
                            <Label htmlFor="linkedin">LinkedIn</Label>
                            <Input
                              name="linkedinUrl"
                              value={formData.linkedinUrl}
                              onChange={handleProfileChange}
                              placeholder="https://linkedin.com/in/yourprofile"
                            />
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <Label htmlFor="city">City</Label>
                            <Input
                              name="city"
                              value={formData.city}
                              onChange={handleProfileChange}
                              placeholder="San Francisco"
                            />
                          </div>
                          <div>
                            <Label htmlFor="country">Country</Label>
                            <Input
                              name="country"
                              value={formData.country}
                              onChange={handleProfileChange}
                              placeholder="United States"
                            />
                          </div>
                        </div>
                      </>
                    ) : (
                      <>
                        <p className="text-muted-foreground leading-relaxed">
                          {profileData?.profile?.bio ||
                            "No biography provided yet."}
                        </p>
                        {profileData?.profile?.expertise && (
                          <div>
                            <h4 className="font-medium mb-2">Area of Expertise</h4>
                            <Badge variant="secondary">
                              {profileData.profile.expertise}
                            </Badge>
                          </div>
                        )}
                        {profileData?.profile?.specializations &&
                          profileData.profile.specializations.length > 0 && (
                            <div className="flex flex-wrap gap-2">
                              {profileData.profile.specializations.map(
                                (spec: string, index: number) => (
                                  <Badge key={index} variant="secondary">
                                    {spec}
                                  </Badge>
                                )
                              )}
                            </div>
                          )}
                        <div className="flex gap-4 text-sm">
                          {profileData?.profile?.website && (
                            <a
                              href={profileData.profile.website}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              Website
                            </a>
                          )}
                          {profileData?.profile?.linkedinUrl && (
                            <a
                              href={profileData.profile.linkedinUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary hover:underline"
                            >
                              LinkedIn
                            </a>
                          )}
                        </div>
                      </>
                    )}
                  </CardContent>
                </Card>

                {/* Teaching Stats */}
                <Card>
                  <CardHeader>
                    <CardTitle>Teaching Statistics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.totalCourses}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Courses
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.totalStudents.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Students
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          {stats.averageRating.toFixed(1)}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Avg Rating
                        </div>
                      </div>
                      <div className="text-center">
                        <div className="text-2xl font-bold text-primary">
                          ${stats.totalRevenue.toLocaleString()}
                        </div>
                        <div className="text-sm text-muted-foreground">
                          Revenue
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </div>
            
            {isEditing && (
              <div className="flex gap-4 mt-6">
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
          </TabsContent>

          <TabsContent value="analytics" className="space-y-6">
            <h2 className="text-2xl font-bold">Analytics & Insights</h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Revenue Trend</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <BarChart3 className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Revenue analytics coming soon</p>
                      <p className="text-sm">Track your earnings over time</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Student Enrollment</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="h-64 flex items-center justify-center text-muted-foreground">
                    <div className="text-center">
                      <Users className="h-12 w-12 mx-auto mb-4 text-muted-foreground/50" />
                      <p>Enrollment analytics coming soon</p>
                      <p className="text-sm">Monitor student growth</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Account Settings</h2>
              <Button
                onClick={() => setIsEditing(!isEditing)}
                disabled={isSaving}
              >
                {isEditing ? "Cancel" : "Edit Profile"}
              </Button>
            </div>

            {isEditing ? (
              <Card>
                <CardContent className="p-6 space-y-4">
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
                    <Label htmlFor="profilePhoto">Profile Photo</Label>
                    <div className="flex items-center gap-4">
                      <Avatar className="size-16">
                        <AvatarImage
                          src={
                            profilePhotoPreview ||
                            profileData?.user.profilePhoto ||
                            "/placeholder.svg"
                          }
                          alt={displayName}
                        />
                        <AvatarFallback>{displayName.charAt(0)}</AvatarFallback>
                      </Avatar>
                      <label className="bg-primary text-primary-foreground rounded-md px-4 py-2 cursor-pointer hover:bg-primary/90">
                        <Camera className="h-4 w-4 inline-block mr-2" />
                        Upload Photo
                        <input
                          type="file"
                          accept="image/*"
                          onChange={handlePhotoChange}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>
                  <div>
                    <Label htmlFor="headline">Professional Headline</Label>
                    <Input
                      name="headline"
                      value={formData.headline}
                      onChange={handleProfileChange}
                      placeholder="e.g., Senior Full Stack Developer & Tech Educator"
                    />
                  </div>
                  <div>
                    <Label htmlFor="bio">Biography</Label>
                    <Textarea
                      name="bio"
                      value={formData.bio}
                      onChange={handleProfileChange}
                      rows={4}
                      placeholder="Tell students about yourself..."
                    />
                  </div>
                  <div>
                    <Label htmlFor="expertise">Area of Expertise</Label>
                    <Input
                      name="expertise"
                      value={formData.expertise}
                      onChange={handleProfileChange}
                      placeholder="e.g., Web Development, Data Science"
                    />
                  </div>
                  <div>
                    <Label htmlFor="languages">
                      Languages (comma-separated)
                    </Label>
                    <Input
                      name="languages"
                      value={formData.languages}
                      onChange={handleProfileChange}
                      placeholder="e.g., English, Spanish"
                    />
                  </div>
                  <div>
                    <Label htmlFor="specializations">
                      Specializations (comma-separated)
                    </Label>
                    <Input
                      name="specializations"
                      value={formData.specializations}
                      onChange={handleProfileChange}
                      placeholder="e.g., React, Python, Machine Learning"
                    />
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="website">Website</Label>
                      <Input
                        name="website"
                        value={formData.website}
                        onChange={handleProfileChange}
                        placeholder="https://yourwebsite.com"
                      />
                    </div>
                    <div>
                      <Label htmlFor="linkedin">LinkedIn</Label>
                      <Input
                        name="linkedinUr"
                        value={formData.linkedinUrl}
                        onChange={handleProfileChange}
                        placeholder="https://linkedin.com/in/yourprofile"
                      />
                    </div>
                  </div>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="city">City</Label>
                      <Input
                        name="city"
                        value={formData.city}
                        onChange={handleProfileChange}
                        placeholder="San Francisco"
                      />
                    </div>
                    <div>
                      <Label htmlFor="country">Country</Label>
                      <Input
                        name="country"
                        value={formData.country}
                        onChange={handleProfileChange}
                        placeholder="United States"
                      />
                    </div>
                  </div>
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
                </CardContent>
              </Card>
            ) : (
              <div className="space-y-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Notification Preferences</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Email Notifications</h4>
                          <p className="text-sm text-muted-foreground">
                            Receive notifications about course activity
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() => handleConfigureNotifications("email")}
                        >
                          Configure
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Student Messages</h4>
                          <p className="text-sm text-muted-foreground">
                            Get notified when students ask questions
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={() =>
                            handleConfigureNotifications("messages")
                          }
                        >
                          Configure
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Payout Settings</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Payment Method</h4>
                          <p className="text-sm text-muted-foreground">
                            Configure how you receive payments
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={handleAddPaymentMethod}
                        >
                          Setup
                        </Button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div>
                          <h4 className="font-medium">Tax Information</h4>
                          <p className="text-sm text-muted-foreground">
                            Update your tax details
                          </p>
                        </div>
                        <Button
                          variant="outline"
                          size="sm"
                          className="bg-transparent"
                          onClick={handleUpdateTaxInfo}
                        >
                          Update
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
