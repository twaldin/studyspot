import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  mutationKeys,
  queryKeys,
  useAuthenticatedUser,
} from "./base";
import { UserSchool } from "@/features/auth/types";
import logger from "@/lib/logger";

// Types
interface UserProfile {
  selectedCourseId?: string;
  selectedSchool?: string;
  selectedSchoolName?: string;
  selectedSchoolDomain?: string;
  hasCompletedOnboarding: boolean;
}

interface OnboardingUpdateRequest {
  selectedSchool: string;
  selectedSchoolName: string;
  selectedSchoolDomain: string | null;
}

interface SelectedCourseResponse {
  selectedCourse?: {
    id: string;
    title?: string;
    code?: string;
  };
}

interface School {
  id: string;
  name: string;
  city: string | null;
  state: string | null;
  domain: string | null;
  logo_url: string | null;
  created_at: string;
  updated_at: string;
}

interface SchoolsResponse {
  schools: School[];
}

interface CanvasCourse {
  id: number;
  name: string;
}

interface CanvasCoursesResponse {
  courses: CanvasCourse[];
}

interface CanvasFile {
  id: number;
  filename: string;
  "content-type": string;
  display_name: string;
  size: number;
  created_at: string;
  updated_at: string;
  url: string;
}

// User school query
export function useUserSchool() {
  const { isAuthenticated } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.user.school(),
    queryFn: async () => {
      const response = await apiClient<{ school: UserSchool | null }>(
        "/user/school",
      );
      return response.school;
    },
    enabled: isAuthenticated,
    staleTime: 1 * 60 * 1000, // Reduced to 1 minute to prevent stale data during rapid school switches
    gcTime: 5 * 60 * 1000, // 5 minutes garbage collection
    refetchOnWindowFocus: true, // Refetch when window gains focus to ensure fresh data
  });
}

// Update onboarding mutation
export function useUpdateOnboarding() {
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedUser();

  return useMutation({
    mutationKey: mutationKeys.user.updateOnboarding,
    mutationFn: async (data: OnboardingUpdateRequest) => {
      await apiClient("/user/onboarding", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return data;
    },
    onMutate: async (data) => {
      // Optimistically update the user school data
      await queryClient.cancelQueries({ queryKey: queryKeys.user.school() });
      
      const previousSchool = queryClient.getQueryData(queryKeys.user.school());
      
      // Set the new school data optimistically
      queryClient.setQueryData(queryKeys.user.school(), {
        id: data.selectedSchool,
        name: data.selectedSchoolName,
        domain: data.selectedSchoolDomain,
      });
      
      return { previousSchool };
    },
    onSuccess: async (data, variables, context) => {
      const isProduction = process.env.NODE_ENV === 'production';
      const targetSchoolId = data.selectedSchool;
      
      // Clear the backend user cache to ensure fresh data
      if (user?.id) {
        await fetch('/api/user/cache', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        }).catch(() => {
          // If cache clearing fails, continue anyway
          logger.warn("Failed to clear backend user cache");
        });
      }
      
      // Force reload of user metadata with retry logic for production
      await user?.reload();
      
      // In production, add retry logic for metadata consistency
      if (isProduction && user) {
        let attempts = 0;
        const maxAttempts = 8;
        const retryDelay = 1500; // 1.5 seconds between retries
        
        while (attempts < maxAttempts) {
          await new Promise(resolve => setTimeout(resolve, retryDelay));
          await user.reload();
          
          const currentSelectedSchool = user.publicMetadata?.selectedSchool;
          if (currentSelectedSchool === targetSchoolId) {
            logger.info(
              { schoolId: targetSchoolId, attempts: attempts + 1 },
              "Metadata consistency confirmed in production"
            );
            break;
          }
          
          attempts++;
          if (attempts >= maxAttempts) {
            logger.warn(
              { 
                schoolId: targetSchoolId, 
                currentSchool: currentSelectedSchool,
                userMetadata: user.publicMetadata 
              },
              "Metadata consistency check timed out in production, proceeding anyway"
            );
          }
        }
      }
      
      // Aggressively clear all school-dependent data
      queryClient.removeQueries({ queryKey: queryKeys.user.school() });
      queryClient.removeQueries({ queryKey: queryKeys.courses.all });
      queryClient.removeQueries({ queryKey: queryKeys.chats.all });
      queryClient.removeQueries({ queryKey: queryKeys.documents.all });
      
      // Clear selected course since it's school-dependent
      queryClient.setQueryData(queryKeys.user.selectedCourse(), null);
      
      // Force refetch of critical queries
      setTimeout(() => {
        queryClient.invalidateQueries({ queryKey: queryKeys.user.school() });
        queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
        queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      }, isProduction ? 2000 : 100);
      
      // Set a timestamp for recent school switch to help middleware handle propagation delays
      if (typeof window !== 'undefined') {
        const timestamp = Date.now().toString();
        sessionStorage.setItem('school-switch-timestamp', timestamp);
        
        // Also set it as a cookie that middleware can read (60 second expiry)
        document.cookie = `school-switch-timestamp=${timestamp}; path=/; max-age=60`;
        
        // Clean up the timestamp after metadata should have propagated
        setTimeout(() => {
          sessionStorage.removeItem('school-switch-timestamp');
          // Clear the cookie by setting expiry to past
          document.cookie = 'school-switch-timestamp=; path=/; expires=Thu, 01 Jan 1970 00:00:00 GMT';
        }, isProduction ? 60000 : 10000); // 60s in prod, 10s in dev
      }
      
      logger.info({ schoolId: targetSchoolId }, "Updated onboarding with production-safe metadata handling");
    },
    onError: (error, variables, context) => {
      // Revert optimistic update on error
      if (context?.previousSchool !== undefined) {
        queryClient.setQueryData(queryKeys.user.school(), context.previousSchool);
      }
      logger.error({ error }, "Failed to update onboarding");
    },
  });
}

// Remove school mutation
export function useRemoveSchool() {
  const queryClient = useQueryClient();
  const { user } = useAuthenticatedUser();

  return useMutation({
    mutationKey: mutationKeys.user.removeSchool,
    mutationFn: async () => {
      await apiClient("/user/school", { method: "DELETE" });
    },
    onSuccess: async () => {
      // Clear the backend user cache
      if (user?.id) {
        await fetch('/api/user/cache', {
          method: 'DELETE',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ userId: user.id })
        }).catch(() => {
          logger.warn("Failed to clear backend user cache");
        });
      }

      logger.info("Removed school");
    },
    onError: (error) => {
      logger.error({ error }, "Failed to remove school");
    },
  });
}

export function useClearUserCourses() {
  const queryClient = useQueryClient();
  return useMutation({
    mutationKey: mutationKeys.user.clearCourses,
    mutationFn: async () => {
      await apiClient("/user/clear-courses", { method: "POST" });
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({
        queryKey: queryKeys.user.selectedCourse(),
      });
    },
  });
}

// Schools list query (for onboarding)
export function useSchools() {
  return useQuery({
    queryKey: queryKeys.schools.lists(),
    queryFn: async () => {
      const response = await apiClient<SchoolsResponse>("/schools");
      return (response.schools || []).map((school: School) => ({
        ...school,
        name: school.name.trim(),
      }));
    },
    staleTime: 30 * 60 * 1000, // 30 minutes for schools list
  });
}

// Waitlist mutation
export function useAddToWaitlist() {
  return useMutation({
    mutationKey: ["waitlist", "add"],
    mutationFn: async (email: string) => {
      const response = await apiClient<{ message: string }>("/waitlist", {
        method: "POST",
        body: JSON.stringify({ email }),
      });
      return response;
    },
    onSuccess: () => {
      logger.info("Successfully added email to waitlist");
    },
    onError: (error) => {
      logger.error({ error }, "Failed to add email to waitlist");
    },
  });
}

// Developer mode query
export function useIsDeveloper() {
  const { user } = useAuthenticatedUser();
  
  return useQuery({
    queryKey: queryKeys.user.isDeveloper(),
    queryFn: () => {
      return user?.publicMetadata?.role === "developer";
    },
    enabled: !!user,
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}

// Canvas courses query
