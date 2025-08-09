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
  "/flashcards(.*)",
  "/quiz(.*)",
  "/post(.*)",
]);

const isOnboardingRoute = createRouteMatcher(["/onboarding(.*)"]);
const isPublicShareRoute = createRouteMatcher([
  "/chat/(.*)/share/(.*)",
  "/flashcards/(.*)/share/(.*)", 
  "/quiz/(.*)/share/(.*)",
]);

export default clerkMiddleware(async (auth, req) => {
  try {
    // Log for debugging in Cloudflare Workers
    if (process.env.openNextDebug === "true") {
      console.log("[MIDDLEWARE] Request URL:", req.url);
      console.log("[MIDDLEWARE] Request pathname:", req.nextUrl.pathname);
    }

    // Allow public share routes without authentication
    if (isPublicShareRoute(req)) {
      return NextResponse.next();
    }

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

          // If no selected course, redirect to courses page
          if (!selectedCourseId) {
            logger.info(
              { userId, selectedCourseId, pathname: req.nextUrl.pathname },
              "No selected course found, redirecting to courses page"
            );
            return NextResponse.redirect(new URL("/courses", req.url));
          }
        } catch (error) {
          logger.error(
            { error, url: req.url },
            "Error checking selected course in middleware",
          );
          // Allow through on error to prevent blocking
          return NextResponse.next();
        }
      }
    }

    return NextResponse.next();
  } catch (error) {
    logger.error({ error, url: req.url }, "Middleware execution error");
    return NextResponse.next();
  }
});

export const config = {
  matcher: [
    // Skip Next.js internals and all static files, unless found in search params
    "/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)",
    // Always run for API routes
    "/(api|trpc)(.*)",
  ],
};