import { useQuery } from "@tanstack/react-query";
import { apiClient, queryKeys, useAuthenticatedUser } from "./base";
import { Document } from "@/lib/types/DocumentTypes";

// Document list query for a course
export function useDocuments(courseId?: string) {
  const { isAuthenticated } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.documents.list(courseId),
    queryFn: async () => {
      const response = await apiClient<{ docs: Document[] }>(
        `/docs?courseId=${courseId}`,
      );
      return response.docs || [];
    },
    enabled: isAuthenticated && !!courseId,
    staleTime: 5 * 60 * 1000, // 5 minutes for document list
  });
}

// Documents by IDs query
export function useDocumentsByIds(ids: string[]) {
  const { isAuthenticated } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.documents.batch(ids),
    queryFn: async () => {
      if (ids.length === 0) return [];
      const response = await apiClient<{ docs: Document[] }>(
        `/docs?ids=${ids.join(",")}`,
      );
      return response.docs || [];
    },
    enabled: isAuthenticated && ids.length > 0,
    staleTime: 10 * 60 * 1000, // 10 minutes for batch document fetch
  });
}

// Individual document query
export function useDocument(documentId?: string) {
  const { isAuthenticated } = useAuthenticatedUser();

  return useQuery({
    queryKey: queryKeys.documents.detail(documentId!),
    queryFn: async () => {
      const response = await apiClient<{ doc: Document }>(
        `/docs/${documentId}`,
      );
      return response.doc;
    },
    enabled: isAuthenticated && !!documentId,
    staleTime: 15 * 60 * 1000, // 15 minutes for individual documents
  });
}
