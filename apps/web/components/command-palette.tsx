"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import {
  Home,
  Settings,
  User,
  PanelRight,
  SunMoon,
  MessageCircle,
  CheckCircle,
  XCircle,
  LoaderCircle,
  Info,
  Upload,
  BookOpen,
  PlusCircle,
  Compass,
  MessagesSquare,
  RefreshCw,
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
} from "@studyspot/ui/components/command"
import { useSidebar } from "@/components/ui/sidebar"
import { FileUploadDialog } from "@/components/file-upload-dialog"
import { CreateCourseDialog } from "@/components/create-course-dialog"
import { useIsDeveloper } from "@/hooks/api/user"
import { useDeveloperMode } from "@/contexts/developer-mode-context"
import { useSelectedCourse, useSuggestedQueries } from "@/hooks/api/courses"
import { useQueryClient } from "@tanstack/react-query"
import { queryKeys } from "@/hooks/api/base"

type CommandInfo = {
  id: string
  label: string
  icon: React.ElementType
  action: () => void
  group: string
}

export function CommandPalette() {
  const [open, setOpen] = React.useState(false)
  const [fileUploadDialogOpen, setFileUploadDialogOpen] = React.useState(false)
  const [createCourseDialogOpen, setCreateCourseDialogOpen] =
    React.useState(false)
  const { toggleSidebar } = useSidebar()
  const { theme, setTheme } = useTheme()
  const router = useRouter()
  const [recentCommandIds, setRecentCommandIds] = React.useState<string[]>([])
  const { data: isDeveloper = false } = useIsDeveloper()
  const { isDeveloperModeEnabled, toggleDeveloperMode } = useDeveloperMode()
  const { data: selectedCourse } = useSelectedCourse()
  const queryClient = useQueryClient()

  const toggleTheme = React.useCallback(() => {
    setTheme(theme === "dark" ? "light" : "dark")
  }, [theme, setTheme])

  const openFileUploadDialog = React.useCallback(() => {
    setFileUploadDialogOpen(true)
  }, [])

  const openCreateCourseDialog = React.useCallback(() => {
    setCreateCourseDialogOpen(true)
  }, [])


  const spawnToast = React.useCallback(
    (type: "success" | "error" | "loading" | "default") => {
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
    },
    [],
  )

  const regenerateSuggestedQueries = React.useCallback(async () => {
    if (!selectedCourse) {
      toast.error("No course selected")
      return
    }

    const toastId = toast.loading("Regenerating suggested queries...")
    
    try {
      // First, call our API to get the school ID and check permissions
      const response = await fetch(
        `/api/suggested-queries?courseId=${selectedCourse.id}&refresh=true`,
        {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
        }
      )

      if (!response.ok) {
        throw new Error("Failed to regenerate queries")
      }

      const data = await response.json()
      
      // Check if we got a redirect response (Worker-to-Worker restriction)
      if (data.redirect && data.assistantUrl && data.params) {
        // Call the assistant worker directly from the client
        const assistantResponse = await fetch(
          `${data.assistantUrl}/suggested-queries?` +
          `courseId=${encodeURIComponent(data.params.courseId)}&` +
          `schoolId=${encodeURIComponent(data.params.schoolId)}&` +
          `refresh=true`,
          {
            method: "GET",
            headers: {
              "Content-Type": "application/json",
            },
          }
        )

        if (!assistantResponse.ok) {
          throw new Error("Assistant worker request failed")
        }

        // We don't need to do anything with the response data
        // The hook will automatically refetch from cache
      }

      // Invalidate the queries cache so they get refetched
      await queryClient.invalidateQueries({
        queryKey: queryKeys.courses.suggestedQueries(selectedCourse.id)
      })

      toast.success("Suggested queries regenerated successfully!", { id: toastId })
    } catch (error) {
      toast.error("Failed to regenerate queries", { id: toastId })
      console.error("Error regenerating queries:", error)
    }
  }, [selectedCourse, queryClient])

  const commands: CommandInfo[] = React.useMemo(
    () => [
      {
        id: "go-home",
        label: "Go Home",
        icon: Home,
        action: () => router.push("/"),
        group: "Suggestions",
      },
      {
        id: "toggle-theme",
        label: "Toggle Theme",
        icon: SunMoon,
        action: toggleTheme,
        group: "Suggestions",
      },
      {
        id: "toggle-sidebar",
        label: "Toggle Sidebar",
        icon: PanelRight,
        action: toggleSidebar,
        group: "Suggestions",
      },
      {
        id: "create-course",
        label: "Create Course",
        icon: PlusCircle,
        action: openCreateCourseDialog,
        group: "Suggestions",
      },
      {
        id: "browse-courses",
        label: "Browse Courses",
        icon: PlusCircle,
        action: () => router.push("/courses"),
        group: "Suggestions",
      },
      {
        id: "course-content",
        label: "Course Content",
        icon: BookOpen,
        action: () => router.push("/content"),
        group: "Suggestions",
      },
      {
        id: "upload-file",
        label: "Upload File",
        icon: Upload,
        action: openFileUploadDialog,
        group: "Suggestions",
      },
      {
        id: "go-to-onboarding",
        label: "Go to Onboarding",
        icon: Compass,
        action: () => router.push("/onboarding"),
        group: "Developer Tools",
      },
      {
        id: "spawn-default-toast",
        label: "Spawn Default Toast",
        icon: MessageCircle,
        action: () => spawnToast("default"),
        group: "Developer Tools",
      },
      {
        id: "spawn-success-toast",
        label: "Spawn Success Toast",
        icon: CheckCircle,
        action: () => spawnToast("success"),
        group: "Developer Tools",
      },
      {
        id: "spawn-error-toast",
        label: "Spawn Error Toast",
        icon: XCircle,
        action: () => spawnToast("error"),
        group: "Developer Tools",
      },
      {
        id: "spawn-loading-toast",
        label: "Spawn Loading Toast",
        icon: LoaderCircle,
        action: () => spawnToast("loading"),
        group: "Developer Tools",
      },
      {
        id: "toggle-developer-mode",
        label: isDeveloperModeEnabled ? "Disable Developer Mode" : "Enable Developer Mode",
        icon: Settings,
        action: toggleDeveloperMode,
        group: "Developer Tools",
      },
      {
        id: "regenerate-suggested-queries",
        label: "Regenerate Suggested Queries",
        icon: RefreshCw,
        action: regenerateSuggestedQueries,
        group: "Developer Tools",
      },
      {
        id: "profile",
        label: "Profile",
        icon: User,
        action: () => {
          toast("Profile page not implemented yet.")
        },
        group: "Settings",
      },
      {
        id: "settings",
        label: "Settings",
        icon: Settings,
        action: () => {
          toast("Settings page not implemented yet.")
        },
        group: "Settings",
      },
    ],
    [router, openFileUploadDialog, spawnToast, toggleSidebar, toggleTheme, openCreateCourseDialog, isDeveloperModeEnabled, toggleDeveloperMode, regenerateSuggestedQueries],
  )

  React.useEffect(() => {
    const down = (e: KeyboardEvent) => {
      if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
        e.preventDefault()
        setOpen(open => !open)
      }
    }

    document.addEventListener("keydown", down)
    return () => document.removeEventListener("keydown", down)
  }, [])

  React.useEffect(() => {
    const storedRecent = localStorage.getItem("commandPalette.recent")
    if (storedRecent) {
      setRecentCommandIds(JSON.parse(storedRecent))
    }
  }, [])

  const runCommand = React.useCallback(
    (command: CommandInfo) => {
      setOpen(false)
      command.action()

      const newRecent = [
        command.id,
        ...recentCommandIds.filter(id => id !== command.id),
      ].slice(0, 5)
      setRecentCommandIds(newRecent)
      localStorage.setItem("commandPalette.recent", JSON.stringify(newRecent))
    },
    [recentCommandIds],
  )

  const recentCommands = recentCommandIds
    .map(id => commands.find(cmd => cmd.id === id))
    .filter(Boolean)
    .filter(command => {
      if (!command) return false
      // Hide developer tools from recent commands if user is not a developer
      if (command.group === "Developer Tools" && !isDeveloper) {
        return false
      }
      return true
    }) as CommandInfo[]
  const recentCommandIdsSet = new Set(recentCommandIds)

  const commandGroups = commands
    .filter(command => !recentCommandIdsSet.has(command.id))
    .filter(command => {
      // Hide developer tools if user is not a developer
      if (command.group === "Developer Tools" && !isDeveloper) {
        return false
      }
      return true
    })
    .reduce(
      (acc, command) => {
        if (!acc[command.group]) {
          acc[command.group] = []
        }
        acc[command.group].push(command)
        return acc
      },
      {} as Record<string, CommandInfo[]>,
    )

  return (
    <>
      <CommandDialog open={open} onOpenChange={setOpen}>
        <CommandInput placeholder="Type a command or search..." />
        <CommandList className="scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <CommandEmpty>No results found.</CommandEmpty>

          {recentCommands.length > 0 && (
            <CommandGroup heading="Recently Used">
              {recentCommands.map(command => (
                <CommandItem
                  key={command.id}
                  onSelect={() => runCommand(command)}
                >
                  <command.icon className="mr-2 h-4 w-4" />
                  <span>{command.label}</span>
                </CommandItem>
              ))}
            </CommandGroup>
          )}

          {Object.entries(commandGroups).map(
            ([groupName, groupCommands], index) => (
              <React.Fragment key={groupName}>
                {(recentCommands.length > 0 || index > 0) && (
                  <CommandSeparator />
                )}
                <CommandGroup heading={groupName}>
                  {groupCommands.map(command => (
                    <CommandItem
                      key={command.id}
                      onSelect={() => runCommand(command)}
                    >
                      <command.icon className="mr-2 h-4 w-4" />
                      <span>{command.label}</span>
                    </CommandItem>
                  ))}
                </CommandGroup>
              </React.Fragment>
            ),
          )}
        </CommandList>
      </CommandDialog>
      <FileUploadDialog
        open={fileUploadDialogOpen}
        onOpenChange={setFileUploadDialogOpen}
      />
      <CreateCourseDialog
        open={createCourseDialogOpen}
        onOpenChange={setCreateCourseDialogOpen}
      />
    </>
  )
} 