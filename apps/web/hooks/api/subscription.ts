import { useQuery } from '@tanstack/react-query';

interface UsageLimits {
  usageStats: any;
  limits: {
    chats: { hasAccess: boolean; remaining?: number; limit?: number } | null;
    contentGeneration: { hasAccess: boolean; remaining?: number; limit?: number } | null;
    fileUpload: { hasAccess: boolean; remaining?: number; limit?: number } | null;
  };
  hasUnlimited: {
    chats: boolean;
    contentGeneration: boolean;
    fileUpload: boolean;
  };
}

export function useUsageLimits(courseId?: string) {
  return useQuery<UsageLimits>({
    queryKey: ['usage-limits', courseId],
    queryFn: async () => {
      const url = courseId 
        ? `/api/user/usage-stats?courseId=${courseId}`
        : '/api/user/usage-stats';
      
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error('Failed to fetch usage limits');
      }
      return response.json();
    },
    refetchInterval: 60000, // Refetch every minute
    staleTime: 30000, // Consider data stale after 30 seconds
  });
}

export function useCanChat() {
  const { data: usage } = useUsageLimits();
  
  if (!usage) return { canChat: true, reason: null };
  
  if (usage.hasUnlimited.chats) {
    return { canChat: true, reason: null };
  }
  
  if (usage.limits.chats && !usage.limits.chats.hasAccess) {
    return { 
      canChat: false, 
      reason: `You've reached your weekly chat limit (${usage.limits.chats.limit}). Upgrade to Pro for unlimited chats.`
    };
  }
  
  return { canChat: true, reason: null };
}

export function useCanGenerateContent() {
  const { data: usage } = useUsageLimits();
  
  if (!usage) return { canGenerate: true, reason: null };
  
  if (usage.hasUnlimited.contentGeneration) {
    return { canGenerate: true, reason: null };
  }
  
  if (usage.limits.contentGeneration && !usage.limits.contentGeneration.hasAccess) {
    return { 
      canGenerate: false, 
      reason: `You've reached your daily content generation limit (${usage.limits.contentGeneration.limit}). Upgrade to Pro for unlimited generation.`
    };
  }
  
  return { canGenerate: true, reason: null };
}

export function useCanUploadFiles(courseId?: string) {
  const { data: usage } = useUsageLimits(courseId);
  
  if (!usage) return { canUpload: true, reason: null, remaining: null };
  
  if (usage.hasUnlimited.fileUpload) {
    return { canUpload: true, reason: null, remaining: null };
  }
  
  if (usage.limits.fileUpload && !usage.limits.fileUpload.hasAccess) {
    return { 
      canUpload: false, 
      reason: `You've reached your daily upload limit for this course (${usage.limits.fileUpload.limit} files). Upgrade to Pro for unlimited uploads.`,
      remaining: 0
    };
  }
  
  return { 
    canUpload: true, 
    reason: null,
    remaining: usage.limits.fileUpload?.remaining || null
  };
}