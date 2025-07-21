import { Database } from "@/lib/database.types";

// Export school types based on the database schema
export type School = Database["public"]["Tables"]["schools"]["Row"];
export type SchoolInsert = Database["public"]["Tables"]["schools"]["Insert"];
export type SchoolUpdate = Database["public"]["Tables"]["schools"]["Update"];

// Additional interfaces for onboarding
export interface OnboardingStatus {
  hasCompletedOnboarding: boolean;
  selectedSchool?: string;
  selectedSchoolName?: string;
}

// User's school information
export interface UserSchool {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  domain: string | null;
  logo_url: string | null;
}
