"use client"

import * as React from "react"
import { Settings, User } from "lucide-react"
import { Button } from "@/components/ui/button"

export function AppRightSidebar() {
  return (
    <div className="hidden lg:flex flex-col w-72 border-l border-sidebar-border">
      <div className="border-b border-sidebar-border flex flex-col gap-4 p-4">
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Reed Grenager
          </Button>
        </div>
      </div>
      <div className="flex-1">
        {/* Placeholder for future content */}
      </div>
    </div>
  )
} 