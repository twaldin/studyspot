import { useUser } from '@clerk/nextjs';
import { rateLimiter, RATE_LIMITS } from '@/lib/utils/rate-limiter';

// Base API configuration and utilities
export const API_BASE_URL = process.env.NODE_ENV === 'production' ? '' : '';

// API Error class for better error handling
export class APIError extends Error {
  constructor(
    public status: number,
    public statusText: string,
    message: string,
    public data?: any
  ) {
    super(message);
    this.name = 'APIError';
  }
}

// Generic API fetch function with error handling and rate limiting
export async function apiClient<T = any>(
  endpoint: string,
  options?: RequestInit
): Promise<T> {
  // Apply rate limiting to API calls
  if (rateLimiter.checkRateLimit(endpoint, RATE_LIMITS.API_CALLS)) {
    throw new APIError(429, "Too Many Requests", "Rate limit exceeded", { endpoint });
  }
  
  const url = `${API_BASE_URL}/api${endpoint}`;
  
  const config: RequestInit = {
    headers: {
      'Content-Type': 'application/json',
      ...options?.headers,
    },
    ...options,
  };

  const response = await fetch(url, config);

  if (!response.ok) {
    let errorData;
    try {
      errorData = await response.json();
    } catch {
      errorData = { message: response.statusText };
    }

    throw new APIError(
      response.status,
      response.statusText,
      errorData.message || `HTTP ${response.status}: ${response.statusText}`,
      errorData
    );
  }

  // Handle empty responses (like DELETE operations)
  if (response.status === 204 || response.headers.get('content-length') === '0') {
    return {} as T;
  }

  return response.json();
}

// Hook to get user context for API calls
export function useAuthenticatedUser() {
  const { user, isLoaded } = useUser();
  
  return {
    user,
    isAuthenticated: isLoaded && !!user,
    isLoading: !isLoaded,
    userId: user?.id,
    schoolId: user?.publicMetadata?.selectedSchool as string | undefined,
    schoolName: user?.publicMetadata?.selectedSchoolName as string | undefined,
    joinedCourses: (user?.publicMetadata?.joinedCourses as string[]) || [],
  };
}

// Query key factories for consistent cache keys
export const queryKeys = {
  // User-related queries
  user: {
    all: ['user'] as const,
    profile: () => [...queryKeys.user.all, 'profile'] as const,
    selectedCourse: () => [...queryKeys.user.all, 'selectedCourse'] as const,
    joinedCourses: () => [...queryKeys.user.all, 'joinedCourses'] as const,
    school: () => [...queryKeys.user.all, 'school'] as const,
    onboardingStatus: () => [...queryKeys.user.all, 'onboardingStatus'] as const,
    isDeveloper: () => [...queryKeys.user.all, 'isDeveloper'] as const,
  },
  
  // Course-related queries
  courses: {
    all: ['courses'] as const,
    lists: () => [...queryKeys.courses.all, 'list'] as const,
    list: (schoolId?: string) => [...queryKeys.courses.lists(), { schoolId }] as const,
    details: () => [...queryKeys.courses.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.courses.details(), id] as const,
    suggestedQueries: (courseId: string) => [...queryKeys.courses.all, 'suggestedQueries', courseId] as const,
  },
  
  // Chat-related queries
  chats: {
    all: ['chats'] as const,
    lists: () => [...queryKeys.chats.all, 'list'] as const,
    list: (schoolId?: string) => [...queryKeys.chats.lists(), { schoolId }] as const,
    details: () => [...queryKeys.chats.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.chats.details(), id] as const,
  },
  
  // Document-related queries
  documents: {
    all: ['documents'] as const,
    lists: () => [...queryKeys.documents.all, 'list'] as const,
    list: (courseId?: string) => [...queryKeys.documents.lists(), { courseId }] as const,
    details: () => [...queryKeys.documents.all, 'detail'] as const,
    detail: (id: string) => [...queryKeys.documents.details(), id] as const,
    batch: (ids: string[]) => [...queryKeys.documents.all, 'batch', ids.sort()] as const,
  },
  
  // School-related queries
  schools: {
    all: ['schools'] as const,
    lists: () => [...queryKeys.schools.all, 'list'] as const,
  },
} as const;

// Mutation key factories
export const mutationKeys = {
  user: {
    setSelectedCourse: ['user', 'setSelectedCourse'] as const,
    clearSelectedCourse: ['user', 'clearSelectedCourse'] as const,
    joinCourse: ['user', 'joinCourse'] as const,
    leaveCourse: ['user', 'leaveCourse'] as const,
    updateOnboarding: ['user', 'updateOnboarding'] as const,
    removeSchool: ['user', 'removeSchool'] as const,
  },
  
  courses: {
    create: ['courses', 'create'] as const,
    delete: ['courses', 'delete'] as const,
    verify: ['courses', 'verify'] as const,
  },
  
  chats: {
    create: ['chats', 'create'] as const,
    update: ['chats', 'update'] as const,
    delete: ['chats', 'delete'] as const,
    selectCourse: ['chats', 'selectCourse'] as const,
    selectAndNavigate: ['chats', 'selectAndNavigate'] as const,
    updateCache: ['chats', 'updateCache'] as const,
    updateCacheWithHistory: ['chats', 'updateCacheWithHistory'] as const,
  },
  
  documents: {
    toggleStar: ['documents', 'toggleStar'] as const,
    report: ['documents', 'report'] as const,
    delete: ['documents', 'delete'] as const,
  },
} as const;