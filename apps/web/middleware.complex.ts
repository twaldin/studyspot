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
          
          // If no selected course, check for grace periods before redirecting
          if (!selectedCourseId) {
            // Check for recent school switch (30 second window)
            if (isProduction && timeSinceSwitch < 30000) {
              logger.info(
                { userId, timeSinceSwitch },
                "Allowing through during school switch metadata propagation window"
              );
              return NextResponse.next();
            }
            
            // Check for recent course selection (allow navigation to main page after "Enter Course")
            const courseSelectionCookie = req.cookies.get('course-selection-timestamp');
            const timeSinceCourseSelection = courseSelectionCookie ? 
              Date.now() - parseInt(courseSelectionCookie.value) : Infinity;
            
            if (isProduction && timeSinceCourseSelection < 15000) {
              logger.info(
                { userId, timeSinceCourseSelection },
                "Allowing through during course selection metadata propagation window"
              );
              return NextResponse.next();
            }
            
            // If we're navigating to the home page and it's recent activity, be more lenient
            if (req.nextUrl.pathname === "/" && isProduction) {
              const recentActivity = Math.min(timeSinceSwitch, timeSinceCourseSelection);
              if (recentActivity < 45000) { // 45 second grace period for home page
                logger.info(
                  { userId, recentActivity, pathname: req.nextUrl.pathname },
                  "Allowing home page navigation during recent activity"
                );
                return NextResponse.next();
              }
            }
            
            logger.info(
              { userId, selectedCourseId, timeSinceSwitch, timeSinceCourseSelection, pathname: req.nextUrl.pathname },
              "No selected course found, redirecting to courses page"
            );
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
