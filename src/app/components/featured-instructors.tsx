import { Card, CardContent, CardHeader, CardTitle } from "./ui/card"
import { Container } from "./ui/container"
import { Section } from "./ui/section"
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar"
import { Button } from "./ui/button"
import Link from "next/link"

const instructors = [
  {
    name: "Jane Doe",
    title: "Full-Stack Developer",
    avatar:
      "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=80&h=80&auto=format&fit=crop&crop=face",
    description: "Expert in React, Node.js, and database design.",
    link: "/instructors/jane-doe",
  },
  {
    name: "John Smith",
    title: "Data Scientist",
    avatar:
      "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=80&h=80&auto=format&fit=crop&crop=face",
    description: "Specializes in machine learning and data visualization.",
    link: "/instructors/john-smith",
  },
  {
    name: "Emily White",
    title: "UI/UX Designer",
    avatar:
      "https://images.unsplash.com/photo-1580489944761-15a19d654956?q=80&w=80&h=80&auto=format&fit=crop&crop=face",
    description: "Passionate about user-centered design and prototyping.",
    link: "/instructors/emily-white",
  },
  {
    name: "David Green",
    title: "Digital Marketing Strategist",
    avatar:
      "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=80&h=80&auto=format&fit=crop&crop=face",
    description: "Helps businesses grow with effective online campaigns.",
    link: "/instructors/david-green",
  },
]

export function FeaturedInstructors() {
  return (
    <Section>
      <Container>
        <h2 className="text-3xl md:text-4xl font-bold text-center mb-12">Meet Our Expert Instructors</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {instructors.map((instructor) => (
            <Card key={instructor.name} className="text-center flex flex-col items-center p-6">
              <Avatar className="w-24 h-24 mb-4">
                <AvatarImage src={instructor.avatar || "/placeholder.svg"} alt={instructor.name} />
                <AvatarFallback>
                  {instructor.name
                    .split(" ")
                    .map((n) => n[0])
                    .join("")}
                </AvatarFallback>
              </Avatar>
              <CardHeader className="p-0 mb-2">
                <CardTitle className="text-xl">{instructor.name}</CardTitle>
                <p className="text-muted-foreground text-sm">{instructor.title}</p>
              </CardHeader>
              <CardContent className="p-0 flex-1">
                <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">{instructor.description}</p>
              </CardContent>
              <Button asChild variant="outline">
                <Link href={instructor.link}>View Profile</Link>
              </Button>
            </Card>
          ))}
        </div>
      </Container>
    </Section>
  )
}
