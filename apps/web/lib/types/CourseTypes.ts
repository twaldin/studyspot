import { Database } from "@/lib/database.types";

// Re-export base course types from model
export type {
  ICourse,
  ICourseInsert,
  ICourseUpdate,
} from "@/features/courses/course.model";

// Course verification types
export interface CourseVerificationParams {
  courseCode: string;
  schoolId: string;
  schoolName: string;
  schoolDomain: string;
}

export interface CourseVerificationResult {
  verified: boolean;
  message: string;
  confidence?: number;
  reason?: string;
  type?: "duplicate" | "invalid_pattern" | "not_found" | "content_unsafe";
}

// Course creation types
export interface CourseCreationParams {
  title: string;
  code: string;
  schoolId: string;
  uploadedFileUrl?: string;
  tempFileKeys?: string[];
}

export interface CourseCreationResult {
  success: boolean;
  course?: Database["public"]["Tables"]["courses"]["Row"];
  message: string;
  type: "success" | "partial_success" | "error" | "duplicate";
  confidence?: number;
}

// Course fetching types
export interface CourseFetchParams {
  schoolId: string;
}

export interface CourseFetchResult {
  success: boolean;
  courses?: Database["public"]["Tables"]["courses"]["Row"][];
  message?: string;
}

// Course deletion types
export interface CourseDeletionResult {
  success: boolean;
  error?: string;
}

// Course update types
export interface CourseUpdateParams {
  courseId: string;
  updates: Database["public"]["Tables"]["courses"]["Update"];
}

export interface CourseUpdateResult {
  success: boolean;
  course?: Database["public"]["Tables"]["courses"]["Row"];
  message?: string;
}

// File upload and syllabus processing types
export interface SyllabusProcessingParams {
  fileKey: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  courseId: string;
}

export interface SyllabusProcessingResult {
  success: boolean;
  message?: string;
}


// Pattern validation types (for course code validation)
export interface PatternValidationResult {
  isValid: boolean;
  confidence: number;
  reason: string;
}

export interface CourseExistenceResult {
  exists: boolean;
  confidence: number;
  reason: string;
}

// Department code normalization
export interface DepartmentCodeVariations {
  [key: string]: string[];
}

