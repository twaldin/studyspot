import { NextResponse } from "next/server";
import { validateAuthWithSchool } from "@/features/auth/operations";
import { verifyCourse } from "@/features/courses/operations";

export async function POST(request: Request) {
  try {
    const auth = await validateAuthWithSchool();
    const { courseCode } = await request.json();

    if (!courseCode) {
      return NextResponse.json(
        { message: "Course code is required" },
        { status: 400 },
      );
    }

    const result = await verifyCourse(
      auth.supabase,
      courseCode,
      auth.selectedSchool,
      auth.selectedSchoolName,
    );

    const status = !result.verified && result.message.includes("already exists") ? 409 : 200;

    return NextResponse.json({
      verified: result.verified,
      message: result.message,
      reason: result.reason,
    }, { status });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
