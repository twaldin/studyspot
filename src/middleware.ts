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
          const isProduction = process.env.NODE_ENV === 'production';
          
          // In production, add retry logic for metadata consistency
          let user;
          let selectedCourseId;
          
          if (isProduction) {
            // Try multiple times to get fresh metadata in production
            let attempts = 0;
            const maxAttempts = 3;
            
            while (attempts < maxAttempts) {
              user = await client.users.getUser(userId);
              selectedCourseId = user.publicMetadata?.selectedCourseId;
              
              // If we have a selected course or this is the last attempt, break
              if (selectedCourseId || attempts === maxAttempts - 1) {
                break;
              }
              
              // Wait briefly before retrying (only in production)
              await new Promise(resolve => setTimeout(resolve, 500));
              attempts++;
            }
            
            if (attempts > 0) {
              logger.info(
                { userId, attempts: attempts + 1, selectedCourseId },
                "Middleware metadata retry in production"
              );
            }
          } else {
            // Development - single fetch
            user = await client.users.getUser(userId);
            selectedCourseId = user.publicMetadata?.selectedCourseId;
          }

          // Check if this might be a metadata propagation delay
          const schoolSwitchCookie = req.cookies.get('school-switch-timestamp');
          const timeSinceSwitch = schoolSwitchCookie ? 
            Date.now() - parseInt(schoolSwitchCookie.value) : Infinity;
          
          // If no selected course and it's not a recent switch, redirect to courses
          if (!selectedCourseId) {
            // In production, allow 30 seconds grace period for metadata propagation
            if (isProduction && timeSinceSwitch < 30000) {
              logger.info(
                { userId, timeSinceSwitch },
                "Allowing through during metadata propagation window"
              );
              return NextResponse.next();
            }
            
            return NextResponse.redirect(new URL("/courses", req.url));
          }
        } catch (error) {
          logger.error(
            { error, url: req.url },
            "Error checking selected course in middleware",
          );
          
          // In production, be more lenient with errors during metadata propagation
          if (process.env.NODE_ENV === 'production') {
            logger.warn(
              { userId, url: req.url },
              "Allowing through due to middleware error in production"
            );
            return NextResponse.next();
          }
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    logger.error({ error, url: req.url }, "Middleware execution error");
    return NextResponse.next();
  }
});
