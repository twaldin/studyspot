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
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { SingleFileInput } from "@/components/ui/single-file-input";
import { ChevronDown, ChevronUp, Loader2 } from "lucide-react";
import React, { useCallback, useState } from "react";
import { useUploadThing } from "../uploadthing";
import {
  useCreateCourse,
  useJoinCourse,
  useVerifyCourse,
} from "@/hooks/api/courses";
import { useUserSchool } from "@/hooks/api/user";
import toast from "react-hot-toast";
import { useQueryClient } from "@tanstack/react-query";
import { useDocumentProcessing } from "@/hooks/use-document-processing";
import { useAuth } from "@clerk/nextjs";
import { CourseIconSelector } from "@/components/ui/course-icon-selector";
import { CourseIconName, suggestCourseIcon } from "@/lib/utils/course-icons";

interface CreateCourseDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface CourseExtractionResult {
  courseCode: string;
  courseTitle: string;
  icon: string | null;
  confidence: number;
}

export function CreateCourseDialog({
  open,
  onOpenChange,
}: CreateCourseDialogProps) {
  const [courseCode, setCourseCode] = useState("");
  const [courseTitle, setCourseTitle] = useState("");
  const [courseIcon, setCourseIcon] = useState<CourseIconName | null>(null);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [uploadedFileUrl, setUploadedFileUrl] = useState<string | null>(null);
  const [showSyllabusUpload, setShowSyllabusUpload] = useState(false);
  const [isExtracting, setIsExtracting] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [extractionResult, setExtractionResult] = useState<
    CourseExtractionResult | null
  >(null);

  const queryClient = useQueryClient();
  const verifyCourseMutation = useVerifyCourse();
  const createCourseMutation = useCreateCourse();
  const joinCourseMutation = useJoinCourse();
  const { data: userSchool } = useUserSchool();
  const { userId } = useAuth();
  const {
    startProcessing,
    markFileComplete,
    updateFileProgress,
    finishProcessing,
  } = useDocumentProcessing();

  const handleFileSelect = async (file: File | null) => {
    setSelectedFile(file);
    setUploadedFileUrl(null);

    if (file) {
      // Start extraction process immediately when file is selected
      setIsExtracting(true);

      try {
        // Upload the file first
        const uploadResult = await startUpload(
          [file],
          { courseId: "temp" } as any,
        );

        if (uploadResult && uploadResult.length > 0) {
          const fileUrl = uploadResult[0].url;
          setUploadedFileUrl(fileUrl);

          // Extract course info
          const response = await fetch("/api/courses/extract", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ fileUrl }),
          });

          const data = await response.json();

          if (response.ok) {
            setExtractionResult({
              courseCode: data.courseCode || "",
              courseTitle: data.courseTitle || "",
              icon: data.icon || null,
              confidence: data.confidence || 0,
            });

            // Auto-fill the form if extraction was successful
            if (data.courseCode) setCourseCode(data.courseCode);
            if (data.courseTitle) setCourseTitle(data.courseTitle);
            if (data.icon) {
              setCourseIcon(data.icon as CourseIconName);
            } else {
              // Suggest icon based on extracted course info
              const suggestedIcon = suggestCourseIcon(data.courseCode || "", data.courseTitle || "");
              setCourseIcon(suggestedIcon);
            }

            toast.success("Course information extracted successfully!");
          } else {
            toast.error(data.message || "Failed to extract course information");
          }
        }
      } catch (error) {
        toast.error("Failed to extract course information");
      } finally {
        setIsExtracting(false);
      }
    } else {
      // Clear extraction results when file is removed
      setExtractionResult(null);
    }
  };

  const { startUpload, isUploading } = useUploadThing(
    "courseMaterialUploader",
    {
      onUploadError: (error: Error) => {
        toast.error(`Upload failed: ${error.message}`);
        setIsExtracting(false);
      },
    },
  );

  const processDocumentsWithMastra = useCallback(
    async (
      files: Array<
        { fileKey: string; fileName: string; fileUrl: string; fileType: string }
      >,
      courseId: string,
    ) => {
      if (!userId) {
        toast.error("User not authenticated");
        return;
      }

      try {
        // Start processing state with proper file format
        const processingFiles = files.map((file) => ({
          id: file.fileKey,
          name: file.fileName,
        }));
        startProcessing(processingFiles);

        // Connect to SSE endpoint for real-time progress updates
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_ASSISTANT_API_URL}/documents/ingest-stream`,
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              files,
              courseId,
              userId,
            }),
          },
        );

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const reader = response.body?.getReader();
        if (!reader) {
          throw new Error("No response body");
        }

        const decoder = new TextDecoder();
        let buffer = "";

        while (true) {
          const { done, value } = await reader.read();
          if (done) break;

          buffer += decoder.decode(value, { stream: true });
          const lines = buffer.split("\n");
          buffer = lines.pop() || "";

          for (const line of lines) {
            if (line.startsWith("data: ")) {
              const data = line.slice(6);
              if (data === "[DONE]") continue;

              try {
                const event = JSON.parse(data);

                switch (event.type) {
                  case "file-start":
                    updateFileProgress(
                      files[event.fileIndex].fileKey,
                      "Starting processing...",
                    );
                    break;

                  case "step-progress":
                    updateFileProgress(
                      files[event.fileIndex].fileKey,
                      event.message,
                    );
                    break;

                  case "file-complete":
                    markFileComplete(files[event.fileIndex].fileKey, true);
                    break;

                  case "file-error":
                    markFileComplete(
                      files[event.fileIndex].fileKey,
                      false,
                      event.error,
                    );
                    break;

                  case "complete":
                    finishProcessing();
                    toast.success(`Syllabus processed successfully!`);
                    break;
                }
              } catch (error) {
                console.error("Failed to parse SSE event:", error);
              }
            }
          }
        }
      } catch (error) {
        console.error("Document processing error:", error);
        finishProcessing();
        toast.error("Failed to process syllabus");
      }
    },
    [
      userId,
      startProcessing,
      updateFileProgress,
      markFileComplete,
      finishProcessing,
    ],
  );

  const handleReset = useCallback(() => {
    setCourseCode("");
    setCourseTitle("");
    setCourseIcon(null);
    setSelectedFile(null);
    setUploadedFileUrl(null);
    setExtractionResult(null);
    setIsExtracting(false);
    setShowSyllabusUpload(false);
    setIsSubmitting(false);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (isSubmitting) return;
    setIsSubmitting(true);

    if (!courseCode.trim() || !courseTitle.trim()) {
      toast.error("Please enter both course code and title");
      setIsSubmitting(false);
      return;
    }

    try {
      // Step 1: Create the course
      const payload: any = {
        title: courseTitle,
        code: courseCode,
        icon: courseIcon || suggestCourseIcon(courseCode, courseTitle),
      };
      if (selectedFile && uploadedFileUrl) {
        payload.uploadedFileUrl = uploadedFileUrl;
      }
      const createData = await createCourseMutation.mutateAsync(payload);

      if (createData) {
        // Step 2: Join the course (this automatically sets it as selected)
        await joinCourseMutation.mutateAsync({
          courseId: createData.id,
          courseData: createData,
        });

        // Step 3: If a syllabus was uploaded, trigger document ingestion
        if (selectedFile && uploadedFileUrl) {
          // Get the file key from the URL (it's the last part after /f/)
          const fileKey = uploadedFileUrl.split("/f/").pop() || "";

          // Trigger document ingestion via the Mastra workflow
          // This happens asynchronously with progress tracking
          const files = [{
            fileKey,
            fileName: selectedFile.name,
            fileUrl: uploadedFileUrl,
            fileType: selectedFile.type || "application/pdf",
          }];

          // Note: This will be processed asynchronously with progress updates
          // We don't await it since it has its own progress tracking
          processDocumentsWithMastra(files, createData.id);
        }

        toast.success("Course created and selected successfully!");
        queryClient.invalidateQueries({ queryKey: ["courses"] });
        queryClient.invalidateQueries({ queryKey: ["joinedCourses"] });
        handleReset();
        onOpenChange(false);
      } else {
        throw new Error("Failed to get course details after creation.");
      }
    } catch (error: any) {
      toast.error(error.message || "An unexpected error occurred.");
    } finally {
      setIsSubmitting(false);
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
    onOpenChange,
    processDocumentsWithMastra,
  ]);

  const canSubmit = courseCode.trim() && courseTitle.trim() && !isSubmitting &&
    !isExtracting;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[525px]">
        <DialogHeader>
          <DialogTitle>Create a new course</DialogTitle>
          <DialogDescription>
            Create a new course to keep track of course material, chats, and
            more. This will be accessible by anyone in{" "}
            {userSchool?.name || "your school"}.
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

          <div className="grid gap-2">
            <Label htmlFor="course-icon">Course Icon</Label>
            <CourseIconSelector
              value={courseIcon}
              onChange={setCourseIcon}
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
            {showSyllabusUpload
              ? <ChevronUp className="w-4 h-4" />
              : <ChevronDown className="w-4 h-4" />}
          </Button>

          {/* Expandable syllabus upload section */}
          {showSyllabusUpload && (
            <div className="space-y-4 border-t pt-4">
              <div className="space-y-2">
                <Label>Syllabus File</Label>
                <p className="text-sm text-muted-foreground">
                  Upload a PDF syllabus and we'll automatically extract the
                  course code and title.
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
                  <span className="text-sm">
                    Extracting course information...
                  </span>
                </div>
              )}

              {extractionResult && (
                <div className="space-y-2 p-3 bg-muted rounded-md">
                  <h4 className="text-sm font-medium">
                    Information extracted from syllabus
                  </h4>
                  <p className="text-xs text-muted-foreground">
                    Confidence:{" "}
                    {Math.round(extractionResult.confidence * 100)}% • You can
                    edit the fields above
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
  );
}

