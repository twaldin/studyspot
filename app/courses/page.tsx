"use client"

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Search, FlaskConical, Radical, Box, Music, Pencil, PlusCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import React from "react"

const coursesData = [
  {
    title: "CHEM 103",
    description: "General Chemistry I",
    icon: FlaskConical,
  },
  {
    title: "MATH 221",
    description: "Calculus and Analytic Geometry I",
    icon: Radical,
  },
  {
    title: "M E 231",
    description: "Geometric Modeling for Design and Manufacturing",
    icon: Box,
  },
  {
    title: "MUSIC 102",
    description: "History of Jazz in America",
    icon: Music,
  },
  {
    title: "ENGL 101",
    description: "Freshman Composition",
    icon: Pencil,
  },
  {
    title: "PHYS 201",
    description: "General Physics I",
    icon: Radical, // Using Radical for Physics too as there's no specific physics icon imported
  },
]

export default function CoursesPage() {
  return (
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
                    <CardDescription className="mt-1">{course.description}</CardDescription>
                  </div>
                </div>
              </CardHeader>
              <CardFooter>
                <Button className="w-full gap-2">
                  <PlusCircle className="h-4 w-4" />
                  Add course
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  )
} 