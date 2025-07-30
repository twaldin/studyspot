import { NextResponse } from "next/server";
import { validateAuthWithSchool } from "@/features/auth/operations";
import { fetchCourses, verifyCourse, createCourse } from "@/features/courses/operations";

export async function GET(request: Request) {
  try {
    const auth = await validateAuthWithSchool();
    const courses = await fetchCourses(auth.supabase, auth.selectedSchool);

    return NextResponse.json({ courses });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const auth = await validateAuthWithSchool();
    const { title, code, uploadedFileUrl, tempFileKeys } = await request.json();

    if (!title || !code) {
      return NextResponse.json(
        { message: "Title and code are required" },
        { status: 400 },
      );
    }

    // First verify the course before creating it
    const verificationResult = await verifyCourse(
      auth.supabase,
      code,
      auth.selectedSchool,
      auth.selectedSchoolName,
    );

    if (!verificationResult.verified) {
      return NextResponse.json(
        {
          message: verificationResult.message || "Course verification failed",
          details: {
            reason: verificationResult.reason,
          },
        },
        { status: 400 },
      );
    }

    // Create the course
    const result = await createCourse(auth.supabase, {
      title,
      code,
      schoolId: auth.selectedSchool,
      uploadedFileUrl,
      tempFileKeys,
    });

    return NextResponse.json(
      { course: result.course, type: result.type, message: result.message },
      { status: 201 },
    );
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    const status = error instanceof Error && error.message.includes("already exists") ? 409 : 500;
    return NextResponse.json({ message }, { status });
  }
}
