import { clerkMiddleware, createRouteMatcher } from "@clerk/nextjs/server";
import { NextResponse } from "next/server";
import { getUserOnboardingStatus } from "@/lib/clerk";
import { clerkClient } from "@clerk/nextjs/server";
import logger from '@/lib/logger';

const isProtectedRoute = createRouteMatcher([
  '/app(.*)',
  '/',
]);

const isOnboardingRoute = createRouteMatcher([
  '/onboarding(.*)',
]);

// const isLandingPage = createRouteMatcher([
//   '/',
// ]);

export default clerkMiddleware(async (auth, req) => {
  // Handle root path redirects for authenticated users
  // if (isLandingPage(req)) {
  //   const { userId } = await auth();
  //   if (userId) {
  //     // User is authenticated, redirect to app
  //     const appUrl = new URL('/app', req.url);
  //     return NextResponse.redirect(appUrl);
  //   }
  //   // For unauthenticated users, let them see the landing page
  //   return NextResponse.next();
  // }
  
  // Check if this is a protected route
  if (isProtectedRoute(req)) {
    const { userId } = await auth();

    // If not authenticated, redirect to sign-in
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirectUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // Check if user has completed onboarding
    const onboardingStatus = await getUserOnboardingStatus(userId);

    if (!onboardingStatus.hasCompletedOnboarding) {
      // If not completed onboarding and not already on onboarding page
      if (!req.nextUrl.pathname.startsWith('/onboarding')) {
        const onboardingUrl = new URL('/onboarding', req.url);
        return NextResponse.redirect(onboardingUrl);
      }
    } else {
      try {
        const client = await clerkClient();
        const user = await client.users.getUser(userId);
        const selectedCourseId = user.publicMetadata.selectedCourseId;
        
        // If completed onboarding but accessing /app root, handle redirects
        if (req.nextUrl.pathname === '/app' || req.nextUrl.pathname === '/app/') {
          if (!selectedCourseId) {
            // If no course is selected, go to select-course
            return NextResponse.redirect(new URL('/app/select-course', req.url));
          } else {
            // Otherwise, go to dashboard
            const dashboardUrl = new URL('/app/dashboard', req.url);
            return NextResponse.redirect(dashboardUrl);
          }
        }
        
        if (!selectedCourseId && !req.nextUrl.pathname.includes('/select-course') && !req.nextUrl.pathname.includes('/create-course')) {
          return NextResponse.redirect(new URL('/app/select-course', req.url));
        }
      } catch (error) {
        logger.error({ error, url: req.url }, 'Error checking selected course in middleware');
        // Continue to the requested page if there's an error checking
      }
    }
  }

  // Allow access to onboarding routes for authenticated users
  if (isOnboardingRoute(req)) {
    const { userId } = await auth();
    if (!userId) {
      const signInUrl = new URL('/sign-in', req.url);
      signInUrl.searchParams.set('redirectUrl', req.url);
      return NextResponse.redirect(signInUrl);
    }

    // If user has already completed onboarding, redirect to dashboard
    const onboardingStatus = await getUserOnboardingStatus(userId);
    if (onboardingStatus.hasCompletedOnboarding) {
      const dashboardUrl = new URL('/app/dashboard', req.url);
      return NextResponse.redirect(dashboardUrl);
    }
  }
});

export const config = {
  matcher: [
    // Include root path but exclude it from running during static generation
    '/((?!_next|_static|_vercel|favicon.ico).*)',
    // Skip Next.js internals and all static files, unless found in search params
    '/((?!_next|[^?]*\\.(?:html?|css|js(?!on)|jpe?g|webp|png|gif|svg|ttf|woff2?|ico|csv|docx?|xlsx?|zip|webmanifest)).*)',
    // Always run for API routes
    '/(api|trpc)(.*)',
  ],
};