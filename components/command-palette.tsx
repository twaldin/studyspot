"use client"

import * as React from "react"
import {
  Settings,
  User,
  PanelRight,
  SunMoon,
  MessageCircle,
  CheckCircle,
  XCircle,
  LoaderCircle,
  Info,
} from "lucide-react"
import { useTheme } from "next-themes"
import toast from "react-hot-toast"

import {
  CommandDialog,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
  CommandSeparator,
  CommandShortcut,
} from "@/components/ui/command"
import { useSidebar } from "@/components/ui/sidebar"

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const { toggleSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen((open) => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  const runCommand = React.useCallback((command: () => unknown) => {
    setOpen(false)
    command()
  }, [])

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const spawnToast = React.useCallback((type: "success" | "error" | "loading" | "default") => {
    const messages = {
      success: "Task completed successfully!",
      error: "Something went wrong. Please try again.",
      loading: "Processing your request...",
      default: "Here's a notification for you.",
    }

    switch (type) {
      case "success":
        toast.success(messages.success)
        break
      case "error":
        toast.error(messages.error)
        break
      case "loading":
        toast.loading(messages.loading)
        break
      default:
        toast(messages.default)
        break
    }
  }, [])

  return (
    <CommandDialog open={open} onOpenChange={setOpen}>
      <CommandInput placeholder="Type a command or search..." />
      {/* <CommandList> */}
      <CommandList className="scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <CommandEmpty>No results found.</CommandEmpty>
        <CommandGroup heading="Suggestions">
          <CommandItem onSelect={() => runCommand(toggleTheme)}>
            <SunMoon className="mr-2 h-4 w-4" />
            <span>Toggle Theme</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(toggleSidebar)}>
            <PanelRight className="mr-2 h-4 w-4 rotate-180" />
            <span>Toggle Sidebar</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Toast Testing">
          <CommandItem onSelect={() => runCommand(() => spawnToast("default"))}>
            <MessageCircle className="mr-2 h-4 w-4" />
            <span>Spawn Default Toast</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => spawnToast("success"))}>
            <CheckCircle className="mr-2 h-4 w-4" />
            <span>Spawn Success Toast</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => spawnToast("error"))}>
            <XCircle className="mr-2 h-4 w-4" />
            <span>Spawn Error Toast</span>
          </CommandItem>
          <CommandItem onSelect={() => runCommand(() => spawnToast("loading"))}>
            <LoaderCircle className="mr-2 h-4 w-4" />
            <span>Spawn Loading Toast</span>
          </CommandItem>
        </CommandGroup>
        <CommandSeparator />
        <CommandGroup heading="Settings">
          <CommandItem>
            <User className="mr-2 h-4 w-4" />
            <span>Profile</span>
          </CommandItem>
          <CommandItem>
            <Settings className="mr-2 h-4 w-4" />
            <span>Settings</span>
          </CommandItem>
        </CommandGroup>
      </CommandList>
    </CommandDialog>
  )
} 