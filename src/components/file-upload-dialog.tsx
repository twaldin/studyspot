"use client";

import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import { UploadCloud, File, X } from "lucide-react";

const courseData = [
  { id: "chem103", name: "CHEM 103" },
  { id: "math221", name: "MATH 221" },
  { id: "me231", name: "M E 231" },
  { id: "music102", name: "MUSIC 102" },
];

const fileData = [
    { name: "lecture_notes_1.pdf", size: "1.2 MB" },
    { name: "homework_3_solution.docx", size: "34 KB" },
]

interface FileUploadDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function FileUploadDialog({ open, onOpenChange }: FileUploadDialogProps) {
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <DialogTitle>Upload Files</DialogTitle>
          <DialogDescription>
            Upload files to your course. These will improve the assistant's ability to answer questions.
          </DialogDescription>
        </DialogHeader>
        <div className="grid gap-6">
          <div className="flex flex-col items-center justify-center w-full">
            <label
              htmlFor="dropzone-file"
              className="flex flex-col items-center justify-center w-full h-32 border-2 border-dashed rounded-lg cursor-pointer bg-muted hover:bg-muted/50"
            >
              <div className="flex flex-col items-center justify-center">
                <UploadCloud className="w-8 h-8 mb-2 text-muted-foreground" />
                <p className="mb-2 text-sm text-muted-foreground">Click to upload or drag and drop</p>
                <p className="text-xs text-muted-foreground">PDF, DOCX, etc. (MAX. 10MB)</p>
              </div>
              <input id="dropzone-file" type="file" className="hidden" multiple />
            </label>
          </div>
          <div className="grid gap-3">
            <div className="space-y-2">
              {fileData.map((file, i) => (
                  <div key={i} className="flex items-center justify-between p-2 border rounded-md">
                      <div className="flex items-center gap-2">
                          <File className="w-4 h-4" />
                          <span className="text-sm">{file.name}</span>
                          <span className="text-xs text-muted-foreground">{file.size}</span>
                      </div>
                      <Button variant="ghost" size="icon" className="w-6 h-6">
                          <X className="w-4 h-4" />
                      </Button>
                  </div>
              ))}
            </div>
          </div>
          <div className="grid gap-2">
            <Label htmlFor="course">Select Course</Label>
            <Select>
              <SelectTrigger id="course">
                <SelectValue placeholder="Select a course" />
              </SelectTrigger>
              <SelectContent>
                {courseData.map((course) => (
                  <SelectItem key={course.id} value={course.id}>
                    {course.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex items-center gap-3">
            <Checkbox id="terms" defaultChecked />
            <Label htmlFor="terms">Make files publicly viewable</Label>
          </div>
          <div className="flex items-start gap-3">
            <Checkbox id="anonymous" />
            <div className="grid gap-2">
              <Label htmlFor="anonymous">Anonymous Upload</Label>
              <p className="text-muted-foreground text-sm">
                By clicking this checkbox, users will not be able to see who uploaded the file.
              </p>
            </div>
          </div>
        </div>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary">Cancel</Button>
          </DialogClose>
          <Button type="submit" variant="primary">Upload</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
} 