"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { Button } from "../ui/button"
import { Input } from "../ui/input"
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar"
import { ArrowLeft, Send, Loader2, AlertCircle, Settings } from "lucide-react"
import { useRouter } from "next/navigation"
import type { Personality } from "../../../lib/personalities"
import { ChatMessage } from "./chat-message"
import { useChatHistory } from "../../../hooks/use-chat-history"
import { Alert, AlertDescription } from "../ui/alert"
import { cn } from "@/src/lib/utils"

interface ChatInterfaceProps {
  personality: Personality
}

function TypingIndicator({ personality }: { personality: Personality }) {
  const colorVariants = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
    red: "from-red-500/20 to-red-600/10 border-red-500/30",
  }

  const dotColors = {
    blue: "bg-blue-500",
    green: "bg-green-500",
    purple: "bg-purple-500",
    orange: "bg-orange-500",
    teal: "bg-teal-500",
    red: "bg-red-500",
  }

  return (
    <div className="flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-500">
      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
        <AvatarImage src={personality.avatar || "/placeholder.svg"} alt={personality.title} />
        <AvatarFallback
          className={`bg-gradient-to-br ${colorVariants[personality.color as keyof typeof colorVariants]} text-foreground font-medium`}
        >
          {personality.title
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div
        className={`bg-gradient-to-br ${colorVariants[personality.color as keyof typeof colorVariants]} border rounded-2xl rounded-bl-md px-4 py-3 shadow-lg backdrop-blur-sm`}
      >
        <div className="flex items-center gap-1">
          <div className="flex gap-1">
            <div
              className={`w-2 h-2 ${dotColors[personality.color as keyof typeof dotColors]} rounded-full animate-bounce [animation-delay:-0.3s] shadow-sm`}
            ></div>
            <div
              className={`w-2 h-2 ${dotColors[personality.color as keyof typeof dotColors]} rounded-full animate-bounce [animation-delay:-0.15s] shadow-sm`}
            ></div>
            <div
              className={`w-2 h-2 ${dotColors[personality.color as keyof typeof dotColors]} rounded-full animate-bounce shadow-sm`}
            ></div>
          </div>
          <span className="text-xs text-foreground/80 ml-2 font-medium">AI is writing...</span>
        </div>
      </div>
    </div>
  )
}

function StreamingMessage({
  content,
  personality,
  onComplete,
}: {
  content: string
  personality: Personality
  onComplete: () => void
}) {
  const [displayedContent, setDisplayedContent] = useState("")
  const [currentIndex, setCurrentIndex] = useState(0)
  const [showCursor, setShowCursor] = useState(true)

  const colorVariants = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
    red: "from-red-500/20 to-red-600/10 border-red-500/30",
  }

  useEffect(() => {
    if (currentIndex < content.length) {
      const timer = setTimeout(
        () => {
          setDisplayedContent((prev) => prev + content[currentIndex])
          setCurrentIndex((prev) => prev + 1)
        },
        Math.random() * 50 + 20,
      ) // Variable typing speed between 20-70ms

      return () => clearTimeout(timer)
    } else {
      // Animation complete
      setTimeout(() => {
        setShowCursor(false)
        onComplete()
      }, 500)
    }
  }, [currentIndex, content, onComplete])

  // Cursor blinking effect
  useEffect(() => {
    if (currentIndex < content.length) {
      const cursorTimer = setInterval(() => {
        setShowCursor((prev) => !prev)
      }, 500)
      return () => clearInterval(cursorTimer)
    }
  }, [currentIndex, content.length])

  return (
    <div className="flex items-start gap-3 animate-in slide-in-from-bottom-4 duration-500">
      <Avatar className="h-8 w-8 ring-2 ring-primary/20">
        <AvatarImage src={personality.avatar || "/placeholder.svg"} alt={personality.title} />
        <AvatarFallback
          className={`bg-gradient-to-br ${colorVariants[personality.color as keyof typeof colorVariants]} text-foreground font-medium`}
        >
          {personality.title
            .split(" ")
            .map((word) => word[0])
            .join("")
            .slice(0, 2)}
        </AvatarFallback>
      </Avatar>
      <div
        className={`bg-gradient-to-br ${colorVariants[personality.color as keyof typeof colorVariants]} border rounded-2xl rounded-bl-md px-4 py-3 shadow-lg backdrop-blur-sm max-w-[80%]`}
      >
        <div className="text-sm text-foreground leading-relaxed whitespace-pre-wrap">
          {displayedContent}
          {showCursor && currentIndex < content.length && (
            <span className="inline-block w-0.5 h-4 bg-foreground ml-0.5 animate-pulse" />
          )}
        </div>
      </div>
    </div>
  )
}

export function ChatInterface({ personality }: ChatInterfaceProps) {
  const router = useRouter()
  const [message, setMessage] = useState("")
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isDemoMode, setIsDemoMode] = useState(false)
  const [streamingMessage, setStreamingMessage] = useState<string | null>(null)
  const messagesEndRef = useRef<HTMLDivElement>(null)

  const { messages, addMessage } = useChatHistory(personality.id)

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" })
  }

  useEffect(() => {
    scrollToBottom()
  }, [messages, isLoading])

  const groupedMessages = messages.reduce(
    (acc, message, index) => {
      const prevMessage = messages[index - 1]
      const isGrouped = prevMessage && prevMessage.role === message.role
      acc.push({ ...message, isGrouped })
      return acc
    },
    [] as Array<(typeof messages)[0] & { isGrouped: boolean }>,
  )

  const handleSendMessage = async () => {
    if (!message.trim() || isLoading) return

    const userMessage = message.trim()
    setMessage("")
    setIsLoading(true)
    setError(null)

    // Add user message
    addMessage({
      id: Date.now().toString(),
      content: userMessage,
      role: "user",
      timestamp: new Date(),
    })

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          message: userMessage,
          personalityId: personality.id,
          systemPrompt: personality.systemPrompt,
        }),
      })

      const data = await response.json()

      if (!response.ok) {
        throw new Error(data.error || "Failed to get response")
      }

      if (data.isDemo) {
        setIsDemoMode(true)
      }

      setIsLoading(false)
      setStreamingMessage(data.response)
    } catch (error) {
      console.error("Error sending message:", error)
      const errorMessage = error instanceof Error ? error.message : "An unexpected error occurred"
      setError(errorMessage)
      setIsLoading(false)
    }
  }

  const handleStreamingComplete = () => {
    if (streamingMessage) {
      addMessage({
        id: (Date.now() + 1).toString(),
        content: streamingMessage,
        role: "assistant",
        timestamp: new Date(),
      })
      setStreamingMessage(null)
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault()
      handleSendMessage()
    }
  }

  const colorVariants = {
    blue: "from-blue-500/20 to-blue-600/10 border-blue-500/30",
    green: "from-green-500/20 to-green-600/10 border-green-500/30",
    purple: "from-purple-500/20 to-purple-600/10 border-purple-500/30",
    orange: "from-orange-500/20 to-orange-600/10 border-orange-500/30",
    teal: "from-teal-500/20 to-teal-600/10 border-teal-500/30",
    red: "from-red-500/20 to-red-600/10 border-red-500/30",
  }

  const headerGradients = {
    blue: "from-blue-500/10 via-blue-400/5 to-transparent",
    green: "from-green-500/10 via-green-400/5 to-transparent",
    purple: "from-purple-500/10 via-purple-400/5 to-transparent",
    orange: "from-orange-500/10 via-orange-400/5 to-transparent",
    teal: "from-teal-500/10 via-teal-400/5 to-transparent",
    red: "from-red-500/10 via-red-400/5 to-transparent",
  }

  return (
    <div className="flex flex-col h-screen bg-gradient-to-br from-background via-background to-muted/20">
      <div
        className={`border-b border-border/50 bg-gradient-to-r ${headerGradients[personality.color as keyof typeof headerGradients]} backdrop-blur-xl sticky top-0 z-10 shadow-sm`}
      >
        <div className="container py-4">
          <div className="flex items-center gap-3">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => router.back()}
              className="hover:bg-white/10 dark:hover:bg-black/10 transition-all duration-200 hover:scale-105"
            >
              <ArrowLeft className="h-4 w-4" />
            </Button>

            <Avatar className="h-10 w-10 ring-2 ring-primary/20 shadow-md">
              <AvatarImage src={personality.avatar || "/placeholder.svg"} alt={personality.title} />
              <AvatarFallback
                className={`bg-gradient-to-br ${colorVariants[personality.color as keyof typeof colorVariants]} text-foreground font-semibold`}
              >
                {personality.title
                  .split(" ")
                  .map((word) => word[0])
                  .join("")
                  .slice(0, 2)}
              </AvatarFallback>
            </Avatar>

            <div className="flex-1">
              <div className="flex items-center gap-2">
                <h1 className="font-bold text-foreground bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                  {personality.title}
                </h1>
                {isDemoMode && (
                  <span className="px-2 py-1 text-xs bg-gradient-to-r from-orange-500/20 to-orange-600/10 text-orange-700 dark:text-orange-300 rounded-full border border-orange-500/30 shadow-sm">
                    Demo Mode
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground font-medium">
                {personality.expertise.slice(0, 2).join(" • ")}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto">
        <div className="container py-6">
          {isDemoMode && (
            <Alert className="border-orange-500/30 bg-gradient-to-r from-orange-500/10 to-orange-600/5 mb-6 shadow-md">
              <Settings className="h-4 w-4 text-orange-600" />
              <AlertDescription className="text-orange-800 dark:text-orange-200">
                <strong>Demo Mode:</strong> You're seeing mock responses. To get real AI-powered conversations, add your{" "}
                <code className="bg-orange-500/20 px-1 py-0.5 rounded text-xs font-mono">GEMINI_API_KEY</code> to your
                environment variables.{" "}
                <a
                  href="https://aistudio.google.com/app/apikey"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:no-underline font-medium"
                >
                  Get your free API key here
                </a>
              </AlertDescription>
            </Alert>
          )}

          {error && (
            <Alert
              variant="destructive"
              className="mb-6 bg-gradient-to-r from-red-500/10 to-red-600/5 border-red-500/30 shadow-md"
            >
              <AlertCircle className="h-4 w-4" />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {messages.length === 0 && (
            <div className="text-center py-12">
              <Avatar className="h-16 w-16 mx-auto mb-4 ring-4 ring-primary/20 shadow-lg">
                <AvatarImage src={personality.avatar || "/placeholder.svg"} alt={personality.title} />
                <AvatarFallback
                  className={`bg-gradient-to-br ${colorVariants[personality.color as keyof typeof colorVariants]} text-foreground font-bold text-lg`}
                >
                  {personality.title
                    .split(" ")
                    .map((word) => word[0])
                    .join("")
                    .slice(0, 2)}
                </AvatarFallback>
              </Avatar>
              <h3 className="text-xl font-bold text-foreground mb-2 bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text">
                Start a conversation with {personality.title}
              </h3>
              <p className="text-muted-foreground max-w-md mx-auto font-medium">{personality.description}</p>
            </div>
          )}

          {groupedMessages.map((msg) => (
            <ChatMessage key={msg.id} message={msg} personality={personality} isGrouped={msg.isGrouped} />
          ))}

          {streamingMessage ? (
            <StreamingMessage
              content={streamingMessage}
              personality={personality}
              onComplete={handleStreamingComplete}
            />
          ) : isLoading ? (
            <TypingIndicator personality={personality} />
          ) : null}

          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="border-t border-border/50 bg-gradient-to-r from-card/80 via-card to-card/80 backdrop-blur-xl shadow-lg">
        <div className="container py-4">
          <div className="flex gap-3">
            <div className="flex-1 relative">
              <Input
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                onKeyPress={handleKeyPress}
                placeholder={`Message ${personality.title}...`}
                disabled={isLoading}
                className="pr-12 bg-gradient-to-r from-input to-input/80 border-input/50 focus:ring-2 focus:ring-primary/50 focus:border-primary/50 rounded-xl resize-none min-h-[44px] shadow-sm transition-all duration-200 hover:shadow-md font-medium"
              />
            </div>
            <Button
              onClick={handleSendMessage}
              disabled={!message.trim() || isLoading}
              className={cn(
                "bg-gradient-to-r from-primary to-primary/90 hover:from-primary/90 hover:to-primary text-primary-foreground rounded-xl px-4 transition-all duration-200 shadow-md hover:shadow-lg",
                !message.trim() || isLoading ? "opacity-50" : "hover:scale-105 active:scale-95",
              )}
            >
              {isLoading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Send className="h-4 w-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
