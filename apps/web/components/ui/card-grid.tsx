"use client";

import { DocumentCard } from "../document-card";
import { useDocuments } from "@/hooks/api/documents";
import type { Document } from "@/lib/types/DocumentTypes";

interface CardGridProps {
  courseId?: string;
  viewAll?: boolean;
  documents?: Document[]; // Use proper Document type
}

export function CardGrid(
  { courseId, viewAll, documents: providedDocuments }: CardGridProps,
) {
  const { data: documents, isLoading, error } = useDocuments(courseId);

  // Use provided documents if available, otherwise use fetched documents
  const finalDocuments = providedDocuments || documents;

  // Only show loading/error states if we're not using provided documents
  if (!providedDocuments && isLoading) {
    return (
      <div className="text-center py-4 text-sm text-foreground">
        Loading documents...
      </div>
    );
  }

  if (!providedDocuments && error) {
    return (
      <div className="text-center py-4 text-red-500 text-sm">
        Error loading documents
      </div>
    );
  }

  if (!finalDocuments || finalDocuments.length === 0) {
    return (
      <div className="text-center py-4 text-sm text-foreground">
        No documents found
      </div>
    );
  }

  const limitedDocuments = viewAll === false
    ? finalDocuments.slice(0, 6)
    : finalDocuments;

  return (
    <div className="hidden gap-4 @md:grid @md:grid-cols-2 @lg:grid-cols-3">
      {limitedDocuments.map((doc) => (
        <DocumentCard
          key={doc.id} // Use document ID as key
          url={doc.file_url || "#"} // Use document URL from API
          file={doc} // Pass the document object (you'll need to update DocumentCard)
          fileType={doc.file_type === "application/pdf" ? "pdf" : "Unknown"}
        />
      ))}
    </div>
  );
}
