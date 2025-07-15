import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/auth.service";
import { courseService } from "@/features/courses/course.service";

export async function GET(request: Request) {
  try {
    const auth = await authService.validateAuthWithSchool();
    const result = await courseService.fetchCourses(auth.supabase, {
      schoolId: auth.selectedSchool,
    });

    if (!result.success) {
      throw new Error(result.message || "Failed to fetch courses");
    }

    return NextResponse.json({ courses: result.courses });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await authService.validateAuthWithSchool();
    const { title, code, uploadedFileUrl, tempFileKeys } = await request.json();

    if (!title || !code) {
      return NextResponse.json(
        { message: "Title and code are required" },
        { status: 400 },
      );
    }

    // First verify the course before creating it
    const verificationResult = await courseService.verifyCourse(auth.supabase, {
      courseCode: code,
      schoolId: auth.selectedSchool,
      schoolName: auth.selectedSchoolName,
      schoolDomain: auth.selectedSchoolDomain || "",
    });

    if (!verificationResult.verified) {
      return NextResponse.json(
        {
          message: verificationResult.message || "Course verification failed",
          details: {
            reason: verificationResult.reason,
            confidence: verificationResult.confidence,
            type: verificationResult.type,
          },
        },
        { status: 400 },
      );
    }

    // Create the course
    const result = await courseService.createCourse(auth.supabase, {
      title,
      code,
      schoolId: auth.selectedSchool,
      uploadedFileUrl,
      tempFileKeys,
    });

    if (!result.success) {
      return NextResponse.json(
        {
          message: result.message || "Failed to create course",
          details: { type: result.type, confidence: result.confidence },
        },
        { status: result.type === "duplicate" ? 409 : 500 },
      );
    }

    if (result.type === "partial_success") {
      return NextResponse.json(
        { course: result.course, type: result.type, message: result.message },
        { status: 201 },
      );
    }

    return NextResponse.json(
      { course: result.course, type: result.type, message: result.message },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
