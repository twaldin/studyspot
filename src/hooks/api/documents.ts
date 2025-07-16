import { useQuery } from '@tanstack/react-query'
import { Document } from '@/features/document/document.service'

export function useDocumentsByIds(ids: string[]) {
  return useQuery({
    queryKey: ['documents', 'by-ids', ids],
    queryFn: async () => {
      // For now, return empty array since we don't have document functionality
      return [] as Document[]
    },
    enabled: ids.length > 0,
    staleTime: 5 * 60 * 1000, // 5 minutes
  })
}