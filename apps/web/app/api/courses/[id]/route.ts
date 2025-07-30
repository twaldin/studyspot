import { NextResponse } from "next/server";
import { validateAuth } from "@/features/auth/operations";
import { deleteCourse } from "@/features/courses/operations";

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  try {
    const auth = await validateAuth();
    const { id: courseId } = await params;

    if (!courseId) {
      return NextResponse.json(
        { message: "Course ID is required" },
        { status: 400 },
      );
    }

    await deleteCourse(auth.supabase, courseId);

    return NextResponse.json({ success: true });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}
