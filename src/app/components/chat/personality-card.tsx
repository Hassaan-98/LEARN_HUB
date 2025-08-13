"use client"

import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { useRouter } from "next/navigation"
import type { Personality } from "../../../lib/personalities"

interface PersonalityCardProps {
  personality: Personality
}

const colorVariants = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  green: "bg-green-500/10 text-green-700 dark:text-green-300",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  red: "bg-red-500/10 text-red-700 dark:text-red-300",
}

export function PersonalityCard({ personality }: PersonalityCardProps) {
  const router = useRouter()

  const handleChatNow = () => {
    router.push(`/chat/${personality.id}`)
  }

  return (
    <Card className="group hover:shadow-lg transition-all duration-300 hover:-translate-y-1 bg-card border-border">
      <CardHeader className="pb-4">
        <div className="flex items-center gap-3 mb-3">
          <Avatar className="h-12 w-12">
            <AvatarImage src={personality.avatar || "/placeholder.svg"} alt={personality.title} />
            <AvatarFallback className={colorVariants[personality.color as keyof typeof colorVariants]}>
              {personality.title
                .split(" ")
                .map((word) => word[0])
                .join("")
                .slice(0, 2)}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="text-lg font-semibold text-card-foreground group-hover:text-primary transition-colors">
              {personality.title}
            </CardTitle>
          </div>
        </div>
        <CardDescription className="text-sm text-muted-foreground leading-relaxed">
          {personality.description}
        </CardDescription>
      </CardHeader>

      <CardContent className="pb-4">
        <div className="flex flex-wrap gap-2">
          {personality.expertise.slice(0, 3).map((skill) => (
            <Badge
              key={skill}
              variant="secondary"
              className="text-xs bg-secondary/50 text-secondary-foreground hover:bg-secondary/70 transition-colors"
            >
              {skill}
            </Badge>
          ))}
          {personality.expertise.length > 3 && (
            <Badge variant="outline" className="text-xs">
              +{personality.expertise.length - 3} more
            </Badge>
          )}
        </div>
      </CardContent>

      <CardFooter>
        <Button
          onClick={handleChatNow}
          className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-medium transition-all duration-200 hover:shadow-md"
        >
          Chat Now
        </Button>
      </CardFooter>
    </Card>
  )
}
