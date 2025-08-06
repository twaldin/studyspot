import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@studyspot/ui/lib/utils"

const gradientBorderVariants = cva(
  // Base styles that are always applied
  "relative p-[0.0625rem] rounded-[0.5625rem]",
  {
    variants: {
      variant: {
        primary: "bg-gradient-to-t from-[var(--primary-button-border-bottom)] to-[var(--primary-button-border-top)]",
        secondary: "bg-gradient-to-t from-[var(--secondary-button-border-bottom)] to-[var(--secondary-button-border-top)]",
      },
    },
    defaultVariants: {
      variant: "secondary",
    },
  }
)

interface GradientBorderProps extends VariantProps<typeof gradientBorderVariants> {
  children: React.ReactNode
  className?: string
}

export function GradientBorder({ children, className, variant }: GradientBorderProps) {
  return (
    <div
      className={cn(
        gradientBorderVariants({ variant }),
        className
      )}
    >
      {/* Inner container that covers the gradient, leaving only the border visible */}
      <div className="bg-background rounded-[0.5rem] h-full w-full grid">
        {children}
      </div>
    </div>
  )
} 