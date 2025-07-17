import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  mutationKeys,
  queryKeys,
  useAuthenticatedUser,
} from "./base";
import { useUserSchool } from "./user"; // Import useUserSchool
import { ICourse } from "@/features/courses/course.model";
import logger from "@/lib/logger";
import { RATE_LIMITS, rateLimiter } from "@/lib/utils/rate-limiter";
import { UserSchool } from "@/features/auth/types";

// Types
interface CreateCourseRequest {
  code: string;
  title: string;
  uploadedFileUrl: string;
}

interface CreateCourseResponse {
  course: ICourse;
}

interface SuggestedQueriesResponse {
  suggestedQueries: string[];
}

// Course list query
export function useCourses() {
  const { data: school, isLoading: isSchoolLoading } = useUserSchool();
  const schoolId = school?.id;
  const { isAuthenticated } = useAuthenticatedUser();
  const queryClient = useQueryClient();

  return useQuery({
    queryKey: queryKeys.courses.list(schoolId),
    queryFn: async () => {
      // Double-check that we still have the same school ID to prevent race conditions
      const currentSchool = queryClient.getQueryData(queryKeys.user.school()) as UserSchool | null;
      if (currentSchool?.id !== schoolId) {
        throw new Error("School ID changed during fetch, aborting");
      }
      
      const response = await apiClient<{ courses: ICourse[] }>(
        "/courses",
      );
      return response.courses || [];
    },
    enabled: isAuthenticated && !!schoolId && !isSchoolLoading,
    staleTime: 2 * 60 * 1000, // Reduced to 2 minutes to prevent stale data during school switches
    retry: (failureCount, error) => {
      // Don't retry if the error is due to school ID change
      if (error.message?.includes("School ID changed during fetch")) {
        return false;
      }
      return failureCount < 3;
    },
  });
}

// Selected course query
export function useSelectedCourse() {
  const { isAuthenticated } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.user.selectedCourse(),
    queryFn: async () => {
      const response = await apiClient<{ selectedCourse: ICourse | null }>(
        "/user/selected-course",
      );
      return response.selectedCourse;
    },
    enabled: isAuthenticated,
    staleTime: Infinity, // Never consider cached data stale
    gcTime: 15 * 60 * 1000, // 15 minutes
    refetchOnMount: false, // Don't refetch when component mounts
    refetchOnWindowFocus: false, // Don't refetch on window focus
  });
}

// Joined courses query
export function useJoinedCourses() {
  const { isAuthenticated, joinedCourses, isLoading } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.user.joinedCourses(),
    queryFn: () => joinedCourses,
    enabled: isAuthenticated && !isLoading,
    initialData: isAuthenticated ? joinedCourses : undefined,
    staleTime: 5 * 60 * 1000, // 5 minutes
    gcTime: 15 * 60 * 1000, // 15 minutes
  });
}

// Suggested queries for course
export function useSuggestedQueries(courseId?: string) {
  const { isAuthenticated } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.courses.suggestedQueries(courseId!),
    queryFn: async () => {
      const response = await apiClient<
        SuggestedQueriesResponse & { fromCache?: boolean }
      >(`/suggested-queries?courseId=${courseId}`);
      return response.suggestedQueries || [];
    },
    enabled: isAuthenticated && !!courseId,
    staleTime: 15 * 60 * 1000, // 15 minutes for suggested queries
  });
}

// Set selected course mutation
export function useSetSelectedCourse() {
  const queryClient = useQueryClient();
  const { data: school } = useUserSchool();
  const schoolId = school?.id;

  return useMutation({
    mutationKey: mutationKeys.user.setSelectedCourse,
    mutationFn: async (course: ICourse) => {
      await apiClient("/user/selected-course", {
        method: "POST",
        body: JSON.stringify({ courseId: course.id }),
      });
      return course;
    },
    onMutate: async (course) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.selectedCourse(),
      });
      const previousSelectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      );
      queryClient.setQueryData(queryKeys.user.selectedCourse(), course);
      return { previousSelectedCourse };
    },
    onSuccess: (course) => {
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      queryClient.setQueryData(queryKeys.user.selectedCourse(), course);
      logger.info({ courseId: course.id }, "Set selected course");
    },
    onError: (error, course, context) => {
      if (context?.previousSelectedCourse !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.selectedCourse(),
          context.previousSelectedCourse,
        );
      }
      logger.error({ error }, "Failed to set selected course");
    },
  });
}

// Create course mutation
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { data: school } = useUserSchool();
  const schoolId = school?.id;

  return useMutation({
    mutationKey: mutationKeys.courses.create,
    mutationFn: async (courseData: CreateCourseRequest) => {
      if (rateLimiter.checkRateLimit("/courses", RATE_LIMITS.COURSE_CREATION)) {
        throw new Error("Rate limit exceeded for course creation");
      }
      const response = await apiClient<CreateCourseResponse>(
        "/courses",
        {
          method: "POST",
          body: JSON.stringify(courseData),
        },
      );
      return response.course;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });
      logger.info("Created new course");
    },
    onError: (error) => {
      logger.error({ error }, "Failed to create course");
    },
  });
}

// Delete course mutation
export function useDeleteCourse() {
  const queryClient = useQueryClient();
  const { data: school } = useUserSchool();
  const schoolId = school?.id;

  return useMutation({
    mutationKey: mutationKeys.courses.delete,
    mutationFn: async (courseId: string) => {
      await apiClient(`/courses/${courseId}`, { method: "DELETE" });
      return courseId;
    },
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });
      const previousCourses = queryClient.getQueryData(
        queryKeys.courses.list(schoolId),
      );
      queryClient.setQueryData(
        queryKeys.courses.list(schoolId),
        (old: ICourse[] | undefined) =>
          old?.filter((course) => course.id !== courseId) || [],
      );
      return { previousCourses };
    },
    onSuccess: (deletedCourseId) => {
      const selectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      ) as ICourse | null;
      if (selectedCourse?.id === deletedCourseId) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), null);
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      }
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });
      logger.info({ courseId: deletedCourseId }, "Deleted course");
    },
    onError: (error, courseId, context) => {
      if (context?.previousCourses) {
        queryClient.setQueryData(
          queryKeys.courses.list(schoolId),
          context.previousCourses,
        );
      }
      logger.error({ error }, "Failed to delete course");
    },
    onSettled: () => {
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });
    },
  });
}

// Join course mutation
export function useJoinCourse() {
  const queryClient = useQueryClient();
  const { data: school } = useUserSchool();
  const schoolId = school?.id;

  return useMutation({
    mutationKey: mutationKeys.user.joinCourse,
    mutationFn: async ({ courseId, courseData }: { courseId: string; courseData: ICourse }) => {
      const response = await apiClient<
        { success: boolean; joinedCourses: string[] }
      >(
        "/courses/join",
        {
          method: "POST",
          body: JSON.stringify({ courseId }),
        },
      );
      return { joinedCourses: response.joinedCourses, courseData };
    },
    onMutate: async ({ courseId, courseData }) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.joinedCourses(),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.selectedCourse(),
      });
      const previousJoinedCourses = queryClient.getQueryData(
        queryKeys.user.joinedCourses(),
      ) as string[] | undefined;
      const previousSelectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      ) as ICourse | null;
      const currentJoinedCourses = previousJoinedCourses || [];
      const updatedJoinedCourses = [...currentJoinedCourses, courseId];
      queryClient.setQueryData(
        queryKeys.user.joinedCourses(),
        updatedJoinedCourses,
      );
      queryClient.setQueryData(queryKeys.user.selectedCourse(), courseData);
      queryClient.setQueryData(
        [...queryKeys.chats.list(schoolId), 'joined-courses', updatedJoinedCourses],
        (oldData: any) => oldData || []
      );
      return { previousJoinedCourses, previousSelectedCourse };
    },
    onSuccess: async ({ joinedCourses, courseData }) => {
      queryClient.setQueryData(queryKeys.user.joinedCourses(), joinedCourses);
      await apiClient("/user/selected-course", {
        method: "POST",
        body: JSON.stringify({ courseId: courseData.id }),
      });
      queryClient.setQueryData(queryKeys.user.selectedCourse(), courseData);
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            const key = query.queryKey;
            return Array.isArray(key) && key.length >= 2 && 
                   key[0] === 'chats' && key[1] === 'list';
          }
        });
      }, 100);
      logger.info({ courseId: courseData.id }, "Joined course and set as selected");
    },
    onError: (error, { courseId }, context) => {
      if (context?.previousJoinedCourses !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.joinedCourses(),
          context.previousJoinedCourses,
        );
      }
      if (context?.previousSelectedCourse !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.selectedCourse(),
          context.previousSelectedCourse,
        );
      }
      logger.error({ error }, "Failed to join course");
    },
  });
}

// Leave course mutation
export function useLeaveCourse() {
  const queryClient = useQueryClient();
  const { data: school } = useUserSchool();
  const schoolId = school?.id;

  return useMutation({
    mutationKey: mutationKeys.user.leaveCourse,
    mutationFn: async (courseId: string) => {
      const response = await apiClient<{
        success: boolean;
        joinedCourses: string[];
      }>("/courses/leave", {
        method: "POST",
        body: JSON.stringify({ courseId }),
      });
      return { joinedCourses: response.joinedCourses, leftCourseId: courseId };
    },
    onMutate: async (courseId) => {
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.joinedCourses(),
      });
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.selectedCourse(),
      });
      const previousJoinedCourses = queryClient.getQueryData(
        queryKeys.user.joinedCourses(),
      ) as string[] | undefined;
      const previousSelectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      ) as ICourse | null;
      const currentJoinedCourses = previousJoinedCourses || [];
      const updatedJoinedCourses = currentJoinedCourses.filter(
        (id) => id !== courseId,
      );
      queryClient.setQueryData(
        queryKeys.user.joinedCourses(),
        updatedJoinedCourses,
      );
      if (previousSelectedCourse?.id === courseId) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), null);
      }
      queryClient.setQueryData(
        [...queryKeys.chats.list(schoolId), 'joined-courses', updatedJoinedCourses],
        (oldData: any) => oldData || []
      );
      return { 
        updatedJoinedCourses, 
        previousJoinedCourses, 
        previousSelectedCourse,
        wasSelectedCourseLeft: previousSelectedCourse?.id === courseId
      };
    },
    onSuccess: async ({ joinedCourses, leftCourseId }, courseId, context) => {
      queryClient.setQueryData(queryKeys.user.joinedCourses(), joinedCourses);
      if (context?.wasSelectedCourseLeft) {
        if (joinedCourses.length > 0) {
          const allCourses = queryClient.getQueryData(
            queryKeys.courses.list(schoolId),
          ) as ICourse[] | undefined;
          
          if (allCourses) {
            const firstJoinedCourse = allCourses.find((course) => 
              joinedCourses.includes(course.id)
            );
            
            if (firstJoinedCourse) {
              await apiClient("/user/selected-course", {
                method: "POST",
                body: JSON.stringify({ courseId: firstJoinedCourse.id }),
              });
              queryClient.setQueryData(queryKeys.user.selectedCourse(), firstJoinedCourse);
              logger.info({ courseId: firstJoinedCourse.id }, "Auto-selected next available course");
            }
          }
        } else {
          await apiClient("/user/selected-course", { method: "DELETE" });
          queryClient.setQueryData(queryKeys.user.selectedCourse(), null);
          logger.info("Cleared selected course - no courses remaining");
        }
      }
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all,
      });
      setTimeout(() => {
        queryClient.invalidateQueries({ 
          predicate: (query) => {
            const key = query.queryKey;
            return Array.isArray(key) && key.length >= 2 && 
                   key[0] === 'chats' && key[1] === 'list';
          }
        });
      }, 100);
      logger.info({ courseId: leftCourseId }, "Left course successfully");
    },
    onError: (error, courseId, context) => {
      if (context?.previousJoinedCourses !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.joinedCourses(),
          context.previousJoinedCourses,
        );
      }
      if (context?.previousSelectedCourse !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.selectedCourse(),
          context.previousSelectedCourse,
        );
      }
      logger.error({ error }, "Failed to leave course");
    },
  });
}

// Verify course mutation
export function useVerifyCourse() {
  return useMutation({
    mutationKey: mutationKeys.courses.verify,
    mutationFn: async ({ courseCode }: { courseCode: string }) => {
      const response = await apiClient("/courses/verify", {
        method: "POST",
        body: JSON.stringify({ courseCode }),
      });
      return response;
    },
  });
}
