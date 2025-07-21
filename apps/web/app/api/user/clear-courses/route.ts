import { currentUser, clerkClient } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import logger from "@/lib/logger";

export async function POST() {
  try {
    const user = await currentUser();
    if (!user) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const newPublicMetadata = {
      ...user.publicMetadata, // Preserve existing metadata
      joined_courses: [],
      selected_course: null,
    };

    const clerk = await clerkClient();
    await clerk.users.updateUserMetadata(user.id, {
      publicMetadata: newPublicMetadata,
    });

    logger.info("Successfully cleared user courses from metadata");

    return new NextResponse(null, { status: 204 });
  } catch (error) {
    logger.error("Failed to clear user courses", { error });
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
