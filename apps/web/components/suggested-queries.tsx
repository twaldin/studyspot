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
      <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
        <Skeleton className="h-8 w-32 rounded-full" />
        <Skeleton className="h-8 w-40 rounded-full" />
        <Skeleton className="h-8 w-24 rounded-full" />
      </div>
    );
  }

  if (isError || suggestedQueries.length === 0) {
    return null; // Don't render anything if there's an error or no queries
  }

  return (
    <div className="flex gap-2 overflow-x-auto pb-2 [-ms-overflow-style:'none'] [scrollbar-width:'none'] [&::-webkit-scrollbar]:hidden">
      {suggestedQueries.map((query, index) => (
        <Button
          key={index}
          variant="outline"
          onClick={() => onQuerySelect(query)}
          className="rounded-full whitespace-nowrap"
        >
          {query}
        </Button>
      ))}
    </div>
  );
}
