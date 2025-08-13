"use client"

import type React from "react"
import { useState } from "react"
import { signIn } from "next-auth/react"
import { Button } from "../../components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "../../components/ui/dialog"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "../../components/ui/dropdown-menu"
import { Input } from "../../components/ui/input"
import { Label } from "../../components/ui/label"
import { Separator } from "../../components/ui/separator"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../components/ui/tabs"
import { ChevronDown, Mail, Lock, User, GraduationCap, BookOpen, Eye, EyeOff } from "lucide-react"
// Add import for useRouter
import { useRouter } from "next/navigation"

interface AuthDialogProps {
  children: React.ReactNode
}

export function AuthDialog({ children }: AuthDialogProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [authMode, setAuthMode] = useState<"login" | "signup">("login")
  const [userType, setUserType] = useState<"student" | "instructor">("student")
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    expertise: "",
  })
  const [errors, setErrors] = useState<Record<string, string>>({})

  // Inside AuthDialog function, initialize router
  const router = useRouter()

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({ ...formData, [e.target.id]: e.target.value })
    setErrors((prevErrors) => ({ ...prevErrors, [e.target.id]: "" })) // Clear specific error on change
    setErrors((prevErrors) => ({ ...prevErrors, general: "" })) // Clear general error
  }

  const validateForm = () => {
    const newErrors: Record<string, string> = {}

    if (!formData.email) {
      newErrors.email = "Email is required."
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = "Email is invalid."
    }

    if (!formData.password) {
      newErrors.password = "Password is required."
    } else if (formData.password.length < 6) {
      newErrors.password = "Password must be at least 6 characters."
    }

    if (authMode === "signup") {
      if (!formData.firstName) newErrors.firstName = "First name is required."
      if (!formData.lastName) newErrors.lastName = "Last name is required."
      if (!formData.confirmPassword) {
        newErrors.confirmPassword = "Confirm password is required."
      } else if (formData.confirmPassword !== formData.password) {
        newErrors.confirmPassword = "Passwords do not match."
      }
      if (userType === "instructor" && !formData.expertise) {
        newErrors.expertise = "Area of expertise is required for instructors."
      }
    }
    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!validateForm()) {
      return
    }

    // In handleSubmit, after successful login or signup, add the redirection logic:
    // Replace the existing `if (response.ok)` block for signup and `if (result?.error)` for login
    // with the following combined logic:

    if (authMode === "login") {
      const result = await signIn("credentials", {
        redirect: false,
        email: formData.email,
        password: formData.password,
        userType: userType,
      })

      if (result?.error) {
        setErrors({ general: result.error })
      } else {
        const redirectPath = userType === "student" ? "/dashboard/user" : "/dashboard/instructor"
        router.push(redirectPath)
        setIsOpen(false)
      }
    } else {
      // signup
      try {
        const response = await fetch("/api/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            firstName: formData.firstName,
            lastName: formData.lastName,
            email: formData.email,
            password: formData.password,
            userType: userType,
            expertise: userType === "instructor" ? formData.expertise : undefined,
          }),
        })

        const data = await response.json()
        if (response.ok) {
          console.log("Signup successful:", data)
          // After successful signup, attempt to sign in the user and redirect
          const result = await signIn("credentials", {
            email: formData.email,
            password: formData.password,
            userType: userType,
            redirect: false,
          })

          if (result?.error) {
            setErrors({ general: result.error })
          } else {
            const redirectPath = userType === "student" ? "/dashboard/user" : "/dashboard/instructor"
            router.push(redirectPath)
            setIsOpen(false)
          }
        } else {
          setErrors({ general: data.error || "Signup failed." })
        }
      } catch (error) {
        console.error("Signup error:", error)
        setErrors({ general: "An unexpected error occurred." })
      }
    }
  }

  const handleSocialAuth = (provider: string) => {
    signIn(provider, { callbackUrl: "/" }) // Redirect to home after social login
  }

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>{children}</DialogTrigger>
      <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden">
        <div className="bg-gradient-to-br from-primary/10 via-primary/5 to-transparent p-6 pb-4">
          <DialogHeader className="text-center">
            <DialogTitle className="text-2xl font-bold">
              {authMode === "login" ? "Welcome Back!" : "Join LearnHub"}
            </DialogTitle>
            <DialogDescription className="text-muted-foreground">
              {authMode === "login"
                ? "Sign in to continue your learning journey"
                : "Start your learning adventure today"}
            </DialogDescription>
          </DialogHeader>
        </div>
        <div className="px-6 pb-6">
          <Tabs value={authMode} onValueChange={(value) => setAuthMode(value as "login" | "signup")}>
            <TabsList className="grid w-full grid-cols-2 mb-6">
              <TabsTrigger value="login">Sign In</TabsTrigger>
              <TabsTrigger value="signup">Sign Up</TabsTrigger>
            </TabsList>
            {errors.general && <p className="text-red-500 text-sm text-center mb-4">{errors.general}</p>}
            <TabsContent value="login" className="space-y-4">
              <div className="flex justify-center mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <div className="flex items-center gap-2">
                        {userType === "student" ? (
                          <GraduationCap className="size-4" />
                        ) : (
                          <BookOpen className="size-4" />
                        )}
                        Login as {userType === "student" ? "Student" : "Instructor"}
                      </div>
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setUserType("student")}>
                      <GraduationCap className="size-4 mr-2" />
                      Student
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserType("instructor")}>
                      <BookOpen className="size-4 mr-2" />
                      Instructor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="Enter your email"
                      className="pl-10"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Enter your password"
                      className="pl-10 pr-10"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="flex items-center justify-between">
                  <label className="flex items-center space-x-2 text-sm">
                    <input type="checkbox" className="rounded border-gray-300" />
                    <span>Remember me</span>
                  </label>
                  <Button variant="link" className="px-0 text-sm">
                    Forgot password?
                  </Button>
                </div>
                <Button type="submit" className="w-full">
                  Sign In as {userType === "student" ? "Student" : "Instructor"}
                </Button>
              </form>
            </TabsContent>
            <TabsContent value="signup" className="space-y-4">
              <div className="flex justify-center mb-4">
                <DropdownMenu>
                  <DropdownMenuTrigger asChild>
                    <Button variant="outline" className="w-full justify-between bg-transparent">
                      <div className="flex items-center gap-2">
                        {userType === "student" ? (
                          <GraduationCap className="size-4" />
                        ) : (
                          <BookOpen className="size-4" />
                        )}
                        Sign up as {userType === "student" ? "Student" : "Instructor"}
                      </div>
                      <ChevronDown className="size-4" />
                    </Button>
                  </DropdownMenuTrigger>
                  <DropdownMenuContent className="w-full">
                    <DropdownMenuItem onClick={() => setUserType("student")}>
                      <GraduationCap className="size-4 mr-2" />
                      Student
                    </DropdownMenuItem>
                    <DropdownMenuItem onClick={() => setUserType("instructor")}>
                      <BookOpen className="size-4 mr-2" />
                      Instructor
                    </DropdownMenuItem>
                  </DropdownMenuContent>
                </DropdownMenu>
              </div>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">First Name</Label>
                    <div className="relative">
                      <User className="absolute left-3 top-3 size-4 text-muted-foreground" />
                      <Input
                        id="firstName"
                        type="text"
                        placeholder="John"
                        className="pl-10"
                        required
                        value={formData.firstName}
                        onChange={handleChange}
                      />
                    </div>
                    {errors.firstName && <p className="text-red-500 text-sm">{errors.firstName}</p>}
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      placeholder="Doe"
                      required
                      value={formData.lastName}
                      onChange={handleChange}
                    />
                    {errors.lastName && <p className="text-red-500 text-sm">{errors.lastName}</p>}
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="john@example.com"
                      className="pl-10"
                      required
                      value={formData.email}
                      onChange={handleChange}
                    />
                  </div>
                  {errors.email && <p className="text-red-500 text-sm">{errors.email}</p>}
                </div>
                {userType === "instructor" && (
                  <div className="space-y-2">
                    <Label htmlFor="expertise">Area of Expertise</Label>
                    <Input
                      id="expertise"
                      type="text"
                      placeholder="e.g., Web Development, Data Science"
                      required
                      value={formData.expertise}
                      onChange={handleChange}
                    />
                    {errors.expertise && <p className="text-red-500 text-sm">{errors.expertise}</p>}
                  </div>
                )}
                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Create a strong password"
                      className="pl-10 pr-10"
                      required
                      value={formData.password}
                      onChange={handleChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.password && <p className="text-red-500 text-sm">{errors.password}</p>}
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirmPassword">Confirm Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-3 size-4 text-muted-foreground" />
                    <Input
                      id="confirmPassword"
                      type={showConfirmPassword ? "text" : "password"}
                      placeholder="Confirm your password"
                      className="pl-10 pr-10"
                      required
                      value={formData.confirmPassword}
                      onChange={handleChange}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    >
                      {showConfirmPassword ? (
                        <EyeOff className="size-4 text-muted-foreground" />
                      ) : (
                        <Eye className="size-4 text-muted-foreground" />
                      )}
                    </Button>
                  </div>
                  {errors.confirmPassword && <p className="text-red-500 text-sm">{errors.confirmPassword}</p>}
                </div>
                <div className="flex items-start space-x-2">
                  <input type="checkbox" className="mt-1 rounded border-gray-300" required />
                  <label className="text-sm text-muted-foreground">
                    I agree to the{" "}
                    <Button variant="link" className="px-0 h-auto text-sm">
                      Terms of Service
                    </Button>{" "}
                    and{" "}
                    <Button variant="link" className="px-0 h-auto text-sm">
                      Privacy Policy
                    </Button>
                  </label>
                </div>
                <Button type="submit" className="w-full">
                  Create {userType === "student" ? "Student" : "Instructor"} Account
                </Button>
              </form>
            </TabsContent>
          </Tabs>
          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 mt-4">
              <Button variant="outline" onClick={() => handleSocialAuth("google")} className="w-full">
                <svg className="size-4" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
              </Button>
              <Button variant="outline" onClick={() => handleSocialAuth("github")} className="w-full">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 0c-6.626 0-12 5.373-12 12 0 5.302 3.438 9.8 8.207 11.387.599.111.793-.261.793-.577v-2.234c-3.338.726-4.033-1.416-4.033-1.416-.546-1.387-1.333-1.756-1.333-1.756-1.089-.745.083-.729.083-.729 1.205.084 1.839 1.237 1.839 1.237 1.07 1.834 2.807 1.304 3.492.997.107-.775.418-1.305.762-1.604-2.665-.305-5.467-1.334-5.467-5.931 0-1.311.469-2.381 1.236-3.221-.124-.303-.535-1.524.117-3.176 0 0 1.008-.322 3.301 1.23.957-.266 1.983-.399 3.003-.404 1.02.005 2.047.138 3.006.404 2.291-1.552 3.297-1.23 3.297-1.23.653 1.653.242 2.874.118 3.176.77.84 1.235 1.911 1.235 3.221 0 4.609-2.807 5.624-5.479 5.921.43.372.823 1.102.823 2.222v3.293c0 .319.192.694.801.576 4.765-1.589 8.199-6.086 8.199-11.386 0-6.627-5.373-12-12-12z" />
                </svg>
              </Button>
              <Button variant="outline" onClick={() => handleSocialAuth("linkedin")} className="w-full">
                <svg className="size-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M20.447 20.452h-3.554v-5.569c0-1.328-.027-3.037-1.852-3.037-1.853 0-2.136 1.445-2.136 2.939v5.667H9.351V9h3.414v1.561h.046c.477-.9 1.637-1.85 3.37-1.85 3.601 0 4.267 2.37 4.267 5.455v6.286zM5.337 7.433c-1.144 0-2.063-.926-2.063-2.065 0-1.138.92-2.063 2.063-2.063 1.14 0 2.064.925 2.064 2.063 0 1.139-.925 2.065-2.064 2.065zm1.782 13.019H3.555V9h3.564v11.452zM22.225 0H1.771C.792 0 0 .774 0 1.729v20.542C0 23.227.792 24 1.771 24h20.451C23.2 24 24 23.227 24 22.271V1.729C24 .774 23.2 0 22.222 0h.003z" />
                </svg>
              </Button>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  )
}
