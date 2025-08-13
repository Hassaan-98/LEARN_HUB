"use client";

import type React from "react";
import { useState } from "react";
import { useRouter } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Button } from "../components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Label } from "../components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select";
import { Separator } from "../components/ui/separator";
import { BookOpen, User, Mail, Lock, Eye, EyeOff, Loader2 } from "lucide-react";

export default function SignupPage() {
  const router = useRouter();
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    userType: "",
    expertise: "",
  });

  const [errors, setErrors] = useState<Record<string, string>>({});

  const [showGoogleUserTypeDialog, setShowGoogleUserTypeDialog] = useState(false);

  const handleChange = (field: string, value: string) => {
    const trimmedValue = ["firstName", "lastName", "expertise"].includes(field) ? value.trim() : value;
    setFormData({ ...formData, [field]: trimmedValue });
    setErrors((prev) => ({ ...prev, [field]: "" }));
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName) newErrors.firstName = "First name is required";
    else if (formData.firstName.length < 2) newErrors.firstName = "First name must be at least 2 characters";

    if (!formData.lastName) newErrors.lastName = "Last name is required";
    else if (formData.lastName.length < 2) newErrors.lastName = "Last name must be at least 2 characters";

    if (!formData.email) newErrors.email = "Email is required";
    else if (!/^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/.test(formData.email))
      newErrors.email = "Email is invalid";

    if (!formData.password) newErrors.password = "Password is required";
    else if (formData.password.length < 8) newErrors.password = "Password must be at least 8 characters";
    else if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/.test(formData.password))
      newErrors.password = "Password must include uppercase, lowercase, number, and special character";

    if (!formData.confirmPassword) newErrors.confirmPassword = "Confirm password is required";
    else if (formData.confirmPassword !== formData.password) newErrors.confirmPassword = "Passwords do not match";

    if (!formData.userType) newErrors.userType = "Please select account type";

    if (formData.userType === "instructor") {
      if (!formData.expertise) newErrors.expertise = "Area of expertise is required for instructors";
      else if (formData.expertise.length < 3) newErrors.expertise = "Expertise must be at least 3 characters";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateForm()) return;

    setIsLoading(true);

    try {
      // Only include expertise in the request body if userType is instructor
      const requestBody = {
        firstName: formData.firstName,
        lastName: formData.lastName,
        email: formData.email,
        password: formData.password,
        userType: formData.userType,
        ...(formData.userType === "instructor" && { expertise: formData.expertise }),
      };

      const response = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody),
      });

      const data = await response.json();

      if (response.ok) {
        const result = await signIn("credentials", {
          email: formData.email,
          password: formData.password,
          userType: formData.userType,
          redirect: false,
        });

        if (result?.error) {
          setErrors({ general: result.error });
        } else {
          const redirectPath = formData.userType === "student" ? "/dashboard/user" : "/dashboard/instructor";
          router.push(redirectPath);
        }
      } else {
        setErrors({ general: data.error || "Signup failed" });
      }
    } catch (error) {
      console.error("Signup error:", error);
      setErrors({ general: "An unexpected error occurred" });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSocialAuth = (provider: string) => {
    if (isLoading) return;
    if (provider === "google") {
      setShowGoogleUserTypeDialog(true);
    } else {
      signIn(provider, { callbackUrl: "/" });
    }
  };

  return (
    <div className="min-h-screen mt-20 bg-gradient-to-br from-background to-muted flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="flex items-center justify-center gap-2 mb-4">
            <div className="size-10 rounded-lg bg-gradient-to-br from-primary to-primary/70 flex items-center justify-center text-primary-foreground">
              <BookOpen className="size-5" />
            </div>
            <span className="text-xl font-bold">LearnHub</span>
          </div>
          <CardTitle className="text-2xl">Create your account</CardTitle>
          <CardDescription>Join thousands of learners and instructors</CardDescription>
        </CardHeader>
        <CardContent>
          {errors.general && (
            <div className="bg-destructive/10 text-destructive text-sm p-3 rounded-md mb-4">{errors.general}</div>
          )}

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
                    value={formData.firstName}
                    onChange={(e) => handleChange("firstName", e.target.value)}
                    disabled={isLoading}
                  />
                </div>
                {errors.firstName && <p className="text-destructive text-sm">{errors.firstName}</p>}
              </div>
              <div className="space-y-2">
                <Label htmlFor="lastName">Last Name</Label>
                <Input
                  id="lastName"
                  type="text"
                  placeholder="Doe"
                  value={formData.lastName}
                  onChange={(e) => handleChange("lastName", e.target.value)}
                  disabled={isLoading}
                />
                {errors.lastName && <p className="text-destructive text-sm">{errors.lastName}</p>}
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
                  value={formData.email}
                  onChange={(e) => handleChange("email", e.target.value)}
                  disabled={isLoading}
                />
              </div>
              {errors.email && <p className="text-destructive text-sm">{errors.email}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="userType">Account Type</Label>
              <Select
                value={formData.userType}
                onValueChange={(value) => handleChange("userType", value)}
                disabled={isLoading}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select account type" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="student">Student - Learn new skills</SelectItem>
                  <SelectItem value="instructor">Instructor - Teach others</SelectItem>
                </SelectContent>
              </Select>
              {errors.userType && <p className="text-destructive text-sm">{errors.userType}</p>}
            </div>

            {formData.userType === "instructor" && (
              <div className="space-y-2">
                <Label htmlFor="expertise">Area of Expertise</Label>
                <Input
                  id="expertise"
                  type="text"
                  placeholder="e.g., Web Development, Data Science"
                  value={formData.expertise}
                  onChange={(e) => handleChange("expertise", e.target.value)}
                  disabled={isLoading}
                />
                {errors.expertise && <p className="text-destructive text-sm">{errors.expertise}</p>}
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
                  value={formData.password}
                  onChange={(e) => handleChange("password", e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowPassword(!showPassword)}
                  disabled={isLoading}
                >
                  {showPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.password && <p className="text-destructive text-sm">{errors.password}</p>}
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
                  value={formData.confirmPassword}
                  onChange={(e) => handleChange("confirmPassword", e.target.value)}
                  disabled={isLoading}
                />
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  disabled={isLoading}
                >
                  {showConfirmPassword ? (
                    <EyeOff className="size-4 text-muted-foreground" />
                  ) : (
                    <Eye className="size-4 text-muted-foreground" />
                  )}
                </Button>
              </div>
              {errors.confirmPassword && <p className="text-destructive text-sm">{errors.confirmPassword}</p>}
            </div>

            <div className="flex items-start space-x-2">
              <input
                type="checkbox"
                className="mt-1 rounded border-gray-300"
                required
                disabled={isLoading}
              />
              <label className="text-sm text-muted-foreground">
                I agree to the{" "}
                <Link href="/terms" className="text-primary hover:underline">
                  Terms of Service
                </Link>{" "}
                and{" "}
                <Link href="/privacy" className="text-primary hover:underline">
                  Privacy Policy
                </Link>
              </label>
            </div>

            <Button type="submit" className="w-full" disabled={isLoading}>
              {isLoading ? (
                <>
                  <Loader2 className="size-4 mr-2 animate-spin" />
                  Creating account...
                </>
              ) : (
                `Create ${formData.userType === "student" ? "Student" : "Instructor"} Account`
              )}
            </Button>
          </form>

          <div className="mt-6">
            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <Separator className="w-full" />
              </div>
              <div className="relative flex justify-center text-xs uppercase">
                <span className="bg-background px-2 text-muted-foreground">Or continue with</span>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 mt-4">
              <Button
                variant="outline"
                onClick={() => handleSocialAuth("google")}
                className="w-full bg-transparent"
              >
                <svg className="mr-2 h-4 w-4" viewBox="0 0 24 24" aria-hidden="true" focusable="false">
                  <path
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    fill="#4285F4"
                  />
                  <path
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    fill="#34A853"
                  />
                  <path
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    fill="#FBBC05"
                  />
                  <path
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    fill="#EA4335"
                  />
                </svg>
                Continue with Google
              </Button>
            </div>
          </div>

          <div className="mt-6 text-center">
            <p className="text-sm text-muted-foreground">
              Already have an account?{" "}
              <Link href="/sign-in" className="text-primary hover:underline font-medium">
                Sign in
              </Link>
            </p>
          </div>
        </CardContent>
      </Card>

      {showGoogleUserTypeDialog && (
        <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50 z-50">
          <div className="bg-white p-6 rounded shadow-lg max-w-sm w-full">
            <h2 className="text-xl font-semibold mb-4 text-center">Sign up with Google as:</h2>
            <div className="flex flex-col gap-4">
              <Button
                onClick={() => {
                  setShowGoogleUserTypeDialog(false);
                  signIn("google", { callbackUrl: "/", userType: "student" });
                }}
              >
                Student
              </Button>
              <Button
                onClick={() => {
                  setShowGoogleUserTypeDialog(false);
                  signIn("google", { callbackUrl: "/", userType: "instructor" });
                }}
              >
                Instructor
              </Button>
              <Button variant="ghost" onClick={() => setShowGoogleUserTypeDialog(false)}>
                Cancel
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}