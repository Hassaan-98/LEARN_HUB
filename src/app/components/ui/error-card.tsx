import * as React from "react"
import { AlertCircle, AlertTriangle, Info } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "./card"
import { Button } from "./button"
import Link from "next/link"

interface ErrorCardProps {
  title: string
  description: string
  errorType?: "error" | "warning" | "info"
  action?: {
    label: string
    href: string
  }
  onRetry?: () => void
}

export function ErrorCard({ title, description, errorType = "error", action, onRetry }: ErrorCardProps) {
  const getIcon = () => {
    switch (errorType) {
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      case "info":
        return <Info className="h-5 w-5 text-blue-500" />
      default:
        return <AlertCircle className="h-5 w-5 text-destructive" />
    }
  }

  const getCardClass = () => {
    switch (errorType) {
      case "warning":
        return "border-yellow-500/50 bg-yellow-50 dark:bg-yellow-950/30"
      case "info":
        return "border-blue-500/50 bg-blue-50 dark:bg-blue-950/30"
      default:
        return "border-destructive/50 bg-destructive/5 dark:bg-destructive/10"
    }
  }

  return (
    <Card className={getCardClass()}>
      <CardHeader className="flex flex-row items-center gap-2">
        {getIcon()}
        <CardTitle className="text-xl">{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <p className="text-muted-foreground mb-4">{description}</p>
        <div className="flex gap-2">
          {onRetry && (
            <Button variant="outline" onClick={onRetry}>
              Try Again
            </Button>
          )}
          {action && (
            <Button asChild>
              <Link href={action.href}>{action.label}</Link>
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}