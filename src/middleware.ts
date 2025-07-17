import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOnboardingStatus } from "@/lib/clerk";
import { clerkClient } from "@clerk/nextjs/server";
import logger from "@/lib/logger";

const isProtectedRoute = createRouteMatcher([
  "/",
  "/courses(.*)",
  "/onboarding(.*)",
  "/content(.*)",
  "/chat(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);

export default clerkMiddleware(async (auth, req) => {
  try {
    if (isProtectedRoute(req)) {
      const { userId } = await auth();

      if (!userId) {
        const signInUrl = new URL("/sign-in", req.url);
        signInUrl.searchParams.set("redirectUrl", req.url);
        return NextResponse.redirect(signInUrl);
      }

      // Always allow onboarding routes - no additional checks needed
      if (isOnboardingRoute(req)) {
        return NextResponse.next();
      }

      const onboardingStatus = await getUserOnboardingStatus(userId);

      // If user hasn't completed onboarding, redirect to onboarding
      if (!onboardingStatus.hasCompletedOnboarding) {
        const onboardingUrl = new URL("/onboarding/select-school", req.url);
        return NextResponse.redirect(onboardingUrl);
      }

      // User has completed onboarding, check for selected course only for non-courses pages
      if (!req.nextUrl.pathname.startsWith("/courses")) {
        try {
          const client = await clerkClient();
          const user = await client.users.getUser(userId);
          const selectedCourseId = user.publicMetadata?.selectedCourseId;

          if (!selectedCourseId) {
            return NextResponse.redirect(new URL("/courses", req.url));
          }
        } catch (error) {
          logger.error(
            { error, url: req.url },
            "Error checking selected course in middleware",
          );
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    logger.error({ error, url: req.url }, "Middleware execution error");
    return NextResponse.next();
  }
});
