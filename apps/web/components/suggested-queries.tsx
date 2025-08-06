import React from 'react';
import { useSuggestedQueries } from '@/hooks/api/courses';
import { useSelectedCourse } from '@/hooks/api/courses';
import { Button } from '@studyspot/ui/components/button';
import { Skeleton } from '@studyspot/ui/components/skeleton';

interface SuggestedQueriesProps {
  onQuerySelect: (query: string) => void;
}

export function SuggestedQueries({ onQuerySelect }: SuggestedQueriesProps) {
  const { data: selectedCourse } = useSelectedCourse();
  const { data: suggestedQueries = [], isLoading, isError } = useSuggestedQueries(selectedCourse?.id);

  if (isLoading) {
    return (
      <div className="flex flex-wrap gap-2">
        <Skeleton className="h-8 w-32" />
        <Skeleton className="h-8 w-40" />
        <Skeleton className="h-8 w-24" />
      </div>
    );
  }

  if (isError || suggestedQueries.length === 0) {
    return null; // Don't render anything if there's an error or no queries
  }

  return (
    <div className="flex flex-wrap gap-2">
      {suggestedQueries.map((query, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onQuerySelect(query)}
          className="rounded-full"
        >
          {query}
        </Button>
      ))}
    </div>
  );
}
