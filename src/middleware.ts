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

export default clerkMiddleware(async (auth, req) => {
  try {
    
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
          const selectedCourseId = user.publicMetadata?.selectedCourseId;
          
          // If completed onboarding but accessing /app root, handle redirects
          if (req.nextUrl.pathname === '/app' || req.nextUrl.pathname === '/app/') {
            if (!selectedCourseId) {
              return NextResponse.redirect(new URL('/app/select-course', req.url));
            } else {
              const dashboardUrl = new URL('/app/dashboard', req.url);
              return NextResponse.redirect(dashboardUrl);
            }
          }
          
          if (!selectedCourseId && !req.nextUrl.pathname.includes('/select-course') && !req.nextUrl.pathname.includes('/create-course')) {
            return NextResponse.redirect(new URL('/app/select-course', req.url));
          }
        } catch (error) {
          console.error('Error checking selected course:', error);
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
        const dashboardUrl = new URL('/', req.url);
        return NextResponse.redirect(dashboardUrl);
      }
    }

    return NextResponse.next();

  } catch (error) {
    console.error('Middleware execution error:', error);
    logger.error({ error, url: req.url }, 'Middleware execution error');
    // Return a fallback response to prevent the middleware from completely failing
    return NextResponse.next();
  }
});