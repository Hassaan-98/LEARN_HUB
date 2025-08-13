import * as React from "react"
import { cn } from "@/src/lib/utils"
import { Container } from "./container"

interface SectionProps extends React.HTMLAttributes<HTMLElement> {
  containerSize?: "default" | "sm" | "lg" | "xl" | "narrow" | "fluid"
  padding?: "none" | "sm" | "md" | "lg" | "xl"
  background?: "default" | "muted" | "primary" | "secondary"
}

const Section = React.forwardRef<HTMLElement, SectionProps>(
  ({ className, containerSize = "default", padding = "lg", background = "default", children, ...props }, ref) => {
    const paddingClasses = {
      none: "",
      sm: "py-8 md:py-12",
      md: "py-12 md:py-16",
      lg: "py-16 md:py-24",
      xl: "py-20 md:py-32",
    }

    const backgroundClasses = {
      default: "",
      muted: "bg-muted/30",
      primary: "bg-primary text-primary-foreground",
      secondary: "bg-secondary text-secondary-foreground",
    }

    return (
      <section
        ref={ref}
        className={cn("w-full", paddingClasses[padding], backgroundClasses[background], className)}
        {...props}
      >
        <Container size={containerSize}>{children}</Container>
      </section>
    )
  },
)
Section.displayName = "Section"

export { Section }
