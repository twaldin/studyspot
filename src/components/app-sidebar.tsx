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
    <Sidebar collapsible="icon">
      <SidebarHeader className="flex flex-col gap-4 border-b border-sidebar-border p-4">
        <div className="flex items-center justify-start gap-4 group-data-[collapsible=icon]:justify-center">
          <div className="relative h-12 w-auto shrink-0">
            <Image
              src="/uw-madison-logo.png"
              alt="UW Madison Logo"
              width={48}
              height={48}
              className="h-12 w-auto object-contain"
            />
          </div>
          <Separator
            orientation="vertical"
            className="h-8 group-data-[collapsible=icon]:hidden"
          />
          <StudySpotLogo className="h-10 w-auto group-data-[collapsible=icon]:hidden" />
        </div>
        <Button
          className="w-full justify-start gap-2 group-data-[collapsible=icon]:w-fit group-data-[collapsible=icon]:self-center group-data-[collapsible=icon]:justify-center"
          variant="outline"
        >
          <Plus className="h-4 w-4" />
          <span className="group-data-[collapsible=icon]:hidden">New Chat</span>
        </Button>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel className="group-data-[collapsible=icon]:hidden">
            Past Chats
          </SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {items.map((item) => (
                <SidebarMenuItem
                  key={item.title}
                  className="group-data-[collapsible=icon]:hidden"
                >
                  <SidebarMenuButton
                    asChild
                    className="group-data-[collapsible=icon]:justify-center"
                  >
                    <a href={item.url}>
                      <item.icon className="h-4 w-4 shrink-0" />
                      <span className="group-data-[collapsible=icon]:hidden">
                        {item.title}
                      </span>
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