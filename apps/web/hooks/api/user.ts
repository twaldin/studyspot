import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  mutationKeys,
  queryKeys,
  useAuthenticatedUser,
} from "./base";
import { UserSchool } from "@/features/auth/types";
import logger from "@/lib/logger";
import { CacheManager } from "@/lib/utils/cache-manager";

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
      const targetSchoolId = data.selectedSchool;
      
      try {
        logger.info({ schoolId: targetSchoolId }, "Starting school selection flow");

        // Step 1: Clear ALL caches to ensure fresh data
        await CacheManager.clearAllCaches(user?.id, queryClient);

        // Step 2: Force user reload to get fresh JWT with new school context
        await user?.reload();

        // Step 3: Refresh auth clients to clear any cached tokens
        await CacheManager.refreshAuthClients(user?.id || '');

        logger.info({ schoolId: targetSchoolId }, "School selection completed successfully");
        
      } catch (error) {
        logger.error({ error, schoolId: targetSchoolId }, "Error in school selection flow");
        // Don't throw - let the navigation continue
      }
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
