import { clerkClient } from "@clerk/nextjs/server";
import logger from "@/lib/logger";

export const setSelectedCourseForUser = async (
  userId: string,
  courseId: string,
) => {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        selectedCourseId: courseId,
      },
    });
    logger.info(
      { userId, courseId },
      "Successfully set selected course for user",
    );
  } catch (error) {
    logger.error(
      { error, userId, courseId },
      "Error updating user metadata with selected course",
    );
    throw new Error("Failed to set selected course for user.");
  }
};

export const clearSelectedCourseForUser = async (userId: string) => {
  try {
    const client = await clerkClient();
    await client.users.updateUserMetadata(userId, {
      publicMetadata: {
        selectedCourseId: null,
      },
    });
    logger.info({ userId }, "Successfully cleared selected course for user");
  } catch (error) {
    logger.error({ error, userId }, "Error clearing selected course for user");
    throw new Error("Failed to clear selected course for user.");
  }
};

export const getSelectedCourseForUser = async (userId: string) => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return user.publicMetadata.selectedCourseId as string | undefined;
  } catch (error) {
    logger.error(
      { error, userId },
      "Error fetching user metadata for selected course",
    );
    // It's possible the user doesn't have this metadata set yet, so don't throw an error, just return undefined.
    return undefined;
  }
};

export const getUserOnboardingStatus = async (userId: string) => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);

    // Handle cases where metadata might be null or undefined during transitions
    const publicMetadata = user.publicMetadata || {};
    const hasCompletedOnboarding = publicMetadata
      .hasCompletedOnboarding as boolean;
    const selectedSchool = publicMetadata.selectedSchool as string | undefined;
    const selectedSchoolName = publicMetadata.selectedSchoolName as
      | string
      | undefined;
    const selectedSchoolDomain = publicMetadata.selectedSchoolDomain as
      | string
      | undefined;

    return {
      hasCompletedOnboarding: !!hasCompletedOnboarding,
      selectedSchool: selectedSchool || undefined,
      selectedSchoolName: selectedSchoolName || undefined,
      selectedSchoolDomain: selectedSchoolDomain || undefined,
    };
  } catch (error) {
    logger.error({ error, userId }, "Error fetching user onboarding status");
    return {
      hasCompletedOnboarding: false,
    };
  }
};

export const hasCanvasToken = async (userId: string) => {
  try {
    const client = await clerkClient();
    const user = await client.users.getUser(userId);
    return !!user.privateMetadata?.canvasToken;
  } catch (error) {
    logger.error({ error, userId }, "Error checking Canvas token status");
    return false;
  }
};
