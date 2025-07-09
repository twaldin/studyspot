'use client';
import { LoaderCircle } from "lucide-react";
import { useEffect, useState, Suspense } from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';
import dynamic from 'next/dynamic';
import { dataService } from '@/lib/services/client';
import logger from '@/lib/logger';

// Dynamically import SchoolSelector for code splitting
const SchoolSelector = dynamic(
  () => import('@/features/auth/components/SchoolSelector'),
  {
    loading: () => (
      <div className="h-80 flex items-center justify-center">
        <LoaderCircle className="h-8 w-8 animate-spin" />
      </div>
    ),
    ssr: false, // Since this involves user interaction, we can disable SSR
  }
);

// Loading component for the main onboarding check
const OnboardingCheckLoader: React.FC = () => (
  <div className="min-h-screen flex items-center justify-center bg-[var(--primary)]">
    <LoaderCircle className="h-8 w-8 animate-spin" />
  </div>
);

// Main onboarding content component
const OnboardingContent: React.FC<{
  onSchoolSelected: (schoolId: string, schoolName: string, schoolDomain: string | null) => void;
}> = ({ onSchoolSelected }) => (
  <div className="min-h-screen bg-[var(--primary)] flex items-center justify-center p-4">
    <div className="w-full max-w-md">
      <div className="text-center mb-8">
        <h1 className="text-xl font-medium text-[var(--primary-text)] mb-2">
          Welcome to StudySpot!
        </h1>
        <p className="text-[var(--primary-text-light)]">
          Let's get you set up by selecting your school
        </p>
      </div>

      <div className="panel-primary-100 p-6">
        <Suspense fallback={
          <div className="h-80 flex items-center justify-center">
            <LoaderCircle className="h-8 w-8 animate-spin" />
          </div>
        }>
          <SchoolSelector onSchoolSelected={onSchoolSelected} />
        </Suspense>
      </div>
    </div>
  </div>
);

/**
 * Renders the onboarding page, handling user authentication, onboarding status checks, and navigation.
 *
 * Displays a loading spinner while verifying the user's authentication and onboarding status. If the user has completed onboarding, redirects to the main app. If not authenticated, redirects to the sign-in page. Otherwise, presents the onboarding flow for school selection and updates the user's onboarding metadata upon completion.
 */
export default function OnboardingPage() {
  const router = useRouter();
  const { user, isLoaded } = useUser();
  const [isCheckingStatus, setIsCheckingStatus] = useState(true);

  useEffect(() => {
    const checkOnboardingStatus = async () => {
      if (!isLoaded || !user) {
        return;
      }

      try {
        // Check if user has completed onboarding - use only hasCompletedOnboarding for consistency
        const hasCompletedOnboarding = user.publicMetadata?.hasCompletedOnboarding;

        if (hasCompletedOnboarding) {
          logger.info({ userId: user.id }, 'User has completed onboarding, redirecting to app');
          router.push('/app');
          return;
        }

        // If we reach here, user needs to complete onboarding
        logger.info({ userId: user.id }, 'User needs to complete onboarding');
      } catch (error) {
        logger.error({ error, userId: user.id }, 'Error checking onboarding status');
      } finally {
        setIsCheckingStatus(false);
      }
    };

    checkOnboardingStatus();
  }, [isLoaded, user, router]);

  const handleSchoolSelected = async (schoolId: string, schoolName: string, schoolDomain: string | null): Promise<void> => {
    if (!user) return Promise.reject(new Error("User not found"));

    try {
      // Use DataService to update onboarding - this will automatically clear all caches
      await dataService.updateOnboarding({
        selectedSchool: schoolId,
        selectedSchoolName: schoolName,
        selectedSchoolDomain: schoolDomain,
      });

      await user.reload(); // Reload user to ensure metadata is fresh for next page

      logger.info({ userId: user.id, schoolId, schoolName, schoolDomain }, 'User completed onboarding');

      // Navigate after successful update
      router.push('/app/select-course');
    } catch (error) {
      logger.error({ error, userId: user.id }, 'Error updating user metadata during onboarding');
      // Re-throw the error so the calling component can handle it
      throw error;
    }
  };

  // Show loading spinner while checking authentication and onboarding status
  if (!isLoaded || isCheckingStatus) {
    return <OnboardingCheckLoader />;
  }

  // Redirect to sign-in if user is not authenticated
  if (!user) {
    router.push('/sign-in');
    return <OnboardingCheckLoader />;
  }

  return (
    <Suspense fallback={<OnboardingCheckLoader />}>
      <OnboardingContent onSchoolSelected={handleSchoolSelected} />
    </Suspense>
  );
} 