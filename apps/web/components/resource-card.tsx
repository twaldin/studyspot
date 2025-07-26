import React from 'react';
import Link from 'next/link';
import { LinkedResource } from '@/features/chat/chat.types';
import { Card, CardContent } from '@/components/ui/card';
import { DocumentCard } from '@/components/document-card';

interface ResourceCardProps {
  resource: LinkedResource;
}

export const ResourceCard: React.FC<ResourceCardProps> = ({ resource }) => {
  // Handle document resources using existing DocumentCard
  if (resource.type === 'document') {
    const documentData = {
      id: resource.id,
      file_name: resource.title,
      file_type: resource.metadata?.file_type || 'unknown',
      file_url: resource.metadata?.file_url || '',
      course_id: '', // Not needed for display
      created_at: '', // Not needed for display
      report_count: 0, // Not needed for display
    };

    return (
      <DocumentCard
        url={documentData.file_url}
        file={documentData}
        fileType={documentData.file_type === 'application/pdf' ? 'pdf' : 'Unknown'}
      />
    );
  }

  // Handle flashcard set resources
  if (resource.type === 'flashcard_set') {
    return (
      <Card className="hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors cursor-pointer">
        <Link href={`/flashcards/${resource.id}`} className="block">
          <CardContent className="p-4">
            <div className="flex items-start gap-3">
              {/* Flashcard icon */}
              <div className="flex-shrink-0 mt-1">
                <svg 
                  className="w-5 h-5 text-blue-600 dark:text-blue-400" 
                  fill="none" 
                  stroke="currentColor" 
                  viewBox="0 0 24 24"
                >
                  <path 
                    strokeLinecap="round" 
                    strokeLinejoin="round" 
                    strokeWidth={2} 
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012 2v2M7 7h10" 
                  />
                </svg>
              </div>
              
              {/* Content */}
              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-medium text-gray-900 dark:text-gray-100 truncate">
                  {resource.title}
                </h3>
                
                {resource.description && (
                  <p className="text-xs text-gray-600 dark:text-gray-400 mt-1 line-clamp-2">
                    {resource.description}
                  </p>
                )}
                
                <div className="flex items-center gap-2 mt-2">
                  {resource.metadata?.cardCount && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200">
                      {resource.metadata.cardCount} cards
                    </span>
                  )}
                  <span className="text-xs text-gray-500 dark:text-gray-400">
                    Study now →
                  </span>
                </div>
              </div>
            </div>
          </CardContent>
        </Link>
      </Card>
    );
  }

  // Fallback for unknown resource types
  return (
    <Card className="bg-gray-50 dark:bg-gray-800">
      <CardContent className="p-4">
        <div className="text-sm text-gray-600 dark:text-gray-400">
          Unknown resource type: {resource.type}
        </div>
      </CardContent>
    </Card>
  );
};