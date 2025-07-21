import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/auth.service";
import { courseService } from "@/features/courses/course.service";

export async function POST(request: Request) {
  try {
    const auth = await authService.validateAuthWithSchool();
    const { courseCode } = await request.json();

    if (!courseCode) {
      return NextResponse.json(
        { message: "Course code is required" },
        { status: 400 },
      );
    }

    const result = await courseService.verifyCourse(auth.supabase, {
      courseCode,
      schoolId: auth.selectedSchool,
      schoolName: auth.selectedSchoolName,
      schoolDomain: auth.selectedSchoolDomain || "",
    });

    if (result.type === "duplicate") {
      return NextResponse.json(
        {
          verified: result.verified,
          message: result.message,
          type: result.type,
        },
        { status: 409 },
      );
    }

    return NextResponse.json({
      verified: result.verified,
      message: result.message,
      confidence: result.confidence,
      reason: result.reason,
      type: result.type,
    });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
