import * as React from "react"

import { cn } from "@studyspot/ui/lib/utils"

const UserMessage = React.forwardRef<
  HTMLDivElement,
  React.HTMLAttributes<HTMLDivElement>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    className={cn(
      "bg-card text-card-foreground rounded-xl border px-3 py-2 shadow-sm text-base md:text-sm whitespace-pre-wrap break-words",
      className
    )}
    {...props}
  />
))
UserMessage.displayName = "UserMessage"

export { UserMessage } 