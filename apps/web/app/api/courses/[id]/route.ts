import { NextResponse } from "next/server";
import { authService } from "@/lib/services/auth/auth.service";
import { courseService } from "@/features/courses/course.service";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await authService.validateAuth();
    const { id: courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 },
      );
    }

    const result = await courseService.deleteCourse(auth.supabase, courseId);

    if (!result.success) {
      throw new Error(result.error || "Failed to delete course");
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error
      ? error.message
      : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
