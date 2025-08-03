import { auth } from "@clerk/nextjs/server";
import { supabaseService } from "@/lib/services/database/supabase.service";
import { getUserOnboardingStatus } from "@/lib/clerk";
import type { SupabaseClient } from "@supabase/supabase-js";
import type { Database } from "@/lib/database.types";

export interface AuthResult {
  userId: string;
  supabase: SupabaseClient<Database>;
}

export interface AuthWithSchoolResult extends AuthResult {
  selectedSchool: string;
  selectedSchoolName: string;
  selectedSchoolDomain?: string;
}


/**
 * Basic auth validation - checks if user is authenticated
 */
export async function validateAuth(): Promise<AuthResult> {
  const authResult = await auth();
  const userId = authResult?.userId;

  if (!userId) {
    throw new Error("Unauthorized");
  }

  const supabase = await supabaseService.createAuthenticatedClient();

  return {
    userId,
    supabase,
  };
}

/**
 * Auth validation with school verification
 */
export async function validateAuthWithSchool(): Promise<AuthWithSchoolResult> {
  const authResult = await validateAuth();

  const onboardingStatus = await getUserOnboardingStatus(authResult.userId);

  if (!onboardingStatus.hasCompletedOnboarding) {
    throw new Error("Please complete onboarding first");
  }

  if (!onboardingStatus.selectedSchool || !onboardingStatus.selectedSchoolName) {
    throw new Error("No school selected");
  }

  return {
    ...authResult,
    selectedSchool: onboardingStatus.selectedSchool,
    selectedSchoolName: onboardingStatus.selectedSchoolName,
    selectedSchoolDomain: onboardingStatus.selectedSchoolDomain,
  };
}

