import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiClient, queryKeys, mutationKeys, useAuthenticatedUser } from "./base";
import { Document } from "@/lib/types/Document";
import logger from "@/lib/logger";

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

// Delete document mutation
export function useDeleteDocument() {
  const queryClient = useQueryClient();

  return useMutation({
    mutationKey: mutationKeys.documents.delete,
    mutationFn: async (documentId: string) => {
      const response = await apiClient<{ 
        message: string; 
        documentId: string; 
        fileName: string; 
      }>(`/docs/${documentId}`, { method: "DELETE" });
      return { documentId, fileName: response.fileName };
    },
    onMutate: async (documentId) => {
      // Cancel any outgoing refetches for documents
      await queryClient.cancelQueries({
        queryKey: queryKeys.documents.all,
      });

      // Optimistically remove the document from all relevant caches
      const snapshot = new Map();
      
      // Update all document lists that might contain this document
      queryClient.getQueriesData({ queryKey: queryKeys.documents.lists() }).forEach(([queryKey, data]) => {
        snapshot.set(queryKey, data);
        if (Array.isArray(data)) {
          queryClient.setQueryData(
            queryKey,
            data.filter((doc: Document) => doc.id !== documentId)
          );
        }
      });

      // Clear individual document cache if it exists
      const detailQueryKey = queryKeys.documents.detail(documentId);
      const detailData = queryClient.getQueryData(detailQueryKey);
      if (detailData) {
        snapshot.set(detailQueryKey, detailData);
        queryClient.setQueryData(detailQueryKey, undefined);
      }

      return { snapshot };
    },
    onSuccess: (data) => {
      // Invalidate all document-related queries to ensure consistency
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all,
      });
      
      logger.info({ 
        documentId: data.documentId, 
        fileName: data.fileName 
      }, "Document deleted successfully");
    },
    onError: (error, documentId, context) => {
      // Restore the snapshot on error
      if (context?.snapshot) {
        context.snapshot.forEach((data, queryKey) => {
          queryClient.setQueryData(queryKey, data);
        });
      }
      
      logger.error({ 
        error: error instanceof Error ? error.message : 'Unknown error',
        documentId 
      }, "Failed to delete document");
    },
    onSettled: () => {
      // Always invalidate to ensure we're in sync
      queryClient.invalidateQueries({
        queryKey: queryKeys.documents.all,
      });
    },
  });
}
