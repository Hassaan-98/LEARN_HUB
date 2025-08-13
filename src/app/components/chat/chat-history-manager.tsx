"use client"

import { useState } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card"
import { Button } from "../ui/button"
import { Badge } from  "../ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { Trash2, MessageCircle, Calendar } from "lucide-react"
import { useRouter } from "next/navigation"
import { personalities } from "../../../lib/personalities"
import { useChatHistory } from "../../../hooks/use-chat-history"

const colorVariants = {
  blue: "bg-blue-500/10 text-blue-700 dark:text-blue-300",
  green: "bg-green-500/10 text-green-700 dark:text-green-300",
  purple: "bg-purple-500/10 text-purple-700 dark:text-purple-300",
  orange: "bg-orange-500/10 text-orange-700 dark:text-orange-300",
  teal: "bg-teal-500/10 text-teal-700 dark:text-teal-300",
  red: "bg-red-500/10 text-red-700 dark:text-red-300",
}

export function ChatHistoryManager() {
  const router = useRouter()
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const chatHistories = personalities.map((personality) => {
    return {
      personality,
      messages: [],
      clearHistory: () => {},
      lastMessage: null,
      messageCount: 0,
    }
  })

  const { messages: userMessages, clearHistory: userClearHistory } = useChatHistory("user")
  const { messages: aiMessages, clearHistory: aiClearHistory } = useChatHistory("ai")

  const handleClearHistory = async (personalityId: string, clearHistory: () => void) => {
    setDeletingId(personalityId)
    // Add a small delay for better UX
    setTimeout(() => {
      clearHistory()
      setDeletingId(null)
    }, 500)
  }

  const handleContinueChat = (personalityId: string) => {
    router.push(`/chat/${personalityId}`)
  }

  const userHistory = {
    personality: { id: "user", title: "User", avatar: "", color: "blue" },
    messages: userMessages,
    clearHistory: userClearHistory,
    lastMessage: userMessages[userMessages.length - 1],
    messageCount: userMessages.length,
  }

  const aiHistory = {
    personality: { id: "ai", title: "AI", avatar: "", color: "green" },
    messages: aiMessages,
    clearHistory: aiClearHistory,
    lastMessage: aiMessages[aiMessages.length - 1],
    messageCount: aiMessages.length,
  }

  const filteredHistories = [userHistory, aiHistory].filter((history) => history.messageCount > 0)

  if (filteredHistories.length === 0) {
    return (
      <div className="text-center py-12">
        <MessageCircle className="h-16 w-16 mx-auto mb-4 text-muted-foreground" />
        <h3 className="text-lg font-semibold text-foreground mb-2">No Chat History Yet</h3>
        <p className="text-muted-foreground max-w-md mx-auto mb-6">
          Start a conversation with any AI personality to see your chat history here.
        </p>
        <Button onClick={() => router.push("/")} className="bg-primary hover:bg-primary/90 text-primary-foreground">
          Browse AI Personalities
        </Button>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredHistories.map(({ personality, messages, clearHistory, lastMessage, messageCount }) => (
          <Card key={personality.id} className="hover:shadow-lg transition-all duration-300">
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
                <div className="flex-1">
                  <CardTitle className="text-lg font-semibold text-card-foreground">{personality.title}</CardTitle>
                  <div className="flex items-center gap-2 mt-1">
                    <Badge variant="secondary" className="text-xs">
                      {messageCount} messages
                    </Badge>
                  </div>
                </div>
              </div>
            </CardHeader>

            <CardContent className="space-y-4">
              {lastMessage && (
                <div className="bg-muted/50 rounded-lg p-3">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-3 w-3 text-muted-foreground" />
                    <span className="text-xs text-muted-foreground">
                      {lastMessage.timestamp.toLocaleDateString()} at{" "}
                      {lastMessage.timestamp.toLocaleTimeString([], {
                        hour: "2-digit",
                        minute: "2-digit",
                      })}
                    </span>
                  </div>
                  <p className="text-sm text-muted-foreground line-clamp-2">
                    <span className="font-medium">
                      {lastMessage.role === "user" ? "You: " : `${personality.title}: `}
                    </span>
                    {lastMessage.content}
                  </p>
                </div>
              )}

              <div className="flex gap-2">
                <Button
                  onClick={() => handleContinueChat(personality.id)}
                  className="flex-1 bg-primary hover:bg-primary/90 text-primary-foreground"
                >
                  Continue Chat
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleClearHistory(personality.id, clearHistory)}
                  disabled={deletingId === personality.id}
                  className="hover:bg-destructive hover:text-destructive-foreground"
                >
                  {deletingId === personality.id ? (
                    <div className="h-4 w-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
