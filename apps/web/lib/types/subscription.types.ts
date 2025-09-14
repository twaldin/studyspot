export interface SubscriptionFeature {
  id: string;
  name: string;
  description: string;
  limit?: number;
  period?: 'daily' | 'weekly' | 'monthly';
}

export const SUBSCRIPTION_FEATURES = {
  // Free Plan Features
  CHATS_50_PER_WEEK: {
    id: '50_chats_per_week',
    name: 'Weekly Chats',
    description: '50 AI chat conversations per week',
    limit: 50,
    period: 'weekly' as const,
  },
  GENERATE_10_QUIZZES_FLASHCARDS_PER_DAY: {
    id: 'generate_10_quizzes_flashcards_per_day',
    name: 'Daily Content Generation',
    description: 'Generate up to 10 quizzes or flashcard sets per day',
    limit: 10,
    period: 'daily' as const,
  },
  UPLOAD_10_FILES_PER_COURSE_PER_DAY: {
    id: 'upload_10_files_per_course_per_day',
    name: 'Daily File Upload',
    description: 'Upload up to 10 files per course per day',
    limit: 10,
    period: 'daily' as const,
  },
  
  // Paid Plan Features
  UNLIMITED_CHATS: {
    id: 'unlimited_chats',
    name: 'Unlimited Chats',
    description: 'Unlimited AI chat conversations',
  },
  UNLIMITED_FILE_UPLOAD: {
    id: 'unlimited_file_upload',
    name: 'Unlimited File Upload',
    description: 'Upload unlimited files to your courses',
  },
  UNLIMITED_CONTENT_GENERATION: {
    id: 'unlimited_content_generation',
    name: 'Unlimited Content Generation',
    description: 'Generate unlimited quizzes and flashcard sets',
  },
} as const;

export type FeatureId = typeof SUBSCRIPTION_FEATURES[keyof typeof SUBSCRIPTION_FEATURES]['id'];

export interface UsageTracking {
  chatCount: {
    count: number;
    weekStartDate: string; // ISO date string for the start of the current week
  };
  quizFlashcardGeneration: {
    count: number;
    date: string; // ISO date string for today
  };
  fileUploads: {
    [courseId: string]: {
      count: number;
      date: string; // ISO date string for today
    };
  };
}

export interface UserSubscriptionMetadata {
  usageTracking?: UsageTracking;
  subscriptionPlan?: 'free' | 'paid';
  subscriptionStartDate?: string;
  subscriptionEndDate?: string;
}