"use client"

import { Button } from "@studyspot/ui/components/button"
import React, { type ButtonHTMLAttributes } from "react"
import { ChevronDown } from "lucide-react"
import { cn } from "@studyspot/ui/lib/utils"

interface ScrollToBottomButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  isAtBottom: boolean
  scrollToBottom: () => void
}

export const ScrollToBottomButton = ({
  isAtBottom,
  scrollToBottom,
  className,
  ...props
}: ScrollToBottomButtonProps) => {
  return (
    <Button
      variant="flat"
      size="sm"
      className={cn(
        "absolute bottom-24 right-1/2 z-10 translate-x-1/2 rounded-full bg-background text-secondary-foreground shadow-lg transition-opacity duration-300",
        isAtBottom ? "opacity-0" : "opacity-100",
        className,
      )}
      onClick={scrollToBottom}
      {...props}
    >
      <ChevronDown className="h-4 w-4" />
      <span>Scroll to bottom</span>
    </Button>
  )
}