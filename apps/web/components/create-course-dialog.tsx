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
import { Input } from "@studyspot/ui/components/input"
import { Label } from "@studyspot/ui/components/label"
import { SingleFileInput } from "@studyspot/ui/components/single-file-input"
import { Loader2, ChevronDown, ChevronUp } from "lucide-react"
import React, { useState, useCallback } from "react"
import { useUploadThing } from '../uploadthing'
import { useCreateCourse, useJoinCourse, useVerifyCourse } from "@/hooks/api/courses"
import { useUserSchool } from "@/hooks/api/user"
import toast from "react-hot-toast"
import { useQueryClient } from "@tanstack/react-query"

interface CreateCourseDialogProps {
  open: boolean
  onOpenChange: (open: boolean) => void
}

interface CourseExtractionResult {
  courseCode: string
  courseTitle: string
  confidence: number
}

export function CreateCourseDialog({
  open,
  onOpenChange,
}: CreateCourseDialogProps) {
  const [courseCode, setCourseCode] = useState("")
  const [courseTitle, setCourseTitle] = useState("")
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null)
  const [showSyllabusUpload, setShowSyllabusUpload] = useState(false)
  const [isExtracting, setIsExtracting] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [extractionResult, setExtractionResult] = useState<CourseExtractionResult | null>(null)
  
  const queryClient = useQueryClient()
  const verifyCourseMutation = useVerifyCourse()
  const createCourseMutation = useCreateCourse()
  const joinCourseMutation = useJoinCourse()
  const { data: userSchool } = useUserSchool()

  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file)
    setUploadedFileUrl(null)
    
    if (file) {
      // Start extraction process immediately when file is selected
      setIsExtracting(true)
      
      try {
        // Upload the file first
        const uploadResult = await startUpload([file], { courseId: 'temp' } as any)
        
        if (uploadResult && uploadResult.length > 0) {
          const fileUrl = uploadResult[0].url
          setUploadedFileUrl(fileUrl)
          
          // Extract course info
          const response = await fetch('/api/courses/extract', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ fileUrl })
          })
          
          const data = await response.json()
          
          if (response.ok) {
            setExtractionResult({
              courseCode: data.courseCode || "",
              courseTitle: data.courseTitle || "",
              confidence: data.confidence || 0
            })
            
            // Auto-fill the form if extraction was successful
            if (data.courseCode) setCourseCode(data.courseCode)
            if (data.courseTitle) setCourseTitle(data.courseTitle)
            
            toast.success("Course information extracted successfully!")
          } else {
            toast.error(data.message || "Failed to extract course information")
          }
        }
      } catch (error) {
        toast.error("Failed to extract course information")
      } finally {
        setIsExtracting(false)
      }
    } else {
      // Clear extraction results when file is removed
      setExtractionResult(null)
    }
  }
  
  const { startUpload, isUploading } = useUploadThing(
    "courseMaterialUploader",
    {
      onUploadError: (error: Error) => {
        toast.error(`Upload failed: ${error.message}`)
        setIsExtracting(false)
      }
    }
  )

  const handleReset = useCallback(() => {
    setCourseCode("")
    setCourseTitle("")
    setSelectedFile(null)
    setUploadedFileUrl(null)
    setExtractionResult(null)
    setIsExtracting(false)
    setShowSyllabusUpload(false)
    setIsSubmitting(false)
  }, [])

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return
    setIsSubmitting(true)

    if (!courseCode.trim() || !courseTitle.trim()) {
      toast.error("Please enter both course code and title")
      setIsSubmitting(false)
      return
    }

    try {
      // Step 1: Create the course
      const payload: any = {
        title: courseTitle,
        code: courseCode,
      }
      if (selectedFile && uploadedFileUrl) {
        payload.uploadedFileUrl = uploadedFileUrl
      }
      const createData = await createCourseMutation.mutateAsync(payload)

      if (createData) {
        // Step 2: Join the course (this automatically sets it as selected)
        await joinCourseMutation.mutateAsync({
          courseId: createData.id,
          courseData: createData
        })

        toast.success("Course created and selected successfully!")
        queryClient.invalidateQueries({ queryKey: ['courses'] })
        queryClient.invalidateQueries({ queryKey: ['joinedCourses'] })
        handleReset()
        onOpenChange(false)
      } else {
        throw new Error("Failed to get course details after creation.")
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.")
    } finally {
      setIsSubmitting(false)
    }
  }, [
    isSubmitting,
    courseCode,
    courseTitle,
    selectedFile,
    uploadedFileUrl,
    createCourseMutation,
    joinCourseMutation,
    queryClient,
    handleReset,
    onOpenChange
  ])

  const canSubmit = courseCode.trim() && courseTitle.trim() && !isSubmitting && !isExtracting

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
          <DialogDescription>
            Create a new course to keep track of course material, chats, and more. This will be accessible by anyone in {userSchool?.name || 'your school'}.
          </DialogDescription>
        </DialogHeader>
        
        <div className="grid gap-4">
          {/* Main form fields */}
          <div className="grid gap-2">
            <Label htmlFor="course-code">Course Code</Label>
            <Input 
              id="course-code" 
              placeholder="e.g. CHEM 103" 
              value={courseCode}
              onChange={(e) => setCourseCode(e.target.value)}
              disabled={isSubmitting || isExtracting}
            />
          </div>
          
          <div className="grid gap-2">
            <Label htmlFor="course-title">Course Title</Label>
            <Input 
              id="course-title" 
              placeholder="e.g. General Chemistry I" 
              value={courseTitle}
              onChange={(e) => setCourseTitle(e.target.value)}
              disabled={isSubmitting || isExtracting}
            />
          </div>

          {/* Expand button for syllabus upload */}
          <Button
            type="button"
            variant="outline"
            onClick={() => setShowSyllabusUpload(!showSyllabusUpload)}
            className="w-full justify-between"
            disabled={isSubmitting || isExtracting}
          >
            Upload syllabus to extract course info (optional)
            {showSyllabusUpload ? (
              <ChevronUp className="w-4 h-4" />
            ) : (
              <ChevronDown className="w-4 h-4" />
            )}
          </Button>

          {/* Expandable syllabus upload section */}
          {showSyllabusUpload && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Syllabus File</Label>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF syllabus and we'll automatically extract the course code and title.
                </p>
                <SingleFileInput 
                  acceptedFileTypes=".pdf"
                  onFileSelect={handleFileSelect}
                  placeholder="Upload syllabus PDF"
                  disabled={isSubmitting || isExtracting}
                />
              </div>
              
              {isExtracting && (
                <div className="flex items-center gap-2 p-3 bg-muted rounded-md">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  <span className="text-sm">Extracting course information...</span>
                </div>
              )}
              
              {extractionResult && (
                <div className="space-y-2 p-3 bg-muted rounded-md">
                  <h4 className="text-sm font-medium">Information extracted from syllabus</h4>
                  <p className="text-xs text-muted-foreground">
                    Confidence: {Math.round(extractionResult.confidence * 100)}% • You can edit the fields above
                  </p>
                </div>
              )}
            </div>
          )}
        </div>

        <DialogFooter>
          <DialogClose asChild>
            <Button variant="secondary" disabled={isSubmitting}>Cancel</Button>
          </DialogClose>
          <Button 
            onClick={handleSubmit}
            disabled={!canSubmit}
            variant="primary"
          >
            {isSubmitting && <Loader2 className="w-4 h-4 mr-2 animate-spin" />}
            {isSubmitting ? "Creating..." : "Create Course"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
} 