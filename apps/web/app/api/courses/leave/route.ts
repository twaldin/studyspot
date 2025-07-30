import { NextResponse } from "next/server";
import { validateAuth } from "@/features/auth/operations";
import { clerkClient } from "@clerk/nextjs/server";

export async function POST(request: Request) {
  try {
    const auth = await validateAuth();
    const { courseId } = await request.json();

    if (!courseId || typeof courseId !== "string") {
      return NextResponse.json(
        { message: "Course ID is required and must be a string" },
        { status: 400 },
      );
    }

    // Get current user metadata
    const client = await clerkClient();
    const user = await client.users.getUser(auth.userId);
    const currentJoinedCourses = (user.publicMetadata?.joinedCourses as string[]) || [];

    // Check if not joined
    if (!currentJoinedCourses.includes(courseId)) {
      return NextResponse.json(
        { message: "Not currently joined to this course" },
        { status: 400 },
      );
    }

    // Remove course from joined courses
    const updatedJoinedCourses = currentJoinedCourses.filter(id => id !== courseId);

    // Update user metadata
    await client.users.updateUserMetadata(auth.userId, {
      publicMetadata: {
        ...user.publicMetadata,
        joinedCourses: updatedJoinedCourses,
      },
    });

    return NextResponse.json({
      success: true,
      joinedCourses: updatedJoinedCourses,
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "An unknown error occurred";
    return NextResponse.json({ message }, { status: 500 });
  }
}