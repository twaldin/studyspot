"use client"

import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import {
  Search,
  FlaskConical,
  Radical,
  Box,
  Music,
  Pencil,
  PlusCircle,
  X,
  PartyPopper,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"
import { CreateCourseDialog } from "@/components/create-course-dialog"
import { useSearchParams } from "next/navigation"
import { OnboardingSuccessDialog } from "@/components/onboarding-success-dialog"
import Link from "next/link"
import toast from "react-hot-toast"

const coursesData = [
  {
    title: "CHEM 103",
    description: "General Chemistry I",
    icon: FlaskConical,
    isAdded: true,
  },
  {
    title: "MATH 221",
    description: "Calculus and Analytic Geometry I",
    icon: Radical,
    isAdded: true,
  },
  {
    title: "M E 231",
    description: "Geometric Modeling for Design and Manufacturing",
    icon: Box,
    isAdded: true,
  },
  {
    title: "MUSIC 102",
    description: "History of Jazz in America",
    icon: Music,
    isAdded: true,
  },
  {
    title: "ENGL 101",
    description: "Freshman Composition",
    icon: Pencil,
    isAdded: false,
  },
  {
    title: "PHYS 201",
    description: "General Physics I",
    icon: Radical, // Using Radical for Physics too as there's no specific physics icon imported
    isAdded: false,
  },
]

export function CoursesPageContent() {
  const [isCreateCourseDialogOpen, setCreateCourseDialogOpen] =
    React.useState(false)
  const [isOnboardingSuccessDialogOpen, setOnboardingSuccessDialogOpen] =
    React.useState(false)
  const searchParams = useSearchParams()

  React.useEffect(() => {
    if (searchParams.get("onboarding") === "success") {
      setOnboardingSuccessDialogOpen(true)
    }
  }, [searchParams])

  const handleOnboardingSuccessDialogChange = (open: boolean) => {
    if (!open && isOnboardingSuccessDialogOpen) {
      toast(
        "Get started by adding your courses, creating a chat, and asking a question.",
        {
          title: "Welcome to StudySpot!",
          icon: <Pencil className="h-4 w-4" />,
          duration: Infinity,
        } as any
      )
    }
    setOnboardingSuccessDialogOpen(open)
  }

  return (
    <>
      <div className="mx-auto w-full max-w-3xl h-full flex flex-col p-6 gap-4">
        <h2 className="text-3xl font-crimson-text leading-none">
          Find your courses
        </h2>
        <div className="flex flex-wrap items-center gap-4">
          <div className="relative flex-1 min-w-[250px]">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search for courses..."
              className="w-full rounded-lg bg-background pl-8"
            />
          </div>
          <div className="flex items-center gap-4">
            <p className="text-sm text-muted-foreground">
              Can&apos;t find your course?
            </p>
            <Button
              className="gap-2"
              variant="secondary"
              onClick={() => setCreateCourseDialogOpen(true)}
            >
              <PlusCircle className="h-4 w-4" />
              Create Course
            </Button>
          </div>
        </div>
        <div className="flex-1 overflow-y-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:'none'] [scrollbar-width:'none']">
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {coursesData.map((course, i) => (
              <Card key={i} className="flex flex-col">
                <CardHeader className="flex-1">
                  <div className="flex items-start gap-4">
                    <course.icon className="h-6 w-6 text-muted-foreground mt-1" />
                    <div className="flex-1">
                      <CardTitle>{course.title}</CardTitle>
                      <CardDescription className="mt-1">
                        {course.description}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardFooter>
                  {course.isAdded ? (
                    <div className="flex gap-2 w-full">
                      <Link href="/" className="flex-1">
                        <Button variant="secondary" className="w-full">
                          Enter Course
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon">
                            <X className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Leave course?</AlertDialogTitle>
                            <AlertDialogDescription>
                              You can always rejoin this course later.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction>Continue</AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  ) : (
                    <Button variant="primary" className="w-full gap-2">
                      <PlusCircle className="h-4 w-4" />
                      Add Course
                    </Button>
                  )}
                </CardFooter>
              </Card>
            ))}
          </div>
        </div>
        <CreateCourseDialog
          open={isCreateCourseDialogOpen}
          onOpenChange={setCreateCourseDialogOpen}
        />
        <OnboardingSuccessDialog
          open={isOnboardingSuccessDialogOpen}
          onOpenChange={handleOnboardingSuccessDialogChange}
        />
      </div>
    </>
  )
} 