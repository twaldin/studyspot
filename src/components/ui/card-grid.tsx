"use client"

import { DocumentCard } from "../document-card"
import { useDocuments } from "@/hooks/api/documents"

interface CardGridProps {
  courseId?: string
}

export function CardGrid({ courseId }: CardGridProps) {
  const { data: documents, isLoading, error } = useDocuments(courseId);

  if (isLoading) {
    return <div className="text-center py-4">Loading documents...</div>;
  }

  if (error) {
    return <div className="text-center py-4 text-red-500">Error loading documents</div>;
  }

  if (!documents || documents.length === 0) {
    return <div className="text-center py-4 text-gray-500">No documents found</div>;
  }
 const limitedDocuments = documents.slice(0, 6);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {limitedDocuments.map((doc) => (
        <DocumentCard
          key={doc.id} // Use document ID as key
          url={doc.file_url || '#'} // Use document URL from API
          file={doc} // Pass the document object (you'll need to update DocumentCard)
          fileType={doc.file_type === 'application/pdf' ? 'pdf' : 'Unknown'}
        />
      ))}
    </div>
  )
}