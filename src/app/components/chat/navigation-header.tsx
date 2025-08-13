"use client"

import { Button } from "../ui/button"
import { History, Home } from "lucide-react"
import { useRouter, usePathname } from "next/navigation"

export function NavigationHeader() {
  const router = useRouter()
  const pathname = usePathname()

  if (pathname.startsWith("/chat/")) {
    return null // Don't show navigation in chat pages
  }

  return (
    <div className="border-b border-border bg-card/50 backdrop-blur-sm sticky top-0 z-10">
      <div className="container py-4">
        <div className="flex items-center justify-between">
          <h1 className="text-xl font-bold text-foreground">AI Personality Hub</h1>

          <div className="flex gap-2">
            <Button
              variant={pathname === "/" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/")}
              className="flex items-center gap-2"
            >
              <Home className="h-4 w-4" />
              Personalities
            </Button>
            <Button
              variant={pathname === "/history" ? "default" : "ghost"}
              size="sm"
              onClick={() => router.push("/history")}
              className="flex items-center gap-2"
            >
              <History className="h-4 w-4" />
              History
            </Button>
          </div>
        </div>
      </div>
    </div>
  )
}
