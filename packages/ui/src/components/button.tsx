import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva, type VariantProps } from "class-variance-authority"

import { cn } from "@workspace/ui/lib/utils"
import { GradientBorder } from "./gradient-border"

const buttonVariants = cva(
  "inline-flex items-center justify-center gap-2 whitespace-nowrap rounded-md text-sm font-medium transition-all disabled:pointer-events-none disabled:opacity-50 [&_svg]:pointer-events-none [&_svg:not([class*='size-'])]:size-4 shrink-0 [&_svg]:shrink-0 outline-none focus-visible:border-ring focus-visible:ring-ring/50 focus-visible:ring-[3px] aria-invalid:ring-destructive/20 dark:aria-invalid:ring-destructive/40 aria-invalid:border-destructive",
  {
    variants: {
      variant: {
        /* My Styles */
        primary:
          // "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
          "bg-[var(--primary-button-bg)] text-primary-foreground shadow-xs hover:bg-[var(--primary-button-bg)]/90",
        secondary:
          "bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        /* Shadcn Styles */
        default:
          "bg-primary text-primary-foreground shadow-xs hover:bg-primary/90",
        destructive:
          "bg-destructive text-white shadow-xs hover:bg-destructive/90 focus-visible:ring-destructive/20 dark:focus-visible:ring-destructive/40 dark:bg-destructive/60",
        outline:
          "border bg-background shadow-xs hover:bg-accent hover:text-accent-foreground dark:bg-input/30 dark:border-input dark:hover:bg-input/50",
        /* secondary: */
        flat:
          "bg-secondary text-secondary-foreground shadow-xs hover:bg-secondary/80",
        ghost:
          "hover:bg-accent hover:text-accent-foreground dark:hover:bg-accent/50",
        link: "text-primary underline-offset-4 hover:underline",
      },
      size: {
        default: "h-9 px-4 py-2 has-[>svg]:px-3",
        sm: "h-8 rounded-md gap-1.5 px-3 has-[>svg]:px-2.5",
        lg: "h-10 rounded-md px-6 has-[>svg]:px-4",
        icon: "size-9",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  }
)

function Button({
  className,
  variant,
  size,
  asChild = false,
  ...props
}: React.ComponentProps<"button"> &
  VariantProps<typeof buttonVariants> & {
    asChild?: boolean
  }) {
  const Comp = asChild ? Slot : "button"

  const isGradient = variant === "primary" || variant === "secondary"

  const buttonElement = (
    <Comp
      data-slot="button"
      className={cn(buttonVariants({ variant, size, className }))}
      {...props}
    />
  )

  // Apply gradient border for primary and secondary variants
  if (isGradient) {
    const gradientBorderElement = (
      <GradientBorder
        variant={variant as "primary" | "secondary"}
        className={cn(
          {
            "shadow-[0_3px_0_0_var(--secondary-button-border-bottom),0_1px_2px_0_rgb(0_0_0/0.1)]":
              variant === "secondary",
            "shadow-[0_3px_0_0_var(--primary-button-border-bottom),0_1px_2px_0_rgb(0_0_0/0.1)]":
              variant === "primary",
          },
          !props.disabled && {
            "hover:shadow-[0_4px_0_0_var(--secondary-button-border-bottom),0_2px_3px_0_rgb(0_0_0/0.12)]":
              variant === "secondary",
            "hover:shadow-[0_4px_0_0_var(--primary-button-border-bottom),0_2px_3px_0_rgb(0_0_0/0.12)]":
              variant === "primary",
          },
          !props.disabled &&
            "transition-all duration-150 ease-in-out hover:-translate-y-[1px] has-[[data-slot=button]]:active:translate-y-[3px] has-[[data-slot=button]]:active:shadow-none"
        )}
      >
        {buttonElement}
      </GradientBorder>
    )

    // Add layout wrapper that affects DOM layout with 3px bottom space
    return (
      <div className={cn("pb-[3px] grid", className?.includes("w-full") && "w-full")}>
        {gradientBorderElement}
      </div>
    )
  }

  return buttonElement
}

export { Button, buttonVariants }
