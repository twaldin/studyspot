"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { UploadCloud, File, X } from "lucide-react"
import React from "react"

// Mock file data for display
const fileData = [
  { name: "Syllabus.pdf", size: "1.2 MB" },
  { name: "Lecture 1 slides.pptx", size: "3.4 MB" },
]

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function CreateCourseDialog({
  open,
  onOpenChange,
}: CreateCourseDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
          <DialogDescription>
            Create a new course to keep track of course material, chats, and
            more. This will be accessible by anyone in UW Madison.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="course-code">Course Code</Label>
            <Input id="course-code" placeholder="e.g. CHEM 103" />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course-title">Course Title</Label>
            <Input id="course-title" placeholder="e.g. General Chemistry I" />
          </div>
          <div className="space-y-4">
            <div className="space-y-1.5">
              <Label>Course Files</Label>
              <p className="text-sm text-muted-foreground">
                Initial files to build StudySpot's course knowledge. You can
                always add to this.
              </p>
            </div>
            <div className="flex flex-col items-center justify-center w-full">
              <label
                htmlFor="dropzone-file-create-course"
                className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
              >
                <div className="flex flex-col items-center justify-center">
                  <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                  <p className="mb-2 text-sm text-muted-foreground">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-muted-foreground">
                    PDF, DOCX, etc. (MAX. 10MB)
                  </p>
                </div>
                <input
                  id="dropzone-file-create-course"
                  type="file"
                  className="hidden"
                  multiple
                />
              </label>
            </div>
            <div className="grid gap-3">
              <Label>Files Added</Label>
              <div className="space-y-2">
                {fileData.map((file, i) => (
                  <div
                    key={i}
                    className="flex items-center justify-between p-2 border rounded-md"
                  >
                    <div className="flex items-center gap-2">
                      <File className="w-4 h-4" />
                      <span className="text-sm">{file.name}</span>
                      <span className="text-xs text-muted-foreground">
                        {file.size}
                      </span>
                    </div>
                    <Button variant="ghost" size="icon" className="w-6 h-6">
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button type="submit">Add Course</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 