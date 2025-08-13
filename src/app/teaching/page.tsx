"use client"

import type React from "react"

import { useState } from "react"
import Link from "next/link"
import Image from "next/image"
import { useSession } from "next-auth/react";

import { BookOpen, ArrowLeft, PlusCircle, Upload, Video, FileText, Trash2, Save, CheckCircle } from "lucide-react"
import { Button } from "../components/ui/button"
import { Input } from "../components/ui/input"
import { Textarea } from "../components/ui/textarea"
import { Label } from "../components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "../components/ui/select"
import { Card } from "../components/ui/card"
import { Badge } from "../components/ui/badge"
import { Progress } from "../components/ui/progress"
import { Alert, AlertDescription } from "../components/ui/alert"

const categories = [
  "Web Development",
  "Data Science",
  "Digital Marketing",
  "Design",
  "Business",
  "Photography",
  "Mobile Development",
  "AI & Machine Learning",
]

const levels = ["Beginner", "Intermediate", "Advanced", "All Levels"]

interface Lesson {
  id: string
  title: string
  duration: string
  videoFile?: File
  videoUrl?: string
  description: string
  resources: File[]
  isUploading?: boolean
  uploadProgress?: number
}

interface Module {
  id: string
  title: string
  description: string
  lessons: Lesson[]
}

interface CourseData {
  title: string
  subtitle: string
  description: string
  category: string
  level: string
  language: string
  price: string
  originalPrice: string
  duration: string
  thumbnail?: File
  thumbnailPreview?: string
  whatYoullLearn: string[]
  requirements: string[]
  modules: Module[]
}

export default function TeachingPage() {
  const [currentStep, setCurrentStep] = useState(1)
  const [courseData, setCourseData] = useState<CourseData>({
    title: "",
    subtitle: "",
    description: "",
    category: "",
    level: "",
    language: "English",
    price: "",
    originalPrice: "",
    duration: "",
    whatYoullLearn: [""],
    requirements: [""],
    modules: [
      {
        id: "1",
        title: "",
        description: "",
        lessons: [
          {
            id: "1",
            title: "",
            duration: "",
            description: "",
            resources: [],
          },
        ],
      },
    ],
  })

  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)

  const totalSteps = 4

  const handleThumbnailChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setCourseData((prev) => ({
        ...prev,
        thumbnail: file,
        thumbnailPreview: URL.createObjectURL(file),
      }))
    }
  }

  const handleVideoUpload = async (moduleIndex: number, lessonIndex: number, file: File) => {
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons[lessonIndex].videoFile = file
    newModules[moduleIndex].lessons[lessonIndex].isUploading = true
    newModules[moduleIndex].lessons[lessonIndex].uploadProgress = 0

    setCourseData((prev) => ({ ...prev, modules: newModules }))

    // Simulate upload progress
    const interval = setInterval(() => {
      setCourseData((prev) => {
        const updatedModules = [...prev.modules]
        const currentProgress = updatedModules[moduleIndex].lessons[lessonIndex].uploadProgress || 0
        if (currentProgress < 100) {
          updatedModules[moduleIndex].lessons[lessonIndex].uploadProgress = currentProgress + 10
        } else {
          updatedModules[moduleIndex].lessons[lessonIndex].isUploading = false
          updatedModules[moduleIndex].lessons[lessonIndex].videoUrl = URL.createObjectURL(file)
          clearInterval(interval)
        }
        return { ...prev, modules: updatedModules }
      })
    }, 200)
  }

  const addModule = () => {
    const newModule: Module = {
      id: Date.now().toString(),
      title: "",
      description: "",
      lessons: [
        {
          id: Date.now().toString(),
          title: "",
          duration: "",
          description: "",
          resources: [],
        },
      ],
    }
    setCourseData((prev) => ({
      ...prev,
      modules: [...prev.modules, newModule],
    }))
  }

  const addLesson = (moduleIndex: number) => {
    const newLesson: Lesson = {
      id: Date.now().toString(),
      title: "",
      duration: "",
      description: "",
      resources: [],
    }
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons.push(newLesson)
    setCourseData((prev) => ({ ...prev, modules: newModules }))
  }

  const removeLesson = (moduleIndex: number, lessonIndex: number) => {
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons.splice(lessonIndex, 1)
    setCourseData((prev) => ({ ...prev, modules: newModules }))
  }

  const addLearningObjective = () => {
    setCourseData((prev) => ({
      ...prev,
      whatYoullLearn: [...prev.whatYoullLearn, ""],
    }))
  }

  const addRequirement = () => {
    setCourseData((prev) => ({
      ...prev,
      requirements: [...prev.requirements, ""],
    }))
  }

  const handleResourceUpload = (moduleIndex: number, lessonIndex: number, files: FileList) => {
    const newModules = [...courseData.modules]
    const newResources = Array.from(files)
    newModules[moduleIndex].lessons[lessonIndex].resources.push(...newResources)
    setCourseData((prev) => ({ ...prev, modules: newModules }))
  }

  const removeResource = (moduleIndex: number, lessonIndex: number, resourceIndex: number) => {
    const newModules = [...courseData.modules]
    newModules[moduleIndex].lessons[lessonIndex].resources.splice(resourceIndex, 1)
    setCourseData((prev) => ({ ...prev, modules: newModules }))
  }
    const { data: session } = useSession();

// Helper to convert File to base64 data URI

// Helper to convert File to base64 data URI
function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => resolve(reader.result as string);
    reader.onerror = (error) => reject(error);
  });
}

const handleSubmit = async () => {
  setIsSubmitting(true);
  setUploadProgress(0);

  try {
    if (!session) {
      console.error("User not logged in");
      setIsSubmitting(false);
      return;
    }

    // Convert thumbnail file to base64 if it exists
    let thumbnailBase64 = null;
    if (courseData.thumbnail && courseData.thumbnail instanceof File) {
      thumbnailBase64 = await fileToBase64(courseData.thumbnail);
    }

    const modulesWithBase64 = await Promise.all(
      courseData.modules.map(async (module: any) => {
        const lessonsWithBase64 = await Promise.all(
          module.lessons.map(async (lesson: any) => {
            let videoFileBase64 = null;

            // Check if videoFile exists before accessing it
            if (lesson.videoFile && lesson.videoFile instanceof File) {
              videoFileBase64 = await fileToBase64(lesson.videoFile);
            }

            // Map over resources if defined, else empty array
            const resourcesWithBase64 = lesson.resources
              ? await Promise.all(
                  lesson.resources.map(async (resource: any) => {
                    if (resource instanceof File) {
                      const base64 = await fileToBase64(resource);
                      return {
                        base64,
                        name: resource.name,
                        type: resource.type,
                        size: resource.size,
                      };
                    }
                    return resource; // already in expected format
                  })
                )
              : [];

            return {
              ...lesson,
              videoFile: videoFileBase64
                ? {
                    base64: videoFileBase64,
                    name: lesson.videoFile.name,
                    type: lesson.videoFile.type,
                  }
                : undefined,
              resources: resourcesWithBase64,
            };
          })
        );

        return { ...module, lessons: lessonsWithBase64 };
      })
    );

    const payload = {
      ...courseData,
      thumbnail: thumbnailBase64
        ? {
            base64: thumbnailBase64,
            name: courseData?.thumbnail?.name ?? "",
            type: courseData?.thumbnail?.type ?? "",
          }
        : undefined,
      modules: modulesWithBase64,
    };

    const response = await fetch("/api/courses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });

    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || "Failed to create course");
    }

    const data = await response.json();
    console.log("Course created:", data);

    // Redirect to /courses page after successful course creation
    window.location.href = "/courses";
  } catch (err) {
    console.error("Error submitting course:", err);
    setIsSubmitting(false);
    setUploadProgress(0);
  }
};




  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Course Landing Page</h3>
              <p className="text-muted-foreground mb-6">
                Your course landing page is crucial to your success on Udemy. If it's done right, it can also help you
                gain visibility in search engines like Google.
              </p>
            </div>

            <div className="space-y-4">
              <div>
                <Label htmlFor="title">Course title *</Label>
                <Input
                  id="title"
                  placeholder="Insert your course title."
                  value={courseData.title}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, title: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Your title should be a mix of attention-grabbing, informative, and optimized for search
                </p>
              </div>

              <div>
                <Label htmlFor="subtitle">Course subtitle *</Label>
                <Input
                  id="subtitle"
                  placeholder="Insert your course subtitle."
                  value={courseData.subtitle}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, subtitle: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">
                  Use 1 or 2 related keywords, and mention 3-4 of the most important areas that you'll teach.
                </p>
              </div>

              <div>
                <Label htmlFor="description">Course description *</Label>
                <Textarea
                  id="description"
                  placeholder="Insert your course description."
                  value={courseData.description}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, description: e.target.value }))}
                  rows={6}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">Description should have minimum 200 words.</p>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <Label htmlFor="category">Category *</Label>
                  <Select
                    value={courseData.category}
                    onValueChange={(value) => setCourseData((prev) => ({ ...prev, category: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a category" />
                    </SelectTrigger>
                    <SelectContent>
                      {categories.map((cat) => (
                        <SelectItem key={cat} value={cat}>
                          {cat}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="level">Level *</Label>
                  <Select
                    value={courseData.level}
                    onValueChange={(value) => setCourseData((prev) => ({ ...prev, level: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a level" />
                    </SelectTrigger>
                    <SelectContent>
                      {levels.map((level) => (
                        <SelectItem key={level} value={level}>
                          {level}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="language">Language *</Label>
                  <Select
                    value={courseData.language}
                    onValueChange={(value) => setCourseData((prev) => ({ ...prev, language: value }))}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Choose a language" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="English">English</SelectItem>
                      <SelectItem value="Spanish">Spanish</SelectItem>
                      <SelectItem value="French">French</SelectItem>
                      <SelectItem value="German">German</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <div>
                <Label htmlFor="thumbnail">Course image</Label>
                <div className="mt-1 flex items-center gap-4">
                  <div className="flex-1">
                    <Input id="thumbnail" type="file" accept="image/*" onChange={handleThumbnailChange} />
                    <p className="text-sm text-muted-foreground mt-1">
                      Upload your course image here. It must meet our course image quality standards to be accepted.
                      Important guidelines: 750x422 pixels; .jpg, .jpeg,. gif, or .png. no text on the image.
                    </p>
                  </div>
                  {courseData.thumbnailPreview && (
                    <div className="w-32 h-18 rounded-lg overflow-hidden border">
                      <Image
                        src={courseData.thumbnailPreview || "/placeholder.svg"}
                        alt="Course thumbnail"
                        width={128}
                        height={72}
                        className="w-full h-full object-cover"
                      />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )

      case 2:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">What will students learn in your course?</h3>
              <p className="text-muted-foreground mb-6">
                You must enter at least 4 learning objectives or outcomes that learners can expect to achieve after
                completing your course.
              </p>
            </div>

            <div className="space-y-4">
              <Label>What will students learn in your course? *</Label>
              {courseData.whatYoullLearn.map((objective, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Example: Define the roles and responsibilities of a project manager"
                    value={objective}
                    onChange={(e) => {
                      const newObjectives = [...courseData.whatYoullLearn]
                      newObjectives[index] = e.target.value
                      setCourseData((prev) => ({ ...prev, whatYoullLearn: newObjectives }))
                    }}
                  />
                  {courseData.whatYoullLearn.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newObjectives = [...courseData.whatYoullLearn]
                        newObjectives.splice(index, 1)
                        setCourseData((prev) => ({ ...prev, whatYoullLearn: newObjectives }))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addLearningObjective}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add more to your response
              </Button>
            </div>

            <div className="space-y-4">
              <Label>What are the requirements or prerequisites for taking your course?</Label>
              <p className="text-sm text-muted-foreground">
                List the required skills, experience, tools or equipment learners should have prior to taking your
                course.
              </p>
              {courseData.requirements.map((requirement, index) => (
                <div key={index} className="flex items-center gap-2">
                  <Input
                    placeholder="Example: No programming experience needed. You will learn everything you need to know"
                    value={requirement}
                    onChange={(e) => {
                      const newRequirements = [...courseData.requirements]
                      newRequirements[index] = e.target.value
                      setCourseData((prev) => ({ ...prev, requirements: newRequirements }))
                    }}
                  />
                  {courseData.requirements.length > 1 && (
                    <Button
                      variant="ghost"
                      size="icon"
                      onClick={() => {
                        const newRequirements = [...courseData.requirements]
                        newRequirements.splice(index, 1)
                        setCourseData((prev) => ({ ...prev, requirements: newRequirements }))
                      }}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              ))}
              <Button variant="outline" onClick={addRequirement}>
                <PlusCircle className="h-4 w-4 mr-2" />
                Add more to your response
              </Button>
            </div>
          </div>
        )

      case 3:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Curriculum</h3>
              <p className="text-muted-foreground mb-6">
                Start putting together your course by creating sections, lectures and practice activities (quizzes,
                coding exercises and assignments).
              </p>
            </div>

            <div className="space-y-6">
              {courseData.modules.map((module, moduleIndex) => (
                <Card key={module.id} className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-center gap-4">
                      <div className="flex-1 space-y-2">
                        <Input
                          placeholder={`Section ${moduleIndex + 1}: Enter a Title`}
                          value={module.title}
                          onChange={(e) => {
                            const newModules = [...courseData.modules]
                            newModules[moduleIndex].title = e.target.value
                            setCourseData((prev) => ({ ...prev, modules: newModules }))
                          }}
                          className="font-medium"
                        />
                        <Input
                          placeholder="What will students be able to do at the end of this section?"
                          value={module.description}
                          onChange={(e) => {
                            const newModules = [...courseData.modules]
                            newModules[moduleIndex].description = e.target.value
                            setCourseData((prev) => ({ ...prev, modules: newModules }))
                          }}
                          className="text-sm"
                        />
                      </div>
                      {courseData.modules.length > 1 && (
                        <Button
                          variant="ghost"
                          size="icon"
                          onClick={() => {
                            const newModules = [...courseData.modules]
                            newModules.splice(moduleIndex, 1)
                            setCourseData((prev) => ({ ...prev, modules: newModules }))
                          }}
                        >
                          <Trash2 className="h-4 w-4" />
                        </Button>
                      )}
                    </div>

                    <div className="pl-4 border-l-2 border-muted space-y-4">
                      {module.lessons.map((lesson, lessonIndex) => (
                        <Card key={lesson.id} className="p-4 bg-muted/30">
                          <div className="space-y-4">
                            <div className="flex items-center gap-2">
                              <Video className="h-4 w-4 text-muted-foreground" />
                              <Input
                                placeholder={`Lecture ${lessonIndex + 1}: Enter a Title`}
                                value={lesson.title}
                                onChange={(e) => {
                                  const newModules = [...courseData.modules]
                                  newModules[moduleIndex].lessons[lessonIndex].title = e.target.value
                                  setCourseData((prev) => ({ ...prev, modules: newModules }))
                                }}
                                className="flex-1"
                              />
                              <Input
                                placeholder="Duration"
                                value={lesson.duration}
                                onChange={(e) => {
                                  const newModules = [...courseData.modules]
                                  newModules[moduleIndex].lessons[lessonIndex].duration = e.target.value
                                  setCourseData((prev) => ({ ...prev, modules: newModules }))
                                }}
                                className="w-24"
                              />
                              {module.lessons.length > 1 && (
                                <Button
                                  variant="ghost"
                                  size="icon"
                                  onClick={() => removeLesson(moduleIndex, lessonIndex)}
                                >
                                  <Trash2 className="h-4 w-4" />
                                </Button>
                              )}
                            </div>

                            <Textarea
                              placeholder="Enter a description for this lecture..."
                              value={lesson.description}
                              onChange={(e) => {
                                const newModules = [...courseData.modules]
                                newModules[moduleIndex].lessons[lessonIndex].description = e.target.value
                                setCourseData((prev) => ({ ...prev, modules: newModules }))
                              }}
                              rows={2}
                            />

                            {/* Video Upload */}
                            <div className="space-y-2">
                              <Label>Video Content</Label>
                              {!lesson.videoFile && !lesson.videoUrl ? (
                                <div className="border-2 border-dashed border-muted-foreground/25 rounded-lg p-6 text-center">
                                  <Upload className="h-8 w-8 mx-auto mb-2 text-muted-foreground" />
                                  <p className="text-sm text-muted-foreground mb-2">Select video files to upload</p>
                                  <Input
                                    type="file"
                                    accept="video/*"
                                    onChange={(e) => {
                                      if (e.target.files && e.target.files[0]) {
                                        handleVideoUpload(moduleIndex, lessonIndex, e.target.files[0])
                                      }
                                    }}
                                    className="max-w-xs mx-auto"
                                  />
                                </div>
                              ) : lesson.isUploading ? (
                                <div className="space-y-2">
                                  <div className="flex items-center gap-2">
                                    <Video className="h-4 w-4" />
                                    <span className="text-sm">Uploading video...</span>
                                  </div>
                                  <Progress value={lesson.uploadProgress || 0} className="w-full" />
                                </div>
                              ) : (
                                <div className="flex items-center gap-2 p-2 bg-green-50 rounded-lg">
                                  <CheckCircle className="h-4 w-4 text-green-600" />
                                  <span className="text-sm text-green-700">Video uploaded successfully</span>
                                  <Button
                                    variant="ghost"
                                    size="sm"
                                    onClick={() => {
                                      const newModules = [...courseData.modules]
                                      delete newModules[moduleIndex].lessons[lessonIndex].videoFile
                                      delete newModules[moduleIndex].lessons[lessonIndex].videoUrl
                                      setCourseData((prev) => ({ ...prev, modules: newModules }))
                                    }}
                                  >
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </div>
                              )}
                            </div>

                            {/* Resources Upload */}
                            <div className="space-y-2">
                              <Label>Additional Resources</Label>
                              <div className="flex items-center gap-2">
                                <Input
                                  type="file"
                                  multiple
                                  accept=".pdf,.doc,.docx,.ppt,.pptx,.zip"
                                  onChange={(e) => {
                                    if (e.target.files) {
                                      handleResourceUpload(moduleIndex, lessonIndex, e.target.files)
                                    }
                                  }}
                                  className="flex-1"
                                />
                              </div>
                              {lesson.resources.length > 0 && (
                                <div className="space-y-1">
                                  {lesson.resources.map((resource, resourceIndex) => (
                                    <div key={resourceIndex} className="flex items-center gap-2 p-2 bg-muted rounded">
                                      <FileText className="h-4 w-4" />
                                      <span className="text-sm flex-1 truncate">{resource.name}</span>
                                      <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => removeResource(moduleIndex, lessonIndex, resourceIndex)}
                                      >
                                        <Trash2 className="h-4 w-4" />
                                      </Button>
                                    </div>
                                  ))}
                                </div>
                              )}
                            </div>
                          </div>
                        </Card>
                      ))}

                      <Button variant="outline" onClick={() => addLesson(moduleIndex)} className="w-full">
                        <PlusCircle className="h-4 w-4 mr-2" />
                        Add Lecture
                      </Button>
                    </div>
                  </div>
                </Card>
              ))}

              <Button variant="outline" onClick={addModule} className="w-full bg-transparent">
                <PlusCircle className="h-4 w-4 mr-2" />
                Add Section
              </Button>
            </div>
          </div>
        )

      case 4:
        return (
          <div className="space-y-6">
            <div>
              <h3 className="text-xl font-semibold mb-4">Pricing</h3>
              <p className="text-muted-foreground mb-6">
                Please select the currency and the price tier for your course. If you'd like to offer your course for
                free, it must have a total video length of less than 2 hours.
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <Label htmlFor="price">Course Price (USD) *</Label>
                <Input
                  id="price"
                  type="number"
                  placeholder="29.99"
                  value={courseData.price}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, price: e.target.value }))}
                  className="mt-1"
                />
              </div>

              <div>
                <Label htmlFor="originalPrice">Original Price (Optional)</Label>
                <Input
                  id="originalPrice"
                  type="number"
                  placeholder="99.99"
                  value={courseData.originalPrice}
                  onChange={(e) => setCourseData((prev) => ({ ...prev, originalPrice: e.target.value }))}
                  className="mt-1"
                />
                <p className="text-sm text-muted-foreground mt-1">Set a higher original price to show discount</p>
              </div>
            </div>

            <div>
              <Label htmlFor="duration">Total Course Duration</Label>
              <Input
                id="duration"
                placeholder="25 hours"
                value={courseData.duration}
                onChange={(e) => setCourseData((prev) => ({ ...prev, duration: e.target.value }))}
                className="mt-1"
              />
            </div>

            <Alert>
              <AlertDescription>
                Your course will be reviewed by our team before it goes live. This process typically takes 1-2 business
                days.
              </AlertDescription>
            </Alert>
          </div>
        )

      default:
        return null
    }
  }

  return (
    <div className="min-h-screen bg-background">

      <div className="container max-w-4xl py-8">
        {/* Progress Steps */}
        <div className="mb-8">
          <div className="flex items-center justify-between mb-4">
            <h1 className="text-2xl font-bold">Create Course</h1>
            <Badge variant="secondary">
              Step {currentStep} of {totalSteps}
            </Badge>
          </div>
          <div className="flex items-center gap-2">
            {Array.from({ length: totalSteps }, (_, i) => (
              <div key={i} className={`h-2 flex-1 rounded-full ${i + 1 <= currentStep ? "bg-primary" : "bg-muted"}`} />
            ))}
          </div>
        </div>

        {/* Step Content */}
        <Card className="p-8">{renderStepContent()}</Card>

        {/* Navigation */}
        <div className="flex justify-between mt-8">
          <Button
            variant="outline"
            onClick={() => setCurrentStep((prev) => Math.max(1, prev - 1))}
            disabled={currentStep === 1}
          >
            Previous
          </Button>

          {currentStep < totalSteps ? (
            <Button onClick={() => setCurrentStep((prev) => Math.min(totalSteps, prev + 1))}>Continue</Button>
          ) : (
            <Button onClick={handleSubmit} disabled={isSubmitting}>
              {isSubmitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2" />
                  Publishing Course...
                </>
              ) : (
                "Publish Course"
              )}
            </Button>
          )}
        </div>

        {/* Upload Progress */}
        {isSubmitting && (
        
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium">Publishing your course...</span>
                </div>
                </div>
            
        
        )}
        </div>
  
    </div>
  )
}
