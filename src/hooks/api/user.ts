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
    staleTime: 10 * 60 * 1000, // 10 minutes
  });
}

// Update onboarding mutation
export function useUpdateOnboarding() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.user.updateOnboarding,
    mutationFn: async (data: OnboardingUpdateRequest) => {
      await apiClient("/user/onboarding", {
        method: "POST",
        body: JSON.stringify(data),
      });
      return data;
    },
    onSuccess: () => {
      // Invalidate user-related caches since school data changed
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.school() });

      // Clear all school-scoped data
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });

      logger.info("Updated onboarding data and cleared school-scoped caches");
    },
    onError: (error) => {
      logger.error({ error }, "Failed to update onboarding");
    },
  });
}

// Remove school mutation
export function useRemoveSchool() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.user.removeSchool,
    mutationFn: async () => {
      await apiClient("/user/school", { method: "DELETE" });
    },
    onSuccess: () => {
      // Clear ALL caches since school removal affects everything
      queryClient.clear();

      logger.info("Removed school and cleared all caches");
    },
    onError: (error) => {
      logger.error({ error }, "Failed to remove school");
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
