import * as React from "react"
import { cn } from "@/src/lib/utils"

interface ContainerProps extends React.HTMLAttributes<HTMLDivElement> {
  size?: "default" | "sm" | "lg" | "xl" | "narrow" | "fluid"
}

const Container = React.forwardRef<HTMLDivElement, ContainerProps>(({ className, size = "default", ...props }, ref) => {
  const containerClasses = {
    default: "container",
    sm: "container-sm",
    lg: "container-lg",
    xl: "container-xl",
    narrow: "container-narrow",
    fluid: "container-fluid",
  }

  return <div ref={ref} className={cn(containerClasses[size], className)} {...props} />
})
Container.displayName = "Container"

export { Container }
