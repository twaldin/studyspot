"use client"

import * as React from "react"
import {
  Settings,
  User,
  PlusCircle,
  FlaskConical,
  Radical,
  Box,
  Music,
  CheckCircle,
  XCircle,
  LoaderCircle,
  Info,
  X,
} from "lucide-react"
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu"
import { Button } from "@/components/ui/button"
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

import { useClerk } from "@clerk/nextjs"
import { useToaster } from "react-hot-toast"

const courses = [
  { name: "CHEM 103", icon: FlaskConical },
  { name: "MATH 221", icon: Radical },
  { name: "M E 231", icon: Box },
  { name: "MUSIC 102", icon: Music },
]

function CustomToaster() {
  const { toasts, handlers } = useToaster()
  const { startPause, endPause, calculateOffset, updateHeight } = handlers

  return (
    <div
      className="fixed bottom-4 right-4 z-50 w-64 px-4"
      onMouseEnter={startPause}
      onMouseLeave={endPause}
    >
      {toasts.map((t) => {
        const offset = calculateOffset(t, {
          reverseOrder: false,
          gutter: 8,
        })

        const ref = (el: HTMLDivElement | null) => {
          if (el && typeof t.height !== "number") {
            const height = el.getBoundingClientRect().height
            updateHeight(t.id, height)
          }
        }

        const getIcon = () => {
          switch (t.type) {
            case "success":
              return <CheckCircle className="h-4 w-4" />
            case "error":
              return <XCircle className="h-4 w-4" />
            case "loading":
              return <LoaderCircle className="h-4 w-4 animate-spin" />
            default:
              return <Info className="h-4 w-4" />
          }
        }

        const getVariant = () => {
          return t.type === "error" ? "destructive" : "default"
        }

        return (
          <div
            key={t.id}
            ref={ref}
            className="relative"
            style={{
              position: "absolute",
              bottom: 0,
              right: 0,
              width: "100%",
              transition: "all 0.3s ease-out",
              opacity: t.visible ? 1 : 0,
              transform: `translateY(-${offset}px)`,
            }}
            {...t.ariaProps}
          >
            <Alert variant={getVariant()} className="pr-12">
              {getIcon()}
              <AlertTitle>{t.type === "loading" ? "Loading..." : "Notification"}</AlertTitle>
              <AlertDescription>
                {typeof t.message === "string" ? t.message : "Notification"}
              </AlertDescription>
              {t.type !== "loading" && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="absolute right-2 top-2 h-6 w-6 p-0"
                  onClick={() => toast.dismiss(t.id)}
                >
                  <X className="h-3 w-3" />
                </Button>
              )}
            </Alert>
          </div>
        )
      })}
    </div>
  )
}


export function AppRightSidebar() {
  const [activeCourse, setActiveCourse] = React.useState(courses[0].name)
  const { openUserProfile, signOut } = useClerk();
  const handleManageAccount = () => {
    openUserProfile();
  };
  const handleSignOut = () => {
    signOut();
  };

  return (
    <>
      <div className="hidden lg:flex flex-col w-72 border-l border-sidebar-border">
        <div className="border-b border-sidebar-border flex flex-col gap-4 p-4">
          <div className="flex items-center justify-end gap-2">
            <Button variant="outline" size="icon">
              <Settings className="h-4 w-4" />
            </Button>
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button variant="outline" className="gap-2">
                  <User className="h-4 w-4" />
                  Reed Grenager
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48">
                <DropdownMenuItem onClick={handleManageAccount}>
                  Manage Account
                </DropdownMenuItem>
                <DropdownMenuItem>
                  Change Schools
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={handleSignOut}>
                  Sign Out
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>
        <div className="p-4 space-y-4">
          <div>
            <h4 className="mb-2 px-2 text-xs font-medium text-muted-foreground text-right">
              My Courses
            </h4>
            <div className="flex flex-col gap-1 items-end">
              {courses.map((course) => (
                <Button
                  key={course.name}
                  variant={activeCourse === course.name ? "secondary" : "ghost"}
                  onClick={() => setActiveCourse(course.name)}
                  className="gap-2"
                >
                  <course.icon className="h-4 w-4" />
                  {course.name}
                </Button>
              ))}
              <Button variant="ghost" className="gap-2">
                <PlusCircle className="h-4 w-4" />
                Add More
              </Button>
            </div>
          </div>
        </div>
        <div className="flex-1">
          {/* Placeholder for future content */}
        </div>
      </div>
      <CustomToaster />
    </>
  )
}