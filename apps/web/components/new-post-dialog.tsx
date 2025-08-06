"use client"

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@studyspot/ui/components/dialog"
import { Button } from "@studyspot/ui/components/button"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@studyspot/ui/components/select"
import { Checkbox } from "@studyspot/ui/components/checkbox"
import { Label } from "@studyspot/ui/components/label"
import { Input } from "@studyspot/ui/components/input"
import { Textarea } from "@studyspot/ui/components/textarea"

const courseData = [
  { id: "chem103", name: "CHEM 103" },
  { id: "math221", name: "MATH 221" },
  { id: "me231", name: "M E 231" },
  { id: "music102", name: "MUSIC 102" },
]

interface NewPostDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function NewPostDialog({ open, onOpenChange }: NewPostDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>New Post</DialogTitle>
          <DialogDescription>
            Ask a question, give advice, or just say hello to your classmates
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="grid gap-2">
            <Label htmlFor="title">Title</Label>
            <Input
              id="title"
              placeholder="e.g. Are the exams graded on a curve?"
            />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="body">Body text (optional)</Label>
            <Textarea id="body" placeholder="Add more details here..." />
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Select Course</Label>
            <Select>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courseData.map(course => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="anonymous" />
            <Label htmlFor="anonymous">Post anonymously</Label>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" variant="primary">Post</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 