import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import {
  apiClient,
  mutationKeys,
  queryKeys,
  useAuthenticatedUser,
} from "./base";
import { ICourse } from "@/features/courses/course.model";
import logger from "@/lib/logger";
import { RATE_LIMITS, rateLimiter } from "@/lib/utils/rate-limiter";

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
  const { schoolId, isAuthenticated } = useAuthenticatedUser();

  console.log("use courses called");
  return useQuery({
    queryKey: queryKeys.courses.list(schoolId),
    queryFn: async () => {
      const response = await apiClient<{ courses: ICourse[] }>(
        "/courses",
      );
      return response.courses || [];
    },
    enabled: isAuthenticated && !!schoolId,
    staleTime: 10 * 60 * 1000, // 10 minutes for course list
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
  const { schoolId } = useAuthenticatedUser();

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
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.selectedCourse(),
      });

      // Snapshot the previous value
      const previousSelectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      );

      // Optimistically update to the new course immediately
      queryClient.setQueryData(queryKeys.user.selectedCourse(), course);

      return { previousSelectedCourse };
    },
    onSuccess: (course) => {
      // Invalidate all queries that depend on the selected course
      queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      queryClient.invalidateQueries({ queryKey: queryKeys.documents.all });

      // Set the selected course in the cache
      queryClient.setQueryData(queryKeys.user.selectedCourse(), course);

      logger.info({ courseId: course.id }, "Set selected course");
    },
    onError: (error, course, context) => {
      // Rollback on error
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

// Clear selected course mutation
export function useClearSelectedCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.user.clearSelectedCourse,
    mutationFn: async () => {
      await apiClient("/user/selected-course", { method: "DELETE" });
    },
    onSuccess: () => {
      // Clear selected course cache and force refetch
      queryClient.setQueryData(queryKeys.user.selectedCourse(), null);
      queryClient.invalidateQueries({ queryKey: queryKeys.user.selectedCourse() });

      // Invalidate related caches to ensure fresh data
      queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      queryClient.invalidateQueries({ queryKey: queryKeys.user.all });
      queryClient.invalidateQueries({
        predicate: (query) =>
          query.queryKey[0] === "courses" &&
          query.queryKey.includes("suggestedQueries"),
      });

      logger.info("Cleared selected course");
    },
    onError: (error) => {
      logger.error({ error }, "Failed to clear selected course");
    },
  });
}

// Create course mutation
export function useCreateCourse() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();

  return useMutation({
    mutationKey: mutationKeys.courses.create,
    mutationFn: async (courseData: CreateCourseRequest) => {
      // Apply course creation rate limiting
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
      // Invalidate courses list to refetch with new course
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
  const { schoolId } = useAuthenticatedUser();

  return useMutation({
    mutationKey: mutationKeys.courses.delete,
    mutationFn: async (courseId: string) => {
      await apiClient(`/courses/${courseId}`, { method: "DELETE" });
      return courseId;
    },
    onMutate: async (courseId) => {
      // Cancel any outgoing refetches (so they don't overwrite our optimistic update)
      await queryClient.cancelQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });

      // Snapshot the previous value
      const previousCourses = queryClient.getQueryData(
        queryKeys.courses.list(schoolId),
      );

      // Optimistically update to the new value
      queryClient.setQueryData(
        queryKeys.courses.list(schoolId),
        (old: ICourse[] | undefined) =>
          old?.filter((course) => course.id !== courseId) || [],
      );

      // Return context with the previous value
      return { previousCourses };
    },
    onSuccess: (deletedCourseId) => {
      // Check if deleted course was selected and clear it
      const selectedCourse = queryClient.getQueryData(
        queryKeys.user.selectedCourse(),
      ) as ICourse | null;
      if (selectedCourse?.id === deletedCourseId) {
        queryClient.setQueryData(queryKeys.user.selectedCourse(), null);
        queryClient.invalidateQueries({ queryKey: queryKeys.user.profile() });
      }

      // Invalidate and refetch courses list to ensure database sync
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });

      logger.info({ courseId: deletedCourseId }, "Deleted course");
    },
    onError: (error, courseId, context) => {
      // If the mutation fails, use the context to roll back
      if (context?.previousCourses) {
        queryClient.setQueryData(
          queryKeys.courses.list(schoolId),
          context.previousCourses,
        );
      }
      logger.error({ error }, "Failed to delete course");
    },
    onSettled: () => {
      // Always refetch after error or success to ensure cache consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.courses.list(schoolId),
      });
    },
  });
}

// Join course mutation
export function useJoinCourse() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.user.joinCourse,
    mutationFn: async (courseId: string) => {
      const response = await apiClient<
        { success: boolean; joinedCourses: string[] }
      >(
        "/courses/join",
        {
          method: "POST",
          body: JSON.stringify({ courseId }),
        },
      );
      return response.joinedCourses;
    },
    onMutate: async (courseId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.joinedCourses(),
      });

      // Snapshot the previous value
      const previousJoinedCourses = queryClient.getQueryData(
        queryKeys.user.joinedCourses(),
      ) as string[] | undefined;

      // Optimistically update joined courses
      const currentJoinedCourses = previousJoinedCourses || [];
      const updatedJoinedCourses = [...currentJoinedCourses, courseId];
      queryClient.setQueryData(
        queryKeys.user.joinedCourses(),
        updatedJoinedCourses,
      );

      return { previousJoinedCourses };
    },
    onSuccess: (joinedCourses) => {
      // Update joined courses cache with server response
      queryClient.setQueryData(queryKeys.user.joinedCourses(), joinedCourses);

      logger.info("Joined course successfully");
    },
    onError: (error, courseId, context) => {
      // Rollback on error
      if (context?.previousJoinedCourses !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.joinedCourses(),
          context.previousJoinedCourses,
        );
      }
      logger.error({ error }, "Failed to join course");
    },
  });
}

// Leave course mutation
export function useLeaveCourse() {
  const queryClient = useQueryClient();
  const { schoolId } = useAuthenticatedUser();

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
      return response.joinedCourses;
    },
    onMutate: async (courseId) => {
      // Cancel any outgoing refetches
      await queryClient.cancelQueries({
        queryKey: queryKeys.user.joinedCourses(),
      });

      // Snapshot the previous value
      const previousJoinedCourses = queryClient.getQueryData(
        queryKeys.user.joinedCourses(),
      ) as string[] | undefined;

      // Optimistically update joined courses
      const currentJoinedCourses = previousJoinedCourses || [];
      const updatedJoinedCourses = currentJoinedCourses.filter(
        (id) => id !== courseId,
      );
      queryClient.setQueryData(
        queryKeys.user.joinedCourses(),
        updatedJoinedCourses,
      );

      return { updatedJoinedCourses, previousJoinedCourses };
    },
    onSuccess: async (joinedCourses, courseId) => {
      // Update joined courses cache with server response
      queryClient.setQueryData(queryKeys.user.joinedCourses(), joinedCourses);

      // Invalidate all course-related data to reflect the change
      await queryClient.invalidateQueries({ queryKey: queryKeys.courses.all });
      await queryClient.invalidateQueries({ queryKey: queryKeys.chats.all });
      await queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all,
      });

      logger.info("Left course successfully");
    },
    onError: (error, courseId, context) => {
      // Rollback on error
      if (context?.previousJoinedCourses !== undefined) {
        queryClient.setQueryData(
          queryKeys.user.joinedCourses(),
          context.previousJoinedCourses,
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
