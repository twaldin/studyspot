import * as React from "react"

import { cn } from "@/lib/utils"

interface AssistantMessageProps extends React.HTMLAttributes<HTMLDivElement> {
  isThinking?: boolean;
  isStreaming?: boolean;
}

const AssistantMessage = React.forwardRef<
  HTMLDivElement,
  AssistantMessageProps
>(({ className, isThinking, isStreaming, children, ...props }, ref) => {
  const content = React.useMemo(() => {
    // Show thinking indicator when no content yet
    if (isThinking && !children) {
      return (
        <div className="flex items-center gap-1.5">
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce"></div>
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          <div className="w-1.5 h-1.5 bg-current rounded-full animate-bounce" style={{ animationDelay: '0.4s' }}></div>
        </div>
      );
    }

    // Show content with pencil animation during streaming
    if (isStreaming && children) {
      return (
        <div className="inline">
          {children}
          <svg 
            className="inline-block h-4 w-4 animate-pulse ml-1" 
            xmlns="http://www.w3.org/2000/svg" 
            width="24" 
            height="24" 
            viewBox="0 0 24 24" 
            fill="none" 
            stroke="currentColor" 
            strokeWidth="2" 
            strokeLinecap="round" 
            strokeLinejoin="round"
          >
            <path d="M17 3a2.828 2.828 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3z"></path>
            <path d="m15 5 4 4"></path>
          </svg>
        </div>
      );
    }

    // Show normal content
    return children;
  }, [isThinking, isStreaming, children]);

  return (
    <div
      ref={ref}
      className={cn("text-card-foreground text-base md:text-sm whitespace-pre-wrap break-words", className)}
      {...props}
    >
      {content}
    </div>
  );
});
AssistantMessage.displayName = "AssistantMessage"

export { AssistantMessage } 