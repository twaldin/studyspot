"use client"

import { Card, CardHeader, CardTitle, CardDescription, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Document } from '@/features/document/document.service'; // Adjust path as needed

interface DocumentCardProps {
  url: string
  file: Document // Changed from File to Document
  fileType: string
}

export function DocumentCard({ url, file, fileType }: DocumentCardProps) {
  return (
    <a
          href={url}
          target="_blank"
          rel="noopener noreferrer"
          className="h-full text-blue-600"
        >
    <Card className="h-full">
      <CardHeader>
        <CardTitle>  {(file.file_name || 'Untitled Document').substring(0, (file.file_name || 'Untitled Document').lastIndexOf('.')) || file.file_name || 'Untitled Document'}</CardTitle>
        <CardDescription>{fileType}</CardDescription>
      </CardHeader>
      <CardContent>

      </CardContent>
    </Card>
            </a>

  )
}