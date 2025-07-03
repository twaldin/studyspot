import { Settings, User } from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"

export function AppRightSidebar() {
  return (
    <Sidebar side="right">
      <SidebarHeader className="border-b border-sidebar-border flex flex-col gap-4 p-4">
        <div className="flex items-center justify-end gap-4">
          <Button variant="outline" size="icon">
            <Settings className="h-4 w-4" />
          </Button>
          <Button variant="outline" className="gap-2">
            <User className="h-4 w-4" />
            Reed Grenager
          </Button>
        </div>
      </SidebarHeader>
      <SidebarContent>
        {/* Placeholder for future content */}
      </SidebarContent>
    </Sidebar>
  )
} 