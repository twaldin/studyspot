"use client";

import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Document } from "@/lib/types/DocumentTypes"; // Adjust path as needed
import { Document as PdfDocument, Page, pdfjs } from 'react-pdf';
import 'react-pdf/dist/Page/AnnotationLayer.css';
import 'react-pdf/dist/Page/TextLayer.css';

pdfjs.GlobalWorkerOptions.workerSrc = new URL(
  'pdfjs-dist/build/pdf.worker.min.mjs',
  import.meta.url,
).toString();


interface DocumentCardProps {
  url: string;
  file: Document; // Changed from File to Document
  fileType: string;
}

export function DocumentCard({ url, file, fileType }: DocumentCardProps) {
  return (
    <a
      href={url}
      target="_blank"
      rel="noopener noreferrer"
      className="h-full text-blue-600"
    >
      <Card className="h-full relative overflow-hidden">
        <CardHeader className="pb-3 relative z-10">
          <CardTitle className="text-sm leading-tight">
            {(file.file_name || "Untitled Document").substring(
              0,
              (file.file_name || "Untitled Document").lastIndexOf("."),
            ) || file.file_name || "Untitled Document"}
          </CardTitle>
          <CardDescription className="text-xs">{fileType}</CardDescription>
        </CardHeader>
        
        {/* Document Preview */}
        {fileType === "pdf" && (
          <div className="absolute bottom-[-80px] right-[0px] w-26 h-32 bg-white border border-gray-200 rounded-md shadow-sm rotate-6 opacity-80 z-0">
            <PdfDocument file={url} loading="Loading PDF..." error="Failed to load PDF.">
              <Page pageNumber={1} />
            </PdfDocument>
          </div>
        )}
      </Card>
    </a>
  );
}

