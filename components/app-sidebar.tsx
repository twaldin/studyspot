import { FlaskConical, Radical, Pencil, Music, Plus } from "lucide-react"
import StudySpotLogo from "@/components/branding/studyspot-logo"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarHeader,
} from "@/components/ui/sidebar"
import { Button } from "@/components/ui/button"
import { Separator } from "@/components/ui/separator"

// Menu items.
const items = [
  {
    title: "Reaction Mechanisms & Synthesis Problems",
    url: "#",
    icon: FlaskConical,
  },
  {
    title: "Integration by Parts Practice",
    url: "#",
    icon: Radical,
  },
  {
    title: "Series Convergence Tests",
    url: "#",
    icon: Radical,
  },
  {
    title: "Persuasive Essay Structure & Thesis Development",
    url: "#",
    icon: Pencil,
  },
  {
    title: "Bebop vs. Cool Jazz Comparison",
    url: "#",
    icon: Music,
  },
]

export function AppSidebar() {
  return (
    <Sidebar>
      <SidebarHeader className="border-b border-sidebar-border flex flex-col gap-4 p-4">
        <div className="flex items-center justify-start gap-4">
          <Image
            src="/uw-madison-logo.png"
            alt="UW Madison Logo"
            width={40}
            height={40}
            className="h-12 w-auto"
          />
          <Separator orientation="vertical" className="h-8" />
          <StudySpotLogo className="h-10 w-auto" />
        </div>
        <Button className="w-full justify-start gap-2" variant="default">
          <Plus className="h-4 w-4" />
          New Chat
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Past chats</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}